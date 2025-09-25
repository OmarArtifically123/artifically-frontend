export default function AutomationCard({ item, onDemo, onBuy }) {
  const formatPrice = (price, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="automation-card">
      <div className="card-header">
        <div className="card-icon">{item.icon}</div>
        <div className="card-price">{formatPrice(item.priceMonthly, item.currency)}/mo</div>
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      {item.tags?.length > 0 && (
        <div className="card-tags">
          {item.tags.map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
      )}
      <div className="card-actions">
        <button className="btn btn-secondary btn-small" onClick={() => onDemo(item)}>
          Try Demo
        </button>
        <button className="btn btn-primary btn-small" onClick={() => onBuy(item)}>
          Buy & Deploy
        </button>
      </div>
    </div>
  );
}
