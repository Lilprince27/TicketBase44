/**
 * Generates a premium, mobile-first HTML email for ticket transfers.
 * Original design — not copied from any specific company's branding.
 */

function generateTransferId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TRF-${ts}-${rand}`;
}

function generateOrderId(ticket) {
  if (ticket.order_number) return ticket.order_number;
  const seed = (ticket.id || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const date = ticket.purchase_date ? ticket.purchase_date.replace(/\D/g, "").slice(0, 8) : new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const num = String(10000 + (seed % 89999)).padStart(5, "0");
  return `${date},${num}`;
}

function formatExpirationDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function buildTransferEmailHtml({ ticket, recipientName, senderName, appUrl = "https://tickeket.xyz" }) {
  const transferId = generateTransferId();
  const orderId = generateOrderId(ticket);
  const expirationDate = formatExpirationDate();
  const heroImage = ticket.event_image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=300&fit=crop";
  const acceptUrl = `${appUrl}/tickets`;
  const supportUrl = `${appUrl}/account`;
  const privacyUrl = `${appUrl}/account`;
  const termsUrl = `${appUrl}/account`;
  const qty = ticket.pax_number || "1";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Ticket Transfer</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!--[if mso]>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
  <![endif]-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f2f5;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Light header -->
          <tr>
            <td style="background-color:#e8ecf5;padding:28px 32px;text-align:center;">
              <span style="font-size:13px;font-weight:600;color:#5a6a8a;letter-spacing:2px;text-transform:uppercase;">Ticket Transfer</span>
            </td>
          </tr>

          <!-- Hero image -->
          <tr>
            <td style="padding:0;">
              <img src="${heroImage}" alt="${ticket.event_name}" width="600" style="display:block;width:100%;max-width:600px;height:auto;object-fit:cover;" />
            </td>
          </tr>

          <!-- Status badge -->
          <tr>
            <td style="padding:24px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#e8f5e9;border-radius:100px;padding:8px 16px;">
                    <span style="font-size:12px;font-weight:700;color:#2e7d32;letter-spacing:0.5px;">● PENDING ACCEPTANCE</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting + message -->
          <tr>
            <td style="padding:20px 32px 0;">
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:#0a1929;line-height:1.2;">${ticket.event_name}</h1>
              <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#0a1929;">You've received a ticket!</p>
              <p style="margin:0 0 8px;font-size:16px;color:#3a4a5a;line-height:1.6;">Hi ${recipientName},</p>
              <p style="margin:0;font-size:15px;color:#5a6a7a;line-height:1.6;">${senderName} has transferred a ticket to you. Review the details below and accept your ticket to add it to your wallet.</p>
            </td>
          </tr>

          <!-- Info card -->
          <tr>
            <td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border-radius:14px;border:1px solid #e8ecf2;">
                <tr>
                  <td style="padding:24px 24px 8px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8a9aaa;letter-spacing:1px;text-transform:uppercase;">Event</p>
                    <p style="margin:0 0 20px;font-size:17px;font-weight:700;color:#0a1929;">${ticket.event_name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom:16px;width:50%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8a9aaa;letter-spacing:1px;text-transform:uppercase;">Date</p>
                          <p style="margin:0;font-size:14px;color:#3a4a5a;font-weight:500;">${ticket.event_date}</p>
                        </td>
                        <td style="padding-bottom:16px;width:50%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8a9aaa;letter-spacing:1px;text-transform:uppercase;">Venue</p>
                          <p style="margin:0;font-size:14px;color:#3a4a5a;font-weight:500;">${ticket.venue_name}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e8ecf2;padding-top:16px;">
                      <tr>
                        <td style="padding-bottom:16px;width:33%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8a9aaa;letter-spacing:1px;text-transform:uppercase;">Section</p>
                          <p style="margin:0;font-size:14px;color:#3a4a5a;font-weight:600;">${ticket.section_bay || "—"}</p>
                        </td>
                        <td style="padding-bottom:16px;width:33%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8a9aaa;letter-spacing:1px;text-transform:uppercase;">Row</p>
                          <p style="margin:0;font-size:14px;color:#3a4a5a;font-weight:600;">${ticket.row || "—"}</p>
                        </td>
                        <td style="padding-bottom:16px;width:34%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8a9aaa;letter-spacing:1px;text-transform:uppercase;">Seat</p>
                          <p style="margin:0;font-size:14px;color:#3a4a5a;font-weight:600;">${ticket.seat_number || "—"}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e8ecf2;padding-top:16px;">
                      <tr>
                        <td style="width:50%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8a9aaa;letter-spacing:1px;text-transform:uppercase;">Ticket Type</p>
                          <p style="margin:0;font-size:14px;color:#3a4a5a;font-weight:600;">${ticket.ticket_type || "General Admission"}</p>
                        </td>
                        <td style="width:50%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8a9aaa;letter-spacing:1px;text-transform:uppercase;">Quantity</p>
                          <p style="margin:0;font-size:14px;color:#3a4a5a;font-weight:600;">${qty}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accept button -->
          <tr>
            <td style="padding:28px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="border-radius:14px;background-color:#0a7c4a;">
                    <a href="${acceptUrl}" target="_blank" style="display:block;padding:18px 0;font-size:17px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">Accept Ticket</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Post-acceptance actions -->
          <tr>
            <td style="padding:16px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="border-radius:12px;background-color:#ffffff;border:1.5px solid #0a1929;">
                    <a href="${acceptUrl}/ticket-detail/${ticket.id}" target="_blank" style="display:block;padding:14px 0;font-size:14px;font-weight:600;color:#0a1929;text-decoration:none;">View Ticket</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" width="50%" style="padding-right:6px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="border-radius:12px;background-color:#0a0a0a;">
                          <a href="${acceptUrl}" target="_blank" style="display:block;padding:14px 0;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">Apple Wallet</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="center" width="50%" style="padding-left:6px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="border-radius:12px;background-color:#0a0a0a;">
                          <a href="${acceptUrl}" target="_blank" style="display:block;padding:14px 0;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">Google Wallet</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order + Transfer IDs + Expiration -->
          <tr>
            <td style="padding:28px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e8ecf2;">
                <tr>
                  <td style="padding:20px 0 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:50%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8a9aaa;letter-spacing:1px;text-transform:uppercase;">Order ID</p>
                          <p style="margin:0;font-size:13px;color:#3a4a5a;font-family:monospace;font-weight:500;">${orderId}</p>
                        </td>
                        <td style="width:50%;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8a9aaa;letter-spacing:1px;text-transform:uppercase;">Transfer ID</p>
                          <p style="margin:0;font-size:13px;color:#3a4a5a;font-family:monospace;font-weight:500;">${transferId}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 0 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#fff8e1;border-radius:10px;padding:14px 16px;">
                          <p style="margin:0;font-size:13px;color:#7a5a00;font-weight:600;">⏳ Transfer expires on ${expirationDate}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security notice -->
          <tr>
            <td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4ff;border-radius:12px;border:1px solid #d0dcf5;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1a3a7a;">🔒 Security Notice</p>
                    <p style="margin:0;font-size:12px;color:#3a5a8a;line-height:1.6;">This ticket transfer can only be accepted <strong>once</strong>. Once accepted, the ticket is permanently assigned to your account and the original sender will no longer have access. If you did not expect this transfer, please contact support immediately.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer links -->
          <tr>
            <td style="padding:32px 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e8ecf2;">
                <tr>
                  <td style="padding:20px 0 0;text-align:center;">
                    <p style="margin:0 0 12px;font-size:13px;color:#5a6a7a;">Need help with your transfer?</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="padding:0 8px;">
                          <a href="${supportUrl}" style="font-size:13px;color:#0a5c9e;text-decoration:none;font-weight:500;">Support</a>
                        </td>
                        <td style="padding:0 8px;color:#d0d8e0;">·</td>
                        <td style="padding:0 8px;">
                          <a href="${privacyUrl}" style="font-size:13px;color:#0a5c9e;text-decoration:none;font-weight:500;">Privacy Policy</a>
                        </td>
                        <td style="padding:0 8px;color:#d0d8e0;">·</td>
                        <td style="padding:0 8px;">
                          <a href="${termsUrl}" style="font-size:13px;color:#0a5c9e;text-decoration:none;font-weight:500;">Terms</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:20px 0 0;font-size:11px;color:#aab4c0;line-height:1.5;">This email was sent because a ticket was transferred to you.<br/>© 2026 Ticketek. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  <!--[if mso]>
  </td></tr></table>
  <![endif]-->
</body>
</html>`;
}