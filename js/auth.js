/* Mock auth. Frontend-only: this is NOT real security, anyone can edit localStorage. */
const getCurrentUser = () => LS.get("currentUser", null);
const isLoggedIn = () => !!getCurrentUser();
const isAdmin = () => getCurrentUser()?.role === "admin";
const rootPath = () => document.body.dataset.root || "";
function login(username, password) { const u = load("users").find(x => x.username === username && x.password === password); if (!u) return null; LS.set("currentUser", { id: u.id, username: u.username, name: u.name, role: u.role }); return u }
function logout() { localStorage.removeItem("currentUser"); location.href = rootPath() + "login.html" }
function requireLogin() { if (!isLoggedIn()) { location.href = rootPath() + "login.html"; return false } return true }
function requireAdmin() { if (!requireLogin()) return false; if (!isAdmin()) { location.href = rootPath() + "access-denied.html"; return false } return true }
