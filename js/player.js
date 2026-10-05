if (requireLogin()) {
    const u = getCurrentUser(), ts = load("tournaments");
    const mine = load("registrations").filter(r => r.username === u.username);
    $("#hello").textContent = `Welcome, ${u.name}`;
    $("#adminBtn").hidden = !isAdmin(); // Players never see this button
    $("#stats").innerHTML = [["Tournaments joined", mine.length], ["Wins", 0], ["Losses", 0], ["Win rate", "—"]].map(([a, b]) => `<div class="card"><b>${b}</b>${a}</div>`).join("");
    const cards = mine.map(r => ts.find(t => t.id === r.tournamentId)).filter(Boolean).map(card).join("");
    $("#mine").innerHTML = cards || '<p class="muted">You haven\'t joined a tournament yet. Find one to get started.</p>';
}
