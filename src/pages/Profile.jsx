import { Link } from "../components/TransitionLink.jsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { getTournamentById } from "../data/tournaments.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const editButtonRef = useRef(null);
  const closeEditor = useCallback(() => { setEditing(false); editButtonRef.current?.focus(); }, []);
  const username = user?.username || "ShadowKira";
  const initials = username.slice(0, 2).toUpperCase();
  const joined = user?.createdAt ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(user.createdAt)) : "Date unavailable";
  return (
    <main>
    <div className="w">
      <section style={{paddingBottom: "24px"}}>
        <div className="card ph2 in">
          <div className="av">
            {initials}
          </div>
          <div>
            <h1 style={{fontSize: "3.4rem"}}>
              {username}
            </h1>
            <p>
              <b>
                {user?.playerId || "Player ID unavailable"}
              </b>
              {user ? " · GAME ARENA player" : " · Entry fragger · Nova Esports"}
            </p>
            <p style={{margin: "8px 0 14px", maxWidth: "56ch"}}>
              {user?.bio || "No bio added yet."}
            </p>
            <span className="tag">
              {`Joined ${joined}`}
            </span>
          </div>
          <button ref={editButtonRef} className="btn p" type="button" disabled={!user} title={!user ? "Log in to edit your profile." : undefined} onClick={() => { setProfileMessage(""); setEditing(true); }}>Edit profile</button>
        </div>
        {profileMessage && <p className="profile-update-message" role="status">{profileMessage}</p>}
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
              {getTournamentById("winter-clash-valorant")?.name}
              </h3>
              <p>
                {"Champions · ₹40,000 won"}
              </p>
            </div>
            <div className="card pad rv">
              <h3>
              {getTournamentById("mobile-mayhem-bgmi")?.name}
              </h3>
              <p>
                {"4th place · ₹15,000 won"}
              </p>
            </div>
            <div className="card pad rv">
              <h3>
              {getTournamentById("inferno-invitational")?.name}
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
    {editing && <EditProfileDialog user={user} onClose={closeEditor} onProfileSave={updateProfile} onPasswordSave={changePassword} onProfileSaved={() => setProfileMessage("Profile updated successfully.")} />}
    </main>
  );
}

const usernamePattern = /^[a-zA-Z0-9_]{3,24}$/;
function EditProfileDialog({ user, onClose, onProfileSave, onPasswordSave, onProfileSaved }) {
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [usernameError, setUsernameError] = useState("");
  const [bioError, setBioError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileBusy, setProfileBusy] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordFieldErrors, setPasswordFieldErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const usernameRef = useRef(null);
  const dialogRef = useRef(null);
  const busyRef = useRef(false);
  busyRef.current = profileBusy || passwordBusy;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    usernameRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") { if (!busyRef.current) onClose(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = [...dialogRef.current.querySelectorAll("button:not(:disabled), input:not(:disabled), textarea:not(:disabled)")];
      if (!controls.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);

  async function saveProfile(event) {
    event.preventDefault();
    if (profileBusy || !user?.id) return;
    const cleanUsername = username.trim();
    const cleanBio = bio.trim();
    const nextUsernameError = !cleanUsername ? "Enter a username." : !usernamePattern.test(cleanUsername) ? "Use 3–24 letters, numbers, or underscores." : "";
    const nextBioError = cleanBio.length > 250 ? "Bio must be 250 characters or fewer." : "";
    setUsernameError(nextUsernameError);
    setBioError(nextBioError);
    setProfileError("");
    if (nextUsernameError || nextBioError) return;
    setProfileBusy(true);
    let result;
    try { result = await onProfileSave({ username: cleanUsername, bio: cleanBio }); }
    catch { result = { ok: false, message: "Profile changes could not be saved. Please try again." }; }
    setProfileBusy(false);
    if (!result.ok) {
      if (result.reason === "username-taken" || result.reason === "invalid-username") setUsernameError(result.message);
      else if (result.reason === "bio-too-long") setBioError(result.message);
      else setProfileError(result.message || "Profile changes could not be saved.");
      return;
    }
    onProfileSaved();
    onClose();
  }

  async function savePassword(event) {
    event.preventDefault();
    if (passwordBusy || !user?.id) return;
    setPasswordBusy(true);
    setPasswordError("");
    setPasswordSuccess("");
    const fieldErrors = {
      current: currentPassword ? "" : "Enter your current password.",
      next: !newPassword ? "Enter a new password." : newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) ? "Use at least 8 characters with uppercase, lowercase, and a number." : newPassword === currentPassword ? "Choose a password different from your current one." : "",
      confirmation: !confirmation ? "Confirm your new password." : confirmation !== newPassword ? "The new passwords do not match." : "",
    };
    setPasswordFieldErrors(fieldErrors);
    if (Object.values(fieldErrors).some(Boolean)) { setPasswordBusy(false); return; }
    let result;
    try { result = await onPasswordSave(currentPassword, newPassword, confirmation); }
    catch { result = { ok: false, message: "Password could not be updated. Please try again." }; }
    setPasswordBusy(false);
    if (!result.ok) {
      if (result.reason === "incorrect-current-password") setPasswordFieldErrors((current) => ({ ...current, current: result.message }));
      else if (["weak-password", "same-password"].includes(result.reason)) setPasswordFieldErrors((current) => ({ ...current, next: result.message }));
      else if (result.reason === "password-mismatch") setPasswordFieldErrors((current) => ({ ...current, confirmation: result.message }));
      else setPasswordError(result.message || "Password could not be updated.");
      return;
    }
    setCurrentPassword(""); setNewPassword(""); setConfirmation("");
    setPasswordSuccess("Password updated successfully.");
  }

  const closeDisabled = profileBusy || passwordBusy;
  return <div className="profile-edit-backdrop" onMouseDown={(event) => { if (!closeDisabled && event.target === event.currentTarget) onClose(); }}>
    <section className="profile-edit-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title" ref={dialogRef}>
      <header className="profile-edit-header"><div><small>Account settings</small><h2 id="profile-edit-title">Edit profile</h2></div><button className="profile-edit-close" type="button" aria-label="Close profile editor" disabled={closeDisabled} onClick={onClose}>×</button></header>
      <form onSubmit={saveProfile} noValidate>
        <h3>Profile details</h3>
        <label className="profile-edit-field">Username<input ref={usernameRef} value={username} maxLength={24} autoComplete="username" aria-invalid={Boolean(usernameError)} aria-describedby="profile-username-error" onChange={(event) => { setUsername(event.target.value); setUsernameError(""); }} /><small id="profile-username-error" className="profile-edit-error">{usernameError}</small></label>
        <label className="profile-edit-field">Bio<textarea value={bio} rows={3} maxLength={250} aria-invalid={Boolean(bioError)} aria-describedby="profile-bio-counter profile-bio-error" onChange={(event) => { setBio(event.target.value); setBioError(""); }} /><span id="profile-bio-counter" className="profile-edit-counter">{bio.length}/250</span><small id="profile-bio-error" className="profile-edit-error">{bioError}</small></label>
        {profileError && <p className="profile-edit-error" role="alert">{profileError}</p>}
        <div className="profile-edit-actions"><button className="btn o" type="button" disabled={closeDisabled} onClick={onClose}>Cancel</button><button className="btn p" type="submit" disabled={profileBusy}>{profileBusy ? "Saving…" : "Save Changes"}</button></div>
      </form>
      <form className="profile-password-form" onSubmit={savePassword} noValidate>
        <h3>Change password</h3>
        <label className="profile-edit-field">Current password<input type="password" autoComplete="current-password" required value={currentPassword} aria-invalid={Boolean(passwordFieldErrors.current)} aria-describedby="profile-current-password-error" onChange={(event) => { setCurrentPassword(event.target.value); setPasswordFieldErrors((current) => ({ ...current, current: "" })); }} /><small className="profile-edit-error" id="profile-current-password-error">{passwordFieldErrors.current}</small></label>
        <label className="profile-edit-field">New password<input type="password" autoComplete="new-password" required minLength={8} value={newPassword} aria-invalid={Boolean(passwordFieldErrors.next)} aria-describedby="profile-password-hint profile-new-password-error" onChange={(event) => { setNewPassword(event.target.value); setPasswordFieldErrors((current) => ({ ...current, next: "", confirmation: "" })); }} /><small id="profile-password-hint">At least 8 characters, including uppercase, lowercase, and a number.</small><small className="profile-edit-error" id="profile-new-password-error">{passwordFieldErrors.next}</small></label>
        <label className="profile-edit-field">Confirm new password<input type="password" autoComplete="new-password" required minLength={8} value={confirmation} aria-invalid={Boolean(passwordFieldErrors.confirmation)} aria-describedby="profile-confirm-password-error" onChange={(event) => { setConfirmation(event.target.value); setPasswordFieldErrors((current) => ({ ...current, confirmation: "" })); }} /><small className="profile-edit-error" id="profile-confirm-password-error">{passwordFieldErrors.confirmation}</small></label>
        {passwordError && <p className="profile-edit-error" role="alert">{passwordError}</p>}
        {passwordSuccess && <p className="profile-edit-success" role="status">{passwordSuccess}</p>}
        <div className="profile-edit-actions"><button className="btn p" type="submit" disabled={passwordBusy}>{passwordBusy ? "Updating…" : "Update Password"}</button></div>
      </form>
    </section>
  </div>;
}
