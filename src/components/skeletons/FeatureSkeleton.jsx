export default function FeatureSkeletonGrid({ cards = 6 }) {
  return (
    <div
      className="features-grid"
      aria-hidden
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          style={{
            padding: "1.75rem",
            borderRadius: "1.25rem",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "linear-gradient(160deg, rgba(148,163,184,0.2), rgba(148,163,184,0.1))",
            display: "grid",
            gap: "1.25rem",
            minHeight: "220px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.85rem",
                background: "rgba(99,102,241,0.25)",
                display: "block",
                animation: "pulse 1.6s ease-in-out infinite",
              }}
            />
            <span
              style={{
                width: "5rem",
                height: "0.8rem",
                borderRadius: "999px",
                background: "rgba(148,163,184,0.4)",
                animation: "pulse 1.6s ease-in-out infinite",
              }}
            />
          </div>
          <span
            style={{
              width: "70%",
              height: "1.2rem",
              borderRadius: "999px",
              background: "rgba(226,232,240,0.6)",
              animation: "pulse 1.6s ease-in-out infinite",
            }}
          />
          <span
            style={{
              width: "100%",
              height: "0.9rem",
              borderRadius: "999px",
              background: "rgba(203,213,225,0.5)",
              animation: "pulse 1.6s ease-in-out infinite",
            }}
          />
          <span
            style={{
              width: "60%",
              height: "0.9rem",
              borderRadius: "999px",
              background: "rgba(203,213,225,0.35)",
              animation: "pulse 1.6s ease-in-out infinite",
            }}
          />
        </div>
      ))}
    </div>
  );
}