import { Link } from "../components/TransitionLink.jsx";
import { tournaments } from "../data/tournaments.js";

const featuredTournaments = [
  tournaments.find((tournament) => tournament.id === "arena-masters-valorant-open"),
  tournaments.find((tournament) => tournament.id === "bgmi-pro-series-season-4"),
  tournaments.find((tournament) => tournament.id === "cs2-iron-cup"),
];
const currency = (value) => value === 0 ? "Free" : `₹${Number(value).toLocaleString("en-IN")}`;
const closeDate = (tournament) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(tournament.registrationDeadline));

export default function Home() {
  return (
    <main>
    <section className="hero">
      <div className="shape s1">
      </div>
      <div className="shape s2">
      </div>
      <div className="w">
        <div>
          <h1>
            <span className="in" style={{"--i": "0"}}>
              {"Enter the arena."}
            </span>
            <span className="ol in" style={{"--i": "1"}}>
              {"Own the bracket."}
            </span>
          </h1>
          <p className="in" style={{"--i": "2"}}>
            {"GAME ARENA is where Valorant, BGMI and Counter-Strike 2 players find tournaments, watch live matches and track every win on the leaderboard."}
          </p>
          <div className="btns in" style={{"--i": "3"}}>
            <Link className="btn p" to="/search-events">
              {"Explore Tournaments"}
            </Link>
            <Link className="btn o" to="/live">
              {"Watch Live"}
            </Link>
          </div>
        </div>
        <div className="hw in" style={{"--i": "2"}}>
          <div className="hex">
            <div>
              <small>
                {"Live now · CS2"}
              </small>
              <b>
                {"11:9"}
              </b>
              <small>
                {"Vanguard vs Crimson Fang"}
              </small>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div className="w">
        <div className="sh rv">
          <h2>
            {"Featured tournaments"}
          </h2>
          <Link className="btn o sm" to="/search-events">
            {"All tournaments"}
          </Link>
        </div>
        <div className="g">
          <article className="card tc gv su rv">
            <div className="bn shared-tournament-art" data-t="VALORANT">
              <span className="tag t-o">
                {"Registration open"}
              </span>
            </div>
            <div className="pad">
              <p>
                {featuredTournaments[0].game}
              </p>
              <h3>
                {featuredTournaments[0].name}
              </h3>
              <div className="meta">
                <div>
                  <b>
                    {currency(featuredTournaments[0].prizePool)}
                  </b>
                  <small>
                    {"Prize pool"}
                  </small>
                </div>
                <div>
                  <b>
                    {currency(featuredTournaments[0].entryFee)}
                  </b>
                  <small>
                    {"Entry fee"}
                  </small>
                </div>
                <div>
                  <b>
                    {`${featuredTournaments[0].participants.registered} / ${featuredTournaments[0].participants.capacity} teams`}
                  </b>
                  <small>
                    {"Participants"}
                  </small>
                </div>
                <div>
                  <b style={{fontSize: "1.05rem"}}>
                    {`Closes ${closeDate(featuredTournaments[0])}`}
                  </b>
                  <small>
                    {"Date"}
                  </small>
                </div>
              </div>
              <Link className="btn p sm" to={`/tournament/${featuredTournaments[0].id}`} state={{ transitionType: "shared" }}>
                {"View details"}
              </Link>
            </div>
          </article>
          <article className="card tc gb so rv">
            <div className="bn" data-t="BGMI">
              <span className="tag t-l">
                {"Live now"}
              </span>
            </div>
            <div className="pad">
              <p>
                {featuredTournaments[1].game}
              </p>
              <h3>
                {featuredTournaments[1].name}
              </h3>
              <div className="meta">
                <div>
                  <b>
                    {currency(featuredTournaments[1].prizePool)}
                  </b>
                  <small>
                    {"Prize pool"}
                  </small>
                </div>
                <div>
                  <b>
                    {currency(featuredTournaments[1].entryFee)}
                  </b>
                  <small>
                    {"Entry fee"}
                  </small>
                </div>
                <div>
                  <b>
                    {`${featuredTournaments[1].participants.registered} ${featuredTournaments[1].participants.label}`}
                  </b>
                  <small>
                    {"Participants"}
                  </small>
                </div>
                <div>
                  <b style={{fontSize: "1.05rem"}}>
                    {"Round 3 in progress"}
                  </b>
                  <small>
                    {"Date"}
                  </small>
                </div>
              </div>
              <Link className="btn p sm" to={`/tournament/${featuredTournaments[1].id}`}>
                {"View details"}
              </Link>
            </div>
          </article>
          <article className="card tc gc su rv">
            <div className="bn" data-t="CS2">
              <span className="tag t-o">
                {"Registration open"}
              </span>
            </div>
            <div className="pad">
              <p>
                {featuredTournaments[2].game}
              </p>
              <h3>
                {featuredTournaments[2].name}
              </h3>
              <div className="meta">
                <div>
                  <b>
                    {currency(featuredTournaments[2].prizePool)}
                  </b>
                  <small>
                    {"Prize pool"}
                  </small>
                </div>
                <div>
                  <b>
                    {currency(featuredTournaments[2].entryFee)}
                  </b>
                  <small>
                    {"Entry fee"}
                  </small>
                </div>
                <div>
                  <b>
                    {`${featuredTournaments[2].participants.registered} / ${featuredTournaments[2].participants.capacity} teams`}
                  </b>
                  <small>
                    {"Participants"}
                  </small>
                </div>
                <div>
                  <b style={{fontSize: "1.05rem"}}>
                    {`Closes ${closeDate(featuredTournaments[2])}`}
                  </b>
                  <small>
                    {"Date"}
                  </small>
                </div>
              </div>
              <Link className="btn p sm" to={`/tournament/${featuredTournaments[2].id}`}>
                {"View details"}
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
    <section>
      <div className="w">
        <div className="sh rv">
          <h2>
            {"Popular games"}
          </h2>
        </div>
        <div className="g">
          <Link className="card gt game-valorant rv" to="/search-events">
            <p>
              {"2,140 active players"}
            </p>
            <h3>
              {"Valorant"}
            </h3>
          </Link>
          <Link className="card gt game-bgmi rv" to="/search-events">
            <p>
              {"3,880 active players"}
            </p>
            <h3>
              {"BGMI"}
            </h3>
          </Link>
          <Link className="card gt game-cs2 rv" to="/search-events">
            <p>
              {"1,760 active players"}
            </p>
            <h3>
              {"Counter-Strike 2"}
            </h3>
          </Link>
        </div>
      </div>
    </section>
    <section>
      <div className="w">
        <div className="sh rv">
          <h2>
            {"Upcoming matches"}
          </h2>
          <Link className="btn o sm" to="/live">
            {"Live schedule"}
          </Link>
        </div>
        <div className="card mr rv">
          <span className="tag t-o">
            {"Valorant"}
          </span>
          <h3>
            {"Vanguard vs Orion Gaming"}
          </h3>
          <span>
            {"Today, 7:30 PM"}
          </span>
          <Link className="btn s sm" to="/live">
            {"Watch"}
          </Link>
        </div>
        <div className="card mr rv">
          <span className="tag t-o">
            {"BGMI"}
          </span>
          <h3>
            {"Nova Esports vs Titan Squad"}
          </h3>
          <span>
            {"Today, 9:00 PM"}
          </span>
          <Link className="btn s sm" to="/live">
            {"Watch"}
          </Link>
        </div>
        <div className="card mr rv">
          <span className="tag t-o">
            {"Counter-Strike 2"}
          </span>
          <h3>
            {"Crimson Fang vs Hawkeye Gaming"}
          </h3>
          <span>
            {"Tomorrow, 6:00 PM"}
          </span>
          <Link className="btn s sm" to="/live">
            {"Watch"}
          </Link>
        </div>
      </div>
    </section>
    <section className="dk">
      <div className="w g">
        <div className="st rv">
          <b>
            {"120K+"}
          </b>
          {"Registered players"}
        </div>
        <div className="st rv">
          <b>
            {"850+"}
          </b>
          {"Tournaments hosted"}
        </div>
        <div className="st rv">
          <b>
            {"₹12 Cr"}
          </b>
          {"Prize money paid"}
        </div>
        <div className="st rv">
          <b>
            {"3"}
          </b>
          {"Supported games"}
        </div>
      </div>
    </section>
    </main>
  );
}
