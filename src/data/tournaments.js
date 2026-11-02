import { listManagedTournaments, seedManagedTournaments } from "./adminStore.js";

export const tournaments = [
  {
    id: "valorant-nightfall-series",
    name: "Valorant Nightfall Series",
    game: "Valorant",
    gameKey: "valorant",
    banner: "VALORANT",
    status: "upcoming",
    start: "2026-11-20T18:00:00+05:30",
    end: "2026-11-23T22:00:00+05:30",
    registrationDeadline: "2026-10-31T23:59:00+05:30",
    entryFee: 250,
    prizePool: 180000,
    participants: { registered: 72, capacity: 96, label: "teams" },
    description: "Nightfall brings rising Valorant teams together for a fast, high-stakes weekend bracket. Registration has closed and the final roster is being prepared.",
    format: "Groups of four lead into a 16-team single-elimination playoff. Matches are best-of-three; the final is best-of-five.",
    rules: ["Teams field five players and one substitute.", "All players must use their registered account.", "Check-in opens 30 minutes before a match.", "Roster changes are closed."],
    schedule: [{ date: "2026-11-20", round: "Group stage", time: "6:00 PM IST" }, { date: "2026-11-22", round: "Playoffs", time: "5:00 PM IST" }, { date: "2026-11-23", round: "Grand final", time: "7:00 PM IST" }],
    teams: ["Vanguard", "Nova Esports", "Crimson Fang", "Apex Syndicate"],
  },
  {
    id: "arena-masters-valorant-open",
    name: "Arena Masters Valorant Open",
    game: "Valorant",
    gameKey: "valorant",
    banner: "VALORANT",
    status: "upcoming",
    start: "2026-11-22T16:00:00+05:30",
    end: "2026-11-30T22:00:00+05:30",
    registrationDeadline: "2026-11-18T23:59:00+05:30",
    entryFee: 500,
    prizePool: 500000,
    participants: { registered: 96, capacity: 128, label: "teams" },
    description: "Eight days, 128 teams and one title. Arena Masters is the season opener for Valorant on GAME ARENA, with a double-elimination playoff and a live-streamed grand final.",
    format: "Qualifiers feed 32 teams into groups of four. The top two from each group enter a best-of-three playoff bracket. The grand final is best-of-five.",
    rules: ["Teams of five players plus one substitute.", "All players need a verified GAME ARENA account.", "Players must be 16 or older.", "Teams check in 30 minutes before each match."],
    schedule: [
      { date: "2026-11-22", round: "Qualifiers", time: "4:00 PM IST" },
      { date: "2026-11-24", round: "Group stage, day 1", time: "4:00 PM IST" },
      { date: "2026-11-25", round: "Group stage, day 2", time: "4:00 PM IST" },
      { date: "2026-11-28", round: "Quarterfinals", time: "5:00 PM IST" },
      { date: "2026-11-29", round: "Semifinals", time: "5:00 PM IST" },
      { date: "2026-11-30", round: "Grand final", time: "7:00 PM IST" },
    ],
    teams: ["Vanguard", "Orion Gaming", "Crimson Fang", "Nova Esports", "Titan Squad", "Hawkeye Gaming", "Phantom Five", "Apex Syndicate"],
  },
  {
    id: "cs2-iron-cup",
    name: "CS2 Iron Cup",
    game: "Counter-Strike 2",
    gameKey: "cs2",
    banner: "CS2",
    status: "upcoming",
    start: "2026-12-05T14:00:00+05:30",
    end: "2026-12-12T22:00:00+05:30",
    registrationDeadline: "2026-11-28T23:59:00+05:30",
    entryFee: 400,
    prizePool: 250000,
    participants: { registered: 48, capacity: 64, label: "teams" },
    description: "A week of tactical Counter-Strike action brings 64 squads together for the Iron Cup. Teams battle through a group stage before the single-elimination playoffs.",
    format: "Four groups of sixteen teams qualify for a 16-team single-elimination playoff. Matches are best-of-three; the final is best-of-five.",
    rules: ["Teams field five starting players and may name one substitute.", "VAC and tournament anti-cheat must remain enabled.", "Players must check in 30 minutes before their match.", "Roster changes close when registration ends."],
    schedule: [
      { date: "2026-12-05", round: "Opening matches", time: "2:00 PM IST" },
      { date: "2026-12-07", round: "Group stage", time: "4:00 PM IST" },
      { date: "2026-12-10", round: "Quarterfinals", time: "5:00 PM IST" },
      { date: "2026-12-11", round: "Semifinals", time: "5:00 PM IST" },
      { date: "2026-12-12", round: "Grand final", time: "7:00 PM IST" },
    ],
    teams: ["Crimson Fang", "Hawkeye Gaming", "Vanguard", "Orion Gaming"],
  },
  {
    id: "bgmi-pro-series-season-4",
    name: "BGMI Pro Series Season 4",
    game: "BGMI",
    gameKey: "bgmi",
    banner: "BGMI",
    status: "ongoing",
    start: "2026-11-01T12:00:00+05:30",
    end: "2026-11-08T22:00:00+05:30",
    registrationDeadline: "2026-10-28T23:59:00+05:30",
    entryFee: 300,
    prizePool: 300000,
    participants: { registered: 100, capacity: 100, label: "squads" },
    description: "The fourth BGMI Pro Series season is underway. One hundred squads are competing across a week of survival rounds for the season title.",
    format: "Squads play daily survival rounds. Placement and elimination points determine the finalists and final standings.",
    rules: ["Squads consist of four players and one optional substitute.", "All matches use the official tournament lobby.", "Team names and rosters are locked for the event.", "Disconnects follow the published match restart policy."],
    schedule: [
      { date: "2026-11-01", round: "Opening rounds", time: "12:00 PM IST" },
      { date: "2026-11-04", round: "Round 3", time: "6:00 PM IST" },
      { date: "2026-11-08", round: "Finals", time: "5:00 PM IST" },
    ],
    teams: ["Nova Esports", "Titan Squad", "Apex Syndicate", "Phantom Five"],
  },
  {
    id: "inferno-invitational",
    name: "Inferno Invitational",
    game: "Counter-Strike 2",
    gameKey: "cs2",
    banner: "CS2",
    status: "ongoing",
    start: "2026-10-30T14:00:00+05:30",
    end: "2026-11-05T22:00:00+05:30",
    registrationDeadline: "2026-10-25T23:59:00+05:30",
    entryFee: 250,
    prizePool: 200000,
    participants: { registered: 32, capacity: 32, label: "teams" },
    description: "Thirty-two invited Counter-Strike 2 teams are facing off in the Inferno Invitational, now at the live playoff stage.",
    format: "Single-elimination bracket with best-of-three matches and a best-of-five grand final.",
    rules: ["Invited teams must use their submitted roster.", "All players must connect through the tournament client.", "A match admin must approve pauses and restarts.", "Teams must be ready at the scheduled match time."],
    schedule: [
      { date: "2026-10-30", round: "Round of 32", time: "2:00 PM IST" },
      { date: "2026-11-02", round: "Quarterfinals", time: "5:00 PM IST" },
      { date: "2026-11-04", round: "Semifinals", time: "5:00 PM IST" },
      { date: "2026-11-05", round: "Grand final", time: "7:00 PM IST" },
    ],
    teams: ["Crimson Fang", "Hawkeye Gaming", "Vanguard", "Orion Gaming"],
  },
  {
    id: "winter-clash-valorant",
    name: "Winter Clash Valorant",
    game: "Valorant",
    gameKey: "valorant",
    banner: "VALORANT",
    status: "completed",
    start: "2026-10-16T16:00:00+05:30",
    end: "2026-10-20T22:00:00+05:30",
    registrationDeadline: "2026-10-12T23:59:00+05:30",
    entryFee: 0,
    prizePool: 100000,
    participants: { registered: 64, capacity: 64, label: "teams" },
    description: "Winter Clash brought 64 Valorant teams together for a four-day bracket. The event has concluded and its final standings are available below.",
    format: "Double-elimination bracket with best-of-three matches and a best-of-five grand final.",
    rules: ["Teams field five players and one substitute.", "All players must use their verified tournament account.", "Match results were confirmed by both team captains.", "The final standings are official."],
    schedule: [
      { date: "2026-10-16", round: "Opening round", time: "4:00 PM IST" },
      { date: "2026-10-18", round: "Quarterfinals", time: "5:00 PM IST" },
      { date: "2026-10-19", round: "Semifinals", time: "5:00 PM IST" },
      { date: "2026-10-20", round: "Grand final", time: "7:00 PM IST" },
    ],
    teams: ["Vanguard", "Orion Gaming", "Crimson Fang", "Nova Esports"],
    results: [{ place: "1st", team: "Vanguard", prize: 40000 }, { place: "2nd", team: "Orion Gaming", prize: 25000 }, { place: "3rd", team: "Crimson Fang", prize: 15000 }],
  },
  {
    id: "mobile-mayhem-bgmi",
    name: "Mobile Mayhem BGMI",
    game: "BGMI",
    gameKey: "bgmi",
    banner: "BGMI",
    status: "completed",
    start: "2026-09-28T12:00:00+05:30",
    end: "2026-10-02T22:00:00+05:30",
    registrationDeadline: "2026-09-24T23:59:00+05:30",
    entryFee: 200,
    prizePool: 150000,
    participants: { registered: 100, capacity: 100, label: "squads" },
    description: "Mobile Mayhem featured 100 BGMI squads in a four-day survival tournament. The event is complete and the final placements are recorded.",
    format: "Squads competed in daily survival rounds. Placement and elimination points determined the final leaderboard.",
    rules: ["Squads field four players.", "Only registered rosters were permitted in tournament lobbies.", "Match points were reviewed by event admins.", "The final standings are official."],
    schedule: [
      { date: "2026-09-28", round: "Opening rounds", time: "12:00 PM IST" },
      { date: "2026-09-30", round: "Semifinals", time: "5:00 PM IST" },
      { date: "2026-10-02", round: "Finals", time: "5:00 PM IST" },
    ],
    teams: ["Nova Esports", "Titan Squad", "Apex Syndicate", "Phantom Five"],
    results: [{ place: "1st", team: "Nova Esports", prize: 50000 }, { place: "2nd", team: "Titan Squad", prize: 30000 }, { place: "4th", team: "Apex Syndicate", prize: 15000 }],
  },
  {
    id: "valorant-rift-rivals-2026",
    name: "Rift Rivals Valorant Cup",
    game: "Valorant", gameKey: "valorant", banner: "VALORANT", status: "registration-open",
    start: "2026-11-14T16:00:00+05:30", end: "2026-11-15T22:00:00+05:30", registrationOpensAt: "2026-10-20T00:00:00+05:30", registrationDeadline: "2026-11-11T16:00:00+05:30",
    entryFee: 150, prizePool: 90000, participants: { registered: 34, capacity: 64, label: "teams" },
    description: "A fast weekend Valorant cup for emerging teams, with a compact group stage and streamed finals.",
    format: "Sixteen groups of four play best-of-one matches. Group winners advance to a best-of-three single-elimination bracket.",
    rules: ["Teams field five players and one substitute.", "All players must use their registered accounts.", "Check-in closes 30 minutes before the first match.", "Coaching is allowed only between maps."],
    schedule: [{ date: "2026-11-14", round: "Groups", time: "4:00 PM IST" }, { date: "2026-11-15", round: "Playoffs and final", time: "5:00 PM IST" }], teams: ["Riftwalkers", "Blue Orbit", "Vanguard", "Nova Esports"],
  },
  {
    id: "bgmi-squad-showdown-nov-2026",
    name: "BGMI Squad Showdown",
    game: "BGMI", gameKey: "bgmi", banner: "BGMI", status: "registration-open",
    start: "2026-11-21T12:00:00+05:30", end: "2026-11-22T20:00:00+05:30", registrationOpensAt: "2026-10-25T00:00:00+05:30", registrationDeadline: "2026-11-18T12:00:00+05:30",
    entryFee: 200, prizePool: 125000, participants: { registered: 56, capacity: 100, label: "squads" },
    description: "A two-day BGMI squad event that rewards smart rotations, consistent placements and clean finishes.",
    format: "Six custom-lobby matches across two days. Placement and elimination points decide the final standings.",
    rules: ["Squads have four starters and may name one substitute.", "Only the submitted roster may join the lobby.", "Emulators are not permitted.", "Results are final after admin review."],
    schedule: [{ date: "2026-11-21", round: "Rounds 1–3", time: "12:00 PM IST" }, { date: "2026-11-22", round: "Rounds 4–6", time: "2:00 PM IST" }], teams: ["Drop Zone", "Nova Esports", "Titan Squad", "Apex Syndicate"],
  },
  {
    id: "cs2-midnight-premier-2026",
    name: "CS2 Midnight Premier",
    game: "Counter-Strike 2", gameKey: "cs2", banner: "CS2", status: "registration-open",
    start: "2026-11-28T17:00:00+05:30", end: "2026-11-30T22:00:00+05:30", registrationOpensAt: "2026-10-28T00:00:00+05:30", registrationDeadline: "2026-11-25T17:00:00+05:30",
    entryFee: 350, prizePool: 220000, participants: { registered: 22, capacity: 32, label: "teams" },
    description: "A 32-team Counter-Strike 2 premier built around disciplined utility, close maps and a live final.",
    format: "Eight groups of four feed a 16-team single-elimination bracket. Matches are best-of-three.",
    rules: ["Five starters and one substitute per team.", "VAC must remain enabled.", "Team captains report results after each match.", "Admins may review match demos for disputes."],
    schedule: [{ date: "2026-11-28", round: "Group stage", time: "5:00 PM IST" }, { date: "2026-11-29", round: "Quarterfinals and semifinals", time: "4:00 PM IST" }, { date: "2026-11-30", round: "Grand final", time: "7:00 PM IST" }], teams: ["Dustline", "Crimson Fang", "Hawkeye Gaming", "Orion Gaming"],
  },
  {
    id: "valorant-ascendant-open-dec-2026",
    name: "Ascendant Open: December Split",
    game: "Valorant", gameKey: "valorant", banner: "VALORANT", status: "registration-open",
    start: "2026-12-06T15:00:00+05:30", end: "2026-12-13T21:00:00+05:30", registrationOpensAt: "2026-11-01T00:00:00+05:30", registrationDeadline: "2026-12-03T15:00:00+05:30",
    entryFee: 500, prizePool: 350000, participants: { registered: 61, capacity: 128, label: "teams" },
    description: "A week-long Valorant open split with room for new challengers and a substantial playoff prize pool.",
    format: "Qualifiers seed 32 teams into groups. The top two per group advance to a double-elimination playoff.",
    rules: ["Five players plus one substitute.", "All matches use the published map pool.", "Teams must check in 30 minutes before play.", "Roster locks at the registration deadline."],
    schedule: [{ date: "2026-12-06", round: "Open qualifiers", time: "3:00 PM IST" }, { date: "2026-12-10", round: "Playoffs", time: "5:00 PM IST" }, { date: "2026-12-13", round: "Grand final", time: "7:00 PM IST" }], teams: ["Orion Gaming", "Riftwalkers", "Apex Syndicate", "Phantom Five"],
  },
  {
    id: "bgmi-winter-drop-cup-2026",
    name: "BGMI Winter Drop Cup",
    game: "BGMI", gameKey: "bgmi", banner: "BGMI", status: "registration-open",
    start: "2026-12-12T13:00:00+05:30", end: "2026-12-13T21:00:00+05:30", registrationOpensAt: "2026-11-02T00:00:00+05:30", registrationDeadline: "2026-12-09T13:00:00+05:30",
    entryFee: 250, prizePool: 180000, participants: { registered: 43, capacity: 100, label: "squads" },
    description: "A winter BGMI competition featuring two days of tactical survival rounds and a live leaderboard.",
    format: "Eight matches over two days. Overall placement is determined by combined placement and elimination points.",
    rules: ["Four players per squad; no mid-event roster swaps.", "All players use the official event client.", "Match lobbies open 20 minutes before start.", "Unsportsmanlike conduct can result in disqualification."],
    schedule: [{ date: "2026-12-12", round: "Rounds 1–4", time: "1:00 PM IST" }, { date: "2026-12-13", round: "Rounds 5–8", time: "2:00 PM IST" }], teams: ["Titan Squad", "Drop Zone", "Nova Esports", "Stormbreak"],
  },
  {
    id: "cs2-new-blood-series-2027",
    name: "CS2 New Blood Series",
    game: "Counter-Strike 2", gameKey: "cs2", banner: "CS2", status: "registration-open",
    start: "2027-01-09T16:00:00+05:30", end: "2027-01-17T22:00:00+05:30", registrationOpensAt: "2026-11-03T00:00:00+05:30", registrationDeadline: "2027-01-05T16:00:00+05:30",
    entryFee: 300, prizePool: 275000, participants: { registered: 18, capacity: 64, label: "teams" },
    description: "An early-season CS2 series giving developing teams a full bracket and a chance to break into the rankings.",
    format: "Four regional qualifiers feed a 16-team double-elimination final stage. All playoff matches are best-of-three.",
    rules: ["Five starters and one registered substitute.", "Players must use their account-linked Steam ID.", "Match demos may be requested by admins.", "Teams must be ready at the scheduled lobby time."],
    schedule: [{ date: "2027-01-09", round: "Qualifiers", time: "4:00 PM IST" }, { date: "2027-01-15", round: "Playoffs", time: "5:00 PM IST" }, { date: "2027-01-17", round: "Final", time: "7:00 PM IST" }], teams: ["Dustline", "Ironclad", "Hawkeye Gaming", "Crimson Fang"],
  },
  {
    id: "valorant-new-year-showdown-2027",
    name: "Valorant New Year Showdown",
    game: "Valorant", gameKey: "valorant", banner: "VALORANT", status: "upcoming",
    start: "2027-01-23T16:00:00+05:30", end: "2027-01-24T22:00:00+05:30", registrationOpensAt: "2026-11-10T00:00:00+05:30", registrationDeadline: "2027-01-20T16:00:00+05:30",
    entryFee: 100, prizePool: 75000, participants: { registered: 0, capacity: 64, label: "teams" },
    description: "A new-year Valorant event for community teams, with an accessible entry fee and a short weekend format.",
    format: "Single-elimination bracket with best-of-one early rounds and best-of-three semifinals and final.",
    rules: ["Five players per roster and one substitute.", "Check-in is required before each round.", "Map selection follows the event guide.", "The tournament team resolves match disputes."],
    schedule: [{ date: "2027-01-23", round: "Opening rounds", time: "4:00 PM IST" }, { date: "2027-01-24", round: "Semifinals and final", time: "5:00 PM IST" }], teams: [],
  },
  {
    id: "bgmi-champions-circuit-2027",
    name: "BGMI Champions Circuit: Open Qualifier",
    game: "BGMI", gameKey: "bgmi", banner: "BGMI", status: "upcoming",
    start: "2027-02-06T12:00:00+05:30", end: "2027-02-14T21:00:00+05:30", registrationOpensAt: "2026-11-15T00:00:00+05:30", registrationDeadline: "2027-02-02T12:00:00+05:30",
    entryFee: 400, prizePool: 400000, participants: { registered: 0, capacity: 128, label: "squads" },
    description: "The open path into the Champions Circuit begins with regional BGMI qualifiers and culminates in a broadcast final.",
    format: "Regional lobbies qualify squads to a 32-team final stage. Points are accumulated across six final matches.",
    rules: ["Squads must register four starters and may add one substitute.", "Players must be 16 or older.", "All matches are played on the official event build.", "Final standings are subject to admin review."],
    schedule: [{ date: "2027-02-06", round: "Regional qualifiers", time: "12:00 PM IST" }, { date: "2027-02-13", round: "Semifinals", time: "1:00 PM IST" }, { date: "2027-02-14", round: "Grand final", time: "5:00 PM IST" }], teams: [],
  },
];

const demoSeedIds = new Set([
  "valorant-rift-rivals-2026", "bgmi-squad-showdown-nov-2026", "cs2-midnight-premier-2026",
  "valorant-ascendant-open-dec-2026", "bgmi-winter-drop-cup-2026", "cs2-new-blood-series-2027",
  "valorant-new-year-showdown-2027", "bgmi-champions-circuit-2027",
]);
const demoTournamentSeeds = tournaments.filter((item) => demoSeedIds.has(item.id));

export function getTournamentById(id) {
  return tournaments.find((tournament) => tournament.id === id) || null;
}

export async function getAllTournaments() {
  try {
    await seedManagedTournaments(demoTournamentSeeds);
    const managed = await listManagedTournaments();
    const overrides = new Map(managed.map((item) => [item.id, item]));
    return [...tournaments.filter((item) => !overrides.get(item.id)?.deleted).map((item) => overrides.get(item.id) || item), ...managed.filter((item) => !item.deleted && !tournaments.some((base) => base.id === item.id))];
  }
  catch { return [...tournaments]; }
}

export function subscribeToTournamentData(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("gamearena:tournament-updated", callback);
  return () => window.removeEventListener("gamearena:tournament-updated", callback);
}

export function getTournamentStatus(tournament, now = new Date()) {
  if (["draft", "registration-closed", "cancelled"].includes(tournament?.status)) return tournament.status;
  const start = Date.parse(tournament?.start);
  const end = Date.parse(tournament?.end);
  const nowTime = new Date(now).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(nowTime)) return tournament?.status === "registration-open" ? "upcoming" : tournament?.status || "upcoming";
  if (nowTime < start) return "upcoming";
  if (!Number.isFinite(end)) return tournament?.status === "completed" ? "completed" : "ongoing";
  if (nowTime > end) return "completed";
  return "ongoing";
}

export function getTournamentRegistrationState(tournament, now = new Date(), participantCount = tournament?.participants?.registered) {
  if (!tournament) return { available: false, status: "unavailable", label: "Unavailable", message: "Tournament information is unavailable." };
  const lifecycle = getTournamentStatus(tournament, now);
  if (lifecycle === "draft") return { available: false, status: lifecycle, label: "Draft", message: "This tournament is not available to players yet." };
  if (lifecycle === "cancelled") return { available: false, status: lifecycle, label: "Cancelled", message: "This tournament has been cancelled." };
  if (lifecycle === "completed") return { available: false, status: lifecycle, label: "Completed", message: "This tournament is complete. Registration is closed." };
  if (lifecycle === "ongoing") return { available: false, status: lifecycle, label: "Ongoing", message: "This tournament is in progress." };
  if (tournament.status === "registration-closed") return { available: false, status: "registration-closed", label: "Registration closed", message: "Registration has closed." };
  const nowTime = new Date(now).getTime();
  const opensAt = Date.parse(tournament.registrationOpensAt);
  if (Number.isFinite(opensAt) && nowTime < opensAt) return { available: false, status: "not-yet-open", label: "Registration not yet open", message: "Registration has not opened yet." };
  const capacity = Number(tournament.participants?.capacity);
  if (Number.isFinite(capacity) && Number(participantCount) >= capacity) return { available: false, status: "full", label: "Tournament full", message: "Maximum participants reached." };
  const deadline = Date.parse(tournament.registrationDeadline);
  if (!Number.isFinite(deadline) || !Number.isFinite(nowTime) || nowTime >= deadline) return { available: false, status: "registration-closed", label: "Registration closed", message: "Registration has closed." };
  if (!["upcoming", "registration-open"].includes(tournament.status)) return { available: false, status: "unavailable", label: "Registration unavailable", message: "Registration is unavailable." };
  return { available: true, status: "registration-open", label: "Registration open", message: "Registration is open." };
}

export function isTournamentRegistrationOpen(tournament, now = new Date()) {
  return getTournamentRegistrationState(tournament, now).available;
}
