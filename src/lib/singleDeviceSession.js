import { base44 } from "@/api/base44Client";

const SESSION_KEY_PREFIX = "tk_active_session_";

export function getLocalSessionId(email) {
  if (!email) return null;
  return localStorage.getItem(`${SESSION_KEY_PREFIX}${email.toLowerCase()}`);
}

export function setLocalSessionId(email, sessionId) {
  if (!email || !sessionId) return;
  localStorage.setItem(`${SESSION_KEY_PREFIX}${email.toLowerCase()}`, sessionId);
}

export function clearLocalSessionId(email) {
  if (!email) return;
  localStorage.removeItem(`${SESSION_KEY_PREFIX}${email.toLowerCase()}`);
}

export function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Claims the single active device session for this user account.
 * If another device was logged in, its stored session id will no longer match
 * `active_session_id` on UserProfile, causing that device to log out automatically.
 */
export async function claimSingleDeviceSession(email) {
  if (!email) return null;
  const normalizedEmail = email.trim();
  const newSessionId = generateSessionId();
  setLocalSessionId(normalizedEmail, newSessionId);

  const profiles = await base44.entities.UserProfile.filter({ user_email: normalizedEmail }).catch(() => []);
  if (profiles.length > 0) {
    await base44.entities.UserProfile.update(profiles[0].id, { active_session_id: newSessionId }).catch(() => {});
  } else {
    const uid = "UID:" + Array.from({ length: 21 }, () => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 36)]).join("");
    const prefix = normalizedEmail.slice(0, 3).toLowerCase().replace(/[^a-z0-9]/g, "x");
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let suffix = "";
    for (let i = 0; i < 12; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
    const authCode = `${prefix}:${suffix}`;
    await base44.entities.UserProfile.create({
      user_email: normalizedEmail,
      uid,
      notifications_enabled: false,
      auth_code: authCode,
      active_session_id: newSessionId,
    }).catch(() => {});
  }

  return newSessionId;
}