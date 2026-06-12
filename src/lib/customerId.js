/**
 * Single source of truth for Customer ID.
 * Derives a stable 8-digit numeric ID from the user's database ID.
 * Used consistently across AccountPage, TicketsPage, OrderHistorySheet.
 */
export function getCustomerId(userId) {
  if (!userId) return "...";
  // Take only numeric characters from the ID, pad/truncate to 8 digits
  const digits = userId.replace(/\D/g, "");
  if (!digits) return "00000000";
  // Use last 8 digits padded with leading zeros
  return digits.padStart(8, "0").slice(-8);
}