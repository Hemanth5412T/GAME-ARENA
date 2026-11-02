import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "./TransitionLink.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../../assets/logos/logo.svg";
import { canUseAdmin, getInterfaceMode, setInterfaceMode, validateAdminAccount } from "../data/adminStore.js";

const navigation = [
  ["Home", "/"],
  ["Live", "/live"],
  ["Leaderboard", "/leaderboard"],
  ["Tournaments", "/search-events"],
  ["Profile", "/profile"],
  ["Activities", "/activities"],
];

export function MainNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, status, logout } = useAuth();
  const adminMode = getInterfaceMode() === "admin";
  const [logoutPending, setLogoutPending] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const logoutStarted = useRef(false);
  const current = pathname.startsWith("/tournament/") ? "/search-events" : pathname;

  function handleLogout() {
    if (logoutStarted.current || logoutPending) return;
    logoutStarted.current = true;
    setLogoutPending(true);
    setLogoutError("");
    try {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.documentElement.dataset.authTransition = "logout";
      logout();
      navigate("/login", { replace: true, viewTransition: true, state: { skipPageTransition: true, authTransition: "logout" } });
      window.setTimeout(() => { delete document.documentElement.dataset.authTransition; }, reduced ? 80 : 900);
    } catch (error) {
      logoutStarted.current = false;
      setLogoutError(error.message || "Could not sign out. Please try again.");
    } finally {
      setLogoutPending(false);
    }
  }

  return (
    <header className="nav">
      <div className="w">
        <Link className="brand" to="/"><img src={logo} alt="" width="40" height="40" />GAME ARENA</Link>
        <nav aria-label="Main"><ul>{navigation.map(([label, href]) => (
          <li key={href}><Link to={href} aria-current={current === href ? "page" : undefined}>{label}</Link></li>
        ))}{user && canUseAdmin(user) && <li className="nav-mode-item">{adminMode
          ? <><Link to="/admin" aria-current={pathname === "/admin" ? "page" : undefined}>Admin Dashboard</Link><button type="button" className="nav-mode-button" onClick={() => { setInterfaceMode("player"); navigate("/", { viewTransition: true }); }}>Player Mode</button></>
          : <button type="button" className="nav-mode-button" onClick={async () => { try { if (!(await validateAdminAccount(user.id))) { setLogoutError("Admin access is no longer available for this account."); return; } setInterfaceMode("admin"); navigate("/admin", { viewTransition: true }); } catch { setLogoutError("Could not verify admin access. Please try again."); } }}>Admin Mode</button>}</li>}
        <li className="nav-auth-item">{status === "loading" ? <span className="nav-auth-button" aria-busy="true">Login</span> : user
          ? <button className="nav-auth-button" type="button" disabled={logoutPending} onClick={handleLogout}>{logoutPending ? "Logging out…" : "Logout"}</button>
          : <Link className="nav-auth-button" to="/login">Login</Link>}
        {logoutError && <small className="nav-auth-error" role="alert">{logoutError}</small>}
        </li></ul></nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="w">
        <div className="fg rv">
          <div><Link className="brand" to="/"><img src={logo} alt="" width="40" height="40" />GAME ARENA</Link>
            <p style={{ marginTop: 12, maxWidth: "36ch" }}>Find tournaments, watch live matches and track your climb.</p>
          </div>
          <ul><li><Link to="/">Home</Link></li><li><Link to="/live">Live</Link></li><li><Link to="/leaderboard">Leaderboard</Link></li></ul>
          <ul><li><Link to="/search-events">Tournaments</Link></li><li><Link to="/profile">Profile</Link></li><li><Link to="/activities">Activities</Link></li><li><Link to="/register">Create account</Link></li></ul>
        </div>
        <small>Frontend prototype. All players, teams, scores and prizes are sample data.</small>
      </div>
    </footer>
  );
}

export function MainLayout({ children }) {
  return <><MainNav />{children}<SiteFooter /></>;
}

export default MainLayout;
