import { useLocation } from "react-router-dom";
import { Link } from "./TransitionLink.jsx";
import logo from "../../assets/logos/logo.svg";

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
  const current = pathname.startsWith("/tournament/") ? "/search-events" : pathname;
  return (
    <header className="nav">
      <div className="w">
        <Link className="brand" to="/"><img src={logo} alt="" width="40" height="40" />GAME ARENA</Link>
        <nav aria-label="Main"><ul>{navigation.map(([label, href]) => (
          <li key={href}><Link to={href} aria-current={current === href ? "page" : undefined}>{label}</Link></li>
        ))}</ul></nav>
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
