export function generateSerialNumber() {
  let serial = "";
  for (let i = 0; i < 14; i++) {
    serial += Math.floor(Math.random() * 10).toString();
  }
  return serial;
}

export function generatePaxNumber() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function generateTransactionNumber() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export function generateSellerId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function generatePurchaseDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[now.getMonth()];
  const year = String(now.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
}

export function generateEventCode(venueName, eventDate, eventName) {
  const venueShort = (venueName || "EVT").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
  const dateClean = (eventDate || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 12);
  const artistShort = (eventName || "").replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
  return `${venueShort}${dateClean}${artistShort}`;
}

// Build a Ticketek verification URL from a ticket's serial number.
// Encoding a URL (not a bare number) in the QR makes iOS open it in a browser
// instead of misinterpreting it as a phone number.
export function buildTicketUrl(serialNumber) {
  const serial = (serialNumber || "").trim() || "0";
  return `https://www.ticketek.com.au/t/${serial}`;
}

// Build the Ticketek mobile verification URL that the "Accept Ticket" /
// "Add to Wallet" buttons link to — same format as the purchase confirmation
// email's access-information link (e.g. https://ticketek.mobi/?id=26-12069324/44).
export function buildTicketekMobiUrl(orderNumber) {
  const id = (orderNumber || "").trim() || "0";
  return `https://ticketek.mobi/?id=${id}`;
}

// Base URL for the connected custom domain — used for all share/transfer links
// so recipients always land on the branded domain regardless of which URL
// the sender was viewing the app from.
export const APP_BASE_URL = "https://tickeket.xyz";

export function buildShareUrl(token) {
  return `${APP_BASE_URL}/shared-ticket/${token}`;
}

export function buildTransferUrl(token) {
  return `${APP_BASE_URL}/transfer/${token}`;
}

export function generateSecureToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function generateOrderNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const num = Math.floor(10000000 + Math.random() * 90000000).toString();
  const suffix = Math.floor(10 + Math.random() * 90).toString();
  return `${year}-${num}/${suffix}`;
}

// Derive a stable order number from a ticket's stored order_number
// Ensures all views (Wallet, Order History, Ticket Detail) show the SAME number
export function formatOrderNumber(orderNumber) {
  if (!orderNumber) return "-";
  return orderNumber;
}