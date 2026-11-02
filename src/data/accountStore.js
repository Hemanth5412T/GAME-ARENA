const DB_NAME = "gameArenaAccounts";
const STORE = "accounts";
export const ADMIN_STORES = { tournaments: "managedTournaments", requests: "promotionRequests", audit: "adminAudit" };
const SESSION_KEY = "gameArena.authUserId";
const ITERATIONS = 600_000;
let databasePromise;

function normalize(value) { return String(value || "").trim().toLowerCase(); }
function toBase64(bytes) { return btoa(String.fromCharCode(...new Uint8Array(bytes))); }
function fromBase64(value) { return Uint8Array.from(atob(value), (char) => char.charCodeAt(0)); }
function safeAccount(account) {
  if (!account) return null;
  const { passwordHash, passwordSalt, usernameNormalized, emailNormalized, ...safe } = account;
  return { ...safe, playerId: account.playerId || `GA-${String(account.id).replaceAll("-", "").slice(0, 8).toUpperCase()}` };
}
function openDatabase() {
  if (!globalThis.indexedDB || !globalThis.crypto?.subtle) return Promise.reject(new Error("Secure browser storage is unavailable."));
  if (!databasePromise) databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      let store;
      if (!db.objectStoreNames.contains(STORE)) {
        store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("usernameNormalized", "usernameNormalized", { unique: true });
        store.createIndex("emailNormalized", "emailNormalized", { unique: true });
      } else store = request.transaction.objectStore(STORE);
      for (const name of Object.values(ADMIN_STORES)) if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: "id" });
      if (event.oldVersion < 2) {
        const cursor = store.openCursor();
        cursor.onsuccess = () => {
          const row = cursor.result;
          if (!row) return;
          const account = row.value;
          row.update({ ...account, role: account.role || "player", status: account.status || (account.isActive === false ? "banned" : "active"), statusReason: account.statusReason || null, statusUpdatedAt: account.statusUpdatedAt || null, statusUpdatedBy: account.statusUpdatedBy || null });
          row.continue();
        };
      }
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
async function getStoredAccountById(id) {
  const db = await openDatabase();
  return requestValue(db.transaction(STORE, "readonly").objectStore(STORE).get(id));
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
function validUsername(username) { return /^[a-z0-9_@]{3,24}$/.test(normalize(username)); }
function validEmail(email) { return /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(normalize(email)); }

export async function createAccount({ username, email, password }) {
  const cleanUsername = String(username || "").trim();
  const normalizedUsername = normalize(cleanUsername);
  const normalizedEmail = normalize(email);
  if (!validUsername(cleanUsername)) return { ok: false, fields: { username: "Use 3–24 letters, numbers, underscores, or @." } };
  if (!validEmail(normalizedEmail)) return { ok: false, fields: { email: "Enter a valid email address." } };
  if (typeof password !== "string" || password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) return { ok: false, fields: { password: "Use at least 8 characters with uppercase, lowercase, and a number." } };
  try {
    const [existingUsername, existingEmail] = await Promise.all([getByIndex("usernameNormalized", normalizedUsername), getByIndex("emailNormalized", normalizedEmail)]);
    if (existingUsername || existingEmail) return { ok: false, fields: { ...(existingUsername ? { username: "That username is already registered." } : {}), ...(existingEmail ? { email: "That email is already registered." } : {}) }, message: "Please correct the highlighted fields." };
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = await hashPassword(password, salt);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const account = { id, playerId: `GA-${id.replaceAll("-", "").slice(0, 8).toUpperCase()}`, username: cleanUsername, email: normalizedEmail, usernameNormalized: normalizedUsername, emailNormalized: normalizedEmail, passwordHash: toBase64(passwordHash), passwordSalt: toBase64(salt), bio: "", role: "player", status: "active", statusReason: null, statusUpdatedAt: null, statusUpdatedBy: null, createdAt: now, updatedAt: now, isActive: true };
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
    const account = await getByIndex("usernameNormalized", value) || (value.includes("@") ? await getByIndex("emailNormalized", value) : null);
    if (account?.status === "banned" || account?.isActive === false) return { ok: false, banned: true, message: "This account is banned and cannot log in." };
    if (!account) {
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
  const account = await getStoredAccountById(id);
  return account?.isActive && account.status !== "banned" ? safeAccount(account) : null;
}

export async function getStoredAccounts() {
  const db = await openDatabase();
  const rows = await requestValue(db.transaction(STORE, "readonly").objectStore(STORE).getAll());
  return rows.map(safeAccount);
}
export async function updateStoredAccount(id, updater) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite"); const store = tx.objectStore(STORE); let result;
    const req = store.get(id); req.onsuccess = () => { if (!req.result) { tx.abort(); return; } result = updater(req.result); store.put(result); };
    tx.oncomplete = () => resolve(safeAccount(result)); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error("Account update rejected."));
  });
}
export async function initializeAccountDatabase() { await openDatabase(); }

// Repairs only the known first-run demo administrator after the early prototype
// stored its account without the computed password hash. Other accounts must
// reset their password because their original plaintext is intentionally absent.
export async function repairSeedAccountCredentials({ username, email, password, legacyUsername, legacyEmail }) {
  const usernameNormalized = normalize(username);
  const db = await openDatabase();
  const existing = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const currentReq = store.index("usernameNormalized").get(usernameNormalized);
    currentReq.onsuccess = async () => {
      let account = currentReq.result;
      if (!account && legacyUsername) {
        const legacyReq = store.index("usernameNormalized").get(normalize(legacyUsername));
        legacyReq.onsuccess = () => {
          const legacy = legacyReq.result;
          if (legacy?.role === "master_admin" || legacy?.createdBy === "first-run-seed" || normalize(legacy?.email) === normalize(legacyEmail)) resolve(legacy);
          else resolve(null);
        };
        legacyReq.onerror = () => reject(legacyReq.error);
        return;
      }
      if (account && (account.role === "master_admin" || account.createdBy === "first-run-seed")) resolve(account);
      else resolve(null);
    };
    currentReq.onerror = () => reject(currentReq.error);
  });
  if (!existing) return null;
  const changed = existing.username !== username || existing.email !== normalize(email) || !existing.passwordHash || !existing.passwordSalt;
  if (!changed) return safeAccount(existing);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await hashPassword(password, salt);
  await requestValue(db.transaction(STORE, "readwrite").objectStore(STORE).put({
    ...existing,
    username,
    usernameNormalized,
    email: normalize(email),
    emailNormalized: normalize(email),
    passwordHash: toBase64(passwordHash),
    passwordSalt: toBase64(salt),
    role: "master_admin",
    status: existing.status || "active",
    isActive: existing.status !== "banned",
    updatedAt: new Date().toISOString(),
  }));
  return safeAccount({ ...existing, username, usernameNormalized, email: normalize(email), emailNormalized: normalize(email), role: "master_admin" });
}

export async function updateAccountProfile(id, { username, bio }) {
  const cleanUsername = String(username || "").trim();
  const usernameNormalized = normalize(cleanUsername);
  const cleanBio = String(bio ?? "").trim();
  if (!validUsername(cleanUsername)) return { ok: false, reason: "invalid-username", message: "Use 3–24 letters, numbers, underscores, or @." };
  if (cleanBio.length > 250) return { ok: false, reason: "bio-too-long", message: "Bio must be 250 characters or fewer." };
  try {
    const existing = await getStoredAccountById(id);
    if (!existing?.isActive) return { ok: false, reason: "account-unavailable", message: "This account is no longer available." };
    if (cleanUsername === existing.username && cleanBio === String(existing.bio || "")) return { ok: true, user: safeAccount(existing) };
    if (usernameNormalized !== existing.usernameNormalized) {
      if (await getByIndex("usernameNormalized", usernameNormalized)) return { ok: false, reason: "username-taken", message: "That username is already in use." };
    }
    const db = await openDatabase();
    const updated = await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, "readwrite");
      const store = transaction.objectStore(STORE);
      let result;
      let failure;
      const request = store.get(id);
      request.onsuccess = () => {
        const current = request.result;
        if (!current?.isActive) {
          failure = new Error("This account is no longer available.");
          transaction.abort();
          return;
        }
        result = { ...current, username: cleanUsername, usernameNormalized, bio: cleanBio, updatedAt: new Date().toISOString() };
        store.put(result);
      };
      transaction.oncomplete = () => resolve(result);
      transaction.onabort = () => reject(failure || transaction.error || new Error("Could not save profile changes."));
      transaction.onerror = () => reject(failure || transaction.error || new Error("Could not save profile changes."));
    });
    return { ok: true, user: safeAccount(updated) };
  } catch (error) {
    if (error?.name === "ConstraintError") return { ok: false, reason: "username-taken", message: "That username is already in use." };
    if (error?.message === "This account is no longer available.") return { ok: false, reason: "account-unavailable", message: error.message };
    return { ok: false, reason: "storage-unavailable", message: "Profile changes could not be saved. Please try again." };
  }
}

export async function changeAccountPassword(id, currentPassword, newPassword, confirmation) {
  if (!currentPassword || !newPassword || !confirmation) return { ok: false, reason: "missing-password", message: "Complete all three password fields." };
  if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) return { ok: false, reason: "weak-password", message: "Use at least 8 characters with an uppercase letter, lowercase letter, and number." };
  if (newPassword !== confirmation) return { ok: false, reason: "password-mismatch", message: "The new passwords do not match." };
  if (newPassword === currentPassword) return { ok: false, reason: "same-password", message: "Choose a password different from your current one." };
  try {
    const account = await getStoredAccountById(id);
    if (!account?.isActive) return { ok: false, reason: "account-unavailable", message: "This account is no longer available." };
    const verified = equalBytes(await hashPassword(currentPassword, fromBase64(account.passwordSalt)), fromBase64(account.passwordHash));
    if (!verified) return { ok: false, reason: "incorrect-current-password", message: "Current password is incorrect." };
    const passwordSalt = toBase64(crypto.getRandomValues(new Uint8Array(16)));
    const passwordHash = toBase64(await hashPassword(newPassword, fromBase64(passwordSalt)));
    const updated = await new Promise((resolve, reject) => {
      const dbPromise = openDatabase();
      dbPromise.then((db) => {
        const transaction = db.transaction(STORE, "readwrite");
        const store = transaction.objectStore(STORE);
        let result;
        let failure;
        const request = store.get(id);
        request.onsuccess = () => {
          const current = request.result;
          if (!current?.isActive || current.passwordHash !== account.passwordHash || current.passwordSalt !== account.passwordSalt) {
            failure = new Error("Account credentials changed while this update was being saved. Please try again.");
            transaction.abort();
            return;
          }
          result = { ...current, passwordSalt, passwordHash, updatedAt: new Date().toISOString() };
          store.put(result);
        };
        transaction.oncomplete = () => resolve(result);
        transaction.onabort = () => reject(failure || transaction.error || new Error("Could not update password."));
        transaction.onerror = () => reject(failure || transaction.error || new Error("Could not update password."));
      }).catch(reject);
    });
    return { ok: true, user: safeAccount(updated) };
  } catch (error) {
    if (error?.message?.startsWith("Account credentials changed")) return { ok: false, reason: "credentials-changed", message: error.message };
    if (error?.message === "This account is no longer available.") return { ok: false, reason: "account-unavailable", message: error.message };
    return { ok: false, reason: "storage-unavailable", message: "Password could not be updated. Please try again." };
  }
}

export function readSessionUserId() { try { return sessionStorage.getItem(SESSION_KEY); } catch { return null; } }
export function saveSessionUserId(id) { try { sessionStorage.setItem(SESSION_KEY, id); return true; } catch { return false; } }
export function clearSessionUserId() { try { sessionStorage.removeItem(SESSION_KEY); } catch {} }
