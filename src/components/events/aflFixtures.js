/**
 * AFL Fixtures 2026-2029 — curated fixtures for the Ticketek AU app.
 * Each fixture has an appropriate event image based on its type:
 *   - Grand Final 2026: the official promotional graphic (Fremantle vs Brisbane)
 *   - Finals series: generic finals promotional image
 *   - Regular season: generic match promotional image
 */

const GRAND_FINAL_2026_IMG = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/acf18530e_IMG_7336.webp";
const FINALS_IMG = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/48b228ead_generated_image.png";
const REGULAR_IMG = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/6df120aa2_generated_image.png";

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
  "UTAS Stadium": "Launceston, TAS",
  "Corroboree Group Oval Manuka": "Canberra, ACT",
  "TIO Stadium": "Darwin, NT",
  "Mars Stadium": "Ballarat, VIC",
  "Riverway Stadium": "Townsville, QLD",
  "Cazaly's Stadium": "Cairns, QLD",
};

const FIXTURES = [
  // ===== 2026 SEASON =====
  // Round 1 (Opening Round, Mar 12-16)
  { title: "Carlton vs Richmond", date: "Thu 12 Mar 2026 · 7:30pm", venue: "MCG", round: "R1", img: REGULAR_IMG },
  { title: "Collingwood vs GWS GIANTS", date: "Fri 13 Mar 2026 · 7:40pm", venue: "MCG", round: "R1", img: REGULAR_IMG },
  { title: "Brisbane Lions vs Geelong Cats", date: "Sat 14 Mar 2026 · 4:35pm", venue: "Gabba", round: "R1", img: REGULAR_IMG },
  { title: "Gold Coast SUNS vs Essendon", date: "Sat 14 Mar 2026 · 7:30pm", venue: "People First Stadium", round: "R1", img: REGULAR_IMG },
  { title: "Western Bulldogs vs St Kilda", date: "Sun 15 Mar 2026 · 3:15pm", venue: "Marvel Stadium", round: "R1", img: REGULAR_IMG },
  { title: "Sydney Swans vs Fremantle", date: "Sun 15 Mar 2026 · 4:05pm", venue: "SCG", round: "R1", img: REGULAR_IMG },
  { title: "West Coast Eagles vs Adelaide Crows", date: "Mon 16 Mar 2026 · 6:10pm", venue: "Optus Stadium", round: "R1", img: REGULAR_IMG },
  // ANZAC Day Round (Apr 24-26)
  { title: "Collingwood vs Essendon", date: "Sat 25 Apr 2026 · 3:20pm", venue: "MCG", round: "R7", img: REGULAR_IMG },
  // Dreamtime at the G (May 29-31)
  { title: "Richmond vs Essendon", date: "Sat 30 May 2026 · 7:30pm", venue: "MCG", round: "R12", img: REGULAR_IMG },
  // Round 20 (Jul 22-28)
  { title: "Adelaide Crows vs Collingwood", date: "Thu 23 Jul 2026 · 7:30pm", venue: "Adelaide Oval", round: "R20", img: REGULAR_IMG },
  { title: "Melbourne vs Geelong Cats", date: "Fri 24 Jul 2026 · 7:40pm", venue: "MCG", round: "R20", img: REGULAR_IMG },
  { title: "Fremantle vs West Coast Eagles", date: "Fri 24 Jul 2026 · 8:10pm", venue: "Optus Stadium", round: "R20", img: REGULAR_IMG },
  { title: "Carlton vs Gold Coast SUNS", date: "Sat 25 Jul 2026 · 1:05pm", venue: "Marvel Stadium", round: "R20", img: REGULAR_IMG },
  { title: "Hawthorn vs Essendon", date: "Sat 25 Jul 2026 · 4:15pm", venue: "MCG", round: "R20", img: REGULAR_IMG },
  { title: "GWS GIANTS vs Sydney Swans", date: "Sat 25 Jul 2026 · 4:35pm", venue: "ENGIE Stadium", round: "R20", img: REGULAR_IMG },
  { title: "Western Bulldogs vs Richmond", date: "Sat 25 Jul 2026 · 7:40pm", venue: "Marvel Stadium", round: "R20", img: REGULAR_IMG },
  { title: "Brisbane Lions vs Port Adelaide", date: "Sun 26 Jul 2026 · 1:10pm", venue: "Gabba", round: "R20", img: REGULAR_IMG },
  { title: "North Melbourne vs St Kilda", date: "Sun 26 Jul 2026 · 3:15pm", venue: "Marvel Stadium", round: "R20", img: REGULAR_IMG },
  // Round 21
  { title: "Collingwood vs Geelong Cats", date: "Thu 30 Jul 2026 · 7:30pm", venue: "MCG", round: "R21", img: REGULAR_IMG },
  { title: "Fremantle vs Western Bulldogs", date: "Fri 31 Jul 2026 · 8:10pm", venue: "Optus Stadium", round: "R21", img: REGULAR_IMG },
  { title: "St Kilda vs Sydney Swans", date: "Sat 1 Aug 2026 · 1:05pm", venue: "Marvel Stadium", round: "R21", img: REGULAR_IMG },
  { title: "Hawthorn vs North Melbourne", date: "Sat 1 Aug 2026 · 1:35pm", venue: "UTAS Stadium", round: "R21", img: REGULAR_IMG },
  { title: "Port Adelaide vs GWS GIANTS", date: "Sat 1 Aug 2026 · 6:35pm", venue: "Adelaide Oval", round: "R21", img: REGULAR_IMG },
  { title: "Carlton vs Brisbane Lions", date: "Sat 1 Aug 2026 · 7:40pm", venue: "Marvel Stadium", round: "R21", img: REGULAR_IMG },
  { title: "Richmond vs West Coast Eagles", date: "Sun 2 Aug 2026 · 1:10pm", venue: "MCG", round: "R21", img: REGULAR_IMG },
  { title: "Gold Coast SUNS vs Melbourne", date: "Sun 2 Aug 2026 · 3:15pm", venue: "People First Stadium", round: "R21", img: REGULAR_IMG },
  { title: "Essendon vs Adelaide Crows", date: "Sun 2 Aug 2026 · 4:40pm", venue: "Marvel Stadium", round: "R21", img: REGULAR_IMG },
  // Round 22
  { title: "Western Bulldogs vs North Melbourne", date: "Thu 6 Aug 2026 · 7:30pm", venue: "Marvel Stadium", round: "R22", img: REGULAR_IMG },
  { title: "Brisbane Lions vs Hawthorn", date: "Fri 7 Aug 2026 · 7:40pm", venue: "Gabba", round: "R22", img: REGULAR_IMG },
  { title: "Melbourne vs Fremantle", date: "Sat 8 Aug 2026 · 1:15pm", venue: "MCG", round: "R22", img: REGULAR_IMG },
  { title: "Sydney Swans vs Port Adelaide", date: "Sat 8 Aug 2026 · 4:15pm", venue: "SCG", round: "R22", img: REGULAR_IMG },
  { title: "Geelong Cats vs Essendon", date: "Sat 8 Aug 2026 · 4:35pm", venue: "GMHBA Stadium", round: "R22", img: REGULAR_IMG },
  { title: "Adelaide Crows vs Richmond", date: "Sat 8 Aug 2026 · 7:35pm", venue: "Adelaide Oval", round: "R22", img: REGULAR_IMG },
  { title: "GWS GIANTS vs Gold Coast SUNS", date: "Sun 9 Aug 2026 · 1:10pm", venue: "Corroboree Group Oval Manuka", round: "R22", img: REGULAR_IMG },
  { title: "West Coast Eagles vs Collingwood", date: "Sun 9 Aug 2026 · 4:10pm", venue: "Optus Stadium", round: "R22", img: REGULAR_IMG },
  { title: "St Kilda vs Carlton", date: "Sun 9 Aug 2026 · 7:20pm", venue: "Marvel Stadium", round: "R22", img: REGULAR_IMG },
  // Round 23
  { title: "Hawthorn vs Collingwood", date: "Fri 14 Aug 2026 · 7:30pm", venue: "MCG", round: "R23", img: REGULAR_IMG },
  { title: "Brisbane Lions vs Gold Coast SUNS", date: "Sat 15 Aug 2026 · 1:45pm", venue: "Gabba", round: "R23", img: REGULAR_IMG },
  { title: "Richmond vs St Kilda", date: "Sat 15 Aug 2026 · 4:35pm", venue: "MCG", round: "R23", img: REGULAR_IMG },
  { title: "GWS GIANTS vs West Coast Eagles", date: "Sat 15 Aug 2026 · 7:30pm", venue: "ENGIE Stadium", round: "R23", img: REGULAR_IMG },
  { title: "North Melbourne vs Geelong Cats", date: "Sun 16 Aug 2026 · 1:10pm", venue: "Marvel Stadium", round: "R23", img: REGULAR_IMG },
  { title: "Essendon vs Sydney Swans", date: "Sun 16 Aug 2026 · 3:20pm", venue: "MCG", round: "R23", img: REGULAR_IMG },
  { title: "Western Bulldogs vs Carlton", date: "Sun 16 Aug 2026 · 4:40pm", venue: "Marvel Stadium", round: "R23", img: REGULAR_IMG },
  { title: "Port Adelaide vs Melbourne", date: "Sun 16 Aug 2026 · 7:40pm", venue: "Adelaide Oval", round: "R23", img: REGULAR_IMG },
  { title: "Fremantle vs Adelaide Crows", date: "Mon 17 Aug 2026 · 6:10pm", venue: "Optus Stadium", round: "R23", img: REGULAR_IMG },
  // Round 24
  { title: "Collingwood vs Brisbane Lions", date: "Fri 21 Aug 2026 · 7:30pm", venue: "MCG", round: "R24", img: REGULAR_IMG },
  { title: "Carlton vs Fremantle", date: "Sat 22 Aug 2026 · 1:45pm", venue: "Marvel Stadium", round: "R24", img: REGULAR_IMG },
  { title: "Geelong Cats vs Richmond", date: "Sat 22 Aug 2026 · 4:35pm", venue: "GMHBA Stadium", round: "R24", img: REGULAR_IMG },
  { title: "Adelaide Crows vs GWS GIANTS", date: "Sat 22 Aug 2026 · 7:30pm", venue: "Adelaide Oval", round: "R24", img: REGULAR_IMG },
  { title: "Sydney Swans vs North Melbourne", date: "Sun 23 Aug 2026 · 1:10pm", venue: "SCG", round: "R24", img: REGULAR_IMG },
  { title: "St Kilda vs Gold Coast SUNS", date: "Sun 23 Aug 2026 · 3:20pm", venue: "Marvel Stadium", round: "R24", img: REGULAR_IMG },
  { title: "Essendon vs Port Adelaide", date: "Sun 23 Aug 2026 · 4:40pm", venue: "Marvel Stadium", round: "R24", img: REGULAR_IMG },
  { title: "Melbourne vs Western Bulldogs", date: "Sun 23 Aug 2026 · 7:40pm", venue: "MCG", round: "R24", img: REGULAR_IMG },
  { title: "West Coast Eagles vs Hawthorn", date: "Mon 24 Aug 2026 · 6:10pm", venue: "Optus Stadium", round: "R24", img: REGULAR_IMG },
  // 2026 Finals Series — Week 1 (Qualifying & Elimination Finals, Sep 4-6)
  { title: "Fremantle vs Western Bulldogs", date: "Fri 4 Sep 2026 · 7:50pm", venue: "Optus Stadium", round: "Qualifying Final 1", img: FINALS_IMG },
  { title: "Brisbane Lions vs GWS GIANTS", date: "Sat 5 Sep 2026 · 4:35pm", venue: "Gabba", round: "Qualifying Final 2", img: FINALS_IMG },
  { title: "Collingwood vs Carlton", date: "Sat 5 Sep 2026 · 7:30pm", venue: "MCG", round: "Elimination Final 1", img: FINALS_IMG },
  { title: "Geelong Cats vs Sydney Swans", date: "Sun 6 Sep 2026 · 3:10pm", venue: "GMHBA Stadium", round: "Elimination Final 2", img: FINALS_IMG },
  // 2026 Finals Series — Week 2 (Semi Finals, Sep 11-12)
  { title: "Western Bulldogs vs GWS GIANTS", date: "Fri 11 Sep 2026 · 7:50pm", venue: "MCG", round: "Semi Final 1", img: FINALS_IMG },
  { title: "Collingwood vs Geelong Cats", date: "Sat 12 Sep 2026 · 7:30pm", venue: "MCG", round: "Semi Final 2", img: FINALS_IMG },
  // 2026 Finals Series — Week 3 (Preliminary Finals, Sep 18-19)
  { title: "Fremantle vs Collingwood", date: "Fri 18 Sep 2026 · 7:50pm", venue: "Optus Stadium", round: "Preliminary Final 1", img: FINALS_IMG },
  { title: "Brisbane Lions vs Geelong Cats", date: "Sat 19 Sep 2026 · 4:35pm", venue: "Gabba", round: "Preliminary Final 2", img: FINALS_IMG },
  // 2026 Grand Final
  { title: "Fremantle Dockers vs Brisbane Lions", date: "Sat 26 Sep 2026 · 2:30pm", venue: "MCG", round: "Grand Final", img: GRAND_FINAL_2026_IMG },

  // ===== 2027 SEASON =====
  // Round 1 (Opening Round, Mar 11-15)
  { title: "Richmond vs Carlton", date: "Thu 11 Mar 2027 · 7:30pm", venue: "MCG", round: "R1", img: REGULAR_IMG },
  { title: "Geelong Cats vs Collingwood", date: "Fri 12 Mar 2027 · 7:40pm", venue: "GMHBA Stadium", round: "R1", img: REGULAR_IMG },
  { title: "Brisbane Lions vs Sydney Swans", date: "Sat 13 Mar 2027 · 4:35pm", venue: "Gabba", round: "R1", img: REGULAR_IMG },
  { title: "Gold Coast SUNS vs North Melbourne", date: "Sat 13 Mar 2027 · 7:30pm", venue: "People First Stadium", round: "R1", img: REGULAR_IMG },
  { title: "Western Bulldogs vs Melbourne", date: "Sun 14 Mar 2027 · 3:15pm", venue: "Marvel Stadium", round: "R1", img: REGULAR_IMG },
  { title: "Fremantle vs West Coast Eagles", date: "Sun 14 Mar 2027 · 4:05pm", venue: "Optus Stadium", round: "R1", img: REGULAR_IMG },
  { title: "Essendon vs St Kilda", date: "Mon 15 Mar 2027 · 6:10pm", venue: "Marvel Stadium", round: "R1", img: REGULAR_IMG },
  // ANZAC Day 2027
  { title: "Collingwood vs Essendon", date: "Sun 25 Apr 2027 · 3:20pm", venue: "MCG", round: "R7", img: REGULAR_IMG },
  // Dreamtime 2027
  { title: "Richmond vs Essendon", date: "Sat 29 May 2027 · 7:30pm", venue: "MCG", round: "R12", img: REGULAR_IMG },
  // 2027 Finals — Week 1 (Sep 3-5)
  { title: "Brisbane Lions vs Fremantle", date: "Fri 3 Sep 2027 · 7:50pm", venue: "Gabba", round: "Qualifying Final 1", img: FINALS_IMG },
  { title: "Collingwood vs Geelong Cats", date: "Sat 4 Sep 2027 · 4:35pm", venue: "MCG", round: "Qualifying Final 2", img: FINALS_IMG },
  { title: "Melbourne vs GWS GIANTS", date: "Sat 4 Sep 2027 · 7:30pm", venue: "MCG", round: "Elimination Final 1", img: FINALS_IMG },
  { title: "Sydney Swans vs Western Bulldogs", date: "Sun 5 Sep 2027 · 3:10pm", venue: "SCG", round: "Elimination Final 2", img: FINALS_IMG },
  // 2027 Finals — Week 2 (Sep 10-11)
  { title: "Brisbane Lions vs Melbourne", date: "Fri 10 Sep 2027 · 7:50pm", venue: "Gabba", round: "Semi Final 1", img: FINALS_IMG },
  { title: "Collingwood vs Sydney Swans", date: "Sat 11 Sep 2027 · 7:30pm", venue: "MCG", round: "Semi Final 2", img: FINALS_IMG },
  // 2027 Finals — Week 3 (Sep 17-18)
  { title: "Fremantle vs Collingwood", date: "Fri 17 Sep 2027 · 7:50pm", venue: "Optus Stadium", round: "Preliminary Final 1", img: FINALS_IMG },
  { title: "Brisbane Lions vs Sydney Swans", date: "Sat 18 Sep 2027 · 4:35pm", venue: "Gabba", round: "Preliminary Final 2", img: FINALS_IMG },
  // 2027 Grand Final
  { title: "AFL Grand Final 2027", date: "Sat 25 Sep 2027 · 2:30pm", venue: "MCG", round: "Grand Final", img: FINALS_IMG },

  // ===== 2028 SEASON =====
  // Round 1 (Opening Round, Mar 9-13)
  { title: "Carlton vs Collingwood", date: "Thu 9 Mar 2028 · 7:30pm", venue: "MCG", round: "R1", img: REGULAR_IMG },
  { title: "Sydney Swans vs GWS GIANTS", date: "Fri 10 Mar 2028 · 7:40pm", venue: "SCG", round: "R1", img: REGULAR_IMG },
  { title: "Brisbane Lions vs Gold Coast SUNS", date: "Sat 11 Mar 2028 · 4:35pm", venue: "Gabba", round: "R1", img: REGULAR_IMG },
  { title: "Geelong Cats vs Richmond", date: "Sat 11 Mar 2028 · 7:30pm", venue: "GMHBA Stadium", round: "R1", img: REGULAR_IMG },
  { title: "Fremantle vs West Coast Eagles", date: "Sun 12 Mar 2028 · 3:15pm", venue: "Optus Stadium", round: "R1", img: REGULAR_IMG },
  { title: "Melbourne vs Essendon", date: "Sun 12 Mar 2028 · 4:05pm", venue: "MCG", round: "R1", img: REGULAR_IMG },
  { title: "Western Bulldogs vs St Kilda", date: "Mon 13 Mar 2028 · 6:10pm", venue: "Marvel Stadium", round: "R1", img: REGULAR_IMG },
  // ANZAC Day 2028
  { title: "Collingwood vs Essendon", date: "Tue 25 Apr 2028 · 3:20pm", venue: "MCG", round: "R7", img: REGULAR_IMG },
  // Dreamtime 2028
  { title: "Richmond vs Essendon", date: "Sat 27 May 2028 · 7:30pm", venue: "MCG", round: "R12", img: REGULAR_IMG },
  // 2028 Finals — Week 1 (Sep 1-3)
  { title: "Collingwood vs Brisbane Lions", date: "Fri 1 Sep 2028 · 7:50pm", venue: "MCG", round: "Qualifying Final 1", img: FINALS_IMG },
  { title: "Fremantle vs Geelong Cats", date: "Sat 2 Sep 2028 · 4:35pm", venue: "Optus Stadium", round: "Qualifying Final 2", img: FINALS_IMG },
  { title: "Melbourne vs GWS GIANTS", date: "Sat 2 Sep 2028 · 7:30pm", venue: "MCG", round: "Elimination Final 1", img: FINALS_IMG },
  { title: "Sydney Swans vs Carlton", date: "Sun 3 Sep 2028 · 3:10pm", venue: "SCG", round: "Elimination Final 2", img: FINALS_IMG },
  // 2028 Finals — Week 2 (Sep 8-9)
  { title: "Brisbane Lions vs Sydney Swans", date: "Fri 8 Sep 2028 · 7:50pm", venue: "Gabba", round: "Semi Final 1", img: FINALS_IMG },
  { title: "Fremantle vs Melbourne", date: "Sat 9 Sep 2028 · 7:30pm", venue: "Optus Stadium", round: "Semi Final 2", img: FINALS_IMG },
  // 2028 Finals — Week 3 (Sep 15-16)
  { title: "Collingwood vs Fremantle", date: "Fri 15 Sep 2028 · 7:50pm", venue: "MCG", round: "Preliminary Final 1", img: FINALS_IMG },
  { title: "Brisbane Lions vs Melbourne", date: "Sat 16 Sep 2028 · 4:35pm", venue: "Gabba", round: "Preliminary Final 2", img: FINALS_IMG },
  // 2028 Grand Final
  { title: "AFL Grand Final 2028", date: "Sat 23 Sep 2028 · 2:30pm", venue: "MCG", round: "Grand Final", img: FINALS_IMG },

  // ===== 2029 SEASON =====
  // Round 1 (Opening Round, Mar 8-12)
  { title: "Richmond vs Carlton", date: "Thu 8 Mar 2029 · 7:30pm", venue: "MCG", round: "R1", img: REGULAR_IMG },
  { title: "Brisbane Lions vs Geelong Cats", date: "Fri 9 Mar 2029 · 7:40pm", venue: "Gabba", round: "R1", img: REGULAR_IMG },
  { title: "Collingwood vs GWS GIANTS", date: "Sat 10 Mar 2029 · 4:35pm", venue: "MCG", round: "R1", img: REGULAR_IMG },
  { title: "Gold Coast SUNS vs Fremantle", date: "Sat 10 Mar 2029 · 7:30pm", venue: "People First Stadium", round: "R1", img: REGULAR_IMG },
  { title: "Sydney Swans vs Western Bulldogs", date: "Sun 11 Mar 2029 · 3:15pm", venue: "SCG", round: "R1", img: REGULAR_IMG },
  { title: "Melbourne vs St Kilda", date: "Sun 11 Mar 2029 · 4:05pm", venue: "MCG", round: "R1", img: REGULAR_IMG },
  { title: "West Coast Eagles vs Essendon", date: "Mon 12 Mar 2029 · 6:10pm", venue: "Optus Stadium", round: "R1", img: REGULAR_IMG },
  // ANZAC Day 2029
  { title: "Collingwood vs Essendon", date: "Wed 25 Apr 2029 · 3:20pm", venue: "MCG", round: "R7", img: REGULAR_IMG },
  // Dreamtime 2029
  { title: "Richmond vs Essendon", date: "Sat 26 May 2029 · 7:30pm", venue: "MCG", round: "R12", img: REGULAR_IMG },
  // 2029 Finals — Week 1 (Sep 7-9)
  { title: "Brisbane Lions vs Collingwood", date: "Fri 7 Sep 2029 · 7:50pm", venue: "Gabba", round: "Qualifying Final 1", img: FINALS_IMG },
  { title: "Fremantle vs Sydney Swans", date: "Sat 8 Sep 2029 · 4:35pm", venue: "Optus Stadium", round: "Qualifying Final 2", img: FINALS_IMG },
  { title: "Geelong Cats vs Melbourne", date: "Sat 8 Sep 2029 · 7:30pm", venue: "GMHBA Stadium", round: "Elimination Final 1", img: FINALS_IMG },
  { title: "GWS GIANTS vs Carlton", date: "Sun 9 Sep 2029 · 3:10pm", venue: "ENGIE Stadium", round: "Elimination Final 2", img: FINALS_IMG },
  // 2029 Finals — Week 2 (Sep 14-15)
  { title: "Collingwood vs Geelong Cats", date: "Fri 14 Sep 2029 · 7:50pm", venue: "MCG", round: "Semi Final 1", img: FINALS_IMG },
  { title: "Fremantle vs GWS GIANTS", date: "Sat 15 Sep 2029 · 7:30pm", venue: "Optus Stadium", round: "Semi Final 2", img: FINALS_IMG },
  // 2029 Finals — Week 3 (Sep 21-22)
  { title: "Brisbane Lions vs Fremantle", date: "Fri 21 Sep 2029 · 7:50pm", venue: "Gabba", round: "Preliminary Final 1", img: FINALS_IMG },
  { title: "Collingwood vs GWS GIANTS", date: "Sat 22 Sep 2029 · 4:35pm", venue: "MCG", round: "Preliminary Final 2", img: FINALS_IMG },
  // 2029 Grand Final
  { title: "AFL Grand Final 2029", date: "Sat 29 Sep 2029 · 2:30pm", venue: "MCG", round: "Grand Final", img: FINALS_IMG },
];

export const AFL_MATCHES = FIXTURES.map((m, i) => ({
  id: `local-afl-${i + 1}`,
  title: m.title,
  date: m.date,
  venue: m.venue,
  city: VENUE_LOCATIONS[m.venue]?.split(", ")[0] || "",
  image: m.img,
  local: true,
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