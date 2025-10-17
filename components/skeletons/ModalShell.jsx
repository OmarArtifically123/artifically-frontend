const overlayStyle = {
  position: "fixed",
  inset: 0,
  display: "grid",
  placeItems: "center",
  backgroundColor: "rgba(15, 23, 42, 0.72)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  zIndex: 60,
};

const surfaceStyle = {
  width: "min(100%, 720px)",
  minHeight: "480px",
  borderRadius: "1.5rem",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  background:
    "linear-gradient(145deg, rgba(15, 23, 42, 0.82) 0%, rgba(30, 41, 59, 0.9) 60%, rgba(15, 23, 42, 0.92) 100%)",
  padding: "clamp(1.5rem, 2.5vw, 2.5rem)",
  display: "grid",
  gap: "1rem",
  position: "relative",
  overflow: "hidden",
};

const shimmerStyle = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(135deg, rgba(148, 163, 184, 0.05) 0%, rgba(148, 163, 184, 0.18) 45%, rgba(148, 163, 184, 0.05) 100%)",
  opacity: 0.35,
  animation: "skeletonShimmer 1.6s ease-in-out infinite",
};

const lineStyle = (width, height) => ({
  width,
  height,
  borderRadius: "999px",
  backgroundColor: "rgba(148, 163, 184, 0.16)",
  position: "relative",
  overflow: "hidden",
});

const blockStyle = {
  display: "grid",
  gap: "0.75rem",
};

export default function ModalShell({ label = "Loading", height = 480 }) {
  return (
    <div style={overlayStyle} role="presentation">
      <div style={{ ...surfaceStyle, minHeight: `${height}px` }} role="status" aria-live="polite">
        <span className="sr-only">{label}</span>
        <div style={shimmerStyle} aria-hidden />
        <div style={blockStyle}>
          <div style={lineStyle("60%", "2.8rem")} aria-hidden />
          <div style={lineStyle("72%", "1rem")} aria-hidden />
        </div>
        <div style={{ ...blockStyle, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          {["68%", "88%", "54%", "72%"].map((width) => (
            <div
              key={width}
              style={{
                ...lineStyle(width, "1.25rem"),
                minHeight: "1.25rem",
              }}
              aria-hidden
            />
          ))}
        </div>
        <div style={{ ...blockStyle, marginTop: "auto" }}>
          <div style={lineStyle("100%", "8rem")} aria-hidden />
          <div style={lineStyle("78%", "1.25rem")} aria-hidden />
        </div>
      </div>
    </div>
  );
}