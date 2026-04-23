export default function BetaBanner() {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #0a1628 0%, #1a3a6b 50%, #0a1628 100%)",
        borderBottom: "3px solid #f59e0b",
        padding: "10px 16px",
        textAlign: "center",
        position: "sticky",
        top: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          background: "#f59e0b",
          color: "#0a1628",
          fontWeight: 900,
          fontSize: "11px",
          letterSpacing: "0.12em",
          padding: "3px 10px",
          borderRadius: "4px",
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        BETA
      </span>
      <span
        style={{
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: "0.02em",
        }}
      >
        We are currently working on login &mdash; this is a{" "}
        <span style={{ color: "#fcd34d" }}>look &amp; feel beta</span>.{" "}
        Full launch coming soon.
      </span>
      <span
        style={{
          color: "#93c5fd",
          fontSize: "13px",
          fontWeight: 500,
        }}
      >
        Thank you for your patience.
      </span>
    </div>
  );
}
