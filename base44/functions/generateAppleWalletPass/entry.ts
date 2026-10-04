import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';

// Generates a real Apple Wallet pass via the PassNinja API.
// Frontend sends the ticket object; we map it to the pass template's fields
// and return the landing URL that installs the pass on the device.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const apiKey = secrets.get("PASSNINJA_API_KEY");
    const accountId = secrets.get("PASSNINJA_ACCOUNT_ID");
    const templateId = secrets.get("PASSNINJA_TEMPLATE_ID");
    if (!apiKey || !accountId || !templateId) {
      return Response.json(
        { error: 'PassNinja credentials not configured. Set PASSNINJA_API_KEY, PASSNINJA_ACCOUNT_ID and PASSNINJA_TEMPLATE_ID in app secrets.' },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }
    const ticket = body?.ticket;
    if (!ticket || !ticket.serial_number) {
      return Response.json({ error: 'Ticket data with a serial_number is required' }, { status: 400 });
    }

    const verifyUrl = `https://www.ticketek.com.au/t/${(ticket.serial_number || "").trim() || "0"}`;

    // Standard PassNinja event-ticket field keys. Match these keys to the
    // fields you define on your PassNinja pass template in the dashboard.
    const passFields = {
      "primary.value": ticket.event_name || "Event Ticket",
      "secondary.1.value": ticket.venue_name || "",
      "secondary.2.value": ticket.event_date || "",
      "auxiliary.1.value": ticket.section_bay || ticket.level_stand || "",
      "auxiliary.2.value": ticket.row || "",
      "auxiliary.3.value": ticket.seat_number || "",
      "header.value": ticket.ticket_type || "General Admission",
      "barcode.value": verifyUrl,
    };
    if (ticket.event_image) passFields["strip.image"] = ticket.event_image;

    const pnRes = await fetch('https://api.passninja.com/v1/passes', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'X-ACCOUNT-ID': accountId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passTemplate: templateId, pass: passFields }),
    });

    if (!pnRes.ok) {
      const errText = await pnRes.text().catch(() => '');
      return Response.json(
        { error: `PassNinja error (${pnRes.status}): ${errText || pnRes.statusText}` },
        { status: 502 }
      );
    }

    const pnData = await pnRes.json();
    const landingUrl = pnData?.urls?.landing;
    if (!landingUrl) {
      return Response.json(
        { error: 'PassNinja response did not include a landing URL' },
        { status: 502 }
      );
    }

    return Response.json({ landingUrl, serialNumber: pnData.serialNumber || null });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Failed to generate wallet pass' },
      { status: 500 }
    );
  }
}