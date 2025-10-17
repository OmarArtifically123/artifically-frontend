export default function RouteShell({ rows = 3, label = "Loading content" }) {
  return (
    <div className="route-shell" role="status" aria-live="polite" aria-label={label}>
      <span className="sr-only">{label}</span>
      <div className="route-shell__surface skeleton-surface" aria-hidden="true">
        {Array.from({ length: rows }).map((_, index) => {
          const width = index === 0 ? 62 : Math.max(40, 92 - index * 9);
          return (
            <div
              key={index}
              className={`skeleton-line${index === 0 ? " skeleton-line--heading" : ""}`}
              style={{ width: `${width}%` }}
              aria-hidden="true"
            />
          );
        })}
      </div>
    </div>
  );
}