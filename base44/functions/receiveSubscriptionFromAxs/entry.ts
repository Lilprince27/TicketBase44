import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { toBridgePayload, secretMatches } from '../../shared/subscriptionBridge.ts';

// Public endpoint called by the AXS app. Authenticity comes from the shared bridge secret.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const expected = secrets.get('AXS_BRIDGE_SECRET');
    const provided = req.headers.get('x-bridge-secret') || '';
    if (!expected || !secretMatches(provided, expected)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const payload = body?.subscription || body;
    const email = (payload?.user_email || '').trim();
    if (!email) return Response.json({ error: 'user_email is required' }, { status: 400 });

    const record = { ...toBridgePayload({ ...payload, user_email: email }), synced_from_axs: true };

    const existing = await base44.asServiceRole.entities.Subscription.filter({ user_email: email });
    const match = existing.find((s) => s.status === 'active') || existing[0];

    if (match) {
      await base44.asServiceRole.entities.Subscription.update(match.id, record);
      return Response.json({ ok: true, action: 'updated', id: match.id });
    }

    const created = await base44.asServiceRole.entities.Subscription.create(record);
    return Response.json({ ok: true, action: 'created', id: created.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}