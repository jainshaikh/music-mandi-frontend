"use client";

// Ported from the prototype's inline `preview()` helper inside `builder()` —
// a 3-step "customer experience" preview (call starts / audio plays / SMS
// arrives), shared by both the "Preview full ad" (creative section) and
// "Preview ad" (review section) buttons.
export default function AdPreviewModal({
  sms,
  onClose,
}: {
  sms: string;
  onClose: () => void;
}) {
  return (
    <div
      className="flow-modal on"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flow-modal-card">
        <button
          className="modal-x"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <span className="route-kicker">Seller Ads preview</span>
        <h3>Customer experience</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
          }}
        >
          <div className="seller-review-card">
            <small>01</small>
            <b>Call starts</b>
            <p>Connection window opens.</p>
          </div>
          <div className="seller-review-card">
            <small>02</small>
            <b>Audio plays</b>
            <p>Your Seller Ads audio message plays.</p>
          </div>
          <div className="seller-review-card">
            <small>03</small>
            <b>SMS &amp; WhatsApp arrives</b>
            <p>{sms}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
