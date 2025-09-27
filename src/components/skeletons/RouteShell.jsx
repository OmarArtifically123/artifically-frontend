export default function RouteShell({ rows = 3 }) {
  return (
    <div
      style={{
        padding: "4rem 0",
        display: "grid",
        gap: "1.5rem",
      }}
    >
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          style={{
            height: index === 0 ? "2.8rem" : "1.1rem",
            width: index === 0 ? "60%" : `${90 - index * 8}%`,
            borderRadius: "999px",
            background: "linear-gradient(90deg, rgba(148,163,184,0.35), rgba(148,163,184,0.18))",
            animation: "pulse 1.4s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );
}