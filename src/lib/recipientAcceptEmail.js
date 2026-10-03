/**
 * Builds the confirmation email sent to the RECIPIENT after they accept a
 * shared/transferred ticket. Distinct from the sender's "ticket accepted"
 * email — this one congratulates the recipient and tells them the ticket is
 * in their wallet.
 *
 * Layout matches the reference: light-blue header band with a green
 * "Ticket Accepted!" heading, dark charcoal body with the event details.
 */

export function buildRecipientAcceptEmail(ticket) {
  const eventName = (ticket?.event_name || "your event").replace(/[<>]/g, "");
  const venue = (ticket?.venue_name || "").replace(/[<>]/g, "");
  const eventDate = (ticket?.event_date || "").replace(/[<>]/g, "");

  const detailLine = [venue, eventDate].filter(Boolean).join(" · ");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="500" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;width:100%;border-radius:14px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.08);">

          <!-- Light blue header -->
          <tr>
            <td style="background-color:#e3f2fd;padding:32px 24px;text-align:center;">
              <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#2e7d32;letter-spacing:0.3px;">Ticket Accepted!</h1>
              <p style="margin:0;font-size:15px;color:#37474f;line-height:1.5;">You've successfully accepted the ticket. Enjoy the show!</p>
            </td>
          </tr>

          <!-- Dark charcoal body -->
          <tr>
            <td style="background-color:#212121;padding:28px 24px;">
              <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#ffffff;">${eventName}</p>
              <p style="margin:0 0 18px;font-size:14px;color:#b0bec5;line-height:1.5;">${detailLine}</p>
              <p style="margin:0 0 18px;font-size:14px;color:#cfd8dc;line-height:1.6;">Your ticket is now in your wallet. Open the Ticketek app to view it and present it at the venue for entry.</p>
              <p style="margin:0;font-size:11px;color:#616161;">Ticketek Pty Limited ABN 92 010 129 110</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `Ticket accepted: ${eventName}`,
    html,
  };
}