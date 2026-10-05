/* Public tournaments page: search, game/status filters, sorting */
const ids = ["q", "game", "status", "sort"];
function refreshView() {
    const [q, game, status, sort] = ids.map(i => $("#" + i).value);
    let list = load("tournaments").filter(t => (!q || t.name.toLowerCase().includes(q.toLowerCase())) && (game === "All" || t.game === game) && (status === "All" || t.status === status));
    const prize = t => +t.prizePool.replace(/[^\d]/g, "");
    list.sort({ date: (a, b) => a.date.localeCompare(b.date), prize: (a, b) => prize(b) - prize(a), reg: (a, b) => b.registered - a.registered }[sort]);
    $("#list").innerHTML = list.map(card).join("") || '<p class="muted">No tournaments match these filters.</p>';
}
ids.forEach(i => $("#" + i).addEventListener("input", refreshView));
refreshView();
