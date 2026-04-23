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
          background: "#ef4444",
          color: "#ffffff",
          fontWeight: 900,
          fontSize: "11px",
          letterSpacing: "0.12em",
          padding: "3px 10px",
          borderRadius: "4px",
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        NOTICE
      </span>
      <span
        style={{
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: "0.02em",
        }}
      >
        Login is temporarily unavailable &mdash; we&apos;re working on it now.
      </span>
      <span
        style={{
          color: "#93c5fd",
          fontSize: "13px",
          fontWeight: 500,
        }}
      >
        Check back shortly.
      </span>
    </div>
  );
}
