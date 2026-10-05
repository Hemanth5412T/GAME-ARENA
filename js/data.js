/* Central mock data + localStorage persistence. Seeds are written on first load. */
const LS = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v } catch { return d } }, set(k, v) { localStorage.setItem(k, JSON.stringify(v)) } };
const mk = (id, name, game, date, time, format, prize, reg, spots, status, desc) => ({ id, name, game, date, time, venue: "GAME Arena", format, prizePool: prize, registered: reg, totalSpots: spots, status, deadline: date, description: desc });
const SEED = {
    users: [{ id: 1, username: "admin", password: "admin123", name: "Admin", role: "admin" },
    { id: 2, username: "hemanth", password: "player123", name: "Hemanth", role: "player" },
    { id: 3, username: "riya", password: "player123", name: "Riya", role: "player" }],
    tournaments: [
        mk(1, "Valorant Champions Cup", "Valorant", "2026-10-20", "18:00", "5v5", "₹1,00,000", 24, 32, "Open", "Single-elimination bracket for the best Valorant squads."),
        mk(2, "BGMI Masters", "BGMI", "2026-10-12", "20:00", "Squad", "₹2,50,000", 100, 100, "Live", "Six-match points series across Erangel and Miramar."),
        mk(3, "CS2 Arena Championship", "Counter-Strike 2", "2026-11-02", "17:00", "5v5", "₹75,000", 10, 16, "Upcoming", "Best-of-three group stage into playoffs."),
        mk(4, "Valorant Rising Stars", "Valorant", "2026-09-15", "16:00", "5v5", "₹40,000", 16, 16, "Completed", "Open qualifier for rising teams."),
        mk(5, "BGMI Weekend Brawl", "BGMI", "2026-10-25", "19:00", "Squad", "₹30,000", 38, 64, "Open", "Casual weekend lobby with kill-point bonuses.")],
    registrations: []
};
function load(k) { let v = LS.get(k, null); if (v === null) { v = SEED[k]; LS.set(k, v) } return v }
const save = (k, v) => LS.set(k, v);
