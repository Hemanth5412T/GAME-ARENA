import { useEffect, useState } from "react";
import { Link } from "../components/TransitionLink.jsx";
import { getAllTournaments, getTournamentStatus, isTournamentRegistrationOpen } from "../data/tournaments.js";

const gameClasses = { valorant: "gv", bgmi: "gb", cs2: "gc" };
const statusClasses = { upcoming: "su", "registration-closed":"sd", draft:"sd", cancelled:"sd", ongoing: "so", completed: "sd" };
const statusLabels = { upcoming: "Upcoming tournaments", "registration-closed":"Registration closed", draft:"Draft tournaments", cancelled:"Cancelled tournaments", ongoing: "Ongoing tournaments", completed: "Completed tournaments" };
const statusBadges = { upcoming: "Registration open", "registration-closed":"Registration closed", draft:"Draft", cancelled:"Cancelled", ongoing: "Live now", completed: "Completed" };
const currency = (value) => value === 0 ? "Free" : `₹${Number(value).toLocaleString("en-IN")}`;
const dateLabel = (value) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

function TournamentCard({ tournament, filters }) {
  const status = getTournamentStatus(tournament);
  const registrationOpen = isTournamentRegistrationOpen(tournament);
  const matches = (filters.game === "all" || filters.game === tournament.gameKey)
    && (filters.status === "all" || filters.status === status || (filters.status === "upcoming" && ["registration-closed","draft"].includes(status)))
    && `${tournament.name} ${tournament.game}`.toLowerCase().includes(filters.query.trim().toLowerCase());
  const gameClass = gameClasses[tournament.gameKey];
  const sharedArtwork = tournament.id === "arena-masters-valorant-open";
  const bannerClass = `bn ${gameClass}${sharedArtwork ? " shared-tournament-art" : ""}`;
  const badgeClass = status === "upcoming" ? (registrationOpen ? "t-o" : "t-d") : status === "ongoing" ? "t-l" : "t-d";
  const badge = status === "upcoming" ? (registrationOpen ? statusBadges.upcoming : "Registration closed") : statusBadges[status];
  const participantCount = tournament.participants.capacity
    ? `${tournament.participants.registered} / ${tournament.participants.capacity} ${tournament.participants.label}`
    : `${tournament.participants.registered} ${tournament.participants.label}`;
  const dateText = status === "upcoming" || status === "registration-closed" || status === "draft"
    ? `Closes ${dateLabel(tournament.registrationDeadline)}`
    : status === "ongoing" ? "In progress" : `Ended ${dateLabel(tournament.end)}`;

  return <article className={`card tc ${gameClass} ${statusClasses[status]} rv`} data-tournament-id={tournament.id} hidden={!matches}>
    <div className={bannerClass} data-t={tournament.banner}>
      <span className={`tag ${badgeClass}`}>{badge}</span>
    </div>
    <div className="pad">
      <p>{tournament.game}</p>
      <h3>{tournament.name}</h3>
      <div className="meta">
        <div><b>{currency(tournament.prizePool)}</b><small>Prize pool</small></div>
        <div><b>{currency(tournament.entryFee)}</b><small>Entry fee</small></div>
        <div><b>{participantCount}</b><small>Participants</small></div>
        <div><b style={{ fontSize: "1.05rem" }}>{dateText}</b><small>Date</small></div>
      </div>
      <Link className="btn p sm" to={`/tournament/${tournament.id}`} state={sharedArtwork ? { transitionType: "shared" } : undefined}>View details</Link>
    </div>
  </article>;
}

export default function SearchEvents() {
  const [filters, setFilters] = useState({ query: "", game: "all", status: "all" });
  const [tournaments, setTournaments] = useState([]);
  useEffect(() => { let active = true; getAllTournaments().then((items) => { if (active) setTournaments(items); }); return () => { active = false; }; }, []);
  return (
    <main>
      <div className="w">
        <div className="ph in">
          <h1>Tournaments</h1>
          <p>Browse open brackets, follow live events and revisit finished ones.</p>
        </div>
        <section style={{ paddingTop: "24px" }}>
          <div className="fb rv">
            <input className="search" type="search" placeholder="Search tournaments" aria-label="Search tournaments" value={filters.query} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} />
            <p>Game</p>
            <div className="chips" role="radiogroup">
              <input type="radio" name="g" id="g-a" value="all" checked={filters.game === "all"} onChange={() => setFilters((current) => ({ ...current, game: "all" }))} /><label htmlFor="g-a">All games</label>
              <input type="radio" name="g" id="g-v" value="valorant" checked={filters.game === "valorant"} onChange={() => setFilters((current) => ({ ...current, game: "valorant" }))} /><label htmlFor="g-v">Valorant</label>
              <input type="radio" name="g" id="g-b" value="bgmi" checked={filters.game === "bgmi"} onChange={() => setFilters((current) => ({ ...current, game: "bgmi" }))} /><label htmlFor="g-b">BGMI</label>
              <input type="radio" name="g" id="g-c" value="cs2" checked={filters.game === "cs2"} onChange={() => setFilters((current) => ({ ...current, game: "cs2" }))} /><label htmlFor="g-c">Counter-Strike 2</label>
            </div>
            <p>Status</p>
            <div className="chips" role="radiogroup">
              <input type="radio" name="s" id="s-a" value="all" checked={filters.status === "all"} onChange={() => setFilters((current) => ({ ...current, status: "all" }))} /><label htmlFor="s-a">All</label>
              <input type="radio" name="s" id="s-u" value="upcoming" checked={filters.status === "upcoming"} onChange={() => setFilters((current) => ({ ...current, status: "upcoming" }))} /><label htmlFor="s-u">Upcoming</label>
              <input type="radio" name="s" id="s-o" value="ongoing" checked={filters.status === "ongoing"} onChange={() => setFilters((current) => ({ ...current, status: "ongoing" }))} /><label htmlFor="s-o">Ongoing</label>
              <input type="radio" name="s" id="s-d" value="completed" checked={filters.status === "completed"} onChange={() => setFilters((current) => ({ ...current, status: "completed" }))} /><label htmlFor="s-d">Completed</label>
            </div>
          </div>
          {Object.entries(statusLabels).map(([status, heading]) => <div className={`grp ${statusClasses[status]}`} key={status}>
            <h2 className="rv">{heading}</h2>
            <div className="g">
              {tournaments.filter((tournament) => getTournamentStatus(tournament) === status).map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} filters={filters} />)}
            </div>
          </div>)}
        </section>
      </div>
    </main>
  );
}
