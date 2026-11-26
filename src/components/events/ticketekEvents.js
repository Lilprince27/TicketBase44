// Real Ticketek AU & NZ events — synced with live premier.ticketek.com.au & premier.ticketek.co.nz homepages (Nov 2026)
const CDN = "https://d35kvm5iuwjt9t.cloudfront.net/dbimages";
const NZ_CDN = "https://d19py84rdi4j91.cloudfront.net/dbimages";

export const TICKETEK_HERO = [
  { id: "bryancranstonaaronpaul", title: "An Evening with Bryan Cranston and Aaron Paul", subtitle: "", image: `${CDN}/sfx368867.jpg`, venue: "Various venues, Australia" },
  { id: "l7", title: "L7 (USA)", subtitle: "The Last Hurrah Tour", image: `${CDN}/sfx372096.jpg`, venue: "Various venues, Australia" },
  { id: "davidsedaris", title: "An Evening with David Sedaris", subtitle: "", image: `${CDN}/sfx362595.jpg`, venue: "Various venues, Australia" },
  { id: "gabrieliglesias", title: "Gabriel Iglesias", subtitle: "The 1976 Tour: A Fluffy Celebration", image: `${CDN}/sfx363550.jpg`, venue: "Various venues, Australia" },
  { id: "asaprocky", title: "A$AP Rocky", subtitle: "Don't Be Dumb World Tour", image: `${CDN}/sfx368775.jpg`, venue: "Various venues, Australia" },
  { id: "summerofcricket", title: "Summer of Cricket", subtitle: "", image: `${CDN}/sfx361047.jpg`, venue: "Various venues, Australia" },
  { id: "guymontgomery", title: "Guy Montgomery", subtitle: "What Do People Do All Day?", image: `${CDN}/sfx370802.jpg`, venue: "Various venues, Australia" },
];

export const TICKETEK_FEATURED = [
  { id: "bryancranstonaaronpaul", title: "An Evening with Bryan Cranston and Aaron Paul", subtitle: "", image: `${CDN}/sfx368867.jpg`, venue: "Various venues, Australia" },
  { id: "l7", title: "L7 (USA)", subtitle: "The Last Hurrah Tour", image: `${CDN}/sfx372096.jpg`, venue: "Various venues, Australia" },
  { id: "davidsedaris", title: "An Evening with David Sedaris", subtitle: "", image: `${CDN}/sfx362595.jpg`, venue: "Various venues, Australia" },
  { id: "gabrieliglesias", title: "Gabriel Iglesias", subtitle: "The 1976 Tour: A Fluffy Celebration", image: `${CDN}/sfx363550.jpg`, venue: "Various venues, Australia" },
  { id: "asaprocky", title: "A$AP Rocky", subtitle: "Don't Be Dumb World Tour", image: `${CDN}/sfx368775.jpg`, venue: "Various venues, Australia" },
  { id: "summerofcricket", title: "Summer of Cricket", subtitle: "", image: `${CDN}/sfx361047.jpg`, venue: "Various venues, Australia" },
  { id: "guymontgomery", title: "Guy Montgomery", subtitle: "What Do People Do All Day?", image: `${CDN}/sfx370802.jpg`, venue: "Various venues, Australia" },
];

export const TICKETEK_TRENDING = [
  { id: "bryancranstonaaronpaul", title: "An Evening with Bryan Cranston and Aaron Paul", subtitle: "", image: `${CDN}/sfx368869.jpg`, venue: "Various venues, Australia" },
  { id: "gabrieliglesias", title: "Gabriel Iglesias", subtitle: "", image: `${CDN}/sfx363552.jpg`, venue: "Various venues, Australia" },
  { id: "adamkay", title: "Adam Kay", subtitle: "", image: `${CDN}/sfx363547.jpg`, venue: "Various venues, Australia" },
  { id: "celticthunder", title: "An evening with CELTIC THUNDER", subtitle: "", image: `${CDN}/sfx368100.jpg`, venue: "Various venues, Australia" },
  { id: "summerofcricket", title: "Summer of Cricket", subtitle: "", image: `${CDN}/sfx361049.jpg`, venue: "Various venues, Australia" },
  { id: "airsupply", title: "Air Supply", subtitle: "", image: `${CDN}/sfx362232.jpg`, venue: "Various venues, Australia" },
  { id: "guymontgomery", title: "Guy Montgomery", subtitle: "", image: `${CDN}/sfx370805.jpg`, venue: "Various venues, Australia" },
  { id: "tktwallet", title: "Add to Wallet and Share Tickets", subtitle: "", image: `${CDN}/sfx357687.png`, venue: "Ticketek App" },
];

export const TICKETEK_WAITLISTS = [
  { id: "moulinrougewait", title: "Moulin Rouge! The Musical", subtitle: "Waitlist", image: `${CDN}/sfx371782.jpg`, venue: "Various venues, Australia" },
  { id: "kylieminogue", title: "Kylie Minogue", subtitle: "Waitlist", image: `${CDN}/sfx298005.jpg`, venue: "Various venues, Australia" },
  { id: "tameimpala", title: "Tame Impala", subtitle: "Waitlist", image: `${CDN}/sfx316812.jpg`, venue: "Various venues, Australia" },
  { id: "gflip", title: "G Flip", subtitle: "Waitlist", image: `${CDN}/sfx312453.jpg`, venue: "Various venues, Australia" },
  { id: "domdolla", title: "Dom Dolla", subtitle: "Waitlist", image: `${CDN}/sfx339145.jpg`, venue: "Various venues, Australia" },
];

// === Ticketek New Zealand events — synced with premier.ticketek.co.nz (Nov 2026) ===
export const TICKETEK_NZ_FEATURED = [
  { id: "pouakaivqueens", title: "Pouakai v Queens", subtitle: "", image: `${NZ_CDN}/sfx101607.jpg`, venue: "Various venues, New Zealand" },
  { id: "blackfridaynz", title: "Black Friday 2026", subtitle: "", image: `${NZ_CDN}/sfx103147.jpg`, venue: "Various venues, New Zealand" },
  { id: "lanewayauckland", title: "Laneway Festival 2027 Auckland", subtitle: "", image: `${NZ_CDN}/sfx102659.jpg`, venue: "Auckland, New Zealand" },
  { id: "raceofchampionsnz", title: "Race Of Champions New Zealand", subtitle: "", image: `${NZ_CDN}/sfx102443.jpg`, venue: "Various venues, New Zealand" },
  { id: "freestylekings", title: "Freestyle Kings Live", subtitle: "", image: `${NZ_CDN}/sfx101862.jpg`, venue: "Various venues, New Zealand" },
  { id: "rebelsummercircuit", title: "Rebel Bakehouse Summer Circuit", subtitle: "", image: `${NZ_CDN}/sfx103169.png`, venue: "Various venues, New Zealand" },
  { id: "sweetcaroline", title: "The Sweet Caroline Tour", subtitle: "A Tribute to Neil Diamond", image: `${NZ_CDN}/sfx101217.jpg`, venue: "Various venues, New Zealand" },
];

export const TICKETEK_NZ_TRENDING = [
  { id: "twopsychics", title: "Two Psychics and A Medium", subtitle: "", image: `${NZ_CDN}/sfx101908.jpeg`, venue: "Various venues, New Zealand" },
  { id: "worldbuskers", title: "World Buskers Festival", subtitle: "", image: `${NZ_CDN}/sfx103014.jpg`, venue: "Various venues, New Zealand" },
  { id: "legostarwars", title: "LEGO® Star Wars™: The Exhibition", subtitle: "", image: `${NZ_CDN}/sfx100812.png`, venue: "Various venues, New Zealand" },
  { id: "tayloreras", title: "TAYLOR: A Tribute to the Eras", subtitle: "", image: `${NZ_CDN}/sfx100938.jpg`, venue: "Various venues, New Zealand" },
  { id: "nzwomensopen", title: "New Zealand Women's Open", subtitle: "", image: `${NZ_CDN}/sfx103095.png`, venue: "Various venues, New Zealand" },
  { id: "drumtao", title: "Drum Tao", subtitle: "", image: `${NZ_CDN}/sfx102926.jpg`, venue: "Various venues, New Zealand" },
  { id: "dunedincraftbeer", title: "Dunedin Craft Beer & Food Festival 2026", subtitle: "", image: `${NZ_CDN}/sfx101363.jpg`, venue: "Dunedin, New Zealand" },
  { id: "menopausethemusical", title: "Menopause the Musical", subtitle: "", image: `${NZ_CDN}/sfx101774.jpg`, venue: "Various venues, New Zealand" },
  { id: "lennyravechristchurch", title: "Lenny's Toddler Rave World Tour: CHRISTCHURCH", subtitle: "", image: `${NZ_CDN}/sfx102134.jpg`, venue: "Christchurch, New Zealand" },
];

export const TICKETEK_NZ_WAITLISTS = [
  { id: "badbunny", title: "Bad Bunny", subtitle: "Waitlist", image: `${NZ_CDN}/sfx99194.jpg`, venue: "Various venues, New Zealand" },
  { id: "morganwallen", title: "Morgan Wallen", subtitle: "Waitlist", image: `${NZ_CDN}/sfx97344.jpg`, venue: "Various venues, New Zealand" },
  { id: "warbirds", title: "Warbirds Over Wānaka 2028", subtitle: "Waitlist", image: `${NZ_CDN}/sfx101380.jpg`, venue: "Wanaka, New Zealand" },
  { id: "fish56octagon", title: "Fish56Octagon", subtitle: "Waitlist", image: `${NZ_CDN}/sfx103243.jpg`, venue: "Various venues, New Zealand" },
  { id: "sabrinacarpenter", title: "Sabrina Carpenter", subtitle: "Waitlist", image: `${NZ_CDN}/sfx97365.jpg`, venue: "Various venues, New Zealand" },
];