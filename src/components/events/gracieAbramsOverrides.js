/**
 * Gracie Abrams — Australian Tour 2027
 * All confirmed Melbourne and Sydney shows.
 */

const GRACIE_ABRAMS_IMAGE = "https://base44.app/api/apps/6a29092b3d99cb9d297711be/files/mp/public/6a29092b3d99cb9d297711be/f5e884003_gracie-abrams.jpg";

const GRACIE_ABRAMS_DATES = [
  { date: "Tue 27 Jul 2027", venue: "Rod Laver Arena", city: "Melbourne", region: "Melbourne, VIC" },
  { date: "Wed 28 Jul 2027", venue: "Rod Laver Arena", city: "Melbourne", region: "Melbourne, VIC" },
  { date: "Fri 30 Jul 2027", venue: "Rod Laver Arena", city: "Melbourne", region: "Melbourne, VIC" },
  { date: "Tue 3 Aug 2027", venue: "Afterpay Arena", city: "Sydney Olympic Park", region: "Sydney Olympic Park, NSW" },
  { date: "Wed 4 Aug 2027", venue: "Afterpay Arena", city: "Sydney Olympic Park", region: "Sydney Olympic Park, NSW" },
  { date: "Fri 6 Aug 2027", venue: "Afterpay Arena", city: "Sydney Olympic Park", region: "Sydney Olympic Park, NSW" },
];

export const GRACIE_ABRAMS_SHOWS = GRACIE_ABRAMS_DATES.map((show, i) => ({
  id: `local-gracie-abrams-${i + 1}`,
  title: "Gracie Abrams",
  date: show.date,
  venue: show.venue,
  city: show.city,
  image: GRACIE_ABRAMS_IMAGE,
  local: true,
  localData: {
    event_name: "Gracie Abrams",
    event_date: show.date,
    venue_name: `${show.venue}, ${show.region}`,
    event_image_url: GRACIE_ABRAMS_IMAGE,
    presenter: "Live Nation",
  },
}));

export const GRACIE_ABRAMS_OVERRIDES = {
  "gracie abrams": GRACIE_ABRAMS_SHOWS,
};