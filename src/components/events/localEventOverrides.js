/**
 * Local event overrides — when a search query matches a key here,
 * these results are returned instead of hitting the Ticketmaster API.
 * This does NOT alter or intercept the API itself; it's a pre-search
 * short-circuit for specific known events.
 */

import { getFormattedDbEvents, getNflOverride } from "./ticketekEventDatabase";

const OLIVIA_DEAN_IMAGE = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/2433af8ed_IMG_4074.jpeg";
const NOAH_KAHAN_IMAGE = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/47e6fd2a8_IMG_5079.jpeg";
const DANIEL_CAESAR_IMAGE = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/7da5b30fc_IMG_5611.jpeg";
const HILARY_DUFF_IMAGE = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/9f021eb3f_IMG_5974.jpeg";

export const LOCAL_EVENT_OVERRIDES = {
  "olivia dean": [
    {
      id: "local-olivia-dean-1",
      title: "Olivia Dean",
      date: "Mon 5 Oct 2026 · 6:00pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: OLIVIA_DEAN_IMAGE,
      local: true,
      localData: {
        event_name: "Olivia Dean",
        event_date: "Mon 5 Oct 2026 · 6:00pm",
        venue_name: "Rod Laver Arena, Melbourne, VIC",
        event_image_url: OLIVIA_DEAN_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-olivia-dean-2",
      title: "Olivia Dean",
      date: "Tue 6 Oct 2026 · 6:00pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: OLIVIA_DEAN_IMAGE,
      local: true,
      localData: {
        event_name: "Olivia Dean",
        event_date: "Tue 6 Oct 2026 · 6:00pm",
        venue_name: "Rod Laver Arena, Melbourne, VIC",
        event_image_url: OLIVIA_DEAN_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-olivia-dean-3",
      title: "Olivia Dean",
      date: "Fri 9 Oct 2026 · 7:00pm",
      venue: "Qudos Bank Arena",
      city: "Sydney Olympic Park",
      image: OLIVIA_DEAN_IMAGE,
      local: true,
      localData: {
        event_name: "Olivia Dean",
        event_date: "Fri 9 Oct 2026 · 7:00pm",
        venue_name: "Afterpay Arena, formerly known as Qudos Bank Arena, Sydney Olympic Park, NSW",
        event_image_url: OLIVIA_DEAN_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-olivia-dean-4",
      title: "Olivia Dean",
      date: "Sat 10 Oct 2026 · 7:00pm",
      venue: "Qudos Bank Arena",
      city: "Sydney Olympic Park",
      image: OLIVIA_DEAN_IMAGE,
      local: true,
      localData: {
        event_name: "Olivia Dean",
        event_date: "Sat 10 Oct 2026 · 7:00pm",
        venue_name: "Afterpay Arena, formerly known as Qudos Bank Arena, Sydney Olympic Park, NSW",
        event_image_url: OLIVIA_DEAN_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-olivia-dean-5",
      title: "Olivia Dean",
      date: "Tue 13 Oct 2026 · 7:30pm",
      venue: "Brisbane Entertainment Centre",
      city: "Brisbane",
      image: OLIVIA_DEAN_IMAGE,
      local: true,
      localData: {
        event_name: "Olivia Dean",
        event_date: "Tue 13 Oct 2026 · 7:30pm",
        venue_name: "Brisbane Entertainment Centre, Brisbane, QLD",
        event_image_url: OLIVIA_DEAN_IMAGE,
        presenter: "Frontier Touring",
      },
    },
  ],
  "noah kahan": [
    {
      id: "local-noah-kahan-1",
      title: "Noah Kahan",
      date: "Fri 25 Sep 2026 · 7:30pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: NOAH_KAHAN_IMAGE,
      local: true,
      localData: {
        event_name: "Noah Kahan",
        event_date: "Fri 25 Sep 2026 · 7:30pm",
        venue_name: "Rod Laver Arena, Melbourne, VIC",
        event_image_url: NOAH_KAHAN_IMAGE,
        presenter: "Live Nation",
      },
    },
    {
      id: "local-noah-kahan-2",
      title: "Noah Kahan",
      date: "Sat 26 Sep 2026 · 7:30pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: NOAH_KAHAN_IMAGE,
      local: true,
      localData: {
        event_name: "Noah Kahan",
        event_date: "Sat 26 Sep 2026 · 7:30pm",
        venue_name: "Rod Laver Arena, Melbourne, VIC",
        event_image_url: NOAH_KAHAN_IMAGE,
        presenter: "Live Nation",
      },
    },
    {
      id: "local-noah-kahan-3",
      title: "Noah Kahan",
      date: "Mon 28 Sep 2026 · 7:30pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: NOAH_KAHAN_IMAGE,
      local: true,
      localData: {
        event_name: "Noah Kahan",
        event_date: "Mon 28 Sep 2026 · 7:30pm",
        venue_name: "Rod Laver Arena, Melbourne, VIC",
        event_image_url: NOAH_KAHAN_IMAGE,
        presenter: "Live Nation",
      },
    },
    {
      id: "local-noah-kahan-4",
      title: "Noah Kahan",
      date: "Tue 29 Sep 2026 · 7:30pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: NOAH_KAHAN_IMAGE,
      local: true,
      localData: {
        event_name: "Noah Kahan",
        event_date: "Tue 29 Sep 2026 · 7:30pm",
        venue_name: "Rod Laver Arena, Melbourne, VIC",
        event_image_url: NOAH_KAHAN_IMAGE,
        presenter: "Live Nation",
      },
    },
    {
      id: "local-noah-kahan-5",
      title: "Noah Kahan",
      date: "Fri 2 Oct 2026 · 8:00pm",
      venue: "Qudos Bank Arena",
      city: "Sydney Olympic Park",
      image: NOAH_KAHAN_IMAGE,
      local: true,
      localData: {
        event_name: "Noah Kahan",
        event_date: "Fri 2 Oct 2026 · 8:00pm",
        venue_name: "Afterpay Arena, formerly known as Qudos Bank Arena, Sydney Olympic Park, NSW",
        event_image_url: NOAH_KAHAN_IMAGE,
        presenter: "Live Nation",
      },
    },
    {
      id: "local-noah-kahan-6",
      title: "Noah Kahan",
      date: "Sat 3 Oct 2026 · 8:00pm",
      venue: "Qudos Bank Arena",
      city: "Sydney Olympic Park",
      image: NOAH_KAHAN_IMAGE,
      local: true,
      localData: {
        event_name: "Noah Kahan",
        event_date: "Sat 3 Oct 2026 · 8:00pm",
        venue_name: "Afterpay Arena, formerly known as Qudos Bank Arena, Sydney Olympic Park, NSW",
        event_image_url: NOAH_KAHAN_IMAGE,
        presenter: "Live Nation",
      },
    },
    {
      id: "local-noah-kahan-7",
      title: "Noah Kahan",
      date: "Mon 5 Oct 2026 · 8:00pm",
      venue: "Qudos Bank Arena",
      city: "Sydney Olympic Park",
      image: NOAH_KAHAN_IMAGE,
      local: true,
      localData: {
        event_name: "Noah Kahan",
        event_date: "Mon 5 Oct 2026 · 8:00pm",
        venue_name: "Afterpay Arena, formerly known as Qudos Bank Arena, Sydney Olympic Park, NSW",
        event_image_url: NOAH_KAHAN_IMAGE,
        presenter: "Live Nation",
      },
    },
    {
      id: "local-noah-kahan-8",
      title: "Noah Kahan",
      date: "Tue 6 Oct 2026 · 8:00pm",
      venue: "Qudos Bank Arena",
      city: "Sydney Olympic Park",
      image: NOAH_KAHAN_IMAGE,
      local: true,
      localData: {
        event_name: "Noah Kahan",
        event_date: "Tue 6 Oct 2026 · 8:00pm",
        venue_name: "Afterpay Arena, formerly known as Qudos Bank Arena, Sydney Olympic Park, NSW",
        event_image_url: NOAH_KAHAN_IMAGE,
        presenter: "Live Nation",
      },
    },
  ],
  "hilary duff": [
    {
      id: "local-hilary-duff-1",
      title: "Hilary Duff",
      date: "Thu 22 Oct 2026 · 7:00pm",
      venue: "Brisbane Entertainment Centre",
      city: "Brisbane",
      image: HILARY_DUFF_IMAGE,
      local: true,
      localData: {
        event_name: "Hilary Duff",
        event_date: "Thu 22 Oct 2026 · 7:00pm",
        venue_name: "Brisbane Entertainment Centre, Brisbane, QLD",
        event_image_url: HILARY_DUFF_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-hilary-duff-2",
      title: "Hilary Duff",
      date: "Sat 24 Oct 2026 · 7:00pm",
      venue: "Afterpay Arena",
      city: "Sydney Olympic Park",
      image: HILARY_DUFF_IMAGE,
      local: true,
      localData: {
        event_name: "Hilary Duff",
        event_date: "Sat 24 Oct 2026 · 7:00pm",
        venue_name: "Afterpay Arena, Sydney Olympic Park, NSW",
        event_image_url: HILARY_DUFF_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-hilary-duff-3",
      title: "Hilary Duff",
      date: "Mon 26 Oct 2026 - Tue 27 Oct 2026 · 7:00pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: HILARY_DUFF_IMAGE,
      local: true,
      localData: {
        event_name: "Hilary Duff",
        event_date: "Mon 26 Oct 2026 - Tue 27 Oct 2026 · 7:00pm",
        venue_name: "Rod Laver Arena, Melbourne, VIC",
        event_image_url: HILARY_DUFF_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-hilary-duff-4",
      title: "Hilary Duff",
      date: "Thu 29 Oct 2026 · 7:00pm",
      venue: "RAC Arena",
      city: "Perth",
      image: HILARY_DUFF_IMAGE,
      local: true,
      localData: {
        event_name: "Hilary Duff",
        event_date: "Thu 29 Oct 2026 · 7:00pm",
        venue_name: "RAC Arena, Perth, WA",
        event_image_url: HILARY_DUFF_IMAGE,
        presenter: "Frontier Touring",
      },
    },
  ],
  "daniel caesar": [
    {
      id: "local-daniel-caesar-1",
      title: "Daniel Caesar",
      date: "Sun 8 Nov 2026 · 7:00pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: DANIEL_CAESAR_IMAGE,
      local: true,
      localData: {
        event_name: "Daniel Caesar",
        event_date: "Sun 8 Nov 2026 · 7:00pm",
        venue_name: "Rod Laver Arena, Melbourne, VIC",
        event_image_url: DANIEL_CAESAR_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-daniel-caesar-2",
      title: "Daniel Caesar",
      date: "Mon 9 Nov 2026 · 7:00pm",
      venue: "Rod Laver Arena",
      city: "Melbourne",
      image: DANIEL_CAESAR_IMAGE,
      local: true,
      localData: {
        event_name: "Daniel Caesar",
        event_date: "Mon 9 Nov 2026 · 7:00pm",
        venue_name: "Rod Laver Arena, Melbourne, VIC",
        event_image_url: DANIEL_CAESAR_IMAGE,
        presenter: "Frontier Touring",
      },
    },
    {
      id: "local-daniel-caesar-3",
      title: "Daniel Caesar",
      date: "Thu 12 Nov 2026 · 8:00pm",
      venue: "Brisbane Entertainment Centre",
      city: "Brisbane",
      image: DANIEL_CAESAR_IMAGE,
      local: true,
      localData: {
        event_name: "Daniel Caesar",
        event_date: "Thu 12 Nov 2026 · 8:00pm",
        venue_name: "Brisbane Entertainment Centre, Brisbane, QLD",
        event_image_url: DANIEL_CAESAR_IMAGE,
        presenter: "Frontier Touring",
      },
    },
  ],
};

const AFL_IMAGE = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/613509fc3_2897687f-18c4-4991-a03c-ad72aab84a66.jpg";

// 2026 AFL premiership season — upcoming matches (Rounds 20-24)
const AFL_FIXTURES = [
  // Round 20 (Jul 22-28)
  { title: "Adelaide Crows vs Collingwood", date: "Thu 23 Jul 2026 · 7:30pm", venue: "Adelaide Oval" },
  { title: "Melbourne vs Geelong Cats", date: "Fri 24 Jul 2026 7:40pm", venue: "MCG" },
  { title: "Fremantle vs West Coast Eagles", date: "Fri 24 Jul 2026 8:10pm", venue: "Optus Stadium" },
  { title: "Carlton vs Gold Coast SUNS", date: "Sat 25 Jul 2026 1:05pm", venue: "Marvel Stadium" },
  { title: "Hawthorn vs Essendon", date: "Sat 25 Jul 2026 4:15pm", venue: "MCG" },
  { title: "GWS GIANTS vs Sydney Swans", date: "Sat 25 Jul 2026 4:35pm", venue: "ENGIE Stadium" },
  { title: "Western Bulldogs vs Richmond", date: "Sat 25 Jul 2026 7:40pm", venue: "Marvel Stadium" },
  { title: "Brisbane Lions vs Port Adelaide", date: "Sun 26 Jul 2026 1:10pm", venue: "Gabba" },
  { title: "North Melbourne vs St Kilda", date: "Sun 26 Jul 2026 3:15pm", venue: "Marvel Stadium" },
  // Round 21 (Jul 29-Aug 4)
  { title: "Collingwood vs Geelong Cats", date: "Thu 30 Jul 2026 · 7:30pm", venue: "MCG" },
  { title: "Fremantle vs Western Bulldogs", date: "Fri 31 Jul 2026 8:10pm", venue: "Optus Stadium" },
  { title: "St Kilda vs Sydney Swans", date: "Sat 1 Aug 2026 1:05pm", venue: "Marvel Stadium" },
  { title: "Hawthorn vs North Melbourne", date: "Sat 1 Aug 2026 1:35pm", venue: "UTAS Stadium" },
  { title: "Port Adelaide vs GWS GIANTS", date: "Sat 1 Aug 2026 6:35pm", venue: "Adelaide Oval" },
  { title: "Carlton vs Brisbane Lions", date: "Sat 1 Aug 2026 7:40pm", venue: "Marvel Stadium" },
  { title: "Richmond vs West Coast Eagles", date: "Sun 2 Aug 2026 1:10pm", venue: "MCG" },
  { title: "Gold Coast SUNS vs Melbourne", date: "Sun 2 Aug 2026 3:15pm", venue: "People First Stadium" },
  { title: "Essendon vs Adelaide Crows", date: "Sun 2 Aug 2026 4:40pm", venue: "Marvel Stadium" },
  // Round 22 (Aug 5-11)
  { title: "Western Bulldogs vs North Melbourne", date: "Thu 6 Aug 2026 · 7:30pm", venue: "Marvel Stadium" },
  { title: "Brisbane Lions vs Hawthorn", date: "Fri 7 Aug 2026 7:40pm", venue: "Gabba" },
  { title: "Melbourne vs Fremantle", date: "Sat 8 Aug 2026 1:15pm", venue: "MCG" },
  { title: "Sydney Swans vs Port Adelaide", date: "Sat 8 Aug 2026 4:15pm", venue: "SCG" },
  { title: "Geelong Cats vs Essendon", date: "Sat 8 Aug 2026 4:35pm", venue: "GMHBA Stadium" },
  { title: "Adelaide Crows vs Richmond", date: "Sat 8 Aug 2026 7:35pm", venue: "Adelaide Oval" },
  { title: "GWS GIANTS vs Gold Coast SUNS", date: "Sun 9 Aug 2026 1:10pm", venue: "Corroboree Group Oval Manuka" },
  { title: "West Coast Eagles vs Collingwood", date: "Sun 9 Aug 2026 4:10pm", venue: "Optus Stadium" },
  { title: "St Kilda vs Carlton", date: "Sun 9 Aug 2026 7:20pm", venue: "Marvel Stadium" },
  // Round 23 (Aug 12-18, dates TBC)
  { title: "Hawthorn vs Collingwood", date: "Fri 14 Aug 2026 · 7:30pm", venue: "MCG" },
  { title: "Brisbane Lions vs Gold Coast SUNS", date: "Sat 15 Aug 2026 1:45pm", venue: "Gabba" },
  { title: "Richmond vs St Kilda", date: "Sat 15 Aug 2026 4:35pm", venue: "MCG" },
  { title: "GWS GIANTS vs West Coast Eagles", date: "Sat 15 Aug 2026 · 7:30pm", venue: "ENGIE Stadium" },
  { title: "North Melbourne vs Geelong Cats", date: "Sun 16 Aug 2026 1:10pm", venue: "Marvel Stadium" },
  { title: "Essendon vs Sydney Swans", date: "Sun 16 Aug 2026 3:20pm", venue: "MCG" },
  { title: "Western Bulldogs vs Carlton", date: "Sun 16 Aug 2026 4:40pm", venue: "Marvel Stadium" },
  { title: "Port Adelaide vs Melbourne", date: "Sun 16 Aug 2026 7:40pm", venue: "Adelaide Oval" },
  { title: "Fremantle vs Adelaide Crows", date: "Mon 17 Aug 2026 6:10pm", venue: "Optus Stadium" },
  // Round 24 (Aug 19-25, dates TBC)
  { title: "Collingwood vs Brisbane Lions", date: "Fri 21 Aug 2026 · 7:30pm", venue: "MCG" },
  { title: "Carlton vs Fremantle", date: "Sat 22 Aug 2026 1:45pm", venue: "Marvel Stadium" },
  { title: "Geelong Cats vs Richmond", date: "Sat 22 Aug 2026 4:35pm", venue: "GMHBA Stadium" },
  { title: "Adelaide Crows vs GWS GIANTS", date: "Sat 22 Aug 2026 · 7:30pm", venue: "Adelaide Oval" },
  { title: "Sydney Swans vs North Melbourne", date: "Sun 23 Aug 2026 1:10pm", venue: "SCG" },
  { title: "St Kilda vs Gold Coast SUNS", date: "Sun 23 Aug 2026 3:20pm", venue: "Marvel Stadium" },
  { title: "Essendon vs Port Adelaide", date: "Sun 23 Aug 2026 4:40pm", venue: "Marvel Stadium" },
  { title: "Melbourne vs Western Bulldogs", date: "Sun 23 Aug 2026 7:40pm", venue: "MCG" },
  { title: "West Coast Eagles vs Hawthorn", date: "Mon 24 Aug 2026 6:10pm", venue: "Optus Stadium" },
];

const AFL_VENUE_LOCATIONS = {
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
};

export const AFL_MATCHES = AFL_FIXTURES.map((m, i) => ({
  id: `local-afl-${i + 1}`,
  title: m.title,
  date: m.date,
  venue: m.venue,
  city: AFL_VENUE_LOCATIONS[m.venue]?.split(", ")[0] || "",
  image: AFL_IMAGE,
  local: true,
  localData: {
    event_name: m.title,
    event_date: m.date,
    venue_name: AFL_VENUE_LOCATIONS[m.venue] ? `${m.venue}, ${AFL_VENUE_LOCATIONS[m.venue]}` : m.venue,
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
];

const TK_CDN = "https://d35kvm5iuwjt9t.cloudfront.net/dbimages";

// Upcoming Ticketek events with exact artwork — surfaced via local search override
const TICKETEK_LOCAL_EVENTS = [
  { title: "Bobby Lee", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx359424.jpg`, keys: ["bobby lee"] },
  { title: "Max Amini", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx361065.jpg`, keys: ["max amini"] },
  { title: "PAW Patrol Live! Race to the Rescue", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx358366.jpg`, keys: ["paw patrol"] },
  { title: "Karan Aujla — P-Pop Culture World Tour", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362309.jpg`, keys: ["karan aujla", "p-pop"] },
  { title: "Urzila Carlson — Fatty On A Yacht", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx349660.jpg`, keys: ["urzila carlson", "fatty on a yacht"] },
  { title: "Happy Mondays — 35th Anniversary of Pils N Thrills and Bellyaches", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx355093.jpg`, keys: ["happy mondays"] },
  { title: "The Wiggles — The Wiggles Sparkle! Big Show", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362844.jpg`, keys: ["wiggles"] },
  { title: "Bassem Youssef", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362765.jpg`, keys: ["bassem youssef"] },
  { title: "Electric Callboy", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx349187.jpg`, keys: ["electric callboy"] },
  { title: "Jason Derulo", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx359476.jpg`, keys: ["jason derulo"] },
  { title: "ECLIPSE", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx357072.jpg`, keys: ["eclipse"] },
  { title: "Shinedown & Bush", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx357495.jpg`, keys: ["shinedown"] },
  { title: "Macy Gray", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx361853.jpg`, keys: ["macy gray"] },
  { title: "Burn The Floor", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx360206.jpg`, keys: ["burn the floor"] },
  { title: "Conan Gray", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx349281.jpg`, keys: ["conan gray"] },
  { title: "Olivia Rodrigo (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx261004.jpg`, keys: ["olivia rodrigo"] },
  { title: "Matchbox Twenty (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx294667.jpg`, keys: ["matchbox twenty", "matchbox 20"] },
  { title: "Netball World Cup Sydney 2027 (Waitlist)", date: "", venue: "Sydney, Australia", image: `${TK_CDN}/sfx362771.png`, keys: ["netball world cup"] },
  { title: "Kylie Minogue (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx298005.jpg`, keys: ["kylie minogue"] },
  { title: "Charli XCX (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx312407.jpg`, keys: ["charli xcx"] },
  { title: "Ashanti", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx361769.jpg`, keys: ["ashanti"] },
  { title: "The Return of Secret Garden", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362278.jpg`, keys: ["secret garden"] },
  { title: "Khalid", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx358455.jpg`, keys: ["khalid"] },
  { title: "Iron Maiden", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx357159.jpg`, keys: ["iron maiden"] },
  { title: "Anthony Callea", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362650.jpg`, keys: ["anthony callea"] },
  { title: "\"Time\" & \"The Chain\" Tributes — Music of Pink Floyd and Fleetwood Mac", date: "Sat 28 Nov 2026", venue: "Astor Theatre, Mount Lawley, WA", image: `${TK_CDN}/sfx364073.jpg`, keys: ["pink floyd", "fleetwood mac", "the chain tributes"] },
  { title: "2026 Schools Spectacular \"Original\"", date: "Fri 27 Nov 2026 to Sat 28 Nov 2026", venue: "Afterpay Arena, NSW", image: `${TK_CDN}/sfx362658.jpg`, keys: ["schools spectacular"] },
  { title: "2026 STAYC Fan Concert Tour — [STAY CLOSER] in Australia", date: "Wed 14 Oct 2026", venue: "Riverside Theatre, Perth, WA", image: `${TK_CDN}/sfx363341.jpg`, keys: ["stayc"] },
  { title: "5 Seconds of Summer — Everyone's A Star! World Tour", date: "Wed 04 Nov 2026", venue: "Adelaide Entertainment Centre, SA", image: `${TK_CDN}/sfx349290.jpg`, keys: ["5 seconds of summer", "5sos"] },
  { title: "50 Years of Ilaiyaraaja — Live In Concert", date: "Thu 24 Sep 2026", venue: "Riverside Theatre, Perth, WA", image: `${TK_CDN}/sfx364455.jpg`, keys: ["ilaiyaraaja"] },
  { title: "80s Movie Hits — Performed by VHS Pirates", date: "Sat 19 Sep 2026", venue: "Astor Theatre, Mount Lawley, WA", image: `${TK_CDN}/sfx361045.jpg`, keys: ["80s movie hits", "vhs pirates"] },
  { title: "A Night at the Ballet", date: "Fri 24 Jul 2026 to Sat 25 Jul 2026", venue: "Festival Theatre, Adelaide, SA", image: `${TK_CDN}/sfx359360.png`, keys: ["a night at the ballet", "night at the ballet"] },
  { title: "State Opera South Australia 2026", date: "", venue: "Adelaide, SA", image: `${TK_CDN}/sfx349931.jpg`, keys: ["state opera south australia", "state opera"] },
  { title: "Lightscape Perth", date: "", venue: "Perth, WA", image: `${TK_CDN}/sfx335026.jpg`, keys: ["lightscape perth", "lightscape"] },
  { title: "Lightscape Melbourne 2026", date: "", venue: "Royal Botanic Gardens Melbourne, VIC", image: `${TK_CDN}/sfx309478.jpg`, keys: ["lightscape melbourne", "lightscape"] },
  { title: "Forever K-Pop — A Celebration Concert", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx360913.jpg`, keys: ["forever k-pop", "forever kpop"] },
  { title: "Circus Rio — Gympie Lighthorse Oval", date: "Thu 23 Jul 2026 to Sun 26 Jul 2026", venue: "Gympie Lighthorse Oval, QLD", image: `${TK_CDN}/sfx264605.jpg`, keys: ["circus rio"] },
  { title: "Come Alive! — The Greatest Showman Circus Spectacular", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx351235.jpg`, keys: ["come alive", "greatest showman"] },
  { title: "Summer of Cricket", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx361048.jpg`, keys: ["summer of cricket"] },
  { title: "Dabble Darts ANZ Premier League", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362076.jpg`, keys: ["dabble darts"] },
  { title: "Repco Supercars Championship", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx317197.jpg`, keys: ["supercars", "repco supercars"] },
  { title: "Chelsea F.C. vs Tottenham Hotspur", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx354131.jpg`, keys: ["chelsea v tottenham", "chelsea vs tottenham", "chelsea f.c", "tottenham hotspur"] },
  { title: "2026 BMW Australian PGA Championship", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx359696.jpg`, keys: ["pga championship", "bmw australian pga"] },
  { title: "2026 Boost Mobile Gold Coast 500 Grandstand", date: "Fri 23 - Sun 25 Oct 2026", venue: "Surfers Paradise Beach, QLD", image: `${TK_CDN}/sfx352161.jpg`, keys: ["gold coast 500", "gold coast grandstand"] },
  { title: "2026 Capital.com Australian Open", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx361173.jpg`, keys: ["australian open", "capital.com australian open"] },
  { title: "2026 Australian Short Course Champs", date: "Tue 29 Sep - Fri 02 Oct 2026", venue: "Aquatic Centre, Sydney Olympic Park, NSW", image: `${TK_CDN}/sfx363619.jpg`, keys: ["short course champs", "australian short course"] },
  { title: "Adelaide United v Công an Hà Nội FC — AFC Champions League Elite", date: "Tue 11 Aug 2026", venue: "Coopers Stadium, Hindmarsh, SA", image: `${TK_CDN}/sfx364359.png`, keys: ["adelaide united", "cong an ha noi"] },
];

const TK_LOCAL_FORMATTED = [...TICKETEK_LOCAL_EVENTS, ...getFormattedDbEvents()].map((m, i) => ({
  id: `local-tk-${i + 1}`,
  title: m.title,
  date: m.date,
  venue: m.venue,
  city: "",
  image: m.image,
  local: true,
  keys: m.keys,
  localData: {
    event_name: m.title,
    event_date: m.date,
    venue_name: m.venue,
    event_image_url: m.image,
    presenter: "Ticketek",
  },
}));

/**
 * Returns local override events if the query matches, otherwise null.
 */
export function getLocalOverride(query) {
  const normalized = query.trim().toLowerCase();
  // NFL Melbourne Game
  const nflResult = getNflOverride(query);
  if (nflResult) return nflResult;
  for (const [key, events] of Object.entries(LOCAL_EVENT_OVERRIDES)) {
    if (normalized.includes(key)) return events;
  }
  // AFL — return the full upcoming match list when "afl" or any team name is searched
  if (AFL_KEYWORDS.some(k => normalized.includes(k))) {
    return AFL_MATCHES;
  }
  // Ticketek events — return all events whose search keys match the query
  const matched = TK_LOCAL_FORMATTED.filter(ev => ev.keys.some(k => normalized.includes(k)));
  if (matched.length) return matched;
  return null;
}