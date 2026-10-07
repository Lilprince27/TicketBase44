/**
 * Builds the "ticket availability" email sent to the RECIPIENT ONLY after a
 * transfer/share is accepted. Distinct from the acceptance confirmation —
 * this one tells the recipient their ticket(s) will appear in the Ticketek
 * app 24 hours before the event.
 *
 * Layout matches the reference: dark charcoal background (#1a1a1a), hero
 * image, event info card with seat details, "What's Next?" section with
 * gold-highlighted key phrases, and a 3-step progress bar.
 */

function nameFromEmail(email) {
  if (!email) return "";
  const local = email.split("@")[0] || "";
  return local
    .split(/[._\-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function highlight(text) {
  // gold highlight on key phrases, matching the reference
  return `<span style="background-color:#fdfd96;color:#1c1d1f;border-radius:3px;padding:0 2px;">${text}</span>`;
}

function esc(s) {
  return (s || "").replace(/[<>]/g, "");
}

export function buildTicketAvailabilityEmail({ ticket, senderEmail, recipientEmail, ticketCount }) {
  const eventName = esc(ticket?.event_name) || "your event";
  const eventImage = ticket?.event_image || "";
  const count = ticketCount && ticketCount > 1 ? ticketCount : 1;
  const recipientName = nameFromEmail(recipientEmail) || "there";
  const senderName = nameFromEmail(senderEmail) || senderEmail || "the sender";

  const venue = esc(ticket?.venue_name);
  const eventDate = esc(ticket?.event_date);
  const section = esc(ticket?.section_bay);
  const row = esc(ticket?.row);
  const seat = esc(ticket?.seat_number);
  const ticketType = esc(ticket?.ticket_type);

  const ticketsWord = count > 1 ? `${count} ${highlight("tickets")}` : highlight("ticket");
  const headerLine = `You have successfully accepted ${ticketsWord} to ${eventName}`;

  // Build seat detail lines — one per ticket if multiple, else single
  const seatLines = [];
  if (section || row || seat) {
    const parts = [];
    if (section) parts.push(`Section ${section}`);
    if (row) parts.push(`Row ${row}`);
    if (seat) parts.push(`Seat ${seat}`);
    seatLines.push(parts.join(", "));
  }
  // If multiple tickets, repeat the seat line for each (placeholder same seat info)
  if (count > 1 && seatLines.length > 0) {
    for (let i = 1; i < count; i++) seatLines.push(seatLines[0]);
  }

  const seatBlock = seatLines.length > 0
    ? seatLines.map((line) => `<div style="font-size:14px;color:#ffffff;font-weight:500;line-height:1.5;">${line}</div>`).join("")
    : "";

  const bodyCopy =
    `Hi ${recipientName},` +
    `<br/><br/>` +
    `You have successfully accepted your ${highlight("ticket")} transfer from ${senderName} and you're now on your way to see ${eventName}.` +
    `<br/><br/>` +
    `Your ${highlight("ticket(s)")} ${highlight("will")} be ${highlight("available")} in your account 24 hours before the event. No action is required from your end.`;

  // 3-step progress bar
  const step = (label, iconSvg) => `
    <td style="text-align:center;width:33%;vertical-align:top;padding:0 4px;">
      <div style="width:46px;height:46px;border-radius:50%;background-color:#001f2d;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;">
        ${iconSvg}
      </div>
      <div style="font-size:12px;font-weight:600;color:#ffffff;letter-spacing:0.3px;">${label}</div>
    </td>`;
  const connector = `<td style="width:8px;"><div style="height:2px;background-color:#001f2d;margin-top:22px;"></div></td>`;

  const progressBar = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;max-width:340px;">
      <tr>
        ${step("Received", '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>')}
        ${connector}
        ${step("Accepted", '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>')}
        ${connector}
        ${step("Complete", '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>')}
      </tr>
    </table>`;

  // Hero image
  const heroBlock = eventImage
    ? `<div style="margin:0 0 20px;border-radius:12px;overflow:hidden;">
         <img src="${eventImage}" alt="${eventName}" style="width:100%;display:block;max-width:100%;"/>
       </div>`
    : "";

  // Event info card with seat details (matches reference design)
  const eventInfoCard = `
    <div style="background-color:#003352;border:1px solid #004070;border-radius:12px;padding:20px;margin:0 0 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:top;width:28px;padding-top:2px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </td>
          <td style="vertical-align:top;padding-left:4px;">
            <div style="font-size:17px;font-weight:700;color:#ffffff;line-height:1.3;margin-bottom:6px;">${eventName}</div>
            ${eventDate ? `<div style="font-size:13px;color:#cccccc;line-height:1.5;">${eventDate.toUpperCase()}</div>` : ""}
            ${venue ? `<div style="font-size:13px;color:#cccccc;line-height:1.5;">${venue}</div>` : ""}
          </td>
        </tr>
        ${seatBlock ? `
        <tr>
          <td colspan="2" style="padding:14px 0 10px;">
            <div style="border-top:1px solid #004070;"></div>
          </td>
        </tr>
        <tr>
          <td style="vertical-align:top;width:28px;padding-top:2px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l3-3 3 3"/><path d="M2 15l3 3 3-3"/><path d="M2 12h6"/><path d="M22 9l-3-3-3 3"/><path d="M22 15l-3 3-3-3"/><path d="M22 12h-6"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>
          </td>
          <td style="vertical-align:top;padding-left:4px;">
            ${ticketType ? `<div style="font-size:13px;color:#cccccc;margin-bottom:4px;">${ticketType}</div>` : ""}
            ${seatBlock}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top:14px;">
            <div style="display:inline-block;background-color:#1b5e20;color:#a5d6a7;font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.3px;">✓ Transfer Complete</div>
          </td>
        </tr>
        ` : ""}
      </table>
    </div>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#001f2d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#001f2d;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="500" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 8px 24px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.35;letter-spacing:0.2px;">${headerLine}</h1>
            </td>
          </tr>

          <!-- Hero image -->
          <tr>
            <td style="padding:0 8px;">${heroBlock}</td>
          </tr>

          <!-- Event info card with seats -->
          <tr>
            <td style="padding:0 8px;">${eventInfoCard}</td>
          </tr>

          <!-- What's Next heading -->
          <tr>
            <td style="padding:0 8px 12px;">
              <h2 style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">What's Next?</h2>
            </td>
          </tr>

          <!-- Body copy -->
          <tr>
            <td style="padding:0 8px;font-size:15px;color:#cccccc;line-height:1.6;">
              ${bodyCopy}
            </td>
          </tr>

          <!-- Progress bar -->
          <tr>
            <td style="padding:24px 4px 0;">${progressBar}</td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 8px 0;font-size:11px;color:#9aa0a6;line-height:1.5;">
              Ticketek Pty Limited ABN 92 010 129 110
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `Your ticket(s) will be available 24 hours before ${eventName}`,
    html,
  };
}