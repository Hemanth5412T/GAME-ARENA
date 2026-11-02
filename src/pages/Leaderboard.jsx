import { Link } from "../components/TransitionLink.jsx";
import { useState } from "react";

export default function Leaderboard() {
  const [game, setGame] = useState("all");
  return (
    <main>
    <div className="w">
      <div className="ph in">
        <h1>
          {"Leaderboard"}
        </h1>
        <p>
          {"Global rankings across every game. Filter by game to see who leads each title."}
        </p>
      </div>
      <section style={{paddingTop: "24px"}}>
        <div className="fb rv">
          <p>
            {"Game"}
          </p>
          <div className="chips" role="radiogroup">
            <input type="radio" name="g" id="g-a" checked={game === "all"} onChange={() => setGame("all")} />
            <label htmlFor="g-a">
              {"All games"}
            </label>
            <input type="radio" name="g" id="g-v" checked={game === "valorant"} onChange={() => setGame("valorant")} />
            <label htmlFor="g-v">
              {"Valorant"}
            </label>
            <input type="radio" name="g" id="g-b" checked={game === "bgmi"} onChange={() => setGame("bgmi")} />
            <label htmlFor="g-b">
              {"BGMI"}
            </label>
            <input type="radio" name="g" id="g-c" checked={game === "cs2"} onChange={() => setGame("cs2")} />
            <label htmlFor="g-c">
              {"Counter-Strike 2"}
            </label>
          </div>
          <p>
            {"Time period"}
          </p>
          <div className="chips" role="radiogroup">
            <input type="radio" name="p" id="p-w" defaultChecked={true} />
            <label htmlFor="p-w">
              {"This week"}
            </label>
            <input type="radio" name="p" id="p-m" />
            <label htmlFor="p-m">
              {"This month"}
            </label>
            <input type="radio" name="p" id="p-all" />
            <label htmlFor="p-all">
              {"All time"}
            </label>
          </div>
        </div>
        <div className="tw rv">
          <table>
            <thead>
              <tr>
                <th>
                  {"Rank"}
                </th>
                <th>
                  {"Player"}
                </th>
                <th>
                  {"Team"}
                </th>
                <th>
                  {"Matches"}
                </th>
                <th>
                  {"Wins"}
                </th>
                <th>
                  {"Win rate"}
                </th>
                <th>
                  {"Points"}
                </th>
                <th>
                  {"Profile"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="gv top" hidden={game !== "all" && game !== "valorant"}>
                <td>
                  <span className="rk">
                    {"1"}
                  </span>
                </td>
                <td>
                  <b>
                    {"ZephyrX"}
                  </b>
                  <br />
                  <small>
                    {"Valorant"}
                  </small>
                </td>
                <td>
                  {"Team Vanguard"}
                </td>
                <td>
                  {"312"}
                </td>
                <td>
                  {"221"}
                </td>
                <td>
                  {"70.8%"}
                  <div className="bar">
                    <i style={{"--p": "70.8%"}}>
                    </i>
                  </div>
                </td>
                <td>
                  <b>
                    {"11,240"}
                  </b>
                </td>
                <td>
                  <Link className="btn o sm" to="/profile">
                    {"View"}
                  </Link>
                </td>
              </tr>
              <tr className="gc top" hidden={game !== "all" && game !== "cs2"}>
                <td>
                  <span className="rk">
                    {"2"}
                  </span>
                </td>
                <td>
                  <b>
                    {"NightOwl"}
                  </b>
                  <br />
                  <small>
                    {"Counter-Strike 2"}
                  </small>
                </td>
                <td>
                  {"Orion Gaming"}
                </td>
                <td>
                  {"287"}
                </td>
                <td>
                  {"198"}
                </td>
                <td>
                  {"69.0%"}
                  <div className="bar">
                    <i style={{"--p": "69%"}}>
                    </i>
                  </div>
                </td>
                <td>
                  <b>
                    {"10,115"}
                  </b>
                </td>
                <td>
                  <Link className="btn o sm" to="/profile">
                    {"View"}
                  </Link>
                </td>
              </tr>
              <tr className="gb top" hidden={game !== "all" && game !== "bgmi"}>
                <td>
                  <span className="rk">
                    {"3"}
                  </span>
                </td>
                <td>
                  <b>
                    {"Valkyrie07"}
                  </b>
                  <br />
                  <small>
                    {"BGMI"}
                  </small>
                </td>
                <td>
                  {"Crimson Fang"}
                </td>
                <td>
                  {"266"}
                </td>
                <td>
                  {"181"}
                </td>
                <td>
                  {"68.0%"}
                  <div className="bar">
                    <i style={{"--p": "68%"}}>
                    </i>
                  </div>
                </td>
                <td>
                  <b>
                    {"9,380"}
                  </b>
                </td>
                <td>
                  <Link className="btn o sm" to="/profile">
                    {"View"}
                  </Link>
                </td>
              </tr>
              <tr className="gv" hidden={game !== "all" && game !== "valorant"}>
                <td>
                  <span className="rk">
                    {"4"}
                  </span>
                </td>
                <td>
                  <b>
                    {"ShadowKira"}
                  </b>
                  <span className="tag t-l">
                    {"You"}
                  </span>
                  <br />
                  <small>
                    {"Valorant"}
                  </small>
                </td>
                <td>
                  {"Nova Esports"}
                </td>
                <td>
                  {"248"}
                </td>
                <td>
                  {"163"}
                </td>
                <td>
                  {"65.7%"}
                  <div className="bar">
                    <i style={{"--p": "65.7%"}}>
                    </i>
                  </div>
                </td>
                <td>
                  <b>
                    {"8,420"}
                  </b>
                </td>
                <td>
                  <Link className="btn o sm" to="/profile">
                    {"View"}
                  </Link>
                </td>
              </tr>
              <tr className="gb" hidden={game !== "all" && game !== "bgmi"}>
                <td>
                  <span className="rk">
                    {"5"}
                  </span>
                </td>
                <td>
                  <b>
                    {"ZeroAarav"}
                  </b>
                  <br />
                  <small>
                    {"BGMI"}
                  </small>
                </td>
                <td>
                  {"Titan Squad"}
                </td>
                <td>
                  {"231"}
                </td>
                <td>
                  {"148"}
                </td>
                <td>
                  {"64.1%"}
                  <div className="bar">
                    <i style={{"--p": "64.1%"}}>
                    </i>
                  </div>
                </td>
                <td>
                  <b>
                    {"7,960"}
                  </b>
                </td>
                <td>
                  <Link className="btn o sm" to="/profile">
                    {"View"}
                  </Link>
                </td>
              </tr>
              <tr className="gc" hidden={game !== "all" && game !== "cs2"}>
                <td>
                  <span className="rk">
                    {"6"}
                  </span>
                </td>
                <td>
                  <b>
                    {"MysticRia"}
                  </b>
                  <br />
                  <small>
                    {"Counter-Strike 2"}
                  </small>
                </td>
                <td>
                  {"Orion Gaming"}
                </td>
                <td>
                  {"219"}
                </td>
                <td>
                  {"137"}
                </td>
                <td>
                  {"62.6%"}
                  <div className="bar">
                    <i style={{"--p": "62.6%"}}>
                    </i>
                  </div>
                </td>
                <td>
                  <b>
                    {"7,310"}
                  </b>
                </td>
                <td>
                  <Link className="btn o sm" to="/profile">
                    {"View"}
                  </Link>
                </td>
              </tr>
              <tr className="gv" hidden={game !== "all" && game !== "valorant"}>
                <td>
                  <span className="rk">
                    {"7"}
                  </span>
                </td>
                <td>
                  <b>
                    {"Hawk3ye"}
                  </b>
                  <br />
                  <small>
                    {"Valorant"}
                  </small>
                </td>
                <td>
                  {"Hawkeye Gaming"}
                </td>
                <td>
                  {"205"}
                </td>
                <td>
                  {"126"}
                </td>
                <td>
                  {"61.5%"}
                  <div className="bar">
                    <i style={{"--p": "61.5%"}}>
                    </i>
                  </div>
                </td>
                <td>
                  <b>
                    {"6,870"}
                  </b>
                </td>
                <td>
                  <Link className="btn o sm" to="/profile">
                    {"View"}
                  </Link>
                </td>
              </tr>
              <tr className="gb" hidden={game !== "all" && game !== "bgmi"}>
                <td>
                  <span className="rk">
                    {"8"}
                  </span>
                </td>
                <td>
                  <b>
                    {"PixelPriya"}
                  </b>
                  <br />
                  <small>
                    {"BGMI"}
                  </small>
                </td>
                <td>
                  {"Crimson Fang"}
                </td>
                <td>
                  {"198"}
                </td>
                <td>
                  {"119"}
                </td>
                <td>
                  {"60.1%"}
                  <div className="bar">
                    <i style={{"--p": "60.1%"}}>
                    </i>
                  </div>
                </td>
                <td>
                  <b>
                    {"6,415"}
                  </b>
                </td>
                <td>
                  <Link className="btn o sm" to="/profile">
                    {"View"}
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
    </main>
  );
}
