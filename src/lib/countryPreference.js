// Country preference for event discovery — stored in localStorage, no API calls.
// Values: "both" (default) | "AU" | "NZ"

const STORAGE_KEY = "tk_event_country";

export function getEventCountry() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "both";
  } catch {
    return "both";
  }
}

export function setEventCountry(country) {
  try {
    localStorage.setItem(STORAGE_KEY, country);
  } catch {}
}

export function isAU() {
  const c = getEventCountry();
  return c === "AU" || c === "both";
}

export function isNZ() {
  const c = getEventCountry();
  return c === "NZ" || c === "both";
}