import { base44 } from "@/api/base44Client";

/**
 * Moves every ticket a user has accepted but not yet claimed into their
 * wallet, so it appears on the Tickets page.
 */
export async function claimAcceptedShares(userEmail) {
  if (!userEmail) return 0;
  const shares = await base44.entities.SharedTicket.filter({ accepted_by: userEmail });
  let claimed = 0;
  for (const share of shares) {
    if (share.claimed_date) continue;
    let ticketData = null;
    try {
      ticketData = JSON.parse(share.ticket_snapshot);
    } catch {
      continue;
    }
    await base44.entities.Ticket.create({ ...ticketData, owner_email: userEmail });
    await base44.entities.SharedTicket.update(share.id, { claimed_date: new Date().toISOString() });
    claimed += 1;
  }
  return claimed;
}