import { useLocation, useParams } from "react-router-dom";
import { Link } from "../components/TransitionLink.jsx";
import { useEffect, useState } from "react";
import { getRegistrationsForUser, getTournamentParticipantCount, registerTournament, subscribeToData } from "../data/gameArenaData.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getAllTournaments, getTournamentById, getTournamentRegistrationState, getTournamentStatus, subscribeToTournamentData } from "../data/tournaments.js";

const gameClasses = { valorant: "gv", bgmi: "gb", cs2: "gc" };
const statusNames = { upcoming: "Upcoming", "registration-closed":"Registration closed", draft:"Draft", cancelled:"Cancelled", ongoing: "Ongoing", completed: "Completed" };
const currency = (value) => value === 0 ? "Free" : `₹${Number(value).toLocaleString("en-IN")}`;
const dateTime = (value) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function TournamentDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { user, status: authStatus } = useAuth();
  const [tournament, setTournament] = useState(() => getTournamentById(id));
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const authReady = authStatus !== "loading";
  const registrationRestricted = user?.status === "restricted";
  const status = tournament ? getTournamentStatus(tournament) : null;
  const participantCount = tournament ? getTournamentParticipantCount(tournament) : 0;
  const registrationState = tournament ? getTournamentRegistrationState(tournament, new Date(), participantCount) : null;
  const registrationOpen = Boolean(registrationState?.available);

  useEffect(() => { let active = true; getAllTournaments().then((items) => { if (active) setTournament(items.find((item) => item.id === id) || null); }); return () => { active = false; }; }, [id]);

  useEffect(() => {
    let active = true;
    const refreshTournament = () => getAllTournaments().then((items) => { if (active) setTournament(items.find((item) => item.id === id) || null); });
    const unsubscribe = subscribeToTournamentData(refreshTournament);
    return () => { active = false; unsubscribe(); };
  }, [id]);

  useEffect(() => {
    if (!tournament) return undefined;
    const refresh = () => {
      setRegistered(Boolean(user && getRegistrationsForUser(user.id).some((item) => item.tournamentId === tournament.id)));
    };
    refresh();
    return subscribeToData(refresh);
  }, [id, tournament, user]);

  async function handleRegister() {
    if (!tournament || !registrationOpen || registering) return;
    if (!authReady) {
      setFeedback({ message: "Checking your account session. Please try again in a moment." });
      return;
    }
    if (!user) {
      setFeedback({ message: "Log in to register for this tournament.", to: "/login", link: "Log in" });
      return;
    }
    if (user.status === "restricted") { setFeedback({ message: "Your account is restricted. Tournament registration is unavailable." }); return; }
    setRegistering(true);
    let result;
    try { result = await registerTournament(tournament, user.id); }
    catch { result = { ok: false, reason: "storage-unavailable" }; }
    finally { setRegistering(false); }
    if (result.ok) {
      setRegistered(true);
      setFeedback({ message: "Registration successful.", to: "/activities", link: "View activities" });
    } else if (result.reason === "duplicate") {
      setRegistered(true);
      setFeedback({ message: "This account is already registered for this tournament." });
    } else if (result.reason === "registration-closed") {
      setFeedback({ message: "Registration is closed for this tournament." });
    } else if (result.reason === "tournament-full") {
      setFeedback({ message: "This tournament has reached maximum capacity." });
    } else if (result.reason === "account-restricted") {
      setFeedback({ message: "Your account is restricted. Tournament registration is unavailable." });
    } else {
      setFeedback({ message: "Registration could not be saved in this browser. Enable local storage and try again.", error: true });
    }
  }

  if (!tournament) {
    return <main><div className="w">
      <section className="card pad" style={{ margin: "48px 0", textAlign: "center" }}>
        <h1>Tournament not found</h1>
        <p style={{ margin: "12px 0 20px" }}>There is no tournament with ID <strong>{id}</strong>.</p>
        <Link className="btn p" to="/search-events">Return to tournaments</Link>
      </section>
    </div></main>;
  }

  const bannerClass = `bn big ${gameClasses[tournament.gameKey]}${tournament.id === "arena-masters-valorant-open" ? " shared-tournament-art" : ""}`;
  const statusClass = status === "upcoming" ? "t-o" : status === "ongoing" ? "t-l" : "t-d";
  const statusLabel = status === "upcoming" || status === "registration-closed" ? registrationState.label : statusNames[status];
  const participants = tournament.participants.capacity
    ? `${participantCount} / ${tournament.participants.capacity}`
    : `${participantCount}`;
  const spotsLeft = tournament.participants.capacity
    ? Math.max(0, tournament.participants.capacity - tournament.participants.registered)
    : null;

  return (
    <main>
      <div className="w">
        <section style={{ paddingBottom: "24px" }}>
          <div className={bannerClass} data-t={tournament.banner}>
            <span className={`tag ${statusClass}`}>{statusLabel}</span>
          </div>
          <div style={{ marginTop: "28px" }} className="in">
            <p><b>{tournament.game}</b></p>
            <h1 style={{ fontSize: "clamp(2.6rem,6vw,5rem)" }}>{tournament.name}</h1>
          </div>
        </section>
        <section style={{ padding: "24px 0" }}>
          <div className="g">
            <div className="st lt rv"><b style={{ fontSize: "2.2rem" }}>{currency(tournament.prizePool)}</b>Prize pool</div>
            <div className="st lt rv"><b style={{ fontSize: "2.2rem" }}>{currency(tournament.entryFee)}</b>Entry fee</div>
            <div className="st lt rv"><b style={{ fontSize: "1.5rem" }}>{dateTime(tournament.registrationDeadline)}</b>Registration deadline</div>
            <div className="st lt rv"><b style={{ fontSize: "1.5rem" }}>{dateTime(tournament.start)}</b>Start date and time</div>
            <div className="st lt rv"><b style={{ fontSize: "2.2rem" }}>{participants}</b>{tournament.participants.label} registered</div>
          </div>
        </section>
        <section style={{ padding: "24px 0" }}>
          <div className="two tournament-detail-layout">
            <div className="tournament-detail-content">
              <div className="card pad rv"><h2>About</h2><p style={{ marginTop: "12px" }}>{tournament.description}</p></div>
              <div className="card pad rv"><h2>Format</h2><p style={{ marginTop: "12px" }}>{tournament.format}</p></div>
              <div className="card pad rv">
                <h2>Rules and requirements</h2>
                <ul className="rl" style={{ marginTop: "12px" }}>{tournament.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
              </div>
              {tournament.schedule.length > 0 && <div className="rv">
                <h2 style={{ marginBottom: "16px" }}>Match schedule</h2>
                <div className="tw"><table>
                  <thead><tr><th>Date</th><th>Round</th><th>Time</th></tr></thead>
                  <tbody>{tournament.schedule.map((match) => <tr key={`${match.date}-${match.round}`}><td><b>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(`${match.date}T12:00:00`))}</b></td><td>{match.round}</td><td>{match.time}</td></tr>)}</tbody>
                </table></div>
              </div>}
              {tournament.teams.length > 0 && <div className="rv">
                <h2 style={{ marginBottom: "16px" }}>{status === "completed" ? "Participating teams" : "Participating teams"}</h2>
                <div className="tms">{tournament.teams.map((team) => <div className="tm" key={team}><i>{team.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase()}</i>{team}</div>)}</div>
              </div>}
              {tournament.results?.length > 0 && <div className="rv">
                <h2 style={{ marginBottom: "16px" }}>Final results</h2>
                <div className="tw"><table><thead><tr><th>Place</th><th>Team</th><th>Prize</th></tr></thead>
                  <tbody>{tournament.results.map((result) => <tr key={result.place}><td><b>{result.place}</b></td><td>{result.team}</td><td>{currency(result.prize)}</td></tr>)}</tbody>
                </table></div>
              </div>}
            </div>
            <aside className="card reg sticky rv">
              <small>{status === "upcoming" ? "Spots left" : "Tournament status"}</small>
              <b>{status === "upcoming" && spotsLeft !== null ? spotsLeft : statusNames[status]}</b>
              <p style={{ margin: "12px 0 20px" }}>
                {status === "upcoming" || status === "registration-closed"
                  ? `${registrationState.message} ${registrationOpen ? `Deadline: ${dateTime(tournament.registrationDeadline)}.` : ""} Entry fee ${currency(tournament.entryFee)}.`
                  : status === "ongoing" ? `This tournament is in progress. ${participants} ${tournament.participants.label} registered.` : "This tournament is complete. Registration is closed."}
              </p>
              <button className="btn s" type="button" id="register-tournament" onClick={handleRegister} disabled={registered || registering || !registrationOpen || !authReady || registrationRestricted}>
                {registering ? "Registering…" : !authReady ? "Checking session…" : registrationRestricted ? "Registration unavailable" : registered ? "Already registered" : registrationOpen ? "Register your team" : registrationState.label}
              </button>
              {registrationRestricted && <p role="status" className="registration-feedback">Your account is restricted. Tournament registration is unavailable.</p>}
              <p id="registration-feedback" className={`registration-feedback${feedback?.error ? " registration-feedback-error" : ""}`} role="status" aria-live="polite">
                {feedback && <>{feedback.message}{feedback.link && <> <Link to={feedback.to}>{feedback.link}</Link></>}</>}
              </p>
              {status === "upcoming" && <p style={{ marginTop: "14px", fontSize: ".9rem" }}>Already have an account? <Link to="/login" style={{ textDecoration: "underline" }}>Log in</Link></p>}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
