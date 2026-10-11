import { base44 } from "@/api/base44Client";

/**
 * Creates a ticket notification record for the recipient.
 * The recipient's app picks this up via real-time subscription and
 * shows an in-app banner + system (Web Notification) alert.
 */
export async function createTicketNotification({
  recipientEmail,
  senderEmail,
  senderName = "",
  eventName = "",
  notificationType = "transfer",
  ticketCount = 1,
}) {
  try {
    await base44.entities.TicketNotification.create({
      recipient_email: recipientEmail,
      sender_email: senderEmail,
      sender_name: senderName,
      event_name: eventName,
      notification_type: notificationType,
      ticket_count: ticketCount,
      read: false,
    });
  } catch (e) {
    console.warn("[notification] create failed:", e);
  }
}