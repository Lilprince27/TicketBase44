/**
 * Builds the "ticket availability" email sent to the RECIPIENT ONLY after a
 * transfer/share is accepted. Distinct from the acceptance confirmation —
 * this one tells the recipient their ticket(s) will appear in the Ticketek
 * app 24 hours before the event.
 *
 * Layout matches the reference: dark charcoal background, centered header,
 * a 3-step progress bar (Received → Accepted → Complete), body copy with
 * gold-highlighted key phrases, and the event image.
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

export function buildTicketAvailabilityEmail({ ticket, senderEmail, recipientEmail, ticketCount }) {
  const eventName = (ticket?.event_name || "your event").replace(/[<>]/g, "");
  const eventImage = ticket?.event_image || "";
  const count = ticketCount && ticketCount > 1 ? ticketCount : 1;
  const recipientName = nameFromEmail(recipientEmail) || "there";
  const senderName = nameFromEmail(senderEmail) || senderEmail || "the sender";

  const ticketsWord = count > 1 ? `${count} ${highlight("tickets")}` : highlight("ticket");
  const headerLine = `You have successfully accepted ${ticketsWord} to ${eventName}`;

  const bodyCopy =
    `Hi ${recipientName},` +
    `<br/><br/>` +
    `You have successfully accepted your ${highlight("ticket")} transfer from ${senderName} and you're now on your way to see ${eventName}.` +
    `<br/><br/>` +
    `Your ${highlight("ticket(s)")} ${highlight("will")} be ${highlight("available")} in your account 24 hours before the event. No action is required from your end.`;

  // 3-step progress bar
  const step = (label, iconSvg) => `
    <td style="text-align:center;width:33%;vertical-align:top;padding:0 4px;">
      <div style="width:46px;height:46px;border-radius:50%;background-color:#007bff;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;">
        ${iconSvg}
      </div>
      <div style="font-size:12px;font-weight:600;color:#ffffff;letter-spacing:0.3px;">${label}</div>
    </td>`;
  const connector = `<td style="width:8px;"><div style="height:2px;background-color:#007bff;margin-top:22px;"></div></td>`;

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

  const imageBlock = eventImage
    ? `<div style="margin:0 0 24px;text-align:center;">
         <img src="${eventImage}" alt="${eventName}" style="max-width:100%;border-radius:12px;display:block;margin:0 auto;"/>
       </div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#1c1d1f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1c1d1f;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="500" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 8px 24px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.35;letter-spacing:0.2px;">${headerLine}</h1>
            </td>
          </tr>

          <!-- Progress bar -->
          <tr>
            <td style="padding:0 4px;">${progressBar}</td>
          </tr>

          <!-- Event image -->
          <tr>
            <td>${imageBlock}</td>
          </tr>

          <!-- Body copy -->
          <tr>
            <td style="padding:0 8px;font-size:15px;color:#ffffff;line-height:1.6;">
              ${bodyCopy}
            </td>
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