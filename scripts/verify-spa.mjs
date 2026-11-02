import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { writeFile } from "node:fs/promises";

const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = new URL("../.tmp-migration-chrome/", import.meta.url).pathname.replace(/^\//, "").replaceAll("/", "\\");
const browser = spawn(chromePath, [
  "--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-first-run", "--force-prefers-reduced-motion=no-preference",
  "--no-default-browser-check", "--window-size=1440,1000", "--remote-debugging-port=9223", `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

let socket;
try {
  let target;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch("http://127.0.0.1:9223/json/list");
      const targets = await response.json();
      target = targets.find((item) => item.type === "page");
      if (target) break;
    } catch { /* Chrome is starting. */ }
    await delay(200);
  }
  if (!target) throw new Error("Chrome DevTools did not start.");

  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === "Runtime.exceptionThrown") console.error("Browser exception:", message.params.exceptionDetails.text);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject, method } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(`${method}: ${message.error.message}`)) : resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject, method });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Page script threw an exception.");
    return result.result.value;
  };
  const capture = async (name) => {
    const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    await writeFile(new URL(`../.tmp-${name}.png`, import.meta.url), Buffer.from(shot.data, "base64"));
  };
  const waitFor = async (expression, timeout = 7000) => {
    const until = Date.now() + timeout;
    while (Date.now() < until) {
      const value = await evaluate(expression);
      if (value) return value;
      await delay(100);
    }
    throw new Error(`Timed out waiting for: ${expression}; page=${await evaluate("document.body.innerText.slice(0,500)")}`);
  };
  const assert = (condition, message) => { if (!condition) throw new Error(message); };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  await send("Page.navigate", { url: "http://127.0.0.1:5173/" });
  await waitFor("document.querySelector('header.nav') && document.querySelector('h1')?.textContent.includes('Enter the arena')");
  console.log("Home rendered");
  await delay(1200);
  await capture("home-render");
  await evaluate("localStorage.clear()");
  await evaluate("window.__spaTestToken = 'kept-alive'");
  await evaluate("window.__viewTransitionStarts = 0; const nativeStartViewTransition = document.startViewTransition.bind(document); document.startViewTransition = (callback, options) => { window.__viewTransitionStarts += 1; window.__lastViewTransitionStartedAt = performance.now(); window.__lastViewTransitionFinished = false; window.__lastViewTransition = nativeStartViewTransition(callback, options); window.__lastViewTransition.finished.then(() => { window.__lastViewTransitionFinished = true; window.__lastViewTransitionFinishedAt = performance.now(); }); return window.__lastViewTransition; }");
  await evaluate("window.__routeTransitionCount = () => document.querySelectorAll('.route-screen').length; window.__nativeRouteTransitions = typeof document.startViewTransition === 'function'");
  await evaluate("document.querySelector('header.nav a[href=\\\"/live\\\"]').click()");
  await waitFor("location.pathname === '/live' && document.querySelector('main h1')?.textContent.includes('Live now')");
  await evaluate("window.__lastViewTransition?.ready.then(() => true)");
  await delay(120);
  assert(await evaluate("window.__spaTestToken === 'kept-alive' && performance.getEntriesByType('navigation').length === 1"), "Home to Live caused a document reload.");
  const liveTransitionFrame = await evaluate("JSON.stringify({ running: !window.__lastViewTransitionFinished, starts: window.__viewTransitionStarts, backOut: document.documentElement.dataset.backOutDirection, backIn: document.documentElement.dataset.backInDirection, oldX: new DOMMatrixReadOnly(getComputedStyle(document.documentElement, '::view-transition-old(root)').transform).m41, newX: new DOMMatrixReadOnly(getComputedStyle(document.documentElement, '::view-transition-new(root)').transform).m41, oldOpacity: getComputedStyle(document.documentElement, '::view-transition-old(root)').opacity, newOpacity: getComputedStyle(document.documentElement, '::view-transition-new(root)').opacity })");
  console.log(`Home -> Live rendered transition frame: ${liveTransitionFrame}`);
  assert(await evaluate("!window.__lastViewTransitionFinished && new DOMMatrixReadOnly(getComputedStyle(document.documentElement, '::view-transition-old(root)').transform).m41 < 0 && new DOMMatrixReadOnly(getComputedStyle(document.documentElement, '::view-transition-new(root)').transform).m41 > 0"), "Home -> Live has no visible left-exit/right-entry transform frame.");
  await capture("route-transition-live");
  console.log("Home -> Live SPA transition passed");
  const transitionState = await evaluate("JSON.stringify({ old: getComputedStyle(document.documentElement, '::view-transition-old(root)').animationName, incoming: getComputedStyle(document.documentElement, '::view-transition-new(root)').animationName, pageLayers: document.querySelectorAll('.route-screen').length, navAnimation: getComputedStyle(document.documentElement, '::view-transition-old(app-nav)').animationName })");
  console.log(`Live page transition state (reduced motion=${await evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")}): ${transitionState}`);
  console.log(`Live page snapshot status: ${await evaluate("JSON.stringify({ viewTransitionStarts: window.__viewTransitionStarts, transitionStillRunning: !window.__lastViewTransitionFinished, elapsed: Math.round(performance.now() - window.__lastViewTransitionStartedAt), liveLayers: document.querySelectorAll('.route-screen').length, outAnimation: getComputedStyle(document.documentElement, '::view-transition-old(root)').animationName, inAnimation: getComputedStyle(document.documentElement, '::view-transition-new(root)').animationName })")}`);
  assert(await evaluate("window.__nativeRouteTransitions && window.__viewTransitionStarts === 1 && document.documentElement.dataset.backOutDirection === 'left' && document.documentElement.dataset.backInDirection === 'right' && getComputedStyle(document.documentElement, '::view-transition-old(root)').animationName === 'route-page-exit-left' && getComputedStyle(document.documentElement, '::view-transition-new(root)').animationName === 'route-page-enter-from-right'"), "Native route snapshot direction or animation did not start.");
  assert(await evaluate("window.__routeTransitionCount() === 1"), "Multiple live page layers are present during the transition.");
  assert(await evaluate("document.documentElement.dataset.backOutDirection === 'left' && document.documentElement.dataset.backInDirection === 'right'"), "Home -> Live directions are not source-left and destination-from-right.");
  console.log("Native snapshot animation and single live route layer verified");
  await evaluate("window.__lastViewTransition.finished.then(() => true)");

  await evaluate("document.querySelector('header.nav a[href=\\\"/\\\"]').click()");
  await waitFor("location.pathname === '/' && document.querySelector('main h1')?.textContent.includes('Enter the arena')");
  await evaluate("window.__lastViewTransition?.ready.then(() => true)");
  await delay(120);
  const homeTransitionFrame = await evaluate("JSON.stringify({ running: !window.__lastViewTransitionFinished, starts: window.__viewTransitionStarts, backOut: document.documentElement.dataset.backOutDirection, backIn: document.documentElement.dataset.backInDirection, oldX: new DOMMatrixReadOnly(getComputedStyle(document.documentElement, '::view-transition-old(root)').transform).m41, newX: new DOMMatrixReadOnly(getComputedStyle(document.documentElement, '::view-transition-new(root)').transform).m41, oldOpacity: getComputedStyle(document.documentElement, '::view-transition-old(root)').opacity, newOpacity: getComputedStyle(document.documentElement, '::view-transition-new(root)').opacity })");
  console.log(`Live -> Home rendered transition frame: ${homeTransitionFrame}`);
  assert(await evaluate("!window.__lastViewTransitionFinished && new DOMMatrixReadOnly(getComputedStyle(document.documentElement, '::view-transition-old(root)').transform).m41 > 0 && new DOMMatrixReadOnly(getComputedStyle(document.documentElement, '::view-transition-new(root)').transform).m41 < 0"), "Live -> Home has no visible right-exit/left-entry transform frame.");
  assert(await evaluate("document.documentElement.dataset.backOutDirection === 'right' && document.documentElement.dataset.backInDirection === 'left' && window.__viewTransitionStarts === 2 && !window.__lastViewTransitionFinished"), "Live -> Home directions are not source-right and destination-from-left.");
  await capture("route-transition-home");
  console.log("Live -> Home direction and overlapping snapshot animations passed");
  await evaluate("window.__lastViewTransition.finished.then(() => true)");

  await evaluate("document.querySelector('header.nav a[href=\\\"/live\\\"]').click()");
  await waitFor("location.pathname === '/live'");
  await evaluate("window.__lastViewTransition?.finished.then(() => true)");
  assert(await evaluate("document.documentElement.dataset.backOutDirection === 'left' && document.documentElement.dataset.backInDirection === 'right'"), "Home -> Live did not reverse the directions correctly.");

  await evaluate("document.querySelector('header.nav a[href=\\\"/leaderboard\\\"]').click()");
  await waitFor("location.pathname === '/leaderboard' && document.querySelector('main h1')?.textContent.includes('Leaderboard')");
  console.log("Live -> Leaderboard passed");
  await evaluate("history.back()");
  await waitFor("location.pathname === '/live'");
  console.log("Browser Back passed");
  await evaluate("history.forward()");
  await waitFor("location.pathname === '/leaderboard'");
  await evaluate("history.back()");
  await waitFor("location.pathname === '/live'");
  console.log("Browser Forward passed");
  await evaluate("document.querySelector('header.nav a[href=\\\"/profile\\\"]').click()");
  await waitFor("location.pathname === '/profile'");
  await evaluate("document.querySelector('header.nav a[href=\\\"/activities\\\"]').click()");
  await waitFor("location.pathname === '/activities'");
  assert(await evaluate("document.documentElement.dataset.backOutDirection === 'left' && document.documentElement.dataset.backInDirection === 'right'"), "Profile -> Activities direction is incorrect.");
  await evaluate("document.querySelector('header.nav a[href=\\\"/profile\\\"]').click()");
  await waitFor("location.pathname === '/profile'");
  assert(await evaluate("document.documentElement.dataset.backOutDirection === 'right' && document.documentElement.dataset.backInDirection === 'left'"), "Activities -> Profile direction is incorrect.");
  await evaluate("document.querySelector('header.nav a[href=\\\"/live\\\"]').click()");
  await waitFor("location.pathname === '/live'");
  console.log("Profile <-> Activities directions passed");
  await send("Page.navigate", { url: "http://127.0.0.1:5173/" });
  await waitFor("!!document.querySelector('.card.tc a[href=\\\"/tournament/arena-masters-valorant-open\\\"]')");
  await evaluate("document.querySelector('.card.tc a[href=\\\"/tournament/arena-masters-valorant-open\\\"]').click()");
  await waitFor("location.pathname === '/tournament/arena-masters-valorant-open' && !!document.querySelector('#register-tournament')");
  await delay(100);
  const sharedTransition = await evaluate("JSON.stringify({ animationDuration: getComputedStyle(document.documentElement, '::view-transition-group(arena-masters-artwork)').animationDuration, pageLayers: document.querySelectorAll('.route-screen').length })");
  console.log(`Tournament artwork transition: ${sharedTransition}`);
  assert(await evaluate("parseFloat(getComputedStyle(document.documentElement, '::view-transition-group(arena-masters-artwork)').animationDuration) >= 0.5 && document.querySelectorAll('.route-screen').length === 1"), "Tournament artwork did not use a shared snapshot transition.");
  console.log("Tournament card -> detail shared-element transition passed");
  await send("Page.navigate", { url: "http://127.0.0.1:5173/tournament/arena-masters-valorant-open" });
  await waitFor("!!document.querySelector('#register-tournament')");
  console.log("Deep tournament route rendered");
  await evaluate("document.querySelector('#register-tournament').click()");
  assert((await evaluate("document.querySelector('#registration-feedback').textContent")).includes("Log in to register"), "Tournament registration did not request authentication.");

  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 700, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: "http://127.0.0.1:5173/register" });
  await waitFor("!!document.querySelector('[data-form=register]')");
  const registrationScroll = await evaluate("JSON.stringify({ viewport: window.innerHeight, document: document.scrollingElement.scrollHeight, documentClient: document.scrollingElement.clientHeight, screen: document.querySelector('.route-screen').scrollHeight, screenClient: document.querySelector('.route-screen').clientHeight, submitBottom: document.querySelector('[data-form=register] button[type=submit]').getBoundingClientRect().bottom, horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth })");
  console.log(`Registration scroll metrics: ${registrationScroll}`);
  assert(await evaluate("document.scrollingElement.scrollHeight > window.innerHeight && document.documentElement.scrollWidth <= window.innerWidth"), "Registration does not naturally scroll or has horizontal overflow.");
  await evaluate("window.scrollTo({ top: 0, behavior: 'instant' })");
  await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: 700, y: 600, deltaY: 360, deltaX: 0 });
  await delay(100);
  assert(await evaluate("window.scrollY > 0"), "Registration mouse-wheel scrolling did not move the document.");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "End", code: "End", windowsVirtualKeyCode: 35 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "End", code: "End", windowsVirtualKeyCode: 35 });
  await delay(100);
  assert(await evaluate("window.scrollY + window.innerHeight >= document.scrollingElement.scrollHeight - 2 && document.querySelector('[data-form=register] button[type=submit]').getBoundingClientRect().bottom <= window.innerHeight"), "Keyboard scrolling could not reach the registration submit button.");
  await evaluate("window.scrollTo({ top: 0, behavior: 'instant' })");
  console.log("Register route rendered");
  await capture("register-render");
  await evaluate("document.querySelector('[data-form=register] button[aria-controls=\\\"reg-password\\\"]').click()");
  assert(await evaluate("document.querySelector('#reg-password').type === 'text' && document.querySelector('#reg-confirm-password').type === 'password'"), "Registration password visibility was not independent.");
  await evaluate("document.querySelector('[data-form=register] button[aria-controls=\\\"reg-password\\\"]').click(); document.querySelector('[data-form=register] button[aria-controls=\\\"reg-confirm-password\\\"]').click()");
  assert(await evaluate("document.querySelector('#reg-confirm-password').type === 'text' && document.querySelector('#reg-password').type === 'password'"), "Confirm-password visibility toggle affected the wrong field.");
  await evaluate("document.querySelector('[data-form=register] button[aria-controls=\\\"reg-confirm-password\\\"]').click()");
  await evaluate("document.querySelector('[data-form=register] button[type=submit]').click()");
  assert(await evaluate("document.querySelector('#reg-username-error').textContent.includes('Enter a username')"), "Registration validation did not render field errors.");
  await evaluate("document.querySelector('[data-form=register] .auth-switch').click()");
  await waitFor("document.querySelector('.au').dataset.mode === 'login'", 2000);
  assert(await evaluate("getComputedStyle(document.querySelector('.auth-brand img')).animationName === 'auth-spin-counterclockwise'"), "Register-to-Login logo rotation is not anticlockwise.");
  await evaluate("document.querySelector('[data-form=login] button[aria-controls=\\\"login-password\\\"]').click()");
  assert(await evaluate("document.querySelector('#login-password').type === 'text'"), "Login password visibility toggle did not reveal its field.");
  await evaluate("document.querySelector('[data-form=login] button[aria-controls=\\\"login-password\\\"]').click()");
  assert(await evaluate("location.pathname === '/register'"), "Auth mode switching changed the document route.");
  await waitFor("!document.querySelector('.au').dataset.transitioning", 2000);
  await evaluate("document.querySelector('[data-form=login] .auth-switch').click()");
  await waitFor("document.querySelector('.au').dataset.mode === 'register'", 2000);
  assert(await evaluate("getComputedStyle(document.querySelector('.auth-brand img')).animationName === 'auth-spin-clockwise'"), "Login-to-Register logo rotation is not clockwise.");
  await waitFor("!document.querySelector('.au').dataset.transitioning", 2000);
  await evaluate("(() => { const setValue = (selector, value, eventName = 'input') => { const element = document.querySelector(selector); Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value').set.call(element, value); element.dispatchEvent(new Event(eventName, { bubbles: true })); }; setValue('#reg-username', 'TestPlayer'); setValue('#reg-email', 'test@example.com'); setValue('#reg-password', 'ArenaTest8'); setValue('#reg-confirm-password', 'ArenaTest8'); setValue('#reg-game', 'Valorant', 'change'); document.querySelector('#reg-terms').click(); document.querySelector('[data-form=register] button[type=submit]').click(); })()");
  console.log(`Registration values after React input events: ${await evaluate("JSON.stringify({ username: document.querySelector('#reg-username').value, email: document.querySelector('#reg-email').value, password: document.querySelector('#reg-password').value, game: document.querySelector('#reg-game').value, terms: document.querySelector('#reg-terms').checked, errors: [...document.querySelectorAll('.form-error')].map((node) => node.textContent) })")}`);
  console.log(`Registration submit state: ${await evaluate("JSON.stringify({ mode: document.querySelector('.au').dataset.mode, formClass: document.querySelector('[data-form=register]').className, busyLabel: document.querySelector('[data-form=register] button[type=submit]').textContent, success: document.querySelector('[data-form=register] .form-success').className, noValidate: document.querySelector('[data-form=register]').noValidate })")}`);
  await waitFor("document.querySelector('.au').dataset.mode === 'login'", 4500);
  await waitFor("!document.querySelector('.au').dataset.transitioning", 2000);
  await evaluate("(() => { const setValue = (selector, value) => { const element = document.querySelector(selector); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(element, value); element.dispatchEvent(new Event('input', { bubbles: true })); }; setValue('#login-identifier', 'demo@gamearena.gg'); setValue('#login-password', 'Arena@2026'); document.querySelector('[data-form=login]').requestSubmit(); })()");
  await waitFor("location.pathname === '/'", 7000);
  assert(await evaluate("JSON.parse(localStorage.getItem('gameArena.currentUser'))?.id === 'demo@gamearena.gg'"), "Login did not persist the current-user storage format.");

  for (const [width, height] of [[1366, 768], [1536, 864], [1920, 1080]]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: "http://127.0.0.1:5173/login" });
    await waitFor("!!document.querySelector('.au[data-mode=login]')");
    const loginSizing = await evaluate("JSON.stringify({ viewport: [window.innerWidth, window.innerHeight], document: [document.scrollingElement.scrollWidth, document.scrollingElement.scrollHeight], app: Math.round(document.querySelector('.app-shell').getBoundingClientRect().height), stage: Math.round(document.querySelector('.route-transition-stage').getBoundingClientRect().height), screen: Math.round(document.querySelector('.route-screen').getBoundingClientRect().height), auth: Math.round(document.querySelector('.au').getBoundingClientRect().height), aside: Math.round(document.querySelector('.au aside').getBoundingClientRect().height), main: (() => { const r = document.querySelector('.au main').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height), Math.round(r.bottom)] })(), card: (() => { const r = document.querySelector('[data-form=login].is-active').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), Math.round(r.bottom)] })() })");
    console.log(`Login sizing at ${width}x${height}: ${loginSizing}`);
    assert(await evaluate("document.scrollingElement.scrollHeight <= window.innerHeight + 1 && document.documentElement.scrollWidth <= window.innerWidth && document.querySelector('[data-form=login].is-active').getBoundingClientRect().bottom <= window.innerHeight + 1"), `Login layout does not fit at ${width}x${height}.`);
  }
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

  await send("Page.navigate", { url: "http://127.0.0.1:5173/search-events" });
  await waitFor("!!document.querySelector('input[aria-label=\\\"Search tournaments\\\"]')");
  await evaluate("(() => { const search = document.querySelector('input[aria-label=\\\"Search tournaments\\\"]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(search, 'BGMI'); search.dispatchEvent(new Event('input', { bubbles: true })); })()");
  assert(await evaluate("document.querySelectorAll('.grp article:not([hidden])').length === 2"), "Tournament search filtering did not update visible cards.");
  await send("Page.navigate", { url: "http://127.0.0.1:5173/leaderboard" });
  await waitFor("!!document.querySelector('#g-b')");
  await evaluate("document.querySelector('#g-b').click()");
  assert(await evaluate("document.querySelectorAll('tbody tr:not([hidden])').length === 3"), "Leaderboard game filtering did not update visible rows.");
  await send("Page.navigate", { url: "http://127.0.0.1:5173/tournament/arena-masters-valorant-open" });
  await waitFor("!!document.querySelector('#register-tournament')");
  await evaluate("document.querySelector('#register-tournament').click()");
  assert(await evaluate("JSON.parse(localStorage.getItem('gameArena.tournamentRegistrations'))?.length === 1"), "Tournament registration was not persisted.");
  await send("Page.navigate", { url: "http://127.0.0.1:5173/activities" });
  await waitFor("!!document.querySelector('#activity-timeline .ti')");
  assert(await evaluate("document.querySelectorAll('.registered-timeline-entry').length === 1"), "Activities omitted the registered tournament.");
  await send("Page.navigate", { url: "http://127.0.0.1:5173/profile" });
  await waitFor("!!document.querySelector('.profile-stats')");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send("Page.navigate", { url: "http://127.0.0.1:5173/login" });
  await waitFor("!!document.querySelector('.au[data-mode=login]')");
  assert(await evaluate("window.innerWidth === 390 && document.documentElement.scrollWidth <= window.innerWidth"), "Mobile login layout overflows horizontally.");
  await send("Page.navigate", { url: "http://127.0.0.1:5173/register" });
  await waitFor("!!document.querySelector('.au[data-mode=register]')");
  assert(await evaluate("document.scrollingElement.scrollHeight > window.innerHeight && document.documentElement.scrollWidth <= window.innerWidth"), "Mobile registration page does not scroll naturally or overflows horizontally.");
  await evaluate("window.scrollTo({ top: 0, behavior: 'instant' })");
  await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 195, y: 780, id: 1 }] });
  await send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 195, y: 340, id: 1 }] });
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await delay(100);
  assert(await evaluate("window.scrollY > 0"), "Mobile touch scrolling did not move the registration page.");
  await evaluate("window.scrollTo({ top: document.scrollingElement.scrollHeight, behavior: 'instant' })");
  assert(await evaluate("document.querySelector('[data-form=register] button[type=submit]').getBoundingClientRect().bottom <= window.innerHeight"), "Mobile registration submit button is not reachable by scrolling.");
  await send("Page.navigate", { url: "http://127.0.0.1:5173/activities" });
  await waitFor("!!document.querySelector('#activity-timeline .ti')");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await evaluate("document.querySelector('header.nav a[href=\\\"/profile\\\"]').click()");
  await waitFor("location.pathname === '/profile'");
  assert(await evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches && document.querySelectorAll('.route-screen').length === 1 && parseFloat(getComputedStyle(document.documentElement, '::view-transition-old(root)').animationDuration) <= 0.001"), "Reduced-motion route transition was not reduced.");
  console.log("Rendered route, no-reload navigation, browser Back, auth validation/mode swap/success, tournament feedback, search, Activities, and Profile checks passed.");
} finally {
  socket?.close();
  browser.kill();
}
