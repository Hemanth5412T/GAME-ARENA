import { Link } from "../components/TransitionLink.jsx";
import { useState } from "react";

export default function SearchEvents() {
  const [filters, setFilters] = useState({ query: "", game: "all", status: "all" });
  const visible = (game, status, title) =>
    (filters.game === "all" || filters.game === game) &&
    (filters.status === "all" || filters.status === status) &&
    `${title} ${game}`.toLowerCase().includes(filters.query.trim().toLowerCase());
  return (
    <main>
    <div className="w">
      <div className="ph in">
        <h1>
          {"Tournaments"}
        </h1>
        <p>
          {"Browse open brackets, follow live events and revisit finished ones."}
        </p>
      </div>
      <section style={{paddingTop: "24px"}}>
        <div className="fb rv">
          <input className="search" type="search" placeholder="Search tournaments" aria-label="Search tournaments" value={filters.query} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} />
          <p>
            {"Game"}
          </p>
          <div className="chips" role="radiogroup">
            <input type="radio" name="g" id="g-a" value="all" checked={filters.game === "all"} onChange={() => setFilters((current) => ({ ...current, game: "all" }))} />
            <label htmlFor="g-a">
              {"All games"}
            </label>
            <input type="radio" name="g" id="g-v" value="valorant" checked={filters.game === "valorant"} onChange={() => setFilters((current) => ({ ...current, game: "valorant" }))} />
            <label htmlFor="g-v">
              {"Valorant"}
            </label>
            <input type="radio" name="g" id="g-b" value="bgmi" checked={filters.game === "bgmi"} onChange={() => setFilters((current) => ({ ...current, game: "bgmi" }))} />
            <label htmlFor="g-b">
              {"BGMI"}
            </label>
            <input type="radio" name="g" id="g-c" value="cs2" checked={filters.game === "cs2"} onChange={() => setFilters((current) => ({ ...current, game: "cs2" }))} />
            <label htmlFor="g-c">
              {"Counter-Strike 2"}
            </label>
          </div>
          <p>
            {"Status"}
          </p>
          <div className="chips" role="radiogroup">
            <input type="radio" name="s" id="s-a" value="all" checked={filters.status === "all"} onChange={() => setFilters((current) => ({ ...current, status: "all" }))} />
            <label htmlFor="s-a">
              {"All"}
            </label>
            <input type="radio" name="s" id="s-u" value="upcoming" checked={filters.status === "upcoming"} onChange={() => setFilters((current) => ({ ...current, status: "upcoming" }))} />
            <label htmlFor="s-u">
              {"Upcoming"}
            </label>
            <input type="radio" name="s" id="s-o" value="ongoing" checked={filters.status === "ongoing"} onChange={() => setFilters((current) => ({ ...current, status: "ongoing" }))} />
            <label htmlFor="s-o">
              {"Ongoing"}
            </label>
            <input type="radio" name="s" id="s-d" value="completed" checked={filters.status === "completed"} onChange={() => setFilters((current) => ({ ...current, status: "completed" }))} />
            <label htmlFor="s-d">
              {"Completed"}
            </label>
          </div>
        </div>
        <div className="grp su">
          <h2 className="rv">
            {"Upcoming tournaments"}
          </h2>
          <div className="g">
            <article className="card tc gv su rv" hidden={!visible("valorant", "upcoming", "Arena Masters Valorant Open")}>
              <div className="bn shared-tournament-art" data-t="VALORANT">
                <span className="tag t-o">
                  {"Registration open"}
                </span>
              </div>
              <div className="pad">
                <p>
                  {"Valorant"}
                </p>
                <h3>
                  {"Arena Masters Valorant Open"}
                </h3>
                <div className="meta">
                  <div>
                    <b>
                      {"₹5,00,000"}
                    </b>
                    <small>
                      {"Prize pool"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"₹500"}
                    </b>
                    <small>
                      {"Entry fee"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"96 / 128 teams"}
                    </b>
                    <small>
                      {"Participants"}
                    </small>
                  </div>
                  <div>
                    <b style={{fontSize: "1.05rem"}}>
                      {"Closes 18 Nov 2026"}
                    </b>
                    <small>
                      {"Date"}
                    </small>
                  </div>
                </div>
                <Link className="btn p sm" to="/tournament/arena-masters-valorant-open" state={{ transitionType: "shared" }}>
                  {"View details"}
                </Link>
              </div>
            </article>
            <article className="card tc gc su rv" hidden={!visible("cs2", "upcoming", "CS2 Iron Cup")}>
              <div className="bn" data-t="CS2">
                <span className="tag t-o">
                  {"Registration open"}
                </span>
              </div>
              <div className="pad">
                <p>
                  {"Counter-Strike 2"}
                </p>
                <h3>
                  {"CS2 Iron Cup"}
                </h3>
                <div className="meta">
                  <div>
                    <b>
                      {"₹2,50,000"}
                    </b>
                    <small>
                      {"Prize pool"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"₹400"}
                    </b>
                    <small>
                      {"Entry fee"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"48 / 64 teams"}
                    </b>
                    <small>
                      {"Participants"}
                    </small>
                  </div>
                  <div>
                    <b style={{fontSize: "1.05rem"}}>
                      {"Closes 28 Nov 2026"}
                    </b>
                    <small>
                      {"Date"}
                    </small>
                  </div>
                </div>
                <Link className="btn p sm" to="/tournament/arena-masters-valorant-open">
                  {"View details"}
                </Link>
              </div>
            </article>
          </div>
        </div>
        <div className="grp so">
          <h2 className="rv">
            {"Ongoing tournaments"}
          </h2>
          <div className="g">
            <article className="card tc gb so rv" hidden={!visible("bgmi", "ongoing", "BGMI Pro Series Season 4")}>
              <div className="bn" data-t="BGMI">
                <span className="tag t-l">
                  {"Live now"}
                </span>
              </div>
              <div className="pad">
                <p>
                  {"BGMI"}
                </p>
                <h3>
                  {"BGMI Pro Series Season 4"}
                </h3>
                <div className="meta">
                  <div>
                    <b>
                      {"₹3,00,000"}
                    </b>
                    <small>
                      {"Prize pool"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"₹300"}
                    </b>
                    <small>
                      {"Entry fee"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"100 squads"}
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
                <Link className="btn p sm" to="/tournament/arena-masters-valorant-open">
                  {"View details"}
                </Link>
              </div>
            </article>
            <article className="card tc gc so rv" hidden={!visible("cs2", "ongoing", "Inferno Invitational")}>
              <div className="bn" data-t="CS2">
                <span className="tag t-l">
                  {"Live now"}
                </span>
              </div>
              <div className="pad">
                <p>
                  {"Counter-Strike 2"}
                </p>
                <h3>
                  {"Inferno Invitational"}
                </h3>
                <div className="meta">
                  <div>
                    <b>
                      {"₹2,00,000"}
                    </b>
                    <small>
                      {"Prize pool"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"₹250"}
                    </b>
                    <small>
                      {"Entry fee"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"32 teams"}
                    </b>
                    <small>
                      {"Participants"}
                    </small>
                  </div>
                  <div>
                    <b style={{fontSize: "1.05rem"}}>
                      {"Quarterfinals live"}
                    </b>
                    <small>
                      {"Date"}
                    </small>
                  </div>
                </div>
                <Link className="btn p sm" to="/tournament/arena-masters-valorant-open">
                  {"View details"}
                </Link>
              </div>
            </article>
          </div>
        </div>
        <div className="grp sd">
          <h2 className="rv">
            {"Completed tournaments"}
          </h2>
          <div className="g">
            <article className="card tc gv sd rv" hidden={!visible("valorant", "completed", "Winter Clash Valorant")}>
              <div className="bn" data-t="VALORANT">
                <span className="tag t-d">
                  {"Completed"}
                </span>
              </div>
              <div className="pad">
                <p>
                  {"Valorant"}
                </p>
                <h3>
                  {"Winter Clash Valorant"}
                </h3>
                <div className="meta">
                  <div>
                    <b>
                      {"₹1,00,000"}
                    </b>
                    <small>
                      {"Prize pool"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"Free"}
                    </b>
                    <small>
                      {"Entry fee"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"64 teams"}
                    </b>
                    <small>
                      {"Participants"}
                    </small>
                  </div>
                  <div>
                    <b style={{fontSize: "1.05rem"}}>
                      {"Ended 20 Oct 2026"}
                    </b>
                    <small>
                      {"Date"}
                    </small>
                  </div>
                </div>
                <Link className="btn p sm" to="/tournament/arena-masters-valorant-open">
                  {"View details"}
                </Link>
              </div>
            </article>
            <article className="card tc gb sd rv" hidden={!visible("bgmi", "completed", "Mobile Mayhem BGMI")}>
              <div className="bn" data-t="BGMI">
                <span className="tag t-d">
                  {"Completed"}
                </span>
              </div>
              <div className="pad">
                <p>
                  {"BGMI"}
                </p>
                <h3>
                  {"Mobile Mayhem BGMI"}
                </h3>
                <div className="meta">
                  <div>
                    <b>
                      {"₹1,50,000"}
                    </b>
                    <small>
                      {"Prize pool"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"₹200"}
                    </b>
                    <small>
                      {"Entry fee"}
                    </small>
                  </div>
                  <div>
                    <b>
                      {"100 squads"}
                    </b>
                    <small>
                      {"Participants"}
                    </small>
                  </div>
                  <div>
                    <b style={{fontSize: "1.05rem"}}>
                      {"Ended 2 Oct 2026"}
                    </b>
                    <small>
                      {"Date"}
                    </small>
                  </div>
                </div>
                <Link className="btn p sm" to="/tournament/arena-masters-valorant-open">
                  {"View details"}
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
    </main>
  );
}
