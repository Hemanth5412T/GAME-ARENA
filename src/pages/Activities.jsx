import { Link } from "../components/TransitionLink.jsx";
import { useEffect, useState } from "react";
import { getCurrentUser, getRegistrationsForUser, subscribeToData } from "../data/gameArenaData.js";

export default function Activities() {
  const [registrations, setRegistrations] = useState(() => {
    const user = getCurrentUser();
    return user ? getRegistrationsForUser(user.id) : [];
  });
  useEffect(() => subscribeToData(() => {
    const user = getCurrentUser();
    setRegistrations(user ? getRegistrationsForUser(user.id) : []);
  }), []);
  const monthMatches = ["2026-11-01T10:42:00+05:30", "2026-10-28T21:05:00+05:30"]
    .map((date, index) => ({ date: new Date(date), won: index === 0 }))
    .filter(({ date }) => date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth());
  const stats = {
    matches: monthMatches.length,
    wins: monthMatches.filter((match) => match.won).length,
    tournaments: registrations.length,
    badges: 1,
  };
  const timeline = [
    { at: "2026-11-01T10:42:00+05:30", type: "match", result: "win", title: "Won vs Orion Gaming", detail: "Valorant · 13–9 on Ascent" },
    { at: "2026-10-28T21:05:00+05:30", type: "match", result: "loss", title: "Lost vs Titan Squad", detail: "Valorant · 10–13 on Bind" },
    { at: "2026-10-25T18:30:00+05:30", type: "badge", result: "win", title: "Badge unlocked: Clutch Master", detail: "Achievement" },
    { at: "2026-10-20T23:20:00+05:30", type: "tournament-result", result: "win", title: "Champions of Winter Clash Valorant", detail: "Tournament result · ₹40,000 won" },
    { at: "2026-10-12T19:00:00+05:30", type: "tournament-result", result: "win", title: "Placed 4th in Mobile Mayhem BGMI", detail: "Tournament result · ₹15,000 won" },
    ...registrations.map((registration) => ({ at: registration.registeredAt, type: "tournament-registration", result: "win", title: "REGISTERED FOR TOURNAMENT", detail: `${registration.game || "Tournament"} · ${registration.name} · Registration successful` })),
  ].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
  };
  return (
    <main>
    <div className="w">
      <div className="ph in">
        <h1>
          {"Activities"}
        </h1>
        <p>
          {"Your recent matches, tournament runs and achievements in one timeline."}
        </p>
      </div>
      <section style={{paddingTop: "24px"}}>
        <div className="g" style={{marginBottom: "48px"}}>
          <div className="st lt rv activity-stat">
            <b data-activity-stat="matches">
            {stats.matches}
            </b>
            {"Matches this month"}
          </div>
          <div className="st lt rv activity-stat">
            <b data-activity-stat="wins">
            {stats.wins}
            </b>
            {"Wins this month"}
          </div>
          <div className="st lt rv activity-stat">
            <b data-activity-stat="tournaments">
            {stats.tournaments}
            </b>
            {"Tournaments joined"}
          </div>
          <div className="st lt rv activity-stat">
            <b data-activity-stat="badges">
            {stats.badges}
            </b>
            {"New badges"}
          </div>
        </div>
        <section className="registered-tournaments" aria-labelledby="registered-tournaments-title">
          <div className="sh">
            <h2 id="registered-tournaments-title">
              {"Registered tournaments"}
            </h2>
          </div>
          <div id="registered-tournament-list" className="g">
            {registrations.map((registration) => {
              const registeredDate = new Date(registration.registeredAt);
              const start = Date.parse(registration.tournamentStart);
              const end = Date.parse(registration.tournamentEnd);
              const status = registration.tournamentStatus === "Cancelled" ? "Cancelled"
                : Number.isFinite(start) && Date.now() < start ? "Upcoming"
                  : Number.isFinite(end) && Date.now() > end ? "Completed"
                    : Number.isFinite(start) && Date.now() >= start ? "Live" : (registration.tournamentStatus || "Upcoming");
              const route = registration.tournamentId
                ? `/tournament/${registration.tournamentId}`
                : "/tournament/arena-masters-valorant-open";
              return <article className="card pad registered-tournament-card" key={`${registration.userId}-${registration.tournamentId}`}>
                <div className="registered-tournament-header"><h3>{registration.name}</h3><span className={`registration-status-badge status-${status.toLowerCase()}`}>{status}</span></div>
                <div className="registered-tournament-meta">
                  <p><b>Game: </b>{registration.game || "—"}</p>
                  <p><b>Registered: </b>{Number.isNaN(registeredDate.getTime()) ? "Date unavailable" : registeredDate.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                  <p><b>Tournament: </b>{registration.tournamentStart ? new Date(registration.tournamentStart).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Date unavailable"}</p>
                  <p><b>Registration: </b>{registration.registrationStatus}</p>
                  {registration.entryFee !== null && registration.entryFee !== undefined && <p><b>Entry fee: </b>{registration.entryFee === 0 ? "Free" : `₹${Number(registration.entryFee).toLocaleString("en-IN")}`}</p>}
                </div>
                <Link className="btn o sm registered-tournament-link" to={route}>View Tournament</Link>
              </article>;
            })}
          </div>
          <div id="registered-tournament-empty" className="registered-empty card pad" hidden={registrations.length > 0}>
            <h3>
              {"No tournament registrations yet."}
            </h3>
            <p>
              {"Explore upcoming tournaments and register to compete."}
            </p>
            <Link className="btn p sm" to="/search-events">
              {"Explore tournaments"}
            </Link>
          </div>
        </section>
        <div className="tlw" id="activity-timeline">
          <div className="ti rv" data-activity-type="match" data-match-result="win" data-activity-at="2026-11-01T10:42:00+05:30">
            <div className="card pad">
              <time>
                {"1 Nov 2026 · 10:42 AM"}
              </time>
              <h3>
                {"Won vs Orion Gaming"}
              </h3>
              <p className="win">
                {"Valorant · 13–9 on Ascent"}
              </p>
            </div>
          </div>
          <div className="ti rv" data-activity-type="match" data-match-result="loss" data-activity-at="2026-10-28T21:05:00+05:30">
            <div className="card pad">
              <time>
                {"28 Oct 2026 · 9:05 PM"}
              </time>
              <h3>
                {"Lost vs Titan Squad"}
              </h3>
              <p className="loss">
                {"Valorant · 10–13 on Bind"}
              </p>
            </div>
          </div>
          <div className="ti rv" data-activity-type="badge" data-activity-at="2026-10-25T18:30:00+05:30">
            <div className="card pad">
              <time>
                {"25 Oct 2026 · 6:30 PM"}
              </time>
              <h3>
                {"Badge unlocked: Clutch Master"}
              </h3>
              <p className="win">
                {"Achievement"}
              </p>
            </div>
          </div>
          <div className="ti rv" data-activity-type="tournament-result" data-activity-at="2026-10-20T23:20:00+05:30">
            <div className="card pad">
              <time>
                {"20 Oct 2026 · 11:20 PM"}
              </time>
              <h3>
                {"Champions of Winter Clash Valorant"}
              </h3>
              <p className="win">
                {"Tournament result · ₹40,000 won"}
              </p>
            </div>
          </div>
          <div className="ti rv" data-activity-type="tournament-result" data-activity-at="2026-10-12T19:00:00+05:30">
            <div className="card pad">
              <time>
                {"12 Oct 2026 · 7:00 PM"}
              </time>
              <h3>
                {"Placed 4th in Mobile Mayhem BGMI"}
              </h3>
              <p className="win">
                {"Tournament result · ₹15,000 won"}
              </p>
            </div>
          </div>
          {timeline.filter((item) => item.type === "tournament-registration").map((item) => <div className="ti rv registered-timeline-entry" data-activity-type={item.type} data-activity-at={item.at} key={item.at}>
            <div className="card pad"><time dateTime={item.at}>{formatDate(item.at)}</time><h3>{item.title}</h3><p className="win">{item.detail}</p></div>
          </div>)}
        </div>
      </section>
    </div>
    </main>
  );
}
