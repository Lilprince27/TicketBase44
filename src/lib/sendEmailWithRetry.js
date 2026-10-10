import { base44 } from "@/api/base44Client";

/**
 * Sends an email via the Core.SendEmail integration with automatic retries.
 * Returns { ok: true } on success, or { ok: false, error } after all retries fail.
 * Transient failures (network blips, momentary rate limits) get retried;
 * permanent failures (unregistered recipient w/o custom domain, content screening)
 * surface immediately so the caller can show the user a real error.
 */
export async function sendEmailWithRetry({ to, subject, body, html, text, maxRetries = 2 }) {
  const payload = { to, subject };
  if (body) payload.body = body;
  if (html) payload.html = html;
  if (text) payload.text = text;

  let lastErr = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await base44.integrations.Core.SendEmail(payload);
      return { ok: true };
    } catch (e) {
      lastErr = e;
      const msg = (e && (e.message || e.error || String(e))) || "";
      // Permanent failures — do not retry
      if (
        /not a registered|not registered|custom domain|paid plan|content screening|rejected/i.test(msg)
      ) {
        return { ok: false, error: msg, permanent: true };
      }
      // Transient — wait briefly then retry
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }
  const msg = (lastErr && (lastErr.message || lastErr.error || String(lastErr))) || "Email could not be sent.";
  return { ok: false, error: msg };
}