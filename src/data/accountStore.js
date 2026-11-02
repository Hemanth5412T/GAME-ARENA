const DB_NAME = "gameArenaAccounts";
const STORE = "accounts";
const SESSION_KEY = "gameArena.authUserId";
const ITERATIONS = 600_000;
let databasePromise;

function normalize(value) { return String(value || "").trim().toLowerCase(); }
function toBase64(bytes) { return btoa(String.fromCharCode(...new Uint8Array(bytes))); }
function fromBase64(value) { return Uint8Array.from(atob(value), (char) => char.charCodeAt(0)); }
function safeAccount(account) {
  if (!account) return null;
  const { passwordHash, passwordSalt, usernameNormalized, emailNormalized, ...safe } = account;
  return safe;
}
function openDatabase() {
  if (!globalThis.indexedDB || !globalThis.crypto?.subtle) return Promise.reject(new Error("Secure browser storage is unavailable."));
  if (!databasePromise) databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(STORE, { keyPath: "id" });
      store.createIndex("usernameNormalized", "usernameNormalized", { unique: true });
      store.createIndex("emailNormalized", "emailNormalized", { unique: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open account storage."));
    request.onblocked = () => reject(new Error("Account storage is blocked by another browser tab."));
  }).catch((error) => { databasePromise = null; throw error; });
  return databasePromise;
}
function requestValue(request) { return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
async function getByIndex(indexName, value) {
  const db = await openDatabase();
  return requestValue(db.transaction(STORE, "readonly").objectStore(STORE).index(indexName).get(value));
}
async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS }, key, 256));
}
function equalBytes(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference |= a[index] ^ b[index];
  return difference === 0;
}
function validUsername(username) { return /^[a-z0-9_]{3,24}$/.test(normalize(username)); }
function validEmail(email) { return /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(normalize(email)); }

export async function createAccount({ username, email, password }) {
  const cleanUsername = String(username || "").trim();
  const normalizedUsername = normalize(cleanUsername);
  const normalizedEmail = normalize(email);
  if (!validUsername(cleanUsername)) return { ok: false, fields: { username: "Use 3–24 letters, numbers, or underscores." } };
  if (!validEmail(normalizedEmail)) return { ok: false, fields: { email: "Enter a valid email address." } };
  if (typeof password !== "string" || password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) return { ok: false, fields: { password: "Use at least 8 characters with uppercase, lowercase, and a number." } };
  try {
    const [existingUsername, existingEmail] = await Promise.all([getByIndex("usernameNormalized", normalizedUsername), getByIndex("emailNormalized", normalizedEmail)]);
    if (existingUsername || existingEmail) return { ok: false, fields: { ...(existingUsername ? { username: "That username is already registered." } : {}), ...(existingEmail ? { email: "That email is already registered." } : {}) }, message: "Please correct the highlighted fields." };
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = await hashPassword(password, salt);
    const account = { id: crypto.randomUUID(), username: cleanUsername, email: normalizedEmail, usernameNormalized: normalizedUsername, emailNormalized: normalizedEmail, passwordSalt: toBase64(salt), passwordHash: toBase64(passwordHash), createdAt: new Date().toISOString(), isActive: true };
    const db = await openDatabase();
    await requestValue(db.transaction(STORE, "readwrite").objectStore(STORE).add(account));
    return { ok: true, user: safeAccount(account) };
  } catch (error) {
    if (error?.name === "ConstraintError") return { ok: false, message: "That username or email is already registered." };
    return { ok: false, unavailable: true, message: "Secure account storage is unavailable in this browser. Please use a supported browser and try again." };
  }
}

export async function authenticateAccount(identifier, password) {
  try {
    const value = normalize(identifier);
    const account = value.includes("@") ? await getByIndex("emailNormalized", value) : await getByIndex("usernameNormalized", value);
    if (!account || !account.isActive) {
      await hashPassword(String(password || ""), new Uint8Array(16));
      return { ok: false, message: "Email/username or password is incorrect." };
    }
    const matches = equalBytes(await hashPassword(String(password || ""), fromBase64(account.passwordSalt)), fromBase64(account.passwordHash));
    if (!matches) return { ok: false, message: "Email/username or password is incorrect." };
    return { ok: true, user: safeAccount(account) };
  } catch {
    return { ok: false, unavailable: true, message: "Secure account storage is unavailable in this browser. Please try again." };
  }
}

export async function getAccountById(id) {
  if (!id) return null;
  const db = await openDatabase();
  const account = await requestValue(db.transaction(STORE, "readonly").objectStore(STORE).get(id));
  return account?.isActive ? safeAccount(account) : null;
}

export function readSessionUserId() { try { return sessionStorage.getItem(SESSION_KEY); } catch { return null; } }
export function saveSessionUserId(id) { try { sessionStorage.setItem(SESSION_KEY, id); return true; } catch { return false; } }
export function clearSessionUserId() { try { sessionStorage.removeItem(SESSION_KEY); } catch {} }
