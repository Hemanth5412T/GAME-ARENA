(() => {
    const data = window.GameArenaData;
    const list = document.querySelector("#registered-tournament-list");
    const emptyState = document.querySelector("#registered-tournament-empty");
    const timeline = document.querySelector("#activity-timeline");
    if (!data || !list || !emptyState || !timeline) return;

    const dateTimeFormat = new Intl.DateTimeFormat("en-IN", {
        day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit"
    });
    const dateFormat = new Intl.DateTimeFormat("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    });

    function formatDate(value, withTime = false) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Date unavailable";
        return (withTime ? dateTimeFormat : dateFormat).format(date);
    }

    function tournamentStatus(registration) {
        if (registration.tournamentStatus === "Cancelled") return "Cancelled";
        const now = Date.now();
        const start = Date.parse(registration.tournamentStart);
        const end = Date.parse(registration.tournamentEnd);
        if (Number.isFinite(start) && now < start) return "Upcoming";
        if (Number.isFinite(end) && now > end) return "Completed";
        if (Number.isFinite(start) && now >= start && (!Number.isFinite(end) || now <= end)) return "Live";
        return registration.tournamentStatus || "Upcoming";
    }

    function createStatus(text, type) {
        const badge = document.createElement("span");
        badge.className = `registration-status-badge status-${type}`;
        badge.textContent = text;
        return badge;
    }

    function createTournamentCard(registration) {
        const card = document.createElement("article");
        card.className = "card pad registered-tournament-card";

        const header = document.createElement("div");
        header.className = "registered-tournament-header";
        const title = document.createElement("h3");
        title.textContent = registration.name;
        const status = tournamentStatus(registration);
        header.append(title, createStatus(status, status.toLowerCase()));

        const details = document.createElement("div");
        details.className = "registered-tournament-meta";
        const rows = [
            ["Game", registration.game || "—"],
            ["Registered", formatDate(registration.registeredAt, true)],
            ["Tournament", registration.tournamentStart ? formatDate(registration.tournamentStart, true) : "Date unavailable"],
            ["Registration", registration.registrationStatus]
        ];
        if (registration.entryFee !== null && registration.entryFee !== undefined) {
            rows.push(["Entry fee", registration.entryFee === 0 ? "Free" : `₹${Number(registration.entryFee).toLocaleString("en-IN")}`]);
        }
        rows.forEach(([label, value]) => {
            const detail = document.createElement("p");
            const key = document.createElement("b");
            key.textContent = `${label}: `;
            detail.append(key, document.createTextNode(value));
            details.append(detail);
        });

        const link = document.createElement("a");
        link.className = "btn o sm registered-tournament-link";
        link.href = registration.detailsUrl || "tournament-details.html";
        link.textContent = "View Tournament";
        card.append(header, details, link);
        return card;
    }

    function createTimelineEntry(registration) {
        const item = document.createElement("div");
        item.className = "ti rv registered-timeline-entry";
        item.dataset.activityType = "tournament-registration";
        item.dataset.activityAt = registration.registeredAt;

        const card = document.createElement("div");
        card.className = "card pad";
        const time = document.createElement("time");
        time.dateTime = registration.registeredAt;
        time.textContent = formatDate(registration.registeredAt, true);
        const heading = document.createElement("h3");
        heading.textContent = "REGISTERED FOR TOURNAMENT";
        const tournament = document.createElement("p");
        tournament.className = "win";
        tournament.textContent = `${registration.game || "Tournament"} · ${registration.name}`;
        const result = document.createElement("p");
        result.className = "win";
        result.textContent = `Registration successful · ${formatDate(registration.registeredAt)}`;
        card.append(time, heading, tournament, result);
        item.append(card);
        return item;
    }

    function updateStats(registrations) {
        const now = new Date();
        const thisMonthMatches = [...timeline.querySelectorAll('[data-activity-type="match"]')].filter((item) => {
            const date = new Date(item.dataset.activityAt);
            return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
        });
        const values = {
            matches: thisMonthMatches.length,
            wins: thisMonthMatches.filter((item) => item.dataset.matchResult === "win").length,
            tournaments: registrations.filter((item) => item.registrationStatus === "Registered").length,
            badges: timeline.querySelectorAll('[data-activity-type="badge"]').length
        };
        Object.entries(values).forEach(([key, value]) => {
            const target = document.querySelector(`[data-activity-stat="${key}"]`);
            if (target) target.textContent = String(value);
        });
    }

    function render() {
        const user = data.getCurrentUser();
        const registrations = user ? data.getRegistrationsForUser(user.id) : [];

        list.replaceChildren(...registrations.map(createTournamentCard));
        emptyState.hidden = registrations.length > 0;

        timeline.querySelectorAll(".registered-timeline-entry").forEach((entry) => entry.remove());
        registrations.forEach((registration) => timeline.append(createTimelineEntry(registration)));
        [...timeline.children]
            .sort((a, b) => Date.parse(b.dataset.activityAt) - Date.parse(a.dataset.activityAt))
            .forEach((entry) => timeline.append(entry));

        updateStats(registrations);
    }

    render();
    window.addEventListener("storage", (event) => {
        if (event.key === "gameArena.tournamentRegistrations" || event.key === "gameArena.currentUser") render();
    });
    window.addEventListener("gamearena:registration-updated", render);
})();
