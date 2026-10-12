// Recent event/artist searches — stored in localStorage, max 5 entries.
const STORAGE_KEY = "tk_recent_searches";
const MAX_ENTRIES = 5;

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(term) {
  const trimmed = term.trim();
  if (!trimmed) return;
  try {
    const existing = getRecentSearches();
    // Remove duplicate (case-insensitive), then prepend
    const filtered = existing.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
    filtered.unshift(trimmed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ENTRIES)));
  } catch {}
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}