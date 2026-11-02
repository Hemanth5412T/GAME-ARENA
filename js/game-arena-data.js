(() => {
    const sessionKey = "gameArena.currentUser";
    const registrationsKey = "gameArena.tournamentRegistrations";

    function readJson(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    }

    function getCurrentUser() {
        const user = readJson(sessionKey, null);
        return user && typeof user.id === "string" ? user : null;
    }

    function getRegistrationsForUser(userId) {
        if (!userId) return [];
        const registrations = readJson(registrationsKey, []);
        if (!Array.isArray(registrations)) return [];
        return registrations
            .filter((registration) => registration && registration.userId === userId && registration.registrationStatus === "Registered")
            .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
    }

    function registerTournament(tournament) {
        const user = getCurrentUser();
        if (!user) return { ok: false, reason: "login-required" };
        if (!tournament || !tournament.id || !tournament.name) return { ok: false, reason: "invalid-tournament" };

        let registrations;
        try {
            registrations = readJson(registrationsKey, []);
            if (!Array.isArray(registrations)) registrations = [];
            const existing = registrations.find((registration) => registration.userId === user.id && registration.tournamentId === tournament.id);
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
                tournamentStatus: tournament.status || "Upcoming"
            };
            registrations.push(registration);
            localStorage.setItem(registrationsKey, JSON.stringify(registrations));
            window.dispatchEvent(new CustomEvent("gamearena:registration-updated", { detail: registration }));
            return { ok: true, registration };
        } catch {
            return { ok: false, reason: "storage-unavailable" };
        }
    }

    function setCurrentUser(user) {
        if (!user || !user.id) return false;
        try {
            localStorage.setItem(sessionKey, JSON.stringify({ id: String(user.id), username: String(user.username || "") }));
            return true;
        } catch {
            return false;
        }
    }

    window.GameArenaData = {
        getCurrentUser,
        getRegistrationsForUser,
        registerTournament,
        setCurrentUser
    };
})();
