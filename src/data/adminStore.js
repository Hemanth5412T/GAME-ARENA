import { ADMIN_STORES, getStoredAccounts, updateStoredAccount, createAccount, initializeAccountDatabase, repairSeedAccountCredentials } from "./accountStore.js";
import { MASTER_ADMIN_SEED } from "./adminSeed.js";

const DB = "gameArenaAccounts";
const ADMIN_MODE_KEY = "gameArena.interfaceMode";
const makeId = () => crypto.randomUUID();
const nowIso = () => new Date().toISOString();

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 2);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Admin storage unavailable."));
  });
}
async function all(storeName) { const db = await openDb(); return new Promise((resolve, reject) => { const r = db.transaction(storeName, "readonly").objectStore(storeName).getAll(); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }); }
function write(storeName, action) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite"); const store = tx.objectStore(storeName); let result;
    try { result = action(store); } catch (error) { tx.abort(); reject(error); return; }
    tx.oncomplete = () => resolve(result); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error("Operation was not saved."));
  }));
}
function audit(actor, action, targetId, description) {
  return write(ADMIN_STORES.audit, (store) => store.add({ id: makeId(), actorId: actor.id, actorUsername: actor.username, actorRole: actor.role, action, targetId: targetId || null, description: description || "", at: nowIso() }));
}
function isAdmin(account) { return account?.role === "admin" || account?.role === "master_admin"; }
function isMaster(account) { return account?.role === "master_admin"; }
async function assertActor(actorId, masterOnly = false) {
  const actor = (await getStoredAccounts()).find((item) => item.id === actorId);
  if (!actor || actor.status === "banned" || !isAdmin(actor) || getInterfaceMode() !== "admin" || (masterOnly && !isMaster(actor))) throw new Error("You are not authorized to perform this action.");
  return actor;
}

export async function initializeAdminData() {
  await initializeAccountDatabase();
  const repairedSeed = await repairSeedAccountCredentials(MASTER_ADMIN_SEED);
  if (repairedSeed && repairedSeed.role !== "master_admin") await updateStoredAccount(repairedSeed.id, (account) => ({ ...account, role: "master_admin", updatedAt: nowIso() }));
  const accounts = await getStoredAccounts();
  if (!accounts.some((account) => account.role === "master_admin")) {
    const seeded = await createAccount(MASTER_ADMIN_SEED);
    if (seeded.ok) await updateStoredAccount(seeded.user.id, (account) => ({ ...account, role: "master_admin", createdBy: "first-run-seed", updatedAt: nowIso() }));
  }
}
export function getInterfaceMode() { try { return sessionStorage.getItem(ADMIN_MODE_KEY) === "admin" ? "admin" : "player"; } catch { return "player"; } }
export function setInterfaceMode(mode) { try { sessionStorage.setItem(ADMIN_MODE_KEY, mode === "admin" ? "admin" : "player"); } catch {} }
export async function chooseInitialMode(account) { const mode = isAdmin(account) ? "admin" : "player"; setInterfaceMode(mode); return mode; }
export function validateInterfaceMode(account) { if (!isAdmin(account)) { setInterfaceMode("player"); return "player"; } return getInterfaceMode(); }
export const canUseAdmin = isAdmin;
export async function validateAdminAccount(id) { const account = (await getStoredAccounts()).find((item) => item.id === id); return Boolean(account && isAdmin(account) && account.status !== "banned"); }

export async function listAdminData() {
  const [accounts, tournaments, requests, auditEvents] = await Promise.all([getStoredAccounts(), all(ADMIN_STORES.tournaments), all(ADMIN_STORES.requests), all(ADMIN_STORES.audit)]);
  return { accounts, tournaments, requests, audit: auditEvents.sort((a,b) => b.at.localeCompare(a.at)) };
}
export async function listManagedTournaments() { return all(ADMIN_STORES.tournaments); }
export async function updateAccountStatus(actorId, targetId, status, reason = "") {
  const actor = await assertActor(actorId); const accounts = await getStoredAccounts(); const target = accounts.find((item) => item.id === targetId);
  if (!target || target.role === "master_admin" || (target.role === "admin" && (!isMaster(actor) || actor.id === target.id))) throw new Error("This account cannot be managed by your role.");
  if (!['active','restricted','banned'].includes(status)) throw new Error("Invalid account status.");
  const updated = await updateStoredAccount(targetId, (account) => ({ ...account, status, statusReason: status === "active" ? null : reason.trim(), statusUpdatedAt: nowIso(), statusUpdatedBy: actor.id, isActive: status !== "banned", updatedAt: nowIso() }));
  await audit(actor, status === "active" ? "account-restored" : `account-${status}`, targetId, reason);
  return updated;
}
export async function changeAdminRole(actorId, targetId, role) {
  const actor = await assertActor(actorId, true); const target = (await getStoredAccounts()).find((item) => item.id === targetId);
  if (!target || target.role === "master_admin" || !["admin", "player"].includes(role)) throw new Error("Invalid role change.");
  const updated = await updateStoredAccount(targetId, (account) => ({ ...account, role, ...(role === "admin" ? { promotedAt: nowIso(), promotionSource: "master-admin" } : {}), updatedAt: nowIso() }));
  await audit(actor, role === "admin" ? "player-promoted" : "admin-demoted", targetId);
  return updated;
}
export async function requestPromotion(actorId, targetId) {
  const actor = await assertActor(actorId); if (!actor || actor.role !== "admin") throw new Error("Only Standard Admins may submit promotion requests.");
  const accounts = await getStoredAccounts(); const target = accounts.find((item) => item.id === targetId);
  if (!target || target.id === actor.id || target.role !== "player" || target.status === "banned") throw new Error("This player is not eligible for promotion.");
  const record = { id: makeId(), requesterId: actor.id, requesterUsername: actor.username, targetId, targetUsername: target.username, requestedAt: nowIso(), status: "Pending", decisionBy: null, decisionAt: null, note: "" };
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(ADMIN_STORES.requests, "readwrite"); const store = tx.objectStore(ADMIN_STORES.requests); let failure;
    const req = store.getAll(); req.onsuccess = () => { if (req.result.some((item) => item.targetId === targetId && item.status === "Pending")) { failure = new Error("A pending request already exists for this player."); tx.abort(); return; } store.add(record); };
    tx.oncomplete = resolve; tx.onabort = () => reject(failure || tx.error); tx.onerror = () => reject(failure || tx.error);
  });
  await audit(actor, "promotion-request-submitted", targetId); return record;
}
export async function decidePromotion(actorId, requestId, approved, note = "") {
  const actor = await assertActor(actorId, true); const db = await openDb();
  const outcome = await new Promise((resolve, reject) => {
    const tx = db.transaction(["accounts", ADMIN_STORES.requests, ADMIN_STORES.audit], "readwrite"); const accounts = tx.objectStore("accounts"); const requests = tx.objectStore(ADMIN_STORES.requests); const request = requests.get(requestId); let result; let error;
    request.onsuccess = () => {
      const record = request.result; if (!record || record.status !== "Pending") { error = new Error("This request is no longer pending."); tx.abort(); return; }
      const targetReq = accounts.get(record.targetId); const requesterReq = accounts.get(record.requesterId); const actorReq = accounts.get(actor.id);
      let target, requester, currentActor, ready = 0;
      const finalize = () => {
        if (++ready !== 3) return;
        if (approved && (!target || target.role !== "player" || target.status === "banned")) { error = new Error("The selected player is no longer eligible."); tx.abort(); return; }
        if (!requester || requester.role !== "admin" || requester.status === "banned") { error = new Error("The requesting admin is no longer authorized."); tx.abort(); return; }
        if (!currentActor || currentActor.role !== "master_admin" || currentActor.status === "banned" || getInterfaceMode() !== "admin") { error = new Error("The Master Admin is no longer authorized."); tx.abort(); return; }
        if (approved) { target.role = "admin"; target.promotedAt = nowIso(); target.promotionSource = `promotion-request:${record.id}`; target.updatedAt = nowIso(); accounts.put(target); }
        record.status = approved ? "Approved" : "Denied"; record.decisionBy = actor.id; record.decisionAt = nowIso(); record.note = note.trim(); requests.put(record);
        tx.objectStore(ADMIN_STORES.audit).add({ id: makeId(), actorId: actor.id, actorUsername: actor.username, actorRole: actor.role, action: approved ? "promotion-request-approved" : "promotion-request-denied", targetId: record.targetId, description: note.trim(), at: nowIso() }); result = record;
      };
      targetReq.onsuccess = () => { target = targetReq.result; finalize(); };
      requesterReq.onsuccess = () => { requester = requesterReq.result; finalize(); };
      actorReq.onsuccess = () => { currentActor = actorReq.result; finalize(); };
    };
    tx.oncomplete = () => resolve(result); tx.onabort = () => reject(error || tx.error || new Error("Could not decide this request.")); tx.onerror = () => reject(error || tx.error);
  }); return outcome;
}

const validStatus = new Set(["draft", "registration-open", "registration-closed", "upcoming", "ongoing", "completed", "cancelled"]);
export async function saveManagedTournament(actorId, input, existingId = null) {
  const actor = await assertActor(actorId); if (!isAdmin(actor)) throw new Error("Admin access required.");
  const required = ["name", "game", "description", "start", "registrationDeadline", "format"];
  if (required.some((key) => !String(input[key] || "").trim())) throw new Error("Complete all required tournament fields.");
  const start = Date.parse(input.start), deadline = Date.parse(input.registrationDeadline);
  if (!Number.isFinite(start) || !Number.isFinite(deadline) || deadline > start) throw new Error("Enter valid dates and a registration deadline no later than the start.");
  const fee = Number(input.entryFee), prize = Number(input.prizePool), capacity = Number(input.capacity);
  if (!validStatus.has(input.status) || !Number.isFinite(fee) || fee < 0 || !Number.isFinite(prize) || prize < 0 || !Number.isInteger(capacity) || capacity <= 0) throw new Error("Check status, fees, prize pool, and participant capacity.");
  const list = await all(ADMIN_STORES.tournaments); const id = existingId || `admin-${crypto.randomUUID()}`;
  if (!existingId && list.some((item) => item.id === id)) throw new Error("Tournament ID already exists.");
  const gameKey = input.game === "Valorant" ? "valorant" : input.game === "BGMI" ? "bgmi" : "cs2";
  const record = { ...(list.find((item) => item.id === id) || {}), ...input, id, gameKey, banner: input.game.toUpperCase(), status: input.status, entryFee: fee, prizePool: prize, participants: { registered: list.find((item) => item.id === id)?.participants?.registered || 0, capacity, label: "players" }, rules: String(input.rules || "").split("\n").map((item) => item.trim()).filter(Boolean), schedule: [], teams: [], source: "managed", updatedAt: nowIso() };
  await write(ADMIN_STORES.tournaments, (store) => store.put(record)); await audit(actor, existingId ? "tournament-edited" : "tournament-created", id, record.name); return record;
}
export async function deleteManagedTournament(actorId, id) {
  const actor = await assertActor(actorId); const existing = (await all(ADMIN_STORES.tournaments)).find((item) => item.id === id);
  if (!existing && !id) throw new Error("Tournament was not found.");
  const registrations = JSON.parse(localStorage.getItem("gameArena.tournamentRegistrations") || "[]");
  if (registrations.some((item) => item.tournamentId === id)) throw new Error("This tournament has registrations. Cancel or resolve them before deleting it.");
  await write(ADMIN_STORES.tournaments, (store) => store.put({ id, deleted: true, updatedAt: nowIso() })); await audit(actor, "tournament-deleted", id, existing?.name || id);
}
