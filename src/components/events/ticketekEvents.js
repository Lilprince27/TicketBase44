// Real Ticketek AU & NZ events — synced with live premier.ticketek.com.au & premier.ticketek.co.nz homepages (Nov 2026)
const CDN = "https://d35kvm5iuwjt9t.cloudfront.net/dbimages";
const ZACH_BRYAN_IMG = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/d41417852_IMG_8679.jpeg";
const SOAD_FAITH_IMG = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/db6bcc4b5_IMG_8841.jpeg";
const KATSEYE_IMG = "https://base44.app/api/apps/6a29092b3d99cb9d297711be/files/mp/public/6a29092b3d99cb9d297711be/7895be4fa_katseye.jpeg";
const SIENNA_SPIRO_IMG = "https://base44.app/api/apps/6a29092b3d99cb9d297711be/files/mp/public/6a29092b3d99cb9d297711be/f67b56a3a_sienna-spiro-my-house-tour.jpg";

export const TICKETEK_HERO = [
  { id: "gabrieliglesias", title: "Gabriel Iglesias", subtitle: "The 1976 Tour: A Fluffy Celebration", image: `${CDN}/sfx363550.jpg`, venue: "Various venues, Australia" },
  { id: "stewartcopeland", title: "Stewart Copeland", subtitle: "", image: `${CDN}/sfx369621.jpg`, venue: "Various venues, Australia" },
  { id: "nazeemhussain", title: "Nazeem Hussain", subtitle: "I AM BEING CALM!", image: `${CDN}/sfx371212.jpg`, venue: "Various venues, Australia" },
  { id: "brysontiller", title: "Bryson Tiller", subtitle: "The Neo Trapsoul Tour", image: `${CDN}/sfx361701.jpg`, venue: "Various venues, Australia" },
  { id: "summerofcricket", title: "Summer of Cricket", subtitle: "", image: `${CDN}/sfx361047.jpg`, venue: "Various venues, Australia" },
  { id: "originalwailers", title: "The Original Wailers featuring Al Anderson", subtitle: "One Love Tour", image: `${CDN}/sfx362050.jpg`, venue: "Various venues, Australia" },
  { id: "marybeard", title: "An Evening with Mary Beard", subtitle: "Talking Classics", image: `${CDN}/sfx363115.jpg`, venue: "Her Majesty's Theatre, Adelaide & Various venues, Australia" },
  { id: "katseye", title: "KATSEYE", subtitle: "THE WILDWORLD TOUR", image: KATSEYE_IMG, venue: "Afterpay Arena, formerly known as Qudos Bank Arena, Sydney Olympic Park, NSW" },
  { id: "soadfaith", title: "System of a Down & Faith No More", subtitle: "Australia & New Zealand Tour 2027", image: SOAD_FAITH_IMG, venue: "Accor Stadium, Marvel Stadium & Suncorp Stadium" },
  { id: "zachbryan", title: "Zach Bryan", subtitle: "Young Manhood & Other Donatable Organs Tour 2027", image: ZACH_BRYAN_IMG, venue: "Marvel Stadium, Accor Stadium & Suncorp Stadium" },
];

export const TICKETEK_FEATURED = [
  { id: "gabrieliglesias", title: "Gabriel Iglesias", subtitle: "The 1976 Tour: A Fluffy Celebration", image: `${CDN}/sfx363550.jpg`, venue: "Various venues, Australia" },
  { id: "stewartcopeland", title: "Stewart Copeland", subtitle: "", image: `${CDN}/sfx369621.jpg`, venue: "Various venues, Australia" },
  { id: "nazeemhussain", title: "Nazeem Hussain", subtitle: "I AM BEING CALM!", image: `${CDN}/sfx371212.jpg`, venue: "Various venues, Australia" },
  { id: "brysontiller", title: "Bryson Tiller", subtitle: "The Neo Trapsoul Tour", image: `${CDN}/sfx361701.jpg`, venue: "Various venues, Australia" },
  { id: "summerofcricket", title: "Summer of Cricket", subtitle: "", image: `${CDN}/sfx361047.jpg`, venue: "Various venues, Australia" },
  { id: "originalwailers", title: "The Original Wailers featuring Al Anderson", subtitle: "One Love Tour", image: `${CDN}/sfx362050.jpg`, venue: "Various venues, Australia" },
  { id: "marybeard", title: "An Evening with Mary Beard", subtitle: "Talking Classics", image: `${CDN}/sfx363115.jpg`, venue: "Her Majesty's Theatre, Adelaide & Various venues, Australia" },
  { id: "katseye", title: "KATSEYE", subtitle: "THE WILDWORLD TOUR", image: KATSEYE_IMG, venue: "Afterpay Arena, formerly known as Qudos Bank Arena, Sydney Olympic Park, NSW" },
  { id: "nickelback", title: "Nickelback", subtitle: "Everything Under The Sun World Tour", image: `${CDN}/sfx369095.jpg`, venue: "Brisbane Entertainment Centre, RAC Arena, Rod Laver Arena & Afterpay Arena" },
  { id: "soadfaith", title: "System of a Down & Faith No More", subtitle: "Australia & New Zealand Tour 2027", image: SOAD_FAITH_IMG, venue: "Accor Stadium, Marvel Stadium & Suncorp Stadium" },
  { id: "zachbryan", title: "Zach Bryan", subtitle: "Young Manhood & Other Donatable Organs Tour 2027", image: ZACH_BRYAN_IMG, venue: "Marvel Stadium, Accor Stadium & Suncorp Stadium" },
  { id: "radiohead", title: "Radiohead", subtitle: "Australia 2027", image: `${CDN}/sfx367540.jpg`, venue: "RAC Arena Perth, Rod Laver Arena Melbourne & Afterpay Arena Sydney" },
  { id: "bonjovi", title: "Bon Jovi", subtitle: "The Forever Tour 2027", image: `${CDN}/sfx370305.jpg`, venue: "Marvel Stadium, Accor Stadium & Suncorp Stadium" },
  { id: "ironmaiden", title: "Iron Maiden", subtitle: "Run For Your Lives World Tour 2026", image: `${CDN}/sfx357158.jpg`, venue: "RAC Arena, AAMI Park, Allianz Stadium & Brisbane Entertainment Centre" },
  { id: "bensonboone", title: "Benson Boone", subtitle: "Wanted Man Tour 2026", image: `${CDN}/sfx363901.jpg`, venue: "RAC Arena, Rod Laver Arena, Afterpay Arena & Brisbane Entertainment Centre" },
  { id: "siennaspiro", title: "Sienna Spiro", subtitle: "My House Tour", image: SIENNA_SPIRO_IMG, venue: "Lion Arts Factory Adelaide, Max Watts Melbourne, Metro Theatre Sydney, The Zoo Brisbane & Astor Theatre Perth" },
];

export const TICKETEK_TRENDING = [
  { id: "periphery", title: "Periphery", subtitle: "", image: `${CDN}/sfx367077.jpg`, venue: "Various venues, Australia" },
  { id: "angusandjuliastone", title: "Angus & Julia Stone", subtitle: "", image: `${CDN}/sfx367666.jpg`, venue: "Various venues, Australia" },
  { id: "bryancranstonaaronpaul", title: "An Evening with Bryan Cranston and Aaron Paul", subtitle: "", image: `${CDN}/sfx368869.jpg`, venue: "Various venues, Australia" },
  { id: "aliwong", title: "Ali Wong", subtitle: "", image: `${CDN}/sfx369989.jpg`, venue: "Various venues, Australia" },
  { id: "thehumanleague", title: "The Human League", subtitle: "", image: `${CDN}/sfx355277.jpg`, venue: "Various venues, Australia" },
  { id: "paulsmith", title: "Paul Smith", subtitle: "", image: `${CDN}/sfx357919.jpg`, venue: "Various venues, Australia" },
  { id: "swaelee", title: "Swae Lee", subtitle: "", image: `${CDN}/sfx369995.jpg`, venue: "Various venues, Australia" },
  { id: "comealive", title: "Come Alive!", subtitle: "", image: `${CDN}/sfx351234.jpg`, venue: "Various venues, Australia" },
  { id: "tktwallet", title: "Add to Wallet and Share Tickets", subtitle: "", image: `${CDN}/sfx357687.png`, venue: "Ticketek App" },
];

export const TICKETEK_WAITLISTS = [
  { id: "cinderella", title: "Cinderella", subtitle: "Waitlist", image: `${CDN}/sfx367187.jpg`, venue: "Various venues, Australia" },
  { id: "netballwc2027", title: "The Netball World Cup Sydney 2027", subtitle: "Waitlist", image: `${CDN}/sfx362771.png`, venue: "Sydney, NSW" },
  { id: "blackfriday", title: "Black Friday", subtitle: "Waitlist", image: `${CDN}/sfx370634.png`, venue: "Various venues, Australia" },
  { id: "ufcwaitlist", title: "UFC", subtitle: "Waitlist", image: `${CDN}/sfx294863.jpg`, venue: "Various venues, Australia" },
  { id: "oliviadeanwait", title: "Olivia Dean", subtitle: "Waitlist", image: `${CDN}/sfx317667.jpg`, venue: "Various venues, Australia" },
];

// === Ticketek New Zealand events — synced with premier.ticketek.co.nz (Nov 2026) ===
const NZ_CDN = "https://d19py84rdi4j91.cloudfront.net/dbimages";

export const TICKETEK_NZ_FEATURED = [
  { id: "tayloreras", title: "TAYLOR: A Tribute to the Eras", subtitle: "THE UNOFFICIAL TRIBUTE SHOW", image: `${NZ_CDN}/sfx100940.jpg`, venue: "Various venues, New Zealand" },
  { id: "chasestatus", title: "Chase & Status", subtitle: "", image: `${NZ_CDN}/sfx102829.png`, venue: "Various venues, New Zealand" },
  { id: "sweetcaroline", title: "The Sweet Caroline Tour", subtitle: "A Tribute to Neil Diamond", image: `${NZ_CDN}/sfx101217.jpg`, venue: "Various venues, New Zealand" },
  { id: "allwhites", title: "All Whites v India Series 2026", subtitle: "", image: `${NZ_CDN}/sfx101693.jpg`, venue: "Various venues, New Zealand" },
  { id: "wellingtonphoenix", title: "Wellington Phoenix FC 2026-2027", subtitle: "", image: `${NZ_CDN}/sfx102171.jpg`, venue: "Sky Stadium, Wellington, New Zealand" },
  { id: "nzsquashopen", title: "2027 NZ International Squash Open", subtitle: "", image: `${NZ_CDN}/sfx101854.png`, venue: "Various venues, New Zealand" },
  { id: "moviemagic", title: "Movie Magic", subtitle: "", image: `${NZ_CDN}/sfx101622.jpg`, venue: "Various venues, New Zealand" },
  { id: "katseyenz", title: "KATSEYE", subtitle: "THE WILDWORLD TOUR", image: KATSEYE_IMG, venue: "Spark Arena, Auckland, New Zealand" },
  { id: "soadfaithnz", title: "System of a Down & Faith No More", subtitle: "New Zealand 2027", image: SOAD_FAITH_IMG, venue: "Hnry Stadium, Wellington, New Zealand" },
  { id: "zachbryannz", title: "Zach Bryan", subtitle: "Young Manhood & Other Donatable Organs Tour 2027", image: ZACH_BRYAN_IMG, venue: "Eden Park, Auckland, New Zealand" },
];

export const TICKETEK_NZ_TRENDING = [
  { id: "raceofchampionsnz", title: "Race Of Champions New Zealand", subtitle: "", image: `${NZ_CDN}/sfx102448.jpg`, venue: "Various venues, New Zealand" },
  { id: "chiefsvhurricanes", title: "Gallagher Chiefs vs Hurricanes", subtitle: "", image: `${NZ_CDN}/sfx102981.jpg`, venue: "FMG Stadium Waikato, Hamilton, New Zealand" },
  { id: "chopper", title: "Heath Franklin's Chopper", subtitle: "", image: `${NZ_CDN}/sfx101895.jpg`, venue: "Various venues, New Zealand" },
  { id: "twopsychics", title: "Two Psychics and A Medium", subtitle: "", image: `${NZ_CDN}/sfx101908.jpeg`, venue: "Various venues, New Zealand" },
  { id: "propagandhi", title: "Propagandhi", subtitle: "", image: `${NZ_CDN}/sfx101884.jpg`, venue: "Various venues, New Zealand" },
  { id: "wobil", title: "WOBIL", subtitle: "Wise Old Bugger in Lycra by Greg Cooper", image: `${NZ_CDN}/sfx101795.jpg`, venue: "Various venues, New Zealand" },
  { id: "divaschristmas", title: "DIVAS! Christmas Special", subtitle: "", image: `${NZ_CDN}/sfx102427.jpg`, venue: "Various venues, New Zealand" },
  { id: "thetentenors", title: "The Ten Tenors", subtitle: "", image: `${NZ_CDN}/sfx102621.jpg`, venue: "Various venues, New Zealand" },
  { id: "wickednz", title: "Wicked", subtitle: "The Musical", image: `${NZ_CDN}/sfx102358.png`, venue: "The Civic, Auckland, New Zealand" },
];

export const TICKETEK_NZ_WAITLISTS = [
  { id: "badbunny", title: "Bad Bunny", subtitle: "Waitlist", image: `${NZ_CDN}/sfx99194.jpg`, venue: "Various venues, New Zealand" },
  { id: "morganwallen", title: "Morgan Wallen", subtitle: "Waitlist", image: `${NZ_CDN}/sfx97344.jpg`, venue: "Various venues, New Zealand" },
  { id: "warbirds", title: "Warbirds Over Wānaka 2028", subtitle: "Waitlist", image: `${NZ_CDN}/sfx101380.jpg`, venue: "Wanaka, New Zealand" },
  { id: "mileycyrus", title: "Miley Cyrus", subtitle: "Waitlist", image: `${NZ_CDN}/sfx99239.jpg`, venue: "Various venues, New Zealand" },
  { id: "sabrinacarpenter", title: "Sabrina Carpenter", subtitle: "Waitlist", image: `${NZ_CDN}/sfx97365.jpg`, venue: "Various venues, New Zealand" },
];