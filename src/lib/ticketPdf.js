import { jsPDF } from "jspdf";

// Builds a clean, self-contained ticket PDF (text only — no external images,
// so it works regardless of CORS). Includes the secure view-only link.
export function generateTicketPdf(ticket, shareUrl) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 0;

  // Header bar
  doc.setFillColor(0, 48, 87);
  doc.rect(0, 0, pageW, 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("TICKETEK", margin, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Mobile Ticket", pageW - margin, 38, { align: "right" });

  y = 92;
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(doc.splitTextToSize(ticket.event_name || "Event", pageW - margin * 2), margin, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  if (ticket.venue_name) { doc.text(`Venue: ${ticket.venue_name}`, margin, y); y += 16; }
  if (ticket.presenter) { doc.text(`Presenter: ${ticket.presenter}`, margin, y); y += 16; }
  if (ticket.event_date) { doc.text(`Date: ${ticket.event_date}`, margin, y); y += 16; }

  // Seat details box
  y += 8;
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(margin, y, pageW - margin * 2, 92, 6, 6, "FD");
  const seatFields = [
    ["Door/Area", ticket.door_area],
    ["Section/Bay", ticket.section_bay],
    ["Row", ticket.row],
    ["Seat", ticket.seat_number],
    ["Level/Stand", ticket.level_stand],
    ["Entry Gate", ticket.entry_gate],
  ];
  const colW = (pageW - margin * 2 - 32) / 3;
  seatFields.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = margin + 16 + col * colW;
    const yy = y + 22 + row * 38;
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(120, 120, 120);
    doc.text(f[0].toUpperCase(), x, yy);
    doc.setFont("helvetica", "normal"); doc.setFontSize(13); doc.setTextColor(20, 20, 20);
    doc.text(String(f[1] || "-"), x, yy + 15);
  });
  y += 92 + 22;

  // Holder & meta
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  if (ticket.holder_name) { doc.text(`Holder: ${ticket.holder_name}`, margin, y); y += 16; }
  if (ticket.ticket_type) { doc.text(`Ticket type: ${ticket.ticket_type}`, margin, y); y += 16; }
  if (ticket.price) { doc.text(`Price: ${ticket.price}`, margin, y); y += 16; }
  if (ticket.serial_number) { doc.text(`Serial: ${ticket.serial_number}`, margin, y); y += 16; }
  if (ticket.order_number) { doc.text(`Order: ${ticket.order_number}`, margin, y); y += 16; }

  // Secure link box
  y += 14;
  doc.setFillColor(0, 48, 87);
  doc.roundedRect(margin, y, pageW - margin * 2, 72, 6, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text("Secure ticket link:", margin + 16, y + 24);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text(doc.splitTextToSize(shareUrl, pageW - margin * 2 - 32), margin + 16, y + 42);
  doc.setFontSize(8);
  doc.text("Open this link to view your ticket with barcode.", margin + 16, y + 62);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text("Ticketek Pty Limited ABN 92 010 129 110", margin, 815);
  doc.text("This ticket is non-transferable. Each barcode allows one entry only.", margin, 828);

  return doc;
}