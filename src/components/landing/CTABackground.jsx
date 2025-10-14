export default function CTABackground({ variant = "gradient-mesh" }) {
  if (variant !== "gradient-mesh") {
    return null;
  }

  return (
    <div className="cta-background" aria-hidden="true">
      <div className="cta-background__layer" />
      <div className="cta-background__layer" data-variant="2" />
      <div className="cta-background__layer" data-variant="3" />
    </div>
  );
}