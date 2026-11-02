import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { Link } from "./components/TransitionLink.jsx";
import { MainNav, SiteFooter } from "./components/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Live from "./pages/Live.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import SearchEvents from "./pages/SearchEvents.jsx";
import TournamentDetails from "./pages/TournamentDetails.jsx";
import Profile from "./pages/Profile.jsx";
import Activities from "./pages/Activities.jsx";
import AuthPage from "./pages/AuthPage.jsx";

const titles = {
  "/": "Home", "/live": "Live", "/leaderboard": "Leaderboard", "/search-events": "Tournaments",
  "/profile": "Profile", "/activities": "Activities", "/login": "Login", "/register": "Register",
};
const navbarIndices = {
  "/": 0,
  "/live": 1,
  "/leaderboard": 2,
  "/search-events": 3,
  "/profile": 4,
  "/activities": 5,
  "/login": -1,
  "/register": -1,
};

function navbarIndex(pathname) {
  if (pathname.startsWith("/tournament/")) return navbarIndices["/search-events"];
  return navbarIndices[pathname] ?? 0;
}

function getTransitionDirections(sourcePath, destinationPath) {
  const movingRight = navbarIndex(destinationPath) > navbarIndex(sourcePath);
  const backOutDirection = movingRight ? "left" : "right";
  const backInDirection = backOutDirection === "left" ? "right" : "left";

  return { backOutDirection, backInDirection };
}

function isAuthPath(pathname) {
  return pathname === "/login" || pathname === "/register";
}

function RouteContent({ location }) {
  const authMode = isAuthPath(location.pathname);
  return <>
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/live" element={<Live />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/search-events" element={<SearchEvents />} />
      <Route path="/tournament/:id" element={<TournamentDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/login" element={<AuthPage initialMode="login" />} />
      <Route path="/register" element={<AuthPage initialMode="register" />} />
      <Route path="*" element={<main className="w"><h1>Page not found</h1><p><Link to="/">Return home</Link></p></main>} />
    </Routes>
    {!authMode && <SiteFooter />}
  </>;
}

function MotionRoutes() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const reducedMotion = useReducedMotion();
  const supportsViewTransitions = typeof document !== "undefined" && typeof document.startViewTransition === "function";
  const [mobileViewport, setMobileViewport] = useState(() => window.matchMedia("(max-width: 700px)").matches);
  const scrollPositions = useRef(new Map());
  const screenRef = useRef(null);
  const previousKey = useRef(location.key);
  const previousPath = useRef(location.pathname);
  const transitionDirections = getTransitionDirections(previousPath.current, location.pathname);
  const { backOutDirection, backInDirection } = transitionDirections;
  const skipTransition = Boolean(location.state?.skipPageTransition);
  const authMode = isAuthPath(location.pathname);

  useLayoutEffect(() => {
    if (previousPath.current !== location.pathname) {
      const root = document.documentElement;

      root.dataset.backOutDirection = transitionDirections.backOutDirection;
      root.dataset.backInDirection = transitionDirections.backInDirection;
      previousPath.current = location.pathname;
    }
    if (previousKey.current !== location.key) {
      const savedScroll = scrollPositions.current.get(location.key);
      if (screenRef.current) {
        screenRef.current.scrollTop = navigationType === "POP" && Number.isFinite(savedScroll) ? savedScroll : 0;
      }
      previousKey.current = location.key;
    }
  }, [location.key, location.pathname, navigationType, transitionDirections]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const updateViewport = (event) => setMobileViewport(event.matches);
    media.addEventListener?.("change", updateViewport);
    return () => media.removeEventListener?.("change", updateViewport);
  }, []);

  useEffect(() => {
    const title = location.pathname.startsWith("/tournament/") ? "Tournament Details" : (titles[location.pathname] || "GAME ARENA");
    document.title = `${title} | GAME ARENA`;
  }, [location.pathname]);

  const routeElements = <RouteContent location={location} />;
  const fallbackVariants = {
    enter: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: mobileViewport ? 1 : 0.97, rotateY: mobileViewport ? 0 : (backInDirection === "right" ? -2 : 2), x: mobileViewport ? (backInDirection === "right" ? 14 : -14) : (backInDirection === "right" ? 24 : -24), z: -35 },
    center: { opacity: 1, scale: 1, rotateY: 0, z: 0 },
    exit: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: mobileViewport ? 1 : 0.96, rotateY: mobileViewport ? 0 : (backOutDirection === "left" ? 4 : -4), x: mobileViewport ? (backOutDirection === "left" ? -14 : 14) : (backOutDirection === "left" ? -24 : 24), z: -45 },
  };
  const fallbackTransition = reducedMotion
    ? { duration: 0.12, ease: "easeOut" }
    : { duration: mobileViewport ? 0.38 : 0.5, ease: [0.77, 0, 0.175, 1] };

  return (
    <div className={`app-shell${authMode ? " auth-app-shell" : ""}`}>
      {!authMode && <MainNav />}
      <div className={`route-transition-stage${authMode ? " auth-transition-stage" : ""}`}>
        {supportsViewTransitions ? (
          <div
            ref={screenRef}
            className={`route-screen page-transition-surface${authMode ? " auth-route-screen" : ""}`}
            onScroll={(event) => scrollPositions.current.set(location.key, event.currentTarget.scrollTop)}
          >
            {routeElements}
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              ref={screenRef}
              className={`route-screen fallback-transition-layer${authMode ? " auth-route-screen" : ""}`}
              variants={fallbackVariants}
              initial={skipTransition ? "center" : "enter"}
              animate="center"
              exit="exit"
              transition={fallbackTransition}
              onScroll={(event) => scrollPositions.current.set(location.key, event.currentTarget.scrollTop)}
            >
              {routeElements}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return <MotionRoutes />;
}
