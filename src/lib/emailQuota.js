/**
 * Unified email quota for both share and transfer actions.
 * Both features consume from the same `email_transfer_quota` /
 * `email_transfer_used` counters on UserProfile, so a user with 6
 * allotted emails can only perform 6 total share+transfer actions
 * until their quota is renewed.
 */

import { base44 } from "@/api/base44Client";

/**
 * Fetches the current quota state for the logged-in user.
 * Returns { quota, used, remaining, profileId } or null if no profile.
 */
export async function getEmailQuota() {
  const me = await base44.auth.me();
  if (!me) return null;
  const profiles = await base44.entities.UserProfile.filter({ user_email: me.email });
  if (profiles.length === 0) return null;
  const p = profiles[0];
  const quota = p.email_transfer_quota || 0;
  const used = p.email_transfer_used || 0;
  return {
    quota,
    used,
    remaining: Math.max(0, quota - used),
    profileId: p.id,
  };
}

/**
 * Checks whether the user has at least one email quota remaining.
 * Throws an Error with a friendly message if the quota is exhausted.
 * Returns the quota state (with profileId + used) on success so the
 * caller can decrement without a second lookup.
 */
export async function assertEmailQuotaAvailable() {
  const state = await getEmailQuota();
  if (!state) {
    throw new Error("Unable to verify your email quota. Please try again.");
  }
  if (state.remaining <= 0) {
    throw new Error(
      `You have used all ${state.quota} of your allotted ticket emails. ` +
        "Please contact admin to renew your quota."
    );
  }
  return state;
}

/**
 * Decrements the user's remaining email quota by 1 (increments
 * email_transfer_used). Pass the state returned by
 * assertEmailQuotaAvailable() so we don't need a second auth.me() +
 * filter round-trip. Falls back to a fresh lookup if state is omitted.
 */
export async function decrementEmailQuota(state) {
  let s = state;
  if (!s || !s.profileId) {
    s = await getEmailQuota();
  }
  if (!s) return;
  await base44.entities.UserProfile.update(s.profileId, {
    email_transfer_used: (s.used || 0) + 1,
  });
  return (s.used || 0) + 1;
}