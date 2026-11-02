import { Link } from "../components/TransitionLink.jsx";
import { useEffect, useState } from "react";
import { getCurrentUser, getRegistrationsForUser, registerTournament, subscribeToData } from "../data/gameArenaData.js";

export default function TournamentDetails() {
  const [registered, setRegistered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  useEffect(() => {
    const refresh = () => {
      const user = getCurrentUser();
      setRegistered(Boolean(user && getRegistrationsForUser(user.id).some((item) => item.tournamentId === "arena-masters-valorant-open")));
    };
    refresh();
    return subscribeToData(refresh);
  }, []);

  function handleRegister() {
    if (!getCurrentUser()) {
      setFeedback({ message: "Log in to register for this tournament.", to: "/login", link: "Log in" });
      return;
    }
    const result = registerTournament({
      id: "arena-masters-valorant-open",
      name: "Arena Masters Valorant Open",
      game: "Valorant",
      start: "2026-11-22T16:00:00+05:30",
      end: "2026-11-30T22:00:00+05:30",
      entryFee: 500,
      status: "Upcoming",
      detailsUrl: "/tournament/arena-masters-valorant-open",
    });
    if (result.ok) {
      setRegistered(true);
      setFeedback({ message: "Registration successful.", to: "/activities", link: "View activities" });
    } else if (result.reason === "duplicate") {
      setRegistered(true);
      setFeedback({ message: "This account is already registered for this tournament." });
    } else {
      setFeedback({ message: "Registration could not be saved in this browser. Enable local storage and try again.", error: true });
    }
  }

  return (
    <main>
    <div className="w">
      <section style={{paddingBottom: "24px"}}>
        <div className="bn big gv shared-tournament-art" data-t="VALORANT">
          <span className="tag t-o">
            {"Registration open"}
          </span>
        </div>
        <div style={{marginTop: "28px"}} className="in">
          <p>
            <b>
              {"Valorant"}
            </b>
          </p>
          <h1 style={{fontSize: "clamp(2.6rem,6vw,5rem)"}}>
            {"Arena Masters Valorant Open"}
          </h1>
        </div>
      </section>
      <section style={{padding: "24px 0"}}>
        <div className="g">
          <div className="st lt rv">
            <b style={{fontSize: "2.2rem"}}>
              {"₹5,00,000"}
            </b>
            {"Prize pool"}
          </div>
          <div className="st lt rv">
            <b style={{fontSize: "2.2rem"}}>
              {"₹500"}
            </b>
            {"Entry fee"}
          </div>
          <div className="st lt rv">
            <b style={{fontSize: "2.2rem"}}>
              {"18 Nov 2026"}
            </b>
            {"Registration deadline"}
          </div>
          <div className="st lt rv">
            <b style={{fontSize: "2.2rem"}}>
              {"22 Nov 2026"}
            </b>
            {"Start date"}
          </div>
          <div className="st lt rv">
            <b style={{fontSize: "2.2rem"}}>
              {"96 / 128"}
            </b>
            {"Teams registered"}
          </div>
        </div>
      </section>
      <section style={{padding: "24px 0"}}>
        <div className="two">
          <div>
            <div className="card pad rv">
              <h2>
                {"About"}
              </h2>
              <p style={{marginTop: "12px"}}>
                {"Eight days, 128 teams and one title. Arena Masters is the season opener for Valorant on GAME ARENA, with a double-elimination playoff and a live-streamed grand final."}
              </p>
            </div>
            <div className="card pad rv">
              <h2>
                {"Format"}
              </h2>
              <p style={{marginTop: "12px"}}>
                {"Qualifiers feed 32 teams into groups of four. The top two from each group enter a best-of-three playoff bracket. The grand final is best-of-five."}
              </p>
            </div>
            <div className="card pad rv">
              <h2>
                {"Rules and requirements"}
              </h2>
              <ul className="rl" style={{marginTop: "12px"}}>
                <li>
                  {"Teams of five players plus one substitute."}
                </li>
                <li>
                  {"All players need a verified GAME ARENA account."}
                </li>
                <li>
                  {"Players must be 16 or older."}
                </li>
                <li>
                  {"Teams check in 30 minutes before each match."}
                </li>
              </ul>
            </div>
            <div className="rv">
              <h2 style={{marginBottom: "16px"}}>
                {"Match schedule"}
              </h2>
              <div className="tw">
                <table>
                  <thead>
                    <tr>
                      <th>
                        {"Date"}
                      </th>
                      <th>
                        {"Round"}
                      </th>
                      <th>
                        {"Time"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <b>
                          {"22 Nov"}
                        </b>
                      </td>
                      <td>
                        {"Qualifiers"}
                      </td>
                      <td>
                        {"4:00 PM IST"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>
                          {"24 Nov"}
                        </b>
                      </td>
                      <td>
                        {"Group stage, day 1"}
                      </td>
                      <td>
                        {"4:00 PM IST"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>
                          {"25 Nov"}
                        </b>
                      </td>
                      <td>
                        {"Group stage, day 2"}
                      </td>
                      <td>
                        {"4:00 PM IST"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>
                          {"28 Nov"}
                        </b>
                      </td>
                      <td>
                        {"Quarterfinals"}
                      </td>
                      <td>
                        {"5:00 PM IST"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>
                          {"29 Nov"}
                        </b>
                      </td>
                      <td>
                        {"Semifinals"}
                      </td>
                      <td>
                        {"5:00 PM IST"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>
                          {"30 Nov"}
                        </b>
                      </td>
                      <td>
                        {"Grand final"}
                      </td>
                      <td>
                        {"7:00 PM IST"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rv">
              <h2 style={{marginBottom: "16px"}}>
                {"Participating teams"}
              </h2>
              <div className="tms">
                <div className="tm">
                  <i>
                    {"VG"}
                  </i>
                  {"Vanguard"}
                </div>
                <div className="tm">
                  <i>
                    {"OG"}
                  </i>
                  {"Orion Gaming"}
                </div>
                <div className="tm">
                  <i>
                    {"CF"}
                  </i>
                  {"Crimson Fang"}
                </div>
                <div className="tm">
                  <i>
                    {"NE"}
                  </i>
                  {"Nova Esports"}
                </div>
                <div className="tm">
                  <i>
                    {"TS"}
                  </i>
                  {"Titan Squad"}
                </div>
                <div className="tm">
                  <i>
                    {"HG"}
                  </i>
                  {"Hawkeye Gaming"}
                </div>
                <div className="tm">
                  <i>
                    {"PF"}
                  </i>
                  {"Phantom Five"}
                </div>
                <div className="tm">
                  <i>
                    {"AS"}
                  </i>
                  {"Apex Syndicate"}
                </div>
              </div>
            </div>
          </div>
          <aside className="card reg sticky rv">
            <small>
              {"Spots left"}
            </small>
            <b>
              {"32"}
            </b>
            <p style={{margin: "12px 0 20px"}}>
              {"Registration closes on 18 Nov 2026. Entry fee ₹500 per team."}
            </p>
            <button className="btn s" type="button" id="register-tournament" onClick={handleRegister} disabled={registered}>
              {registered ? "Already registered" : "Register your team"}
            </button>
            <p id="registration-feedback" className={`registration-feedback${feedback?.error ? " registration-feedback-error" : ""}`} role="status" aria-live="polite">
              {feedback && <>{feedback.message}{feedback.link && <> <Link to={feedback.to}>{feedback.link}</Link></>}</>}
            </p>
            <p style={{marginTop: "14px", fontSize: ".9rem"}}>
              {"Already have an account? "}
              <Link to="/login" style={{textDecoration: "underline"}}>
                {"Log in"}
              </Link>
            </p>
          </aside>
        </div>
      </section>
    </div>
    </main>
  );
}
