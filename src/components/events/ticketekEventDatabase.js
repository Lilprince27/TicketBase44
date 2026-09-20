/**
 * Ticketek Event Database — comprehensive list of events from 2026-2029
 * sourced from ticketek.com.au across Concerts, Sports, Theatre & Arts,
 * Family, and Comedy categories.
 *
 * Each entry has search `keys` so users can type the event name and see it
 * appear in the local override search results.
 */

const TK_CDN = "https://d35kvm5iuwjt9t.cloudfront.net/dbimages";

const NFL_IMAGE = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/5ed786cdc_IMG_7301.jpeg";

export const NFL_MELBOURNE_GAME = {
  id: "local-nfl-melbourne-1",
  title: "Los Angeles Rams v San Francisco 49ers",
  date: "Fri 11 Sep 2026 · 10:35am",
  venue: "Melbourne Cricket Ground (MCG)",
  city: "Jolimont",
  image: NFL_IMAGE,
  local: true,
  keys: ["nfl", "los angeles rams", "san francisco 49ers", "49ers", "rams v 49ers", "melbourne game", "nfl melbourne", "rams vs 49ers"],
  localData: {
    event_name: "Los Angeles Rams v San Francisco 49ers",
    event_date: "Fri 11 Sep 2026 · 10:35am",
    venue_name: "Melbourne Cricket Ground (MCG), Jolimont, VIC",
    event_image_url: NFL_IMAGE,
    presenter: "NFL",
  },
};

export const TICKETEK_DB_EVENTS = [
  // === CONCERTS ===
  { title: "Radiohead", subtitle: "Australia 2027", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx367540.jpg`, keys: ["radiohead"] },
  { title: "Queens Of The Stone Age", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx364312.jpg`, keys: ["queens of the stone age", "qotsa"] },
  { title: "Bryson Tiller", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx361703.jpg`, keys: ["bryson tiller"] },
  { title: "A Perfect Circle", date: "Sun 06 Dec 2026", venue: "Rod Laver Arena, Melbourne, VIC", image: `${TK_CDN}/sfx358059.jpg`, keys: ["a perfect circle", "perfect circle"] },
  { title: "Air Supply", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362232.jpg`, keys: ["air supply"] },
  { title: "ICEHOUSE", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx368006.jpg`, keys: ["icehouse"] },
  { title: "James with Razorlight", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362588.jpg`, keys: ["james with razorlight", "james band", "razorlight"] },
  { title: "Sonu Nigam", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx358937.jpg`, keys: ["sonu nigam"] },
  { title: "Lorna Shore", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx360029.jpg`, keys: ["lorna shore"] },
  { title: "Louis Tomlinson", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx356365.jpg`, keys: ["louis tomlinson"] },
  { title: "CAKE", subtitle: "An Evening with", date: "Sat 20 Mar 2027 to Sun 21 Mar 2027", venue: "Enmore Theatre, Newtown, NSW", image: `${TK_CDN}/sfx363028.jpg`, keys: ["cake band", "cake evening with"] },
  { title: "The Cat Empire", subtitle: "with the West Australian Symphony Orchestra", date: "Fri 04 Dec 2026 to Sat 05 Dec 2026", venue: "Riverside Theatre, Perth Convention and Exhibition Centre, Perth, WA", image: `${TK_CDN}/sfx361548.jpg`, keys: ["cat empire", "cat empire waso"] },
  { title: "The Cat Empire", subtitle: "with Orchestra Victoria", date: "Sat 16 Jan 2027", venue: "Sidney Myer Music Bowl, Melbourne, VIC", image: `${TK_CDN}/sfx359593.jpg`, keys: ["cat empire orchestra victoria"] },
  { title: "The Cat Empire", subtitle: "with the Tasmanian Symphony Orchestra", date: "Fri 25 Sep 2026", venue: "MyState Bank Arena, Glenorchy, TAS", image: `${TK_CDN}/sfx359403.jpg`, keys: ["cat empire tasmanian"] },
  { title: "Cat Power", subtitle: "The Greatest On Tour", date: "Fri 11 Dec 2026", venue: "Astor Theatre, Mount Lawley, WA", image: `${TK_CDN}/sfx362389.jpg`, keys: ["cat power", "cat power the greatest"] },
  { title: "Cat Burns", date: "Sat 17 Oct 2026", venue: "Enmore Theatre, Newtown, NSW", image: `${TK_CDN}/sfx360355.jpg`, keys: ["cat burns"] },
  { title: "Celebrating David Bowie", date: "Sat 07 Nov 2026", venue: "Metro Theatre, Sydney, NSW", image: `${TK_CDN}/sfx357887.jpg`, keys: ["celebrating david bowie", "david bowie tribute"] },
  { title: "Catholic Schools Music Festival 2026", date: "Mon 21 Sep 2026 to Thu 24 Sep 2026", venue: "Adelaide Entertainment Centre Theatre, Hindmarsh, SA", image: `${TK_CDN}/sfx365120.jpg`, keys: ["catholic schools music festival", "catholic schools music"] },
  { title: "Dirty Dancing In Concert", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362379.jpg`, keys: ["dirty dancing in concert", "dirty dancing"] },
  { title: "UNDERTALE", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx359175.jpg`, keys: ["undertale"] },
  { title: "Aldous Harding", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx360613.jpg`, keys: ["aldous harding"] },
  { title: "Ashnikko", subtitle: "Smoochies Tour", date: "Sun 20 Sep 2026", venue: "Enmore Theatre, Newtown, NSW", image: `${TK_CDN}/sfx346583.jpg`, keys: ["ashnikko", "smoochies tour"] },
  { title: "AKMU", date: "Sun 20 Sep 2026", venue: "TikTok Entertainment Centre, Sydney, NSW", image: `${TK_CDN}/sfx360613.jpg`, keys: ["akmu"] },
  { title: "ABBA - Thank you for the Music", date: "Fri 20 Nov 2026 to Sat 21 Nov 2026", venue: "Regal Theatre, Subiaco, WA", image: `${TK_CDN}/sfx360664.jpg`, keys: ["abba thank you for the music", "abbabeat", "abba"] },
  { title: "A Special Evening With Christian Horner", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx354952.jpg`, keys: ["christian horner", "special evening with christian horner"] },
  { title: "Dermot Kennedy", subtitle: "The Weight Of The woods Tour", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx360477.jpg`, keys: ["dermot kennedy", "weight of the woods"] },
  { title: "The Castle On Stage", date: "Tue 23 Mar 2027 to Sun 2 May 2027", venue: "Her Majesty's Theatre, Melbourne, VIC", image: `${TK_CDN}/sfx365036.jpg`, keys: ["the castle on stage", "castle on stage"] },

  // === CONCERTS - WAITLIST ===
  { title: "Calvin Harris (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx264852.jpg`, keys: ["calvin harris"] },
  { title: "Cardi B (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx265078.jpg`, keys: ["cardi b"] },
  { title: "Carol Ades (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx338324.jpg`, keys: ["carol ades"] },
  { title: "Carrie Underwood (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx251336.jpg`, keys: ["carrie underwood"] },
  { title: "The Chainsmokers (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx294993.jpg`, keys: ["chainsmokers", "the chainsmokers"] },
  { title: "Chance The Rapper (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx264928.jpg`, keys: ["chance the rapper"] },
  { title: "Cinderella (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx367187.jpg`, keys: ["cinderella musical", "cinderella waitlist"] },
  { title: "Depeche Mode (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx294990.jpg`, keys: ["depeche mode"] },
  { title: "Florence + the Machine (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx294870.jpg`, keys: ["florence and the machine", "florence + the machine", "florence welch"] },
  { title: "My Chemical Romance (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx261927.jpg`, keys: ["my chemical romance", "mcr"] },
  { title: "Paris Paloma (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx314983.jpg`, keys: ["paris paloma"] },

  // === SPORTS ===
  { title: "CommBank Matildas v Colombia", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx366774.jpg`, keys: ["matildas", "matildas v colombia", "commbank matildas"] },
  { title: "2026 Constellation Cup", date: "Sun 25 Oct 2026", venue: "Afterpay Arena, formerly known as Qudos Bank Arena, Sydney Olympic Park, NSW", image: `${TK_CDN}/sfx367952.jpg`, keys: ["constellation cup", "2026 constellation cup"] },
  { title: "2026 Gold Coast SUNS AFLW Season", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx364709.jpg`, keys: ["gold coast suns aflw", "suns aflw", "gold coast aflw"] },
  { title: "2026 Hostplus SANFL League Finals Series", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx365309.jpg`, keys: ["sanfl", "sanfl finals", "hostplus sanfl"] },
  { title: "2026 NAB AFL Womens Competition", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx364482.jpg`, keys: ["aflw", "nab afl womens", "afl womens competition"] },
  { title: "2026 NRL & NRLW Finals Series", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx367652.jpg`, keys: ["nrl finals", "nrlw finals", "nrl & nrlw finals"] },
  { title: "2026 QRL Grand Final Day", date: "Sat 26 Sep 2026", venue: "Kayo Stadium, Moreton Bay, QLD", image: `${TK_CDN}/sfx364475.jpg`, keys: ["qrl grand final", "qrl", "queensland rugby league grand final"] },
  { title: "2027 Squash Australian Open", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx364746.jpg`, keys: ["squash australian open", "squash open 2027"] },
  { title: "Adelaide 36ers", subtitle: "2026/2027 Season", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx364173.jpg`, keys: ["adelaide 36ers", "36ers", "adelaide 36ers season"] },
  { title: "Adelaide 36ers v Sydney Kings", subtitle: "Game 9 - Kids Takeover Round", date: "Sun 13 Dec 2026", venue: "Adelaide Entertainment Centre Arena, Adelaide, SA", image: `${TK_CDN}/sfx343624.jpg`, keys: ["adelaide 36ers v sydney kings", "36ers v sydney kings", "36ers vs kings"] },
  { title: "Adelaide Lightning 2026/27 WNBL Season", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx367456.jpg`, keys: ["adelaide lightning", "wnbl adelaide", "adelaide lightning wnbl"] },
  { title: "Adelaide United", subtitle: "2026/2027 Season", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx366869.jpg`, keys: ["adelaide united", "adelaide united season"] },
  { title: "Adelaide United v Auckland FC", date: "Sat 01 May 2027", venue: "Coopers Stadium, Hindmarsh, SA", image: `${TK_CDN}/sfx366933.jpg`, keys: ["adelaide united v auckland", "adelaide united v auckland fc"] },
  { title: "Adelaide United v Brisbane Roar FC", date: "Sat 24 Apr 2027", venue: "Coopers Stadium, Hindmarsh, SA", image: `${TK_CDN}/sfx366928.jpg`, keys: ["adelaide united v brisbane roar", "adelaide united v brisbane"] },
  { title: "2026 Capital.com Australian Open Ticket+", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx359041.jpg`, keys: ["australian open ticket+", "aus open ticket plus"] },

  // === THEATRE & ARTS ===
  { title: "The 2 Johnnies", subtitle: "Australian Tour 2026", date: "Fri 19 Feb 2027 to Sun 28 Feb 2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx343139.jpg`, keys: ["the 2 johnnies", "2 johnnies", "two johnnies"] },
  { title: "9 to 5 The Musical (Waitlist)", date: "", venue: "Adelaide, SA", image: `${TK_CDN}/sfx271673.jpg`, keys: ["9 to 5 the musical", "9 to 5 musical", "nine to five musical"] },
  { title: "A Beautiful Noise", subtitle: "The Neil Diamond Musical", date: "Sun 20 Sep 2026 to Sat 07 Nov 2026", venue: "Princess Theatre, Melbourne, VIC", image: `${TK_CDN}/sfx346843.jpg`, keys: ["a beautiful noise", "neil diamond musical", "beautiful noise neil diamond"] },
  { title: "A Centenary of Song", date: "Sat 07 Nov 2026", venue: "Orange Civic Theatre, Orange, NSW", image: `${TK_CDN}/sfx351150.jpg`, keys: ["a centenary of song", "centenary of song"] },
  { title: "A Chorus Line", date: "Fri 20 Nov 2026 to Sun 29 Nov 2026", venue: "Twelfth Night Theatre, Bowen Hills, QLD", image: `${TK_CDN}/sfx364390.jpg`, keys: ["a chorus line", "chorus line"] },
  { title: "A Night At The Musicals", date: "Thu 15 Oct 2026 to Sat 17 Oct 2026", venue: "Brisbane Powerhouse, New Farm, QLD", image: `${TK_CDN}/sfx364061.jpg`, keys: ["a night at the musicals", "night at the musicals"] },
  { title: "A Very Naughty Christmas", date: "Thu 03 Dec 2026 to Sun 20 Dec 2026", venue: "Twelfth Night Theatre, Bowen Hills, QLD", image: `${TK_CDN}/sfx367598.jpg`, keys: ["a very naughty christmas", "naughty christmas"] },
  { title: "American Psycho", subtitle: "A Musical Thriller", date: "Thu 4 Feb 2027 to Sat 20 Feb 2027", venue: "Brisbane Powerhouse, New Farm, QLD", image: `${TK_CDN}/sfx364395.jpg`, keys: ["american psycho musical", "american psycho"] },
  { title: "An Evening with Alastair Campbell", date: "Wed 18 Nov 2026", venue: "Festival Theatre, Adelaide, SA", image: `${TK_CDN}/sfx364914.jpg`, keys: ["alastair campbell", "evening with alastair campbell"] },
  { title: "An Evening with Anthony Scaramucci", date: "Thu 03 Dec 2026", venue: "Regal Theatre, Subiaco, WA", image: `${TK_CDN}/sfx365912.jpg`, keys: ["anthony scaramucci", "scaramucci"] },
  { title: "An Evening with David Sedaris", date: "Fri 15 Jan 2027", venue: "Regal Theatre, Subiaco, WA", image: `${TK_CDN}/sfx362592.jpg`, keys: ["david sedaris", "evening with david sedaris"] },
  { title: "An Evening with Mary Beard", subtitle: "Talking Classics", date: "Fri 20 Nov 2026", venue: "Her Majesty's Theatre, Adelaide, SA", image: `${TK_CDN}/sfx363119.jpeg`, keys: ["mary beard", "evening with mary beard", "talking classics"] },
  { title: "Scott Kelly", subtitle: "The Sky Is Not The Limit: Lessons from a Year in Space", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx360523.jpg`, keys: ["scott kelly", "sky is not the limit", "scott kelly space"] },

  // === FAMILY ===
  { title: "Lenny's Toddler Rave", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx366964.jpg`, keys: ["lenny's toddler rave", "toddler rave", "lenny toddler"] },
  { title: "The Greatest Christmas Show", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx366331.jpg`, keys: ["the greatest christmas show", "greatest christmas show", "christmas show"] },
  { title: "2026 Marion Taylor Address with Andrew O'Hagan", date: "Fri 9 Oct 2026", venue: "Brisbane Powerhouse, New Farm, QLD", image: `${TK_CDN}/sfx364816.jpg`, keys: ["marion taylor address", "andrew o'hagan", "marion taylor"] },
  { title: "A Bit of Spice", date: "Sat 10 Oct 2026", venue: "Brisbane Powerhouse, New Farm, QLD", image: `${TK_CDN}/sfx364540.jpg`, keys: ["a bit of spice", "bit of spice"] },
  { title: "Adam Liaw: Asian Home Cooking", subtitle: "In conversation with Rebecca Levingston", date: "Sat 10 Oct 2026", venue: "Brisbane Powerhouse, New Farm, QLD", image: `${TK_CDN}/sfx363795.jpg`, keys: ["adam liaw", "asian home cooking", "adam liaw asian home cooking"] },

  // === COMEDY ===
  { title: "Hannah Ferguson", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx363384.jpg`, keys: ["hannah ferguson"] },
  { title: "Dara Ó Briain", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx363562.jpg`, keys: ["dara o briain", "dara ó briain", "dara obriain"] },
  { title: "Lawrence Mooney", subtitle: "Full Moon Party", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx361087.jpg`, keys: ["lawrence mooney", "full moon party", "mooney full moon"] },
  { title: "Gabriel Iglesias", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx363551.jpg`, keys: ["gabriel iglesias", "fluffy", "gabriel fluffy"] },
  { title: "Paul Smith", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx357918.jpg`, keys: ["paul smith comedy", "paul smith comedian"] },
  { title: "Aaron Chen", subtitle: "Technology", date: "Fri 25 Sep 2026 to Sat 26 Sep 2026", venue: "Riverside Theatre, Perth Convention and Exhibition Centre, Perth, WA", image: `${TK_CDN}/sfx362214.jpg`, keys: ["aaron chen", "aaron chen technology"] },
  { title: "Alejandra Azcarate", subtitle: "Lo Que Se Permite Se Repite", date: "Wed 18 Nov 2026", venue: "Brisbane Powerhouse, New Farm, QLD", image: `${TK_CDN}/sfx368020.jpg`, keys: ["alejandra azcarate", "azcarate"] },
  { title: "Anh Do", subtitle: "The Happiest Refugee", date: "Wed 28 Oct 2026", venue: "Orange Civic Theatre, Orange, NSW", image: `${TK_CDN}/sfx286949.jpg`, keys: ["anh do", "the happiest refugee", "anh do happiest refugee"] },
  { title: "Aziz Ansari", subtitle: "Hypothetical Tour", date: "Wed 30 Sep 2026", venue: "Brisbane Convention & Exhibition Centre, Plaza Auditorium, QLD", image: `${TK_CDN}/sfx365607.jpg`, keys: ["aziz ansari", "hypothetical tour", "ansari"] },
  { title: "Adam Kay", subtitle: "Twas The Nightshift Before Christmas Live", date: "Mon 30 Nov 2026 to Tue 15 Dec 2026", venue: "Various venues, Australia", image: `${TK_CDN}/sfx363548.jpg`, keys: ["adam kay", "adam kay nightshift", "twas the nightshift"] },
];

/**
 * Formats the database events into the same shape as LOCAL_EVENT_OVERRIDES entries.
 */
export function getFormattedDbEvents() {
  return TICKETEK_DB_EVENTS.map((m, i) => ({
    id: `local-tkdb-${i + 1}`,
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
}

/**
 * Returns NFL Melbourne Game if query matches.
 */
export function getNflOverride(query) {
  const normalized = query.trim().toLowerCase();
  if (NFL_MELBOURNE_GAME.keys.some(k => normalized.includes(k))) {
    return [NFL_MELBOURNE_GAME];
  }
  return null;
}