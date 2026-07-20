/**
 * Local event overrides — when a search query matches a key here,
 * these results are returned instead of hitting the Ticketmaster API.
 * This does NOT alter or intercept the API itself; it's a pre-search
 * short-circuit for specific known events.
 */

const OLIVIA_DEAN_IMAGE = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/2433af8ed_IMG_4074.jpeg";

export const LOCAL_EVENT_OVERRIDES = {
  "olivia dean": [
    {
      id: "local-olivia-dean-1",
      title: "Olivia Dean",
      date: "Mon 5 Oct 2026 6:00pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: OLIVIA_DEAN_IMAGE,
      local: true,
      localData: {
        event_name: "Olivia Dean",
        event_date: "Mon 5 Oct 2026 6:00pm",
        venue_name: "Rod Laver Arena",
        event_image_url: OLIVIA_DEAN_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-olivia-dean-2",
      title: "Olivia Dean",
      date: "Tue 6 Oct 2026 6:00pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: OLIVIA_DEAN_IMAGE,
      local: true,
      localData: {
        event_name: "Olivia Dean",
        event_date: "Tue 6 Oct 2026 6:00pm",
        venue_name: "Rod Laver Arena",
        event_image_url: OLIVIA_DEAN_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-olivia-dean-3",
      title: "Olivia Dean",
      date: "Fri 9 Oct 2026 7:00pm",
      venue: "Qudos Bank Arena",
      city: "Sydney Olympic Park",
      image: OLIVIA_DEAN_IMAGE,
      local: true,
      localData: {
        event_name: "Olivia Dean",
        event_date: "Fri 9 Oct 2026 7:00pm",
        venue_name: "Qudos Bank Arena",
        event_image_url: OLIVIA_DEAN_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-olivia-dean-4",
      title: "Olivia Dean",
      date: "Sat 10 Oct 2026 7:00pm",
      venue: "Qudos Bank Arena",
      city: "Sydney Olympic Park",
      image: OLIVIA_DEAN_IMAGE,
      local: true,
      localData: {
        event_name: "Olivia Dean",
        event_date: "Sat 10 Oct 2026 7:00pm",
        venue_name: "Qudos Bank Arena",
        event_image_url: OLIVIA_DEAN_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-olivia-dean-5",
      title: "Olivia Dean",
      date: "Tue 13 Oct 2026 7:30pm",
      venue: "Brisbane Entertainment Centre",
      city: "Brisbane",
      image: OLIVIA_DEAN_IMAGE,
      local: true,
      localData: {
        event_name: "Olivia Dean",
        event_date: "Tue 13 Oct 2026 7:30pm",
        venue_name: "Brisbane Entertainment Centre",
        event_image_url: OLIVIA_DEAN_IMAGE,
        presenter: "Frontier Touring",
      },
    },
  ],
};

const AFL_IMAGE = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/613509fc3_2897687f-18c4-4991-a03c-ad72aab84a66.jpg";

// 2026 AFL premiership season — upcoming matches (Rounds 20-24)
const AFL_FIXTURES = [
  // Round 20 (Jul 22-28)
  { title: "Adelaide Crows vs Collingwood", date: "Thu 23 Jul 2026 7:30pm", venue: "Adelaide Oval" },
  { title: "Melbourne vs Geelong Cats", date: "Fri 24 Jul 2026 7:40pm", venue: "MCG" },
  { title: "Fremantle vs West Coast Eagles", date: "Fri 24 Jul 2026 8:10pm", venue: "Optus Stadium" },
  { title: "Carlton vs Gold Coast SUNS", date: "Sat 25 Jul 2026 1:05pm", venue: "Marvel Stadium" },
  { title: "Hawthorn vs Essendon", date: "Sat 25 Jul 2026 4:15pm", venue: "MCG" },
  { title: "GWS GIANTS vs Sydney Swans", date: "Sat 25 Jul 2026 4:35pm", venue: "ENGIE Stadium" },
  { title: "Western Bulldogs vs Richmond", date: "Sat 25 Jul 2026 7:40pm", venue: "Marvel Stadium" },
  { title: "Brisbane Lions vs Port Adelaide", date: "Sun 26 Jul 2026 1:10pm", venue: "Gabba" },
  { title: "North Melbourne vs St Kilda", date: "Sun 26 Jul 2026 3:15pm", venue: "Marvel Stadium" },
  // Round 21 (Jul 29-Aug 4)
  { title: "Collingwood vs Geelong Cats", date: "Thu 30 Jul 2026 7:30pm", venue: "MCG" },
  { title: "Fremantle vs Western Bulldogs", date: "Fri 31 Jul 2026 8:10pm", venue: "Optus Stadium" },
  { title: "St Kilda vs Sydney Swans", date: "Sat 1 Aug 2026 1:05pm", venue: "Marvel Stadium" },
  { title: "Hawthorn vs North Melbourne", date: "Sat 1 Aug 2026 1:35pm", venue: "UTAS Stadium" },
  { title: "Port Adelaide vs GWS GIANTS", date: "Sat 1 Aug 2026 6:35pm", venue: "Adelaide Oval" },
  { title: "Carlton vs Brisbane Lions", date: "Sat 1 Aug 2026 7:40pm", venue: "Marvel Stadium" },
  { title: "Richmond vs West Coast Eagles", date: "Sun 2 Aug 2026 1:10pm", venue: "MCG" },
  { title: "Gold Coast SUNS vs Melbourne", date: "Sun 2 Aug 2026 3:15pm", venue: "People First Stadium" },
  { title: "Essendon vs Adelaide Crows", date: "Sun 2 Aug 2026 4:40pm", venue: "Marvel Stadium" },
  // Round 22 (Aug 5-11)
  { title: "Western Bulldogs vs North Melbourne", date: "Thu 6 Aug 2026 7:30pm", venue: "Marvel Stadium" },
  { title: "Brisbane Lions vs Hawthorn", date: "Fri 7 Aug 2026 7:40pm", venue: "Gabba" },
  { title: "Melbourne vs Fremantle", date: "Sat 8 Aug 2026 1:15pm", venue: "MCG" },
  { title: "Sydney Swans vs Port Adelaide", date: "Sat 8 Aug 2026 4:15pm", venue: "SCG" },
  { title: "Geelong Cats vs Essendon", date: "Sat 8 Aug 2026 4:35pm", venue: "GMHBA Stadium" },
  { title: "Adelaide Crows vs Richmond", date: "Sat 8 Aug 2026 7:35pm", venue: "Adelaide Oval" },
  { title: "GWS GIANTS vs Gold Coast SUNS", date: "Sun 9 Aug 2026 1:10pm", venue: "Corroboree Group Oval Manuka" },
  { title: "West Coast Eagles vs Collingwood", date: "Sun 9 Aug 2026 4:10pm", venue: "Optus Stadium" },
  { title: "St Kilda vs Carlton", date: "Sun 9 Aug 2026 7:20pm", venue: "Marvel Stadium" },
  // Round 23 (Aug 12-18, dates TBC)
  { title: "Hawthorn vs Collingwood", date: "Fri 14 Aug 2026 7:30pm", venue: "MCG" },
  { title: "Brisbane Lions vs Gold Coast SUNS", date: "Sat 15 Aug 2026 1:45pm", venue: "Gabba" },
  { title: "Richmond vs St Kilda", date: "Sat 15 Aug 2026 4:35pm", venue: "MCG" },
  { title: "GWS GIANTS vs West Coast Eagles", date: "Sat 15 Aug 2026 7:30pm", venue: "ENGIE Stadium" },
  { title: "North Melbourne vs Geelong Cats", date: "Sun 16 Aug 2026 1:10pm", venue: "Marvel Stadium" },
  { title: "Essendon vs Sydney Swans", date: "Sun 16 Aug 2026 3:20pm", venue: "MCG" },
  { title: "Western Bulldogs vs Carlton", date: "Sun 16 Aug 2026 4:40pm", venue: "Marvel Stadium" },
  { title: "Port Adelaide vs Melbourne", date: "Sun 16 Aug 2026 7:40pm", venue: "Adelaide Oval" },
  { title: "Fremantle vs Adelaide Crows", date: "Mon 17 Aug 2026 6:10pm", venue: "Optus Stadium" },
  // Round 24 (Aug 19-25, dates TBC)
  { title: "Collingwood vs Brisbane Lions", date: "Fri 21 Aug 2026 7:30pm", venue: "MCG" },
  { title: "Carlton vs Fremantle", date: "Sat 22 Aug 2026 1:45pm", venue: "Marvel Stadium" },
  { title: "Geelong Cats vs Richmond", date: "Sat 22 Aug 2026 4:35pm", venue: "GMHBA Stadium" },
  { title: "Adelaide Crows vs GWS GIANTS", date: "Sat 22 Aug 2026 7:30pm", venue: "Adelaide Oval" },
  { title: "Sydney Swans vs North Melbourne", date: "Sun 23 Aug 2026 1:10pm", venue: "SCG" },
  { title: "St Kilda vs Gold Coast SUNS", date: "Sun 23 Aug 2026 3:20pm", venue: "Marvel Stadium" },
  { title: "Essendon vs Port Adelaide", date: "Sun 23 Aug 2026 4:40pm", venue: "Marvel Stadium" },
  { title: "Melbourne vs Western Bulldogs", date: "Sun 23 Aug 2026 7:40pm", venue: "MCG" },
  { title: "West Coast Eagles vs Hawthorn", date: "Mon 24 Aug 2026 6:10pm", venue: "Optus Stadium" },
];

export const AFL_MATCHES = AFL_FIXTURES.map((m, i) => ({
  id: `local-afl-${i + 1}`,
  title: m.title,
  date: m.date,
  venue: m.venue,
  city: "",
  image: AFL_IMAGE,
  local: true,
  localData: {
    event_name: m.title,
    event_date: m.date,
    venue_name: m.venue,
    event_image_url: AFL_IMAGE,
    presenter: "AFL",
  },
}));

// Search terms that should surface the AFL match drop list
const AFL_KEYWORDS = [
  "afl",
  "adelaide crows", "crows",
  "brisbane lions",
  "carlton",
  "collingwood",
  "essendon",
  "fremantle",
  "geelong",
  "gold coast suns", "gold coast",
  "gws", "giants", "greater western sydney",
  "hawthorn", "hawks",
  "north melbourne", "kangaroos",
  "port adelaide",
  "richmond",
  "st kilda",
  "sydney swans", "swans",
  "west coast eagles", "west coast",
  "western bulldogs", "bulldogs",
];

/**
 * Returns local override events if the query matches, otherwise null.
 */
export function getLocalOverride(query) {
  const normalized = query.trim().toLowerCase();
  for (const [key, events] of Object.entries(LOCAL_EVENT_OVERRIDES)) {
    if (normalized.includes(key)) return events;
  }
  // AFL — return the full upcoming match list when "afl" or any team name is searched
  if (AFL_KEYWORDS.some(k => normalized.includes(k))) {
    return AFL_MATCHES;
  }
  return null;
}