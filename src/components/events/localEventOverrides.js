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

/**
 * Returns local override events if the query matches, otherwise null.
 */
export function getLocalOverride(query) {
  const normalized = query.trim().toLowerCase();
  for (const [key, events] of Object.entries(LOCAL_EVENT_OVERRIDES)) {
    if (normalized.includes(key)) return events;
  }
  return null;
}