/**
 * Infers a title (Mr. / Miss) from a first name and returns "Mr. James" / "Miss Chloe".
 * Uses a curated set of common female names; anything not matched defaults to "Mr."
 */
const FEMALE_NAMES = new Set([
  "mary", "patricia", "jennifer", "linda", "elizabeth", "barbara", "susan", "jessica",
  "sarah", "karen", "nancy", "lisa", "betty", "helen", "sandra", "donna", "carol",
  "ruth", "sharon", "michelle", "laura", "emily", "kimberly", "deborah", "dorothy",
  "amy", "angela", "ashley", "brenda", "emma", "olivia", "ava", "sophia", "isabella",
  "mia", "charlotte", "amelia", "harper", "evelyn", "abigail", "chloe", "zoe", "lily",
  "grace", "ruby", "ella", "scarlett", "lucy", "alice", "hannah", "layla", "natalie",
  "stella", "ivy", "eva", "hazel", "willow", "aria", "jane", "ann", "anne", "marie",
  "kate", "claire", "rose", "julia", "sophie", "daisy", "isla", "phoebe", "poppy",
  "florence", "maisie", "nora", "holly", "tara", "megan", "rachel", "rebecca",
  "victoria", "danielle", "lauren", "kelly", "samantha", "stephanie", "nicole",
  "heather", "tiffany", "amber", "jenna", "allison", "katherine", "catherine",
  "christine", "christina", "valerie", "vanessa", "wendy", "gloria", "irene",
  "joyce", "judy", "paula", "diane", "josephine", "martha", "teresa", "theresa",
  "gail", "lorraine", "monica", "diana", "rita", "beatrice", "bianca", "carla",
  "carmen", "cecilia", "chelsea", "cheryl", "elaine", "erica", "fiona", "gabrielle",
  "gina", "haley", "hayley", "jacqueline", "jasmine", "judith", "kayla", "leah",
  "lila", "lola", "lucia", "lydia", "madison", "molly", "natasha", "olive", "penny",
  "piper", "renee", "sabrina", "selena", "serena", "shirley", "tamara", "tanya",
  "tina", "tracy", "valentina", "veronica", "violet", "vivian", "yvette", "zara",
  "sienna", "paige", "skye", "summer", "autumn", "faith", "hope", "joy", "prudence",
  "tahlia", "taya", "kiara", "alia", "anika", "bella", "cleo", "frances", "georgia",
  "harriet", "india", "jessie", "kira", "lola", "maya", "nimah", "priya", "sana",
  "tiana", "uma", "vera", "xena", "yara", "zahra",
]);

export function formatHolderName(rawName) {
  if (!rawName || !rawName.trim()) return "";
  const name = rawName.trim();
  const firstName = name.split(/\s+/)[0].toLowerCase();
  const title = FEMALE_NAMES.has(firstName) ? "Miss" : "Mr.";
  return `${title} ${name}`;
}