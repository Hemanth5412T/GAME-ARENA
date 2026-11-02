const SESSION_KEY = "gameArena.currentUser";
const REGISTRATIONS_KEY = "gameArena.tournamentRegistrations";

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getCurrentUser() {
  const user = readJSON(SESSION_KEY, null);
  return user && typeof user.id === "string" ? user : null;
}

export function getRegistrationsForUser(userId) {
  if (!userId) return [];
  const registrations = readJSON(REGISTRATIONS_KEY, []);
  if (!Array.isArray(registrations)) return [];
  return registrations
    .filter((item) => item?.userId === userId && item.registrationStatus === "Registered")
    .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
}

export function setCurrentUser(user) {
  if (!user?.id) return false;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: String(user.id), username: String(user.username || "") }));
    window.dispatchEvent(new CustomEvent("gamearena:user-updated"));
    return true;
  } catch {
    return false;
  }
}

export function registerTournament(tournament) {
  const user = getCurrentUser();
  if (!user) return { ok: false, reason: "login-required" };
  if (!tournament?.id || !tournament?.name) return { ok: false, reason: "invalid-tournament" };
  try {
    const registrations = readJSON(REGISTRATIONS_KEY, []);
    const list = Array.isArray(registrations) ? registrations : [];
    const existing = list.find((item) => item.userId === user.id && item.tournamentId === tournament.id);
    if (existing) return { ok: false, reason: "duplicate", registration: existing };
    const registration = {
      userId: user.id,
      tournamentId: tournament.id,
      name: tournament.name,
      game: tournament.game,
      registeredAt: new Date().toISOString(),
      tournamentStart: tournament.start || "",
      tournamentEnd: tournament.end || "",
      detailsUrl: tournament.detailsUrl || "tournament-details.html",
      entryFee: Number.isFinite(Number(tournament.entryFee)) ? Number(tournament.entryFee) : null,
      registrationStatus: "Registered",
      tournamentStatus: tournament.status || "Upcoming",
    };
    list.push(registration);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("gamearena:registration-updated", { detail: registration }));
    return { ok: true, registration };
  } catch {
    return { ok: false, reason: "storage-unavailable" };
  }
}

export function subscribeToData(callback) {
  const onStorage = (event) => {
    if ([SESSION_KEY, REGISTRATIONS_KEY].includes(event.key)) callback();
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
