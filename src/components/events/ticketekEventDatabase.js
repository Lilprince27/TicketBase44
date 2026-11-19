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

const ZACH_BRYAN_IMAGE = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/d41417852_IMG_8679.jpeg";
const SOAD_FAITH_IMAGE = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/db6bcc4b5_IMG_8841.jpeg";
const KATSEYE_IMAGE = "https://base44.app/api/apps/6a29092b3d99cb9d297711be/files/mp/public/6a29092b3d99cb9d297711be/7895be4fa_katseye.jpeg";
const SIENNA_SPIRO_IMAGE = "https://base44.app/api/apps/6a29092b3d99cb9d297711be/files/mp/public/6a29092b3d99cb9d297711be/f67b56a3a_sienna-spiro-my-house-tour.jpg";
const GRACIE_ABRAMS_IMAGE = "https://base44.app/api/apps/6a29092b3d99cb9d297711be/files/mp/public/6a29092b3d99cb9d297711be/f5e884003_gracie-abrams.jpg";

export const TICKETEK_DB_EVENTS = [
  // === CONCERTS ===
  { title: "Gracie Abrams", subtitle: "The Look at My Life Tour", date: "Tue 27 Jul 2027 - Fri 6 Aug 2027", venue: "Rod Laver Arena, Melbourne & Afterpay Arena, Sydney Olympic Park, NSW", image: GRACIE_ABRAMS_IMAGE, keys: ["gracie abrams", "gracie", "look at my life"] },
  { title: "Wicked", subtitle: "Part One In Concert", date: "2027", venue: "Adelaide Entertainment Centre, Brisbane Convention & Exhibition Centre & The Star Gold Coast", image: `${TK_CDN}/sfx371732.jpg`, keys: ["wicked", "part one in concert", "wicked in concert"] },
  { title: "Guy Montgomery", subtitle: "What Do People Do All Day?", date: "2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx370805.jpg`, keys: ["guy montgomery", "what do people do all day"] },
  { title: "Sienna Spiro — My House Tour", subtitle: "My House Tour", date: "Fri 15 Jan 2027 - Mon 25 Jan 2027", venue: "Fremantle Arts Centre Perth, Lion Arts Factory Adelaide, Festival Hall Melbourne, The Hordern Pavilion Sydney & Fortitude Music Hall Brisbane", image: SIENNA_SPIRO_IMAGE, keys: ["sienna spiro", "sienna", "my house tour", "my house"] },
  { title: "KATSEYE", subtitle: "THE WILDWORLD TOUR", date: "Sun 28 Feb 2027 · 8:00pm", venue: "Afterpay Arena, formerly known as Qudos Bank Arena, Sydney Olympic Park, NSW", image: KATSEYE_IMAGE, keys: ["katseye", "wildworld tour", "the wildworld tour"] },
  { title: "Stewart Copeland", date: "2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx369621.jpg`, keys: ["stewart copeland", "copeland"] },
  { title: "Nazeem Hussain — I AM BEING CALM!", subtitle: "I AM BEING CALM!", date: "2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx371212.jpg`, keys: ["nazeem hussain", "i am being calm"] },
  { title: "The Original Wailers featuring Al Anderson — One Love Tour", subtitle: "One Love Tour", date: "2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362050.jpg`, keys: ["the original wailers", "original wailers", "al anderson", "one love tour"] },
  { title: "Periphery", date: "2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx367077.jpg`, keys: ["periphery"] },
  { title: "Angus & Julia Stone", date: "2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx367666.jpg`, keys: ["angus & julia stone", "angus and julia stone"] },
  { title: "An Evening with Bryan Cranston and Aaron Paul", date: "2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx368869.jpg`, keys: ["bryan cranston", "aaron paul", "bryan cranston and aaron paul"] },
  { title: "The Human League", date: "2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx355277.jpg`, keys: ["the human league", "human league"] },
  { title: "Swae Lee", date: "2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx369995.jpg`, keys: ["swae lee"] },
  { title: "Black Friday (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx370634.png`, keys: ["black friday"] },
  { title: "UFC (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx294863.jpg`, keys: ["ufc", "ufc waitlist"] },
  { title: "The Sweet Caroline Tour — A Tribute to Neil Diamond", date: "2026/2027", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101217.jpg", keys: ["sweet caroline tour", "the sweet caroline tour"] },
  { title: "2027 NZ International Squash Open", date: "2027", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101854.png", keys: ["nz international squash open", "nz squash open"] },
  { title: "Race Of Champions New Zealand", date: "2027", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx102448.jpg", keys: ["race of champions", "race of champions new zealand"] },
  { title: "Gallagher Chiefs vs Hurricanes", date: "2027", venue: "FMG Stadium Waikato, Hamilton, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx102981.jpg", keys: ["gallagher chiefs", "chiefs vs hurricanes", "hurricanes"] },
  { title: "Heath Franklin's Chopper", date: "2026/2027", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101895.jpg", keys: ["heath franklin", "chopper"] },
  { title: "Propagandhi", date: "2027", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101884.jpg", keys: ["propagandhi"] },
  { title: "The Ten Tenors", date: "2027", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx102621.jpg", keys: ["the ten tenors", "ten tenors"] },
  { title: "Nickelback — Everything Under The Sun World Tour", subtitle: "Everything Under The Sun World Tour", date: "Tue 12 Oct 2027 · 8:00pm", venue: "Brisbane Entertainment Centre, Brisbane, QLD", image: `${TK_CDN}/sfx369095.jpg`, keys: ["nickelback", "everything under the sun"] },
  { title: "System of a Down & Faith No More", date: "Fri 22 Jan 2027 - Sun 7 Feb 2027", venue: "Accor Stadium Sydney, Marvel Stadium Melbourne, Suncorp Stadium Brisbane & Hnry Stadium Wellington", image: SOAD_FAITH_IMAGE, keys: ["system of a down", "faith no more", "soad"] },
  { title: "Zach Bryan — Young Manhood & Other Donatable Organs Tour 2027", date: "Fri 3 Dec 2027 - Sat 18 Dec 2027", venue: "Marvel Stadium Melbourne, Accor Stadium Sydney & Suncorp Stadium Brisbane", image: ZACH_BRYAN_IMAGE, keys: ["zach bryan", "young manhood", "donatable organs"] },
  { title: "Radiohead — Australia 2027", subtitle: "Australia 2027", date: "Mon 3 May 2027 - Tue 1 Jun 2027 · 7:30pm", venue: "RAC Arena Perth, Rod Laver Arena Melbourne & Afterpay Arena Sydney", image: `${TK_CDN}/sfx367540.jpg`, keys: ["radiohead"] },
  { title: "Big Bash League 2026/2027", date: "Dec 2026 - Jan 2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx365327.jpg`, keys: ["big bash league", "bbl", "big bash"] },
  { title: "Mamma Mia! The Party", date: "2027 Season", venue: "Sydney, NSW", image: `${TK_CDN}/sfx370076.jpg`, keys: ["mamma mia the party", "mamma mia"] },
  { title: "Jonah Marais", date: "Nov 2026", venue: "Various venues, Australia", image: `${TK_CDN}/sfx364628.jpg`, keys: ["jonah marais"] },
  { title: "Joji — SOLARIS", date: "Nov 2026", venue: "Afterpay Arena Sydney, Rod Laver Arena Melbourne & Brisbane Entertainment Centre", image: `${TK_CDN}/sfx357321.jpg`, keys: ["joji", "joji solaris", "solaris"] },
  { title: "Weezer", date: "Mar 2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx370328.jpg`, keys: ["weezer"] },
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
  { title: "Doechii (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx331728.jpg`, keys: ["doechii"] },
  { title: "Tate McRae (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx266052.jpg`, keys: ["tate mcrae"] },
  { title: "Ashanti", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx361769.jpg`, keys: ["ashanti"] },
  { title: "The Return of Secret Garden", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362278.jpg`, keys: ["secret garden"] },
  { title: "Khalid", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx358455.jpg`, keys: ["khalid"] },
  { title: "Anthony Callea", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362650.jpg`, keys: ["anthony callea"] },
  { title: "5 Seconds of Summer — Everyone's A Star! World Tour", date: "Wed 04 Nov 2026", venue: "Adelaide Entertainment Centre, SA", image: `${TK_CDN}/sfx349290.jpg`, keys: ["5 seconds of summer", "5sos"] },
  { title: "Come Alive! — The Greatest Showman Circus Spectacular", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx351235.jpg`, keys: ["come alive", "greatest showman"] },
  { title: "Summer of Cricket", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx361048.jpg`, keys: ["summer of cricket"] },
  { title: "Dabble Darts ANZ Premier League", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362076.jpg`, keys: ["dabble darts"] },
  { title: "Repco Supercars Championship", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx317197.jpg`, keys: ["supercars", "repco supercars"] },
  { title: "Fontaines D.C.", date: "Feb 2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx368795.jpg`, keys: ["fontaines dc", "fontaines d.c"] },
  { title: "Evanescence", date: "Nov 2026", venue: "Various venues, Australia", image: `${TK_CDN}/sfx362080.jpg`, keys: ["evanescence"] },
  { title: "THE SCRIPT — Satellites World Tour", date: "Jan 2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx361263.jpg`, keys: ["the script", "satellites tour"] },
  { title: "Delta Goodrem", date: "Nov 2026", venue: "Various venues, Australia", image: `${TK_CDN}/sfx363329.jpg`, keys: ["delta goodrem"] },
  { title: "Westlife", date: "Feb 2027", venue: "Various venues, Australia", image: `${TK_CDN}/sfx360731.jpg`, keys: ["westlife"] },
  { title: "Remi Wolf", date: "Dec 2026", venue: "Various venues, Australia", image: `${TK_CDN}/sfx369340.jpg`, keys: ["remi wolf"] },
  { title: "Simple Minds — Global Tour 2027", date: "Sat 13 Feb 2027 - Thu 18 Feb 2027", venue: "RAC Arena, Adelaide Entertainment Centre & Rod Laver Arena", image: `${TK_CDN}/sfx362588.jpg`, keys: ["simple minds"] },
  { title: "Empire of the Sun — Ask That God Tour", date: "Feb 2027", venue: "Afterpay Arena, Sydney Olympic Park, NSW", image: `${TK_CDN}/sfx368006.jpg`, keys: ["empire of the sun", "ask that god"] },
  { title: "Nine Inch Nails (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx369527.jpg`, keys: ["nine inch nails", "nin"] },
  { title: "Phoebe Bridgers (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx360771.jpg`, keys: ["phoebe bridgers"] },
  { title: "U2 (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx296129.jpg`, keys: ["u2"] },
  { title: "John Mayer (Waitlist)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx294283.jpg`, keys: ["john mayer"] },
  { title: "Ali Wong — ALI WONG: LIVE", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx370089.jpg`, keys: ["ali wong"] },
  { title: "An evening with CELTIC THUNDER", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx368098.jpg`, keys: ["celtic thunder"] },
  { title: "Monster Truck Mania Live", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx368432.jpg`, keys: ["monster truck mania", "monster truck"] },
  { title: "Crash Test Dummies (Canada)", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx366542.jpg`, keys: ["crash test dummies"] },
  { title: "Arthur Hill", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx367236.jpg`, keys: ["arthur hill"] },
  { title: "An Evening with Lee Asher", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx368652.jpg`, keys: ["lee asher", "evening with lee asher"] },
  { title: "Hungry Jacks NBL", date: "", venue: "Various venues, Australia", image: `${TK_CDN}/sfx366108.jpg`, keys: ["hungry jacks nbl", "nbl"] },
  // New Zealand events
  { title: "Chase & Status", date: "2027", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx102829.png", keys: ["chase & status", "chase and status"] },
  { title: "All Whites v India Series 2026", date: "Nov 2026", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101693.jpg", keys: ["all whites", "all whites v india"] },
  { title: "Freestyle Kings Live", date: "Nov 2026", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101862.jpg", keys: ["freestyle kings"] },
  { title: "WOBIL — Wise Old Bugger in Lycra by Greg Cooper", date: "2027", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101797.jpg", keys: ["wobil", "wise old bugger in lycra"] },
  { title: "Best of the Bee Gees: Greatest Show", date: "2027", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101128.jpg", keys: ["best of the bee gees", "bee gees"] },
  { title: "Movie Magic", date: "2026", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101622.jpg", keys: ["movie magic"] },
  { title: "NZ Cricket 2026-27", date: "2026/27 Season", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101972.jpg", keys: ["nz cricket", "new zealand cricket"] },
  { title: "TAYLOR: A Tribute to the Eras", date: "2026", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx100938.jpg", keys: ["taylor a tribute to the eras", "taylor tribute"] },
  { title: "Two Psychics and A Medium", date: "Nov 2026", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101908.jpeg", keys: ["two psychics", "two psychics and a medium"] },
  { title: "New Zealand Rugby 2026 Season", date: "2026 Season", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101833.jpg", keys: ["nz rugby", "new zealand rugby", "all blacks"] },
  { title: "Mainland Pouākai 2026 Season", date: "2026 Season", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101581.jpg", keys: ["mainland pouakai", "pouakai"] },
  { title: "Royal New Zealand Ballet", date: "2026 Season", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx99002.jpg", keys: ["royal new zealand ballet", "rnzb"] },
  { title: "LEGO Star Wars: The Exhibition", date: "2026/27", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx100812.png", keys: ["lego star wars", "lego star wars exhibition"] },
  { title: "ISPS HANDA Japan-Australasia Championship", date: "2027", venue: "Royal Auckland and Grange Golf Club, Auckland, NZ", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx102778.png", keys: ["isps handa", "japan-australasia championship"] },
  { title: "DIVAS! Christmas Special", date: "Dec 2026", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx102427.jpg", keys: ["divas christmas special", "divas"] },
  { title: "Wellington Phoenix FC Season 2026-2027", date: "2026/27 Season", venue: "Sky Stadium, Wellington, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx102171.jpg", keys: ["wellington phoenix", "phoenix fc"] },
  { title: "The Fray — Summer of Light Tour", date: "Jan 2027", venue: "Spark Arena, Auckland, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx102392.jpg", keys: ["the fray", "summer of light"] },
  { title: "Wicked — The Musical", date: "2026/27 Season", venue: "The Civic, Auckland, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx102358.png", keys: ["wicked", "wicked nz", "wicked musical"] },
  { title: "Bad Bunny (Waitlist)", date: "", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx99194.jpg", keys: ["bad bunny"] },
  { title: "Morgan Wallen (Waitlist)", date: "", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx97344.jpg", keys: ["morgan wallen"] },
  { title: "Warbirds Over Wanaka 2028 (Waitlist)", date: "", venue: "Wanaka, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx101380.jpg", keys: ["warbirds over wanaka", "warbirds"] },
  { title: "Miley Cyrus (Waitlist)", date: "", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx99239.jpg", keys: ["miley cyrus"] },
  { title: "Sabrina Carpenter (Waitlist)", date: "", venue: "Various venues, New Zealand", image: "https://d19py84rdi4j91.cloudfront.net/dbimages/sfx97365.jpg", keys: ["sabrina carpenter"] },
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