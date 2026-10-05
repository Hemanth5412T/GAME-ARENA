/* Admin: tournament CRUD + live control. Guarded by requireAdmin (prototype-only). */
if (requireAdmin()) {
  const GAMES = ["Valorant", "BGMI", "Counter-Strike 2"], STAT = ["Upcoming", "Open", "Live", "Completed"];
  function render() {
    const ts = load("tournaments");
    $("#stats").innerHTML = [["Tournaments", ts.length], ["Live", ts.filter(t => t.status === "Live").length], ["Registrations", load("registrations").length], ["Players", load("users").filter(u => u.role === "player").length]].map(([a, b]) => `<div class="card"><b>${b}</b>${a}</div>`).join("");
    $("#rows").innerHTML = ts.map(t => `<tr><td>${esc(t.name)}</td><td>${esc(t.game)}</td><td>${fmt(t.date)}</td><td>${t.registered}/${t.totalSpots}</td><td><select data-status="${t.id}">${STAT.map(s => `<option ${s === t.status ? "selected" : ""}>${s}</option>`).join("")}</select></td><td><button class="btn ghost" data-edit="${t.id}">Edit</button> <button class="btn danger" data-del="${t.id}">Delete</button></td></tr>`).join("");
  }
  function form(id) {
    const ts = load("tournaments"), t = ts.find(x => x.id === id) || { name: "", game: GAMES[0], date: "", time: "18:00", format: "5v5", prizePool: "", totalSpots: 16, description: "", status: "Upcoming" };
    const m = modal(`<h2>${id ? "Edit" : "Create"} tournament</h2><form id="tf"><label>Name<input name="name" required value="${esc(t.name)}"></label><label>Game<select name="game">${GAMES.map(g => `<option ${g === t.game ? "selected" : ""}>${g}</option>`).join("")}</select></label><label>Date<input type="date" name="date" required value="${t.date}"></label><label>Time<input type="time" name="time" value="${t.time}"></label><label>Format<input name="format" value="${esc(t.format)}"></label><label>Prize pool<input name="prizePool" required value="${esc(t.prizePool)}"></label><label>Total spots<input type="number" min="2" name="totalSpots" value="${t.totalSpots}"></label><label>Description<textarea name="description">${esc(t.description)}</textarea></label><div class="row"><button class="btn">Save tournament</button></div></form>`);
    $("#tf", m).onsubmit = e => {
      e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); f.totalSpots = +f.totalSpots;
      if (id) Object.assign(t, f); else ts.push({ ...t, ...f, id: Date.now(), venue: "GAME Arena", registered: 0, deadline: f.date });
      save("tournaments", ts); m.remove(); render(); toast("Tournament saved")
    };
  }
  document.addEventListener("click", e => {
    const ed = e.target.closest("[data-edit]"), de = e.target.closest("[data-del]");
    if (e.target.id === "create") form();
    if (ed) form(+ed.dataset.edit);
    if (de && confirm("Delete this tournament? This cannot be undone.")) { save("tournaments", load("tournaments").filter(t => t.id !== +de.dataset.del)); render(); toast("Tournament deleted") }
  });
  document.addEventListener("change", e => {
    if (!e.target.dataset.status) return;
    const ts = load("tournaments"); ts.find(t => t.id === +e.target.dataset.status).status = e.target.value; save("tournaments", ts); render(); toast("Status updated");
  });
  render();
}
