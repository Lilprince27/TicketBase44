// Shared helpers for the Ticketek AU <-> AXS subscription bridge.

export function toBridgePayload(record) {
  return {
    user_email: (record?.user_email || "").trim(),
    user_name: record?.user_name || "",
    duration: record?.duration || "1_month",
    start_date: record?.start_date || new Date().toISOString(),
    end_date: record?.end_date || null,
    status: record?.status || "active",
    granted_by: record?.granted_by || "Subscription bridge",
  };
}

export function secretMatches(provided, expected) {
  if (!provided || !expected) return false;
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i += 1) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function bridgeUrlFor(baseUrl, functionName) {
  return `${String(baseUrl).trim().replace(/\/+$/, "")}/functions/${functionName}`;
}