import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Full-screen management sheet shown when a sender taps a shared/accepted ticket.
 * Two actions: "Cancel share" and "Event info".
 */
export default function SharedTicketManageModal({
  ticket,
  shareRecord,
  onClose,
  onCancelShare,
}) {
  const navigate = useNavigate();
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const handleCancel = async (sendEmail) => {
    if (cancelling) return;
    setCancelling(true);
    try {
      await onCancelShare(shareRecord, ticket, sendEmail);
      onClose();
    } finally {
      setCancelling(false);
    }
  };

  const btnStyle = {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "white",
    border: "none",
    borderRadius: 14,
    padding: "20px",
    cursor: "pointer",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    textAlign: "left",
    width: "100%",
  };

  const labelStyle = {
    fontSize: 17,
    fontWeight: 600,
    color: "#001f2d",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#FAFAFA",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Navy header */}
      <div
        style={{
          background: "#001f2d",
          paddingTop: "calc(env(safe-area-inset-top) + 16px)",
          paddingBottom: 16,
          paddingLeft: 20,
          paddingRight: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "white", fontSize: 17, fontWeight: 600 }}>
          Manage shared ticket
        </span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Action buttons / confirmation */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "40px 20px",
        }}
      >
        {!confirmCancel ? (
          <button
            onClick={() => setConfirmCancel(true)}
            style={btnStyle}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#001f2d"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span style={labelStyle}>Cancel share</span>
          </button>
        ) : (
          <>
            <p style={{ fontSize: 15, color: "#666", margin: "0 0 4px", lineHeight: 1.4 }}>
              Choose how to cancel this shared ticket:
            </p>
            <button
              onClick={() => handleCancel(true)}
              disabled={cancelling}
              style={{ ...btnStyle, cursor: cancelling ? "default" : "pointer" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#001f2d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span style={labelStyle}>
                {cancelling ? "Cancelling..." : "Cancel and send email"}
              </span>
            </button>
            <button
              onClick={() => handleCancel(false)}
              disabled={cancelling}
              style={{ ...btnStyle, cursor: cancelling ? "default" : "pointer" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#001f2d"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span style={labelStyle}>
                {cancelling ? "Cancelling..." : "Cancel without email"}
              </span>
            </button>
          </>
        )}

        <button
          onClick={() => {
            onClose();
            navigate(`/ticket-detail/${ticket.id}`);
          }}
          style={btnStyle}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#001f2d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          <span style={labelStyle}>Event info</span>
        </button>
      </div>
    </div>
  );
}