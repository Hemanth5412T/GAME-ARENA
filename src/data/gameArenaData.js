import { getAllTournaments, getTournamentById, isTournamentRegistrationOpen } from "./tournaments.js";
import { getAccountById } from "./accountStore.js";

const REGISTRATIONS_KEY = "gameArena.tournamentRegistrations";

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getRegistrationsForUser(userId) {
  if (!userId) return [];
  const registrations = readJSON(REGISTRATIONS_KEY, []);
  if (!Array.isArray(registrations)) return [];
  return registrations
    .filter((item) => item?.userId === userId && item.registrationStatus === "Registered")
    .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
}

const UNREGISTER_CUTOFF_MS = 3 * 24 * 60 * 60 * 1000;

export function getUnregisterDeadline(tournamentStart) {
  const startTime = new Date(tournamentStart).getTime();
  return Number.isFinite(startTime) ? new Date(startTime - UNREGISTER_CUTOFF_MS) : null;
}

export function isUnregistrationOpen(tournamentStart, now = new Date()) {
  const deadline = getUnregisterDeadline(tournamentStart);
  const nowTime = new Date(now).getTime();
  return Boolean(deadline) && Number.isFinite(nowTime) && nowTime < deadline.getTime();
}

export async function registerTournament(tournament, userId) {
  if (!userId) return { ok: false, reason: "login-required" };
  if (!tournament?.id || !tournament?.name) return { ok: false, reason: "invalid-tournament" };
  const canonicalTournament = (await getAllTournaments()).find((item) => item.id === tournament.id);
  if (!canonicalTournament) return { ok: false, reason: "invalid-tournament" };
  if (!isTournamentRegistrationOpen(canonicalTournament)) return { ok: false, reason: "registration-closed" };
  const account = await getAccountById(userId);
  if (!account || account.status === "banned") return { ok: false, reason: "account-unavailable" };
  if (account.status === "restricted") return { ok: false, reason: "account-restricted" };
  try {
    const registrations = readJSON(REGISTRATIONS_KEY, []);
    const list = Array.isArray(registrations) ? registrations : [];
    const currentParticipants = list.filter((item) => item?.tournamentId === canonicalTournament.id && item.registrationStatus === "Registered").length;
    if (Number.isFinite(canonicalTournament.participants?.capacity) && currentParticipants >= canonicalTournament.participants.capacity) return { ok: false, reason: "registration-closed" };
    const existing = list.find((item) => item.userId === userId && item.tournamentId === canonicalTournament.id);
    if (existing) return { ok: false, reason: "duplicate", registration: existing };
    const registration = {
      userId,
      tournamentId: canonicalTournament.id,
      name: canonicalTournament.name,
      game: canonicalTournament.game,
      registeredAt: new Date().toISOString(),
      tournamentStart: canonicalTournament.start || "",
      tournamentEnd: canonicalTournament.end || "",
      detailsUrl: canonicalTournament.detailsUrl || "tournament-details.html",
      entryFee: Number.isFinite(Number(canonicalTournament.entryFee)) ? Number(canonicalTournament.entryFee) : null,
      registrationStatus: "Registered",
      tournamentStatus: canonicalTournament.status || "Upcoming",
    };
    list.push(registration);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("gamearena:registration-updated", { detail: registration }));
    return { ok: true, registration };
  } catch {
    return { ok: false, reason: "storage-unavailable" };
  }
}

export async function unregisterTournament(tournamentId, userId, now = new Date()) {
  if (!userId) return { ok: false, reason: "login-required" };
  if (!tournamentId) return { ok: false, reason: "invalid-tournament" };
  try {
    const stored = readJSON(REGISTRATIONS_KEY, []);
    const registrations = Array.isArray(stored) ? stored : [];
    const index = registrations.findIndex((item) => item?.userId === userId && item?.tournamentId === tournamentId && item.registrationStatus === "Registered");
    if (index < 0) return { ok: false, reason: "not-registered" };
    const registration = registrations[index];
    const currentTournament = (await getAllTournaments()).find((item) => item.id === tournamentId) || getTournamentById(tournamentId);
    const tournamentStart = currentTournament?.start || registration.tournamentStart;
    if (!isUnregistrationOpen(tournamentStart, now)) return { ok: false, reason: "closed" };
    const remaining = registrations.filter((_, itemIndex) => itemIndex !== index);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(remaining));
    window.dispatchEvent(new CustomEvent("gamearena:registration-updated", { detail: { type: "unregistered", registration } }));
    return { ok: true, registration };
  } catch {
    return { ok: false, reason: "storage-unavailable" };
  }
}

export function subscribeToData(callback) {
  const onStorage = (event) => {
    if (event.key === REGISTRATIONS_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("gamearena:registration-updated", callback);
  window.addEventListener("gamearena:user-updated", callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("gamearena:registration-updated", callback);
    window.removeEventListener("gamearena:user-updated", callback);
  };
}
