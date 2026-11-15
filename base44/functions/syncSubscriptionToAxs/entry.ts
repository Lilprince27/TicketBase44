import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { toBridgePayload, bridgeUrlFor } from '../../shared/subscriptionBridge.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { subscription_id } = await req.json().catch(() => ({}));
    if (!subscription_id) return Response.json({ error: 'subscription_id is required' }, { status: 400 });

    const sub = await base44.asServiceRole.entities.Subscription.get(subscription_id)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!sub) return Response.json({ error: 'Subscription not found' }, { status: 404 });
    if (!sub.user_email) return Response.json({ error: 'Subscription has no email' }, { status: 400 });

    const bridgeUrl = secrets.get('AXS_BRIDGE_URL');
    const bridgeSecret = secrets.get('AXS_BRIDGE_SECRET');
    if (!bridgeUrl || !bridgeSecret) {
      return Response.json({ error: 'Subscription bridge is not configured yet' }, { status: 400 });
    }

    const response = await fetch(bridgeUrlFor(bridgeUrl, 'bridgeSubscription'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bridge-secret': bridgeSecret },
      body: JSON.stringify({ source_app: 'ticketek-au', subscription: toBridgePayload(sub) }),
      signal: AbortSignal.timeout(15000),
    });

    const text = await response.text().catch(() => '');
    if (!response.ok) {
      return Response.json({ ok: false, status: response.status, detail: text.slice(0, 400) }, { status: 502 });
    }

    return Response.json({ ok: true, email: sub.user_email, axs: text.slice(0, 400) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}