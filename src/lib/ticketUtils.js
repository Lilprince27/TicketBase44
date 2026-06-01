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

export function generateOrderNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const num = Math.floor(10000000 + Math.random() * 90000000).toString();
  const suffix = Math.floor(10 + Math.random() * 90).toString();
  return `${year}-${num}/${suffix}`;
}