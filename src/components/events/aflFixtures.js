/**
 * AFL Fixtures 2026-2029 — Full home-and-away seasons + finals.
 * All matches are generated programmatically from team and schedule data.
 * Each match uses the home team's unique promotional image.
 * No external API is used — everything is local.
 */

const GRAND_FINAL_2026_IMG = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/802ed3aea_IMG_7358.jpeg";
const FINALS_IMG = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/48b228ead_generated_image.png";

const TEAMS = [
  { name: "Adelaide Crows", venue: "Adelaide Oval", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/349cb9465_generated_image.png" },
  { name: "Brisbane Lions", venue: "Gabba", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/96392b79c_generated_image.png" },
  { name: "Carlton", venue: "MCG", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/9dfa26c7c_generated_image.png" },
  { name: "Collingwood", venue: "MCG", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/8d2ad953c_generated_image.png" },
  { name: "Essendon", venue: "MCG", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/66b8ebf7d_generated_image.png" },
  { name: "Fremantle", venue: "Optus Stadium", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/4be43193d_generated_image.png" },
  { name: "Geelong Cats", venue: "GMHBA Stadium", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/9c47cfba2_generated_image.png" },
  { name: "Gold Coast SUNS", venue: "People First Stadium", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/801148338_generated_image.png" },
  { name: "GWS GIANTS", venue: "ENGIE Stadium", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/468669c87_generated_image.png" },
  { name: "Hawthorn", venue: "MCG", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/199ab63f7_generated_image.png" },
  { name: "Melbourne", venue: "MCG", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/755568e18_generated_image.png" },
  { name: "North Melbourne", venue: "Marvel Stadium", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/d693eb2a2_generated_image.png" },
  { name: "Port Adelaide", venue: "Adelaide Oval", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/939ccd4d2_generated_image.png" },
  { name: "Richmond", venue: "MCG", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/252c0c2ee_generated_image.png" },
  { name: "St Kilda", venue: "Marvel Stadium", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/010382e50_generated_image.png" },
  { name: "Sydney Swans", venue: "SCG", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/4b9d42ca0_generated_image.png" },
  { name: "West Coast Eagles", venue: "Optus Stadium", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/7a52a5d18_generated_image.png" },
  { name: "Western Bulldogs", venue: "Marvel Stadium", img: "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/a8942c4b5_generated_image.png" },
];

const VENUE_LOCATIONS = {
  "Adelaide Oval": "Adelaide, SA",
  "MCG": "Melbourne, VIC",
  "Optus Stadium": "Perth, WA",
  "Marvel Stadium": "Docklands, VIC",
  "Gabba": "Brisbane, QLD",
  "SCG": "Sydney, NSW",
  "GMHBA Stadium": "Geelong, VIC",
  "ENGIE Stadium": "Sydney Olympic Park, NSW",
  "People First Stadium": "Gold Coast, QLD",
};

// 9 time slots per round (Thu–Mon)
const TIME_SLOTS = [
  { dayOffset: 0, time: "7:30pm" },
  { dayOffset: 1, time: "7:40pm" },
  { dayOffset: 2, time: "1:45pm" },
  { dayOffset: 2, time: "4:35pm" },
  { dayOffset: 2, time: "7:30pm" },
  { dayOffset: 3, time: "1:10pm" },
  { dayOffset: 3, time: "3:15pm" },
  { dayOffset: 3, time: "4:40pm" },
  { dayOffset: 4, time: "6:10pm" },
];

function formatDate(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Circle-method round-robin: 17 rounds for 18 teams
function generateRoundRobin(teams) {
  const n = teams.length;
  const rounds = [];
  const arr = [...teams];
  for (let r = 0; r < n - 1; r++) {
    const round = [];
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (r % 2 === 0) round.push({ home: a, away: b });
      else round.push({ home: b, away: a });
    }
    rounds.push(round);
    arr.splice(1, 0, arr.pop());
  }
  return rounds;
}

// 23 rounds: 17 round-robin + 6 reversed rivalry rounds
function generateFullRounds(teams) {
  const base = generateRoundRobin(teams);
  const extra = base.slice(0, 6).map((round) =>
    round.map((m) => ({ home: m.away, away: m.home }))
  );
  return [...base, ...extra];
}

function generateSeason(year, startDateStr) {
  const rounds = generateFullRounds(TEAMS);
  const startDate = new Date(startDateStr + "T00:00:00");
  const matches = [];
  rounds.forEach((round, roundIdx) => {
    const roundStart = new Date(startDate);
    roundStart.setDate(roundStart.getDate() + roundIdx * 7);
    round.forEach((match, matchIdx) => {
      const slot = TIME_SLOTS[matchIdx];
      const matchDate = new Date(roundStart);
      matchDate.setDate(matchDate.getDate() + slot.dayOffset);
      matches.push({
        title: `${match.home.name} vs ${match.away.name}`,
        date: `${formatDate(matchDate)} · ${slot.time}`,
        venue: match.home.venue,
        round: `R${roundIdx + 1}`,
        img: match.home.img,
      });
    });
  });
  return matches;
}

// ===== FINALS =====

const FINALS_2026 = [
  { title: "Fremantle vs Western Bulldogs", date: "Fri 4 Sep 2026 · 7:50pm", venue: "Optus Stadium", round: "Qualifying Final 1", img: FINALS_IMG },
  { title: "Brisbane Lions vs GWS GIANTS", date: "Sat 5 Sep 2026 · 4:35pm", venue: "Gabba", round: "Qualifying Final 2", img: FINALS_IMG },
  { title: "Collingwood vs Carlton", date: "Sat 5 Sep 2026 · 7:30pm", venue: "MCG", round: "Elimination Final 1", img: FINALS_IMG },
  { title: "Geelong Cats vs Sydney Swans", date: "Sun 6 Sep 2026 · 3:10pm", venue: "GMHBA Stadium", round: "Elimination Final 2", img: FINALS_IMG },
  { title: "Western Bulldogs vs GWS GIANTS", date: "Fri 11 Sep 2026 · 7:50pm", venue: "MCG", round: "Semi Final 1", img: FINALS_IMG },
  { title: "Collingwood vs Geelong Cats", date: "Sat 12 Sep 2026 · 7:30pm", venue: "MCG", round: "Semi Final 2", img: FINALS_IMG },
  { title: "Fremantle vs Collingwood", date: "Fri 18 Sep 2026 · 7:50pm", venue: "Optus Stadium", round: "Preliminary Final 1", img: FINALS_IMG },
  { title: "Brisbane Lions vs Geelong Cats", date: "Sat 19 Sep 2026 · 4:35pm", venue: "Gabba", round: "Preliminary Final 2", img: FINALS_IMG },
  { title: "Toyota AFL Grand Final 2026", date: "Sat 26 Sep 2026 · 2:30pm", venue: "MCG", round: "Grand Final", img: GRAND_FINAL_2026_IMG },
];

const FINALS_2027 = [
  { title: "Brisbane Lions vs Fremantle", date: "Fri 3 Sep 2027 · 7:50pm", venue: "Gabba", round: "Qualifying Final 1", img: FINALS_IMG },
  { title: "Collingwood vs Geelong Cats", date: "Sat 4 Sep 2027 · 4:35pm", venue: "MCG", round: "Qualifying Final 2", img: FINALS_IMG },
  { title: "Melbourne vs GWS GIANTS", date: "Sat 4 Sep 2027 · 7:30pm", venue: "MCG", round: "Elimination Final 1", img: FINALS_IMG },
  { title: "Sydney Swans vs Western Bulldogs", date: "Sun 5 Sep 2027 · 3:10pm", venue: "SCG", round: "Elimination Final 2", img: FINALS_IMG },
  { title: "Brisbane Lions vs Melbourne", date: "Fri 10 Sep 2027 · 7:50pm", venue: "Gabba", round: "Semi Final 1", img: FINALS_IMG },
  { title: "Collingwood vs Sydney Swans", date: "Sat 11 Sep 2027 · 7:30pm", venue: "MCG", round: "Semi Final 2", img: FINALS_IMG },
  { title: "Fremantle vs Collingwood", date: "Fri 17 Sep 2027 · 7:50pm", venue: "Optus Stadium", round: "Preliminary Final 1", img: FINALS_IMG },
  { title: "Brisbane Lions vs Sydney Swans", date: "Sat 18 Sep 2027 · 4:35pm", venue: "Gabba", round: "Preliminary Final 2", img: FINALS_IMG },
  { title: "AFL Grand Final 2027", date: "Sat 25 Sep 2027 · 2:30pm", venue: "MCG", round: "Grand Final", img: FINALS_IMG },
];

const FINALS_2028 = [
  { title: "Collingwood vs Brisbane Lions", date: "Fri 1 Sep 2028 · 7:50pm", venue: "MCG", round: "Qualifying Final 1", img: FINALS_IMG },
  { title: "Fremantle vs Geelong Cats", date: "Sat 2 Sep 2028 · 4:35pm", venue: "Optus Stadium", round: "Qualifying Final 2", img: FINALS_IMG },
  { title: "Melbourne vs GWS GIANTS", date: "Sat 2 Sep 2028 · 7:30pm", venue: "MCG", round: "Elimination Final 1", img: FINALS_IMG },
  { title: "Sydney Swans vs Carlton", date: "Sun 3 Sep 2028 · 3:10pm", venue: "SCG", round: "Elimination Final 2", img: FINALS_IMG },
  { title: "Brisbane Lions vs Sydney Swans", date: "Fri 8 Sep 2028 · 7:50pm", venue: "Gabba", round: "Semi Final 1", img: FINALS_IMG },
  { title: "Fremantle vs Melbourne", date: "Sat 9 Sep 2028 · 7:30pm", venue: "Optus Stadium", round: "Semi Final 2", img: FINALS_IMG },
  { title: "Collingwood vs Fremantle", date: "Fri 15 Sep 2028 · 7:50pm", venue: "MCG", round: "Preliminary Final 1", img: FINALS_IMG },
  { title: "Brisbane Lions vs Melbourne", date: "Sat 16 Sep 2028 · 4:35pm", venue: "Gabba", round: "Preliminary Final 2", img: FINALS_IMG },
  { title: "AFL Grand Final 2028", date: "Sat 23 Sep 2028 · 2:30pm", venue: "MCG", round: "Grand Final", img: FINALS_IMG },
];

const FINALS_2029 = [
  { title: "Brisbane Lions vs Collingwood", date: "Fri 7 Sep 2029 · 7:50pm", venue: "Gabba", round: "Qualifying Final 1", img: FINALS_IMG },
  { title: "Fremantle vs Sydney Swans", date: "Sat 8 Sep 2029 · 4:35pm", venue: "Optus Stadium", round: "Qualifying Final 2", img: FINALS_IMG },
  { title: "Geelong Cats vs Melbourne", date: "Sat 8 Sep 2029 · 7:30pm", venue: "GMHBA Stadium", round: "Elimination Final 1", img: FINALS_IMG },
  { title: "GWS GIANTS vs Carlton", date: "Sun 9 Sep 2029 · 3:10pm", venue: "ENGIE Stadium", round: "Elimination Final 2", img: FINALS_IMG },
  { title: "Collingwood vs Geelong Cats", date: "Fri 14 Sep 2029 · 7:50pm", venue: "MCG", round: "Semi Final 1", img: FINALS_IMG },
  { title: "Fremantle vs GWS GIANTS", date: "Sat 15 Sep 2029 · 7:30pm", venue: "Optus Stadium", round: "Semi Final 2", img: FINALS_IMG },
  { title: "Brisbane Lions vs Fremantle", date: "Fri 21 Sep 2029 · 7:50pm", venue: "Gabba", round: "Preliminary Final 1", img: FINALS_IMG },
  { title: "Collingwood vs GWS GIANTS", date: "Sat 22 Sep 2029 · 4:35pm", venue: "MCG", round: "Preliminary Final 2", img: FINALS_IMG },
  { title: "AFL Grand Final 2029", date: "Sat 29 Sep 2029 · 2:30pm", venue: "MCG", round: "Grand Final", img: FINALS_IMG },
];

const ALL_FIXTURES = [
  ...generateSeason(2026, "2026-03-12"),
  ...generateSeason(2027, "2027-03-11"),
  ...generateSeason(2028, "2028-03-09"),
  ...generateSeason(2029, "2029-03-08"),
  ...FINALS_2026,
  ...FINALS_2027,
  ...FINALS_2028,
  ...FINALS_2029,
];

export const AFL_MATCHES = ALL_FIXTURES.map((m, i) => ({
  id: `local-afl-${i + 1}`,
  title: m.title,
  date: m.date,
  venue: m.venue,
  city: VENUE_LOCATIONS[m.venue]?.split(", ")[0] || "",
  image: m.img,
  local: true,
  round: m.round,
  localData: {
    event_name: m.title,
    event_date: m.date,
    venue_name: VENUE_LOCATIONS[m.venue] ? `${m.venue}, ${VENUE_LOCATIONS[m.venue]}` : m.venue,
    event_image_url: m.img,
    presenter: "AFL",
  },
}));

export const AFL_KEYWORDS = [
  "afl",
  "adelaide crows", "crows",
  "brisbane lions",
  "carlton",
  "collingwood",
  "essendon",
  "fremantle",
  "geelong",
  "gold coast suns",
  "gws", "giants", "greater western sydney",
  "hawthorn", "hawks",
  "north melbourne", "kangaroos",
  "port adelaide",
  "richmond",
  "st kilda",
  "sydney swans", "swans",
  "west coast eagles", "west coast",
  "western bulldogs", "bulldogs",
  "grand final",
];