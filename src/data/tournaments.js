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
];

export function getTournamentById(id) {
  return tournaments.find((tournament) => tournament.id === id) || null;
}

export function getTournamentStatus(tournament, now = new Date()) {
  const start = Date.parse(tournament?.start);
  const end = Date.parse(tournament?.end);
  const nowTime = new Date(now).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(nowTime)) return tournament?.status || "upcoming";
  if (nowTime < start) return "upcoming";
  if (nowTime > end) return "completed";
  return "ongoing";
}

export function isTournamentRegistrationOpen(tournament, now = new Date()) {
  if (getTournamentStatus(tournament, now) !== "upcoming") return false;
  if (Number.isFinite(tournament?.participants?.capacity)
    && Number(tournament.participants.registered) >= tournament.participants.capacity) return false;
  const deadline = Date.parse(tournament?.registrationDeadline);
  const nowTime = new Date(now).getTime();
  return Number.isFinite(deadline) && Number.isFinite(nowTime) && nowTime < deadline;
}
