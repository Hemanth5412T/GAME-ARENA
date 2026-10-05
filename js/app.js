const ROOT = document.body.dataset.root || "";
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = d => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
function toast(m) { const e = document.createElement("div"); e.className = "toast"; e.textContent = m; document.body.append(e); setTimeout(() => e.remove(), 2500) }
function modal(html) { const m = document.createElement("div"); m.className = "overlay"; m.innerHTML = `<div class="modal">${html}<button class="btn ghost close">Close</button></div>`; m.onclick = e => { if (e.target === m || e.target.classList.contains("close")) m.remove() }; document.body.append(m); return m }
function renderNav() {
    const u = getCurrentUser();
    const auth = u ? `<span class="muted">${esc(u.username)} (${u.role})</span><a href="${ROOT}player/dashboard.html">Player Dashboard</a>${u.role === "admin" ? `<a href="${ROOT}admin/dashboard.html">Admin Dashboard</a>` : ""}<a href="#" id="logout">Logout</a>` : `<a href="${ROOT}login.html">Login</a><a href="${ROOT}register.html">Register</a>`;
    $("#nav").innerHTML = `<a class="logo" href="${ROOT}index.html">GAME ARENA</a><button class="burger" aria-label="Menu">☰</button><div class="links"><a href="${ROOT}index.html">Home</a><a href="${ROOT}tournaments.html">Tournaments</a>${auth}</div>`;
    $(".burger").onclick = () => $(".links").classList.toggle("open");
    $("#logout")?.addEventListener("click", e => { e.preventDefault(); logout() });
}
function card(t) {
    const full = t.registered >= t.totalSpots, closed = t.status === "Completed";
    return `<article class="card"><span class="tag ${t.status}">${t.status}</span><h3>${esc(t.name)}</h3><p class="muted">${esc(t.game)} · ${esc(t.format)}</p><p>${fmt(t.date)}, ${t.time}<br>${esc(t.venue)}</p><p class="prize">${esc(t.prizePool)}</p><p>${t.registered} / ${t.totalSpots} Registered</p><div class="row"><button class="btn" data-reg="${t.id}" ${full || closed ? "disabled" : ""}>${full ? "Registration Full" : closed ? "Closed" : "Register Now"}</button><button class="btn ghost" data-view="${t.id}">View Details</button></div></article>`;
}
function showDetails(id) {
    const t = load("tournaments").find(x => x.id === id); if (!t) return;
    modal(`<h2>${esc(t.name)}</h2><p class="muted">${esc(t.game)} · ${esc(t.format)} · ${t.status}</p><p>${esc(t.description)}</p><p><b>Date:</b> ${fmt(t.date)}, ${t.time}<br><b>Venue:</b> ${esc(t.venue)}<br><b>Prize pool:</b> ${esc(t.prizePool)}<br><b>Spots:</b> ${t.registered} / ${t.totalSpots}<br><b>Registration deadline:</b> ${fmt(t.deadline)}</p>`);
}
function showRegister(id) {
    if (!requireLogin()) return;
    const ts = load("tournaments"), t = ts.find(x => x.id === id), u = getCurrentUser();
    if (!t || t.registered >= t.totalSpots) return toast("Registration full");
    const regs = load("registrations");
    if (regs.some(r => r.tournamentId === id && r.username === u.username)) return toast("You are already registered");
    const m = modal(`<h2>Register: ${esc(t.name)}</h2><form id="regForm" novalidate><label>Player name<input name="name" value="${esc(u.name)}"></label><label>Username<input name="username" value="${esc(u.username)}" readonly></label><label>Team name<input name="team"></label><label>Email<input name="email" type="email"></label><label>Phone<input name="phone" inputmode="tel"></label><p class="err" id="regErr"></p><div class="row"><button class="btn">Confirm registration</button></div></form>`);
    $("#regForm", m).onsubmit = e => {
        e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
        const err = !f.name.trim() || !f.team.trim() ? "Name and team are required." : !/^\S+@\S+\.\S+$/.test(f.email) ? "Enter a valid email." : !/^\d{10}$/.test(f.phone) ? "Enter a 10-digit phone number." : "";
        if (err) { $("#regErr", m).textContent = err; return }
        regs.push({ id: Date.now(), tournamentId: id, ...f }); save("registrations", regs);
        t.registered++; save("tournaments", ts); m.remove(); toast("Registered successfully");
        if (window.refreshView) refreshView();
    };
}
document.addEventListener("click", e => {
    const r = e.target.closest("[data-reg]"), v = e.target.closest("[data-view]");
    if (r) showRegister(+r.dataset.reg); if (v) showDetails(+v.dataset.view);
});
renderNav();
