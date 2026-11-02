import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "../components/TransitionLink.jsx";
import logo from "../../assets/logos/logo.svg";
import { setCurrentUser } from "../data/gameArenaData.js";
import { MainLayout } from "../components/MainLayout.jsx";
import Home from "./Home.jsx";

const emailSyntax = /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,}$/i;
const commonProviderTypos = new Set(["googl.com", "gmial.com", "gmai.com", "outlok.com", "yaho.com"]);

function PasswordToggle({ inputId, visible, onToggle }) {
  return <button className="toggle-password" type="button" aria-label={visible ? "Hide password" : "Show password"} aria-controls={inputId} aria-pressed={visible} onClick={onToggle}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /><path className="eye-slash" d="m4 4 16 16" /></svg>
  </button>;
}

export default function AuthPage({ initialMode }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [switching, setSwitching] = useState(false);
  const [spin, setSpin] = useState("");
  const [patternVisible, setPatternVisible] = useState(false);
  const [registration, setRegistration] = useState({ username: "", email: "", password: "", confirmation: "", game: "", terms: false });
  const [login, setLogin] = useState({ identifier: "", password: "", remember: false });
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [registrationBusy, setRegistrationBusy] = useState(false);
  const [homeRevealing, setHomeRevealing] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setPatternVisible(true), 80);
    return () => {
      window.clearTimeout(timer);
      timers.current.forEach(window.clearTimeout);
    };
  }, []);

  function after(callback, delay) {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
  }

  function changeMode(nextMode, isRegistrationAutoSwitch = false) {
    if (switching || (registrationBusy && !isRegistrationAutoSwitch) || nextMode === mode || homeRevealing) return;
    setSwitching(true);
    setPatternVisible(false);
    const nextSpin = nextMode === "login" ? "spin-counterclockwise" : "spin-clockwise";
    setSpin(nextSpin);
    setMode(nextMode);
    after(() => setSpin(""), 800);
    after(() => {
      setSwitching(false);
      setPatternVisible(true);
      if (isRegistrationAutoSwitch) {
        setRegistrationBusy(false);
        setRegistrationSuccess(false);
      }
    }, 800);
  }

  function togglePassword(id) {
    setVisiblePasswords((current) => ({ ...current, [id]: !current[id] }));
  }

  function updateRegistration(field, value) {
    setRegistration((current) => ({ ...current, [field]: value }));
    setRegistrationSuccess(false);
    if (attempted || errors[field]) validateRegistrationField(field, { ...registration, [field]: value });
    if (["password", "confirmation"].includes(field) && (attempted || registration.password || registration.confirmation)) {
      validateRegistrationField("confirmation", { ...registration, [field]: value });
    }
  }

  function validateRegistrationField(field, values = registration) {
    let message = "";
    const username = values.username.trim();
    switch (field) {
      case "username":
        if (!username) message = "Enter a username.";
        else if ([...username].length < 3) message = "Username must be at least 3 characters.";
        break;
      case "email": {
        const email = values.email.trim();
        if (!email) message = "Enter your email address.";
        else if (!emailSyntax.test(email)) message = "Enter a valid email address with a complete domain and TLD.";
        else if (commonProviderTypos.has(email.slice(email.lastIndexOf("@") + 1).toLowerCase())) message = "Check the spelling of this email provider domain.";
        break;
      }
      case "password":
        if (!values.password) message = "Enter a password.";
        else if (values.password.length < 8) message = "Password must be at least 8 characters.";
        else if (!/[A-Z]/.test(values.password)) message = "Add at least one uppercase letter.";
        else if (!/[a-z]/.test(values.password)) message = "Add at least one lowercase letter.";
        else if (!/[0-9]/.test(values.password)) message = "Add at least one number.";
        break;
      case "confirmation":
        if (!values.confirmation) message = "Confirm your password.";
        else if (values.confirmation !== values.password) message = "Passwords do not match.";
        break;
      case "game": if (!values.game) message = "Choose a preferred game."; break;
      case "terms": if (!values.terms) message = "Accept the terms and conditions to continue."; break;
      default: break;
    }
    setErrors((current) => ({ ...current, [field]: message }));
    return !message;
  }

  function submitRegistration(event) {
    event.preventDefault();
    if (registrationBusy || switching) return;
    setAttempted(true);
    const values = { ...registration, username: registration.username.trim() };
    setRegistration(values);
    const valid = ["username", "email", "password", "confirmation", "game", "terms"]
      .map((field) => validateRegistrationField(field, values)).every(Boolean);
    if (!valid) return;
    setRegistrationBusy(true);
    setRegistrationSuccess(true);
    after(() => changeMode("login", true), 600);
  }

  function submitLogin(event) {
    event.preventDefault();
    if (switching || homeRevealing) return;
    const identifier = login.identifier.trim();
    const accountKnown = ["demo@gamearena.gg", "shadowkira"].includes(identifier.toLowerCase());
    const nextErrors = {
      identifier: !identifier ? "Enter your email or username." : !accountKnown ? "No demo account matches this email or username." : "",
      loginPassword: !login.password ? "Enter your password." : accountKnown && login.password !== "Arena@2026" ? "The password does not match the demo account." : "",
    };
    setErrors((current) => ({ ...current, ...nextErrors }));
    if (nextErrors.identifier || nextErrors.loginPassword) return;
    if (!setCurrentUser({ id: "demo@gamearena.gg", username: "ShadowKira" })) {
      setErrors((current) => ({ ...current, identifier: "Could not save the demo login in this browser. Enable local storage and try again." }));
      return;
    }
    setLoginSuccess(true);
    after(() => {
      setHomeRevealing(true);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      after(() => navigate("/", { replace: true, state: { skipPageTransition: true } }), reduced ? 40 : 1050);
    }, 300);
  }

  const heading = mode === "register" ? "Your squad is waiting." : "Back in the arena.";
  const registerError = (key) => errors[key] || "";
  const formClass = (key) => `fld${registerError(key) ? " has-error" : ""}`;
  const loginFieldClass = (key) => `fld${registerError(key) ? " has-error" : ""}`;

  return <div className={`au ${spin} ${patternVisible ? "pattern-visible" : ""} ${homeRevealing ? "auth-home-reveal" : ""}`} data-mode={mode} data-transitioning={switching ? "true" : undefined}>
    {homeRevealing && <div className="home-underlay" aria-hidden="true"><MainLayout><Home /></MainLayout></div>}
    <aside>
      <div className="shape s1" />
      <div className="auth-branding"><Link className="brand auth-brand" to="/"><img src={logo} alt="" width="112" height="112" /><span>GAME ARENA</span></Link></div>
      <div className="auth-promo"><h1 id="auth-heading">{heading}</h1><small>Sample data. No real accounts are created.</small></div>
    </aside>
    <main>
      <form className={`fm auth-card auth-form${mode === "register" ? " is-active" : ""}`} data-form="register" aria-hidden={mode !== "register"} inert={mode !== "register" ? true : undefined} noValidate onSubmit={submitRegistration}>
        <h2>Create account</h2><p>Join in under a minute. Use the demo login afterwards.</p>
        <label className={formClass("username")}>Username<input id="reg-username" name="username" type="text" required minLength="3" placeholder="ShadowKira" autoComplete="username" aria-describedby="reg-username-error" aria-invalid={Boolean(registerError("username"))} value={registration.username} onChange={(event) => updateRegistration("username", event.target.value)} onBlur={() => { const value = registration.username.trim(); setRegistration((current) => ({ ...current, username: value })); if (attempted || value) validateRegistrationField("username", { ...registration, username: value }); }} /><small className="form-error" id="reg-username-error">{registerError("username")}</small></label>
        <label className={formClass("email")}>Email<input id="reg-email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" aria-describedby="reg-email-error" aria-invalid={Boolean(registerError("email"))} value={registration.email} onChange={(event) => updateRegistration("email", event.target.value)} onBlur={() => { if (attempted || registration.email) validateRegistrationField("email"); }} /><small className="form-error" id="reg-email-error">{registerError("email")}</small></label>
        <label className={formClass("password")}>Password<div className="password-control"><input id="reg-password" name="password" type={visiblePasswords.regPassword ? "text" : "password"} required minLength="8" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}" title="Use at least 8 characters with an uppercase letter, a lowercase letter, and a number." placeholder="At least 8 characters" autoComplete="new-password" aria-describedby="reg-password-error" aria-invalid={Boolean(registerError("password"))} value={registration.password} onChange={(event) => updateRegistration("password", event.target.value)} onBlur={() => { if (attempted || registration.password) validateRegistrationField("password"); }} /><PasswordToggle inputId="reg-password" visible={Boolean(visiblePasswords.regPassword)} onToggle={() => togglePassword("regPassword")} /></div><small className="form-error" id="reg-password-error">{registerError("password")}</small></label>
        <label className={formClass("confirmation")}>Confirm password<div className="password-control"><input id="reg-confirm-password" name="confirm-password" type={visiblePasswords.regConfirmation ? "text" : "password"} required minLength="8" placeholder="Repeat password" autoComplete="new-password" aria-describedby="reg-confirm-password-error" aria-invalid={Boolean(registerError("confirmation"))} value={registration.confirmation} onChange={(event) => updateRegistration("confirmation", event.target.value)} onBlur={() => { if (attempted || registration.confirmation) validateRegistrationField("confirmation"); }} /><PasswordToggle inputId="reg-confirm-password" visible={Boolean(visiblePasswords.regConfirmation)} onToggle={() => togglePassword("regConfirmation")} /></div><small className="form-error" id="reg-confirm-password-error">{registerError("confirmation")}</small></label>
        <label className={formClass("game")}>Preferred game<select id="reg-game" name="game" required aria-describedby="reg-game-error" aria-invalid={Boolean(registerError("game"))} value={registration.game} onChange={(event) => { updateRegistration("game", event.target.value); if (attempted) validateRegistrationField("game", { ...registration, game: event.target.value }); }}><option value="">Choose a game</option><option value="Valorant">Valorant</option><option value="BGMI">BGMI</option><option value="Counter-Strike 2">Counter-Strike 2</option></select><small className="form-error" id="reg-game-error">{registerError("game")}</small></label>
        <div className="row terms-row"><label className={`terms-field${registerError("terms") ? " has-error" : ""}`}><span><input id="reg-terms" name="terms" type="checkbox" required checked={registration.terms} aria-describedby="reg-terms-error" aria-invalid={Boolean(registerError("terms"))} onChange={(event) => { updateRegistration("terms", event.target.checked); if (attempted) validateRegistrationField("terms", { ...registration, terms: event.target.checked }); }} /> I accept the terms and conditions</span><small className="form-error" id="reg-terms-error">{registerError("terms")}</small></label></div>
        <button className="btn p" type="submit" disabled={registrationBusy}>{registrationBusy ? "Please wait…" : "Create account"}</button>
        <p className={`form-success${registrationSuccess ? " is-visible" : ""}`} role="status" aria-live="polite"><span className="success-check" aria-hidden="true">✓</span><span><strong>{registrationSuccess ? "Account created successfully! You can now log in to GAME ARENA." : ""}</strong><small>Demo only. Your details are not stored.</small></span></p>
        <p className="alt"><a className="auth-switch" href="/login" onClick={(event) => { event.preventDefault(); changeMode("login"); }}>Log in</a></p>
      </form>

      <form className={`fm auth-card auth-form${mode === "login" ? " is-active" : ""}`} data-form="login" aria-hidden={mode !== "login"} inert={mode !== "login" ? true : undefined} noValidate onSubmit={submitLogin}>
        <h2>Log in</h2><p>Welcome back. Pick up where you left off.</p>
        <div className="demo"><b>Demo account</b><br />Email: demo@gamearena.gg<br />Password: Arena@2026</div>
        <label className={loginFieldClass("identifier")}>Email or username<input id="login-identifier" name="username" type="text" required pattern="demo@gamearena\.gg|ShadowKira" title="Use the demo account: demo@gamearena.gg" autoComplete="username" placeholder="demo@gamearena.gg" aria-describedby="login-identifier-error" aria-invalid={Boolean(registerError("identifier"))} value={login.identifier} onChange={(event) => { setLogin((current) => ({ ...current, identifier: event.target.value })); setErrors((current) => ({ ...current, identifier: "" })); setLoginSuccess(false); }} /><small className="form-error" id="login-identifier-error">{registerError("identifier")}</small></label>
        <label className={loginFieldClass("loginPassword")}>Password<div className="password-control"><input id="login-password" name="password" type={visiblePasswords.loginPassword ? "text" : "password"} required pattern="Arena@2026" title="Use the demo password: Arena@2026" autoComplete="current-password" placeholder="Your password" aria-describedby="login-password-error" aria-invalid={Boolean(registerError("loginPassword"))} value={login.password} onChange={(event) => { setLogin((current) => ({ ...current, password: event.target.value })); setErrors((current) => ({ ...current, loginPassword: "" })); setLoginSuccess(false); }} /><PasswordToggle inputId="login-password" visible={Boolean(visiblePasswords.loginPassword)} onToggle={() => togglePassword("loginPassword")} /></div><small className="form-error" id="login-password-error">{registerError("loginPassword")}</small></label>
        <div className="row"><label><input type="checkbox" checked={login.remember} onChange={(event) => setLogin((current) => ({ ...current, remember: event.target.checked }))} /> Remember me</label><a href="mailto:support@gamearena.gg">Forgot password?</a></div>
        <button className="btn p" type="submit">Log in</button>
        <p className={`form-success login-success${loginSuccess ? " is-visible" : ""}`} role="status" aria-live="polite"><span className="success-check" aria-hidden="true">✓</span><span><strong>Login successful. Opening GAME ARENA…</strong></span></p>
        <p className="alt"><a className="auth-switch" href="/register" onClick={(event) => { event.preventDefault(); changeMode("register"); }}>Create an account</a></p>
      </form>
    </main>
  </div>;
}
