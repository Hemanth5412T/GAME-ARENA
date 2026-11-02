import { Link } from "../components/TransitionLink.jsx";

export default function Live() {
  return (
    <main>
    <div className="w">
      <div className="ph in">
        <h1>
          {"Live now"}
        </h1>
        <p>
          {"Watch matches as they happen and see what is on next."}
        </p>
      </div>
      <section style={{paddingTop: "28px"}}>
        <div className="two">
          <div>
            <div className="stream in" style={{"--i": "1"}}>
              <span className="tag t-l">
                {"Live · 8,412 watching"}
              </span>
              <Link className="play" to="/tournament/arena-masters-valorant-open" aria-label="Play stream">
              </Link>
              <div className="sb">
                <span>
                  {"Vanguard 11"}
                </span>
                <span>
                  {"Round 21 · Inferno"}
                </span>
                <span>
                  {"9 Crimson Fang"}
                </span>
              </div>
            </div>
            <div className="card pad rv">
              <h2>
                {"Inferno Invitational: Quarterfinal"}
              </h2>
              <div className="meta" style={{gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))"}}>
                <div>
                  <b>
                    {"Counter-Strike 2"}
                  </b>
                  <small>
                    {"Game"}
                  </small>
                </div>
                <div>
                  <b>
                    {"Vanguard 11 : 9"}
                  </b>
                  <small>
                    {"Current score"}
                  </small>
                </div>
                <div>
                  <b>
                    {"Second half"}
                  </b>
                  <small>
                    {"Match status"}
                  </small>
                </div>
              </div>
              <div className="tms">
                <div className="tm">
                  <i>
                    {"VG"}
                  </i>
                  {"Vanguard"}
                </div>
                <div className="tm">
                  <i>
                    {"CF"}
                  </i>
                  {"Crimson Fang"}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="card pad rv">
              <h3 style={{marginBottom: "14px"}}>
                {"Up next"}
              </h3>
              <p style={{marginBottom: "12px"}}>
                <span className="tag t-o">
                  {"BGMI"}
                </span>
                <br />
                <b>
                  {"Pro Series, Round 3"}
                </b>
                <br />
                <small>
                  {"Tonight, 9:00 PM"}
                </small>
              </p>
              <p style={{marginBottom: "12px"}}>
                <span className="tag t-o">
                  {"Valorant"}
                </span>
                <br />
                <b>
                  {"Arena Masters qualifier"}
                </b>
                <br />
                <small>
                  {"22 Nov, 4:00 PM"}
                </small>
              </p>
              <p style={{marginBottom: "12px"}}>
                <span className="tag t-o">
                  {"CS2"}
                </span>
                <br />
                <b>
                  {"Iron Cup opener"}
                </b>
                <br />
                <small>
                  {"5 Dec, 6:00 PM"}
                </small>
              </p>
            </div>
            <article className="card tc gc so rv">
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
      </section>
    </div>
    </main>
  );
}
