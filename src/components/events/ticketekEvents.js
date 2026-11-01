// Real Ticketek AU events — sourced from premier.ticketek.com.au homepage (Oct 2026)
const CDN = "https://d35kvm5iuwjt9t.cloudfront.net/dbimages";
const ZACH_BRYAN_IMG = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/d41417852_IMG_8679.jpeg";
const SOAD_FAITH_IMG = "https://media.base44.com/images/public/6a29092b3d99cb9d297711be/db6bcc4b5_IMG_8841.jpeg";

export const TICKETEK_HERO = [
  { id: "bbl27", title: "Big Bash League", subtitle: "2026/2027", image: `${CDN}/sfx365327.jpg`, venue: "Various venues, Australia" },
  { id: "mammamiaparty", title: "Mamma Mia The Party", subtitle: "", image: `${CDN}/sfx370076.jpg`, venue: "Sydney, NSW" },
  { id: "jonahmarais", title: "Jonah Marais", subtitle: "", image: `${CDN}/sfx364628.jpg`, venue: "Various venues, Australia" },
  { id: "ironmaiden", title: "Iron Maiden", subtitle: "Run For Your Lives World Tour 2026", image: `${CDN}/sfx357158.jpg`, venue: "RAC Arena, AAMI Park, Allianz Stadium & Brisbane Entertainment Centre" },
  { id: "bensonboone", title: "Benson Boone", subtitle: "Wanted Man Tour 2026", image: `${CDN}/sfx363901.jpg`, venue: "RAC Arena, Rod Laver Arena, Afterpay Arena & Brisbane Entertainment Centre" },
  { id: "joji", title: "Joji", subtitle: "SOLARIS", image: `${CDN}/sfx357321.jpg`, venue: "Afterpay Arena, Rod Laver Arena & Brisbane Entertainment Centre" },
  { id: "hannahferguson", title: "Hannah Ferguson", subtitle: "CHEEK LIVE: State of the Nation", image: `${CDN}/sfx363383.jpg`, venue: "Various venues, Australia" },
  { id: "radiohead", title: "Radiohead", subtitle: "Australia 2027", image: `${CDN}/sfx367540.jpg`, venue: "RAC Arena Perth, Rod Laver Arena Melbourne & Afterpay Arena Sydney" },
  { id: "soadfaith", title: "System of a Down & Faith No More", subtitle: "Australia & New Zealand Tour 2027", image: SOAD_FAITH_IMG, venue: "Accor Stadium, Marvel Stadium & Suncorp Stadium" },
  { id: "zachbryan", title: "Zach Bryan", subtitle: "Young Manhood & Other Donatable Organs Tour 2027", image: ZACH_BRYAN_IMG, venue: "Marvel Stadium, Accor Stadium & Suncorp Stadium" },
];

export const TICKETEK_FEATURED = [
  { id: "bbl27", title: "Big Bash League", subtitle: "2026/2027", image: `${CDN}/sfx365327.jpg`, venue: "Various venues, Australia" },
  { id: "mammamiaparty", title: "Mamma Mia The Party", subtitle: "", image: `${CDN}/sfx370076.jpg`, venue: "Sydney, NSW" },
  { id: "jonahmarais", title: "Jonah Marais", subtitle: "", image: `${CDN}/sfx364628.jpg`, venue: "Various venues, Australia" },
  { id: "ironmaiden", title: "Iron Maiden", subtitle: "Run For Your Lives World Tour 2026", image: `${CDN}/sfx357158.jpg`, venue: "RAC Arena, AAMI Park, Allianz Stadium & Brisbane Entertainment Centre" },
  { id: "bensonboone", title: "Benson Boone", subtitle: "Wanted Man Tour 2026", image: `${CDN}/sfx363901.jpg`, venue: "RAC Arena, Rod Laver Arena, Afterpay Arena & Brisbane Entertainment Centre" },
  { id: "joji", title: "Joji", subtitle: "SOLARIS", image: `${CDN}/sfx357321.jpg`, venue: "Afterpay Arena, Rod Laver Arena & Brisbane Entertainment Centre" },
  { id: "hannahferguson", title: "Hannah Ferguson", subtitle: "CHEEK LIVE: State of the Nation", image: `${CDN}/sfx363383.jpg`, venue: "Various venues, Australia" },
  { id: "radiohead", title: "Radiohead", subtitle: "Australia 2027", image: `${CDN}/sfx367540.jpg`, venue: "RAC Arena Perth, Rod Laver Arena Melbourne & Afterpay Arena Sydney" },
  { id: "soadfaith", title: "System of a Down & Faith No More", subtitle: "Australia & New Zealand Tour 2027", image: SOAD_FAITH_IMG, venue: "Accor Stadium, Marvel Stadium & Suncorp Stadium" },
  { id: "zachbryan", title: "Zach Bryan", subtitle: "Young Manhood & Other Donatable Organs Tour 2027", image: ZACH_BRYAN_IMG, venue: "Marvel Stadium, Accor Stadium & Suncorp Stadium" },
  { id: "nickelback", title: "Nickelback", subtitle: "Everything Under The Sun World Tour", image: `${CDN}/sfx369095.jpg`, venue: "Brisbane Entertainment Centre, RAC Arena, Rod Laver Arena & Afterpay Arena" },
  { id: "bonjovi", title: "Bon Jovi", subtitle: "The Forever Tour 2027", image: `${CDN}/sfx370305.jpg`, venue: "Marvel Stadium, Accor Stadium & Suncorp Stadium" },
  { id: "brysontiller", title: "Bryson Tiller", subtitle: "The Neo Trapsoul Tour", image: `${CDN}/sfx361701.jpg`, venue: "Various venues, Australia" },
];

export const TICKETEK_TRENDING = [
  { id: "weezer", title: "Weezer", subtitle: "", image: `${CDN}/sfx370328.jpg`, venue: "Various venues, Australia" },
  { id: "ashanti", title: "Ashanti", subtitle: "", image: `${CDN}/sfx361768.jpg`, venue: "Various venues, Australia" },
  { id: "hungryjacksnbl", title: "Hungry Jacks NBL", subtitle: "", image: `${CDN}/sfx366108.jpg`, venue: "Various venues, Australia" },
  { id: "summerofcricket", title: "Summer of Cricket", subtitle: "", image: `${CDN}/sfx361049.jpg`, venue: "Various venues, Australia" },
  { id: "eclipse", title: "ECLIPSE", subtitle: "", image: `${CDN}/sfx357072.jpg`, venue: "Various venues, Australia" },
  { id: "daraobriain", title: "Dara Ó Briain", subtitle: "", image: `${CDN}/sfx363563.jpg`, venue: "Various venues, Australia" },
  { id: "supercars", title: "Repco Supercars Championship", subtitle: "", image: `${CDN}/sfx317198.jpg`, venue: "Various venues, Australia" },
  { id: "dabbledarts", title: "Dabble Darts ANZ Premier League", subtitle: "", image: `${CDN}/sfx362077.jpg`, venue: "Various venues, Australia" },
  { id: "brysontillertrending", title: "Bryson Tiller", subtitle: "", image: `${CDN}/sfx361703.jpg`, venue: "Various venues, Australia" },
];

export const TICKETEK_WAITLISTS = [
  { id: "cinderella", title: "Cinderella", subtitle: "Waitlist", image: `${CDN}/sfx367187.jpg`, venue: "Various venues, Australia" },
  { id: "netballwc2027", title: "The Netball World Cup Sydney 2027", subtitle: "Waitlist", image: `${CDN}/sfx362771.png`, venue: "Sydney, NSW" },
  { id: "doechii", title: "Doechii", subtitle: "Waitlist", image: `${CDN}/sfx331728.jpg`, venue: "Various venues, Australia" },
  { id: "tatemcrae", title: "Tate McRae", subtitle: "Waitlist", image: `${CDN}/sfx266052.jpg`, venue: "Various venues, Australia" },
  { id: "oliviadeanwait", title: "Olivia Dean", subtitle: "Waitlist", image: `${CDN}/sfx317667.jpg`, venue: "Various venues, Australia" },
];

// === Ticketek New Zealand events — sourced from premier.ticketek.co.nz (Oct 2026) ===
const NZ_CDN = "https://d19py84rdi4j91.cloudfront.net/dbimages";

export const TICKETEK_NZ_FEATURED = [
  { id: "chasestatus", title: "Chase & Status", subtitle: "", image: `${NZ_CDN}/sfx102829.png`, venue: "Various venues, New Zealand" },
  { id: "allwhites", title: "All Whites v India Series 2026", subtitle: "", image: `${NZ_CDN}/sfx101693.jpg`, venue: "Various venues, New Zealand" },
  { id: "freestylekings", title: "Freestyle Kings Live", subtitle: "", image: `${NZ_CDN}/sfx101862.jpg`, venue: "Various venues, New Zealand" },
  { id: "wobil", title: "WOBIL", subtitle: "Wise Old Bugger in Lycra by Greg Cooper", image: `${NZ_CDN}/sfx101797.jpg`, venue: "Various venues, New Zealand" },
  { id: "beegees", title: "Best of the Bee Gees: Greatest Show", subtitle: "with Special Guests", image: `${NZ_CDN}/sfx101128.jpg`, venue: "Various venues, New Zealand" },
  { id: "moviemagic", title: "Movie Magic", subtitle: "", image: `${NZ_CDN}/sfx101622.jpg`, venue: "Various venues, New Zealand" },
  { id: "nzcricket", title: "NZ Cricket 2026-27", subtitle: "", image: `${NZ_CDN}/sfx101972.jpg`, venue: "Various venues, New Zealand" },
  { id: "soadfaithnz", title: "System of a Down & Faith No More", subtitle: "New Zealand 2027", image: SOAD_FAITH_IMG, venue: "Hnry Stadium, Wellington, New Zealand" },
  { id: "zachbryannz", title: "Zach Bryan", subtitle: "Young Manhood & Other Donatable Organs Tour 2027", image: ZACH_BRYAN_IMG, venue: "Eden Park, Auckland, New Zealand" },
];

export const TICKETEK_NZ_TRENDING = [
  { id: "tayloreras", title: "TAYLOR: A Tribute to the Eras", subtitle: "", image: `${NZ_CDN}/sfx100938.jpg`, venue: "Various venues, New Zealand" },
  { id: "twopsychics", title: "Two Psychics and A Medium", subtitle: "", image: `${NZ_CDN}/sfx101908.jpeg`, venue: "Various venues, New Zealand" },
  { id: "nzrugby", title: "New Zealand Rugby 2026 Season", subtitle: "", image: `${NZ_CDN}/sfx101833.jpg`, venue: "Various venues, New Zealand" },
  { id: "mainlandpouakai", title: "Mainland Pouākai 2026 Season", subtitle: "", image: `${NZ_CDN}/sfx101581.jpg`, venue: "Various venues, New Zealand" },
  { id: "rnzb", title: "Royal New Zealand Ballet", subtitle: "", image: `${NZ_CDN}/sfx99002.jpg`, venue: "Various venues, New Zealand" },
  { id: "lennyrave", title: "Lenny's Toddler Rave World Tour: CHRISTCHURCH", subtitle: "", image: `${NZ_CDN}/sfx102134.jpg`, venue: "Wolfbrook Arena, Christchurch, New Zealand" },
  { id: "legosw", title: "LEGO® Star Wars™: The Exhibition", subtitle: "", image: `${NZ_CDN}/sfx100812.png`, venue: "Various venues, New Zealand" },
  { id: "ispshanda", title: "ISPS HANDA Japan-Australasia Championship", subtitle: "", image: `${NZ_CDN}/sfx102778.png`, venue: "Royal Auckland and Grange Golf Club, Auckland" },
  { id: "divaschristmas", title: "DIVAS! Christmas Special", subtitle: "", image: `${NZ_CDN}/sfx102427.jpg`, venue: "Various venues, New Zealand" },
];

export const TICKETEK_NZ_WAITLISTS = [
  { id: "badbunny", title: "Bad Bunny", subtitle: "Waitlist", image: `${NZ_CDN}/sfx99194.jpg`, venue: "Various venues, New Zealand" },
  { id: "morganwallen", title: "Morgan Wallen", subtitle: "Waitlist", image: `${NZ_CDN}/sfx97344.jpg`, venue: "Various venues, New Zealand" },
  { id: "warbirds", title: "Warbirds Over Wānaka 2028", subtitle: "Waitlist", image: `${NZ_CDN}/sfx101380.jpg`, venue: "Wanaka, New Zealand" },
  { id: "mileycyrus", title: "Miley Cyrus", subtitle: "Waitlist", image: `${NZ_CDN}/sfx99239.jpg`, venue: "Various venues, New Zealand" },
  { id: "sabrinacarpenter", title: "Sabrina Carpenter", subtitle: "Waitlist", image: `${NZ_CDN}/sfx97365.jpg`, venue: "Various venues, New Zealand" },
];