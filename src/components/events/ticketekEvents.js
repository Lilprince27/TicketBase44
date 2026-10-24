// Real Ticketek AU events — sourced from premier.ticketek.com.au homepage (Oct 2026)
const CDN = "https://d35kvm5iuwjt9t.cloudfront.net/dbimages";
const ZACH_BRYAN_IMG = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/d41417852_IMG_8679.jpeg";

export const TICKETEK_HERO = [
  { id: "brysontiller", title: "Bryson Tiller", subtitle: "The Neo Trapsoul Tour", image: `${CDN}/sfx361701.jpg`, venue: "Various venues, Australia" },
  { id: "aliwong", title: "Ali Wong", subtitle: "ALI WONG: LIVE", image: `${CDN}/sfx370089.jpg`, venue: "Various venues, Australia" },
  { id: "louistomlinson", title: "Louis Tomlinson", subtitle: "How Did We Get Here? Australia Tour 2026", image: `${CDN}/sfx356364.jpg`, venue: "Various venues, Australia" },
  { id: "comealive", title: "Come Alive!", subtitle: "The Greatest Showman Circus Spectacular", image: `${CDN}/sfx351232.jpg`, venue: "Various venues, Australia" },
  { id: "celticthunder", title: "An evening with CELTIC THUNDER", subtitle: "", image: `${CDN}/sfx368098.jpg`, venue: "Various venues, Australia" },
  { id: "aleagues2027", title: "A-Leagues 2026/27 Season", subtitle: "", image: `${CDN}/sfx368706.png`, venue: "Various venues, Australia" },
  { id: "supercars", title: "Repco Supercars Championship", subtitle: "", image: `${CDN}/sfx317196.jpg`, venue: "Various venues, Australia" },
  { id: "bonjovi", title: "Bon Jovi", subtitle: "The Forever Tour 2027", image: `${CDN}/sfx370305.jpg`, venue: "Various venues, Australia" },
  { id: "zachbryan", title: "Zach Bryan", subtitle: "Young Manhood & Other Donatable Organs Tour 2027", image: ZACH_BRYAN_IMG, venue: "Marvel Stadium, Accor Stadium & Suncorp Stadium" },
];

export const TICKETEK_FEATURED = [
  { id: "brysontiller", title: "Bryson Tiller", subtitle: "The Neo Trapsoul Tour", image: `${CDN}/sfx361701.jpg`, venue: "Various venues, Australia" },
  { id: "aliwong", title: "Ali Wong", subtitle: "ALI WONG: LIVE", image: `${CDN}/sfx370089.jpg`, venue: "Various venues, Australia" },
  { id: "louistomlinson", title: "Louis Tomlinson", subtitle: "How Did We Get Here? Australia Tour 2026", image: `${CDN}/sfx356364.jpg`, venue: "Various venues, Australia" },
  { id: "comealive", title: "Come Alive!", subtitle: "The Greatest Showman Circus Spectacular", image: `${CDN}/sfx351232.jpg`, venue: "Various venues, Australia" },
  { id: "celticthunder", title: "An evening with CELTIC THUNDER", subtitle: "", image: `${CDN}/sfx368098.jpg`, venue: "Various venues, Australia" },
  { id: "aleagues2027", title: "A-Leagues 2026/27 Season", subtitle: "", image: `${CDN}/sfx368706.png`, venue: "Various venues, Australia" },
  { id: "supercars", title: "Repco Supercars Championship", subtitle: "", image: `${CDN}/sfx317196.jpg`, venue: "Various venues, Australia" },
  { id: "bonjovi", title: "Bon Jovi", subtitle: "The Forever Tour 2027", image: `${CDN}/sfx370305.jpg`, venue: "Various venues, Australia" },
  { id: "zachbryan", title: "Zach Bryan", subtitle: "Young Manhood & Other Donatable Organs Tour 2027", image: ZACH_BRYAN_IMG, venue: "Marvel Stadium, Accor Stadium & Suncorp Stadium" },
  { id: "asaprocky", title: "A$AP Rocky", subtitle: "Don't Be Dumb World Tour", image: `${CDN}/sfx368777.jpg`, venue: "Various venues, Australia" },
  { id: "zaralarsson", title: "Zara Larsson", subtitle: "Midnight Sun Tour 2026", image: `${CDN}/sfx355845.jpg`, venue: "Various venues, Australia" },
];

export const TICKETEK_TRENDING = [
  { id: "monstertruck", title: "Monster Truck Mania Live", subtitle: "", image: `${CDN}/sfx368432.jpg`, venue: "Various venues, Australia" },
  { id: "summerofcricket", title: "Summer of Cricket", subtitle: "", image: `${CDN}/sfx361049.jpg`, venue: "Various venues, Australia" },
  { id: "crashtestdummies", title: "Crash Test Dummies (Canada)", subtitle: "", image: `${CDN}/sfx366542.jpg`, venue: "Various venues, Australia" },
  { id: "dirtydancing", title: "Dirty Dancing In Concert", subtitle: "", image: `${CDN}/sfx362379.jpg`, venue: "Various venues, Australia" },
  { id: "arthurhill", title: "Arthur Hill", subtitle: "", image: `${CDN}/sfx367236.jpg`, venue: "Various venues, Australia" },
  { id: "undertale", title: "UNDERTALE", subtitle: "", image: `${CDN}/sfx359175.jpg`, venue: "Various venues, Australia" },
  { id: "leeasher", title: "An Evening with Lee Asher", subtitle: "", image: `${CDN}/sfx368652.jpg`, venue: "Various venues, Australia" },
  { id: "hungryjacksnbl", title: "Hungry Jacks NBL", subtitle: "", image: `${CDN}/sfx366108.jpg`, venue: "Various venues, Australia" },
];

export const TICKETEK_WAITLISTS = [
  { id: "cinderella", title: "Cinderella", subtitle: "Waitlist", image: `${CDN}/sfx367187.jpg`, venue: "Various venues, Australia" },
  { id: "johnmayer", title: "John Mayer", subtitle: "Waitlist", image: `${CDN}/sfx294283.jpg`, venue: "Various venues, Australia" },
  { id: "phoebebridgers", title: "Phoebe Bridgers", subtitle: "Waitlist", image: `${CDN}/sfx360771.jpg`, venue: "Various venues, Australia" },
  { id: "nineinchnails", title: "Nine Inch Nails", subtitle: "Waitlist", image: `${CDN}/sfx369527.jpg`, venue: "Various venues, Australia" },
  { id: "u2", title: "U2", subtitle: "Waitlist", image: `${CDN}/sfx296129.jpg`, venue: "Various venues, Australia" },
];

// === Ticketek New Zealand events — sourced from premier.ticketek.co.nz (Oct 2026) ===
const NZ_CDN = "https://d19py84rdi4j91.cloudfront.net/dbimages";

export const TICKETEK_NZ_FEATURED = [
  { id: "nzcricket", title: "NZ Cricket 2026-27", subtitle: "", image: `${NZ_CDN}/sfx101972.jpg`, venue: "Various venues, New Zealand" },
  { id: "rockthebowl", title: "Rock the Bowl 2026", subtitle: "", image: `${NZ_CDN}/sfx101976.jpg`, venue: "Various venues, New Zealand" },
  { id: "wellingtonphoenix", title: "Wellington Phoenix FC Season 2026-2027", subtitle: "A-League Women & A-League Men", image: `${NZ_CDN}/sfx102171.jpg`, venue: "Various venues, New Zealand" },
  { id: "legosw", title: "LEGO Star Wars: The Exhibition", subtitle: "", image: `${NZ_CDN}/sfx100725.png`, venue: "Various venues, New Zealand" },
  { id: "allwhites", title: "All Whites v India Series 2026", subtitle: "", image: `${NZ_CDN}/sfx101693.jpg`, venue: "Various venues, New Zealand" },
  { id: "thefray", title: "The Fray", subtitle: "Summer of Light Tour", image: `${NZ_CDN}/sfx102392.jpg`, venue: "Various venues, New Zealand" },
  { id: "nznetball", title: "2026 WM New Zealand Netball Series", subtitle: "", image: `${NZ_CDN}/sfx102458.jpg`, venue: "Various venues, New Zealand" },
  { id: "zachbryannz", title: "Zach Bryan", subtitle: "Young Manhood & Other Donatable Organs Tour 2027", image: ZACH_BRYAN_IMG, venue: "Eden Park, Auckland, New Zealand" },
  { id: "oliviadean", title: "Olivia Dean", subtitle: "The Art of Loving Live", image: `${NZ_CDN}/sfx101979.png`, venue: "Western Springs, Auckland" },
  { id: "zaralarssonnz", title: "Zara Larsson", subtitle: "Midnight Sun Tour 2026", image: `${CDN}/sfx355845.jpg`, venue: "Spark Arena, Auckland, New Zealand" },
  { id: "asaprockynz", title: "A$AP Rocky", subtitle: "Don't Be Dumb World Tour", image: `${CDN}/sfx368777.jpg`, venue: "Spark Arena, Auckland, New Zealand" },
];

export const TICKETEK_NZ_TRENDING = [
  { id: "nzrugby", title: "New Zealand Rugby 2026 Season", subtitle: "", image: `${NZ_CDN}/sfx101833.jpg`, venue: "Various venues, New Zealand" },
  { id: "chopper", title: "Heath Franklin's Chopper", subtitle: "", image: `${NZ_CDN}/sfx101895.jpg`, venue: "Various venues, New Zealand" },
  { id: "lennyrave", title: "Lenny's Toddler Rave World Tour: CHRISTCHURCH", subtitle: "", image: `${NZ_CDN}/sfx102134.jpg`, venue: "Christchurch, New Zealand" },
  { id: "beatlemania", title: "Beatlemania On Tour", subtitle: "", image: `${NZ_CDN}/sfx99921.jpg`, venue: "Various venues, New Zealand" },
  { id: "twopsychics", title: "Two Psychics and A Medium", subtitle: "", image: `${NZ_CDN}/sfx101908.jpeg`, venue: "Various venues, New Zealand" },
  { id: "arthurhill", title: "Arthur Hill", subtitle: "", image: `${NZ_CDN}/sfx102232.jpg`, venue: "Various venues, New Zealand" },
  { id: "daraobriainnz", title: "Dara Ó Briain", subtitle: "", image: `${NZ_CDN}/sfx101500.jpg`, venue: "Various venues, New Zealand" },
  { id: "dunedincbf", title: "Dunedin Craft Beer & Food Festival 2026", subtitle: "", image: `${NZ_CDN}/sfx101363.jpg`, venue: "Dunedin, New Zealand" },
  { id: "wicked", title: "Wicked", subtitle: "", image: `${NZ_CDN}/sfx102358.png`, venue: "Various venues, New Zealand" },
];

export const TICKETEK_NZ_WAITLISTS = [
  { id: "badbunny", title: "Bad Bunny", subtitle: "Waitlist", image: `${NZ_CDN}/sfx99194.jpg`, venue: "Various venues, New Zealand" },
  { id: "morganwallen", title: "Morgan Wallen", subtitle: "Waitlist", image: `${NZ_CDN}/sfx97344.jpg`, venue: "Various venues, New Zealand" },
  { id: "warbirds", title: "Warbirds Over Wanaka 2028", subtitle: "Waitlist", image: `${NZ_CDN}/sfx101380.jpg`, venue: "Wanaka, New Zealand" },
  { id: "mileycyrus", title: "Miley Cyrus", subtitle: "Waitlist", image: `${NZ_CDN}/sfx99239.jpg`, venue: "Various venues, New Zealand" },
  { id: "sabrinacarpenter", title: "Sabrina Carpenter", subtitle: "Waitlist", image: `${NZ_CDN}/sfx97365.jpg`, venue: "Various venues, New Zealand" },
];