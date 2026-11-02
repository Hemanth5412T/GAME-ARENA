import { Link } from "../components/TransitionLink.jsx";

export default function Profile() {
  return (
    <main>
    <div className="w">
      <section style={{paddingBottom: "24px"}}>
        <div className="card ph2 in">
          <div className="av">
            {"SK"}
          </div>
          <div>
            <h1 style={{fontSize: "3.4rem"}}>
              {"ShadowKira"}
            </h1>
            <p>
              <b>
                {"Player ID GA-20481"}
              </b>
              {" · Entry fragger · Nova Esports"}
            </p>
            <p style={{margin: "8px 0 14px", maxWidth: "56ch"}}>
              {"Aggressive Valorant entry player. Plays BGMI and CS2 for fun and chases a top 3 spot this season."}
            </p>
            <span className="tag">
              {"Joined 14 Mar 2025"}
            </span>
          </div>
          <Link className="btn p" to="/profile">
            {"Edit profile"}
          </Link>
        </div>
      </section>
      <section style={{padding: "24px 0"}}>
        <div className="g profile-stats">
          <div className="st lt rv profile-stat-card">
            <b>
              {"248"}
            </b>
            {"Total matches"}
          </div>
          <div className="st lt rv profile-stat-card">
            <b>
              {"163"}
            </b>
            {"Wins"}
          </div>
          <div className="st lt rv profile-stat-card">
            <b>
              {"85"}
            </b>
            {"Losses"}
          </div>
          <div className="st lt rv profile-stat-card">
            <b>
              {"65.7%"}
            </b>
            {"Win rate"}
          </div>
          <div className="st lt rv profile-stat-card">
            <b>
              {"18"}
            </b>
            {"Tournaments played"}
          </div>
        </div>
      </section>
      <section style={{padding: "24px 0"}}>
        <h2 className="rv" style={{marginBottom: "20px"}}>
          {"Game statistics"}
        </h2>
        <div className="tw rv">
          <table>
            <thead>
              <tr>
                <th>
                  {"Game"}
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
                  {"Rank"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>
                    {"Valorant"}
                  </b>
                </td>
                <td>
                  {"142"}
                </td>
                <td>
                  {"98"}
                </td>
                <td>
                  {"69.0%"}
                </td>
                <td>
                  {"#4"}
                </td>
              </tr>
              <tr>
                <td>
                  <b>
                    {"BGMI"}
                  </b>
                </td>
                <td>
                  {"71"}
                </td>
                <td>
                  {"42"}
                </td>
                <td>
                  {"59.2%"}
                </td>
                <td>
                  {"#11"}
                </td>
              </tr>
              <tr>
                <td>
                  <b>
                    {"Counter-Strike 2"}
                  </b>
                </td>
                <td>
                  {"35"}
                </td>
                <td>
                  {"23"}
                </td>
                <td>
                  {"65.7%"}
                </td>
                <td>
                  {"#9"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section style={{padding: "24px 0"}}>
        <div className="two">
          <div>
            <h2 className="rv">
              {"Recent tournaments"}
            </h2>
            <div className="card pad rv">
              <h3>
                {"Winter Clash Valorant"}
              </h3>
              <p>
                {"Champions · ₹40,000 won"}
              </p>
            </div>
            <div className="card pad rv">
              <h3>
                {"Mobile Mayhem BGMI"}
              </h3>
              <p>
                {"4th place · ₹15,000 won"}
              </p>
            </div>
            <div className="card pad rv">
              <h3>
                {"Inferno Invitational"}
              </h3>
              <p>
                {"Quarterfinals in progress"}
              </p>
            </div>
          </div>
          <div>
            <h2 className="rv">
              {"Match history"}
            </h2>
            <div className="card pad rv">
              <span className="res win">
                {"W 13–9"}
              </span>
              <b>
                {"vs Orion Gaming"}
              </b>
              <br />
              <small>
                {"Valorant · Ascent"}
              </small>
            </div>
            <div className="card pad rv">
              <span className="res loss">
                {"L 10–13"}
              </span>
              <b>
                {"vs Titan Squad"}
              </b>
              <br />
              <small>
                {"Valorant · Bind"}
              </small>
            </div>
            <div className="card pad rv">
              <span className="res win">
                {"W 13–11"}
              </span>
              <b>
                {"vs Crimson Fang"}
              </b>
              <br />
              <small>
                {"CS2 · Inferno"}
              </small>
            </div>
          </div>
        </div>
      </section>
      <section style={{padding: "24px 0"}}>
        <h2 className="rv" style={{marginBottom: "20px"}}>
          {"Achievements"}
        </h2>
        <div className="g">
          <div className="card badge rv">
            <i>
              {"C"}
            </i>
            <div>
              <b>
                {"Clutch Master"}
              </b>
              <br />
              <small>
                {"Won 25 rounds 1v3 or worse"}
              </small>
            </div>
          </div>
          <div className="card badge rv">
            <i>
              {"W"}
            </i>
            <div>
              <b>
                {"Winter Champion"}
              </b>
              <br />
              <small>
                {"Won Winter Clash Valorant"}
              </small>
            </div>
          </div>
          <div className="card badge rv">
            <i>
              {"50"}
            </i>
            <div>
              <b>
                {"50 Wins Streak Club"}
              </b>
              <br />
              <small>
                {"Reached 50 wins in Valorant"}
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
    </main>
  );
}
