import { memo, useEffect, useMemo, useState } from "react";

const TESTIMONIALS = [
  {
    id: "aurora",
    quote:
      "Artifically helped us migrate legacy decision-trees into adaptive AI workflows with full governance in under three weeks.",
    author: "Sami Idris",
    role: "Chief Digital Officer, Aurora Logistics",
  },
  {
    id: "zenith",
    quote:
      "The pre-built automations delivered a 4.3x ROI in the first quarter. Our teams collaborate through a single compliance-first workspace.",
    author: "Isla Han",
    role: "VP Platform Engineering, Zenith Retail",
  },
  {
    id: "lumen",
    quote:
      "We now orchestrate customer lifecycle communications entirely through Artifically, with human-in-the-loop review when required.",
    author: "Noah Brooks",
    role: "Head of Growth, Lumen Capital",
  },
];

function Testimonial({ quote, author, role }) {
  return (
    <figure className="marketing-testimonial" role="group">
      <blockquote>“{quote}”</blockquote>
      <footer>
        <div>{author}</div>
        <small className="marketing-testimonial__role">{role}</small>
      </footer>
    </figure>
  );
}

function Testimonials() {
  const [activeId, setActiveId] = useState(TESTIMONIALS[0].id);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }
    const interval = setInterval(() => {
      setActiveId((current) => {
        const index = TESTIMONIALS.findIndex((item) => item.id === current);
        const next = (index + 1) % TESTIMONIALS.length;
        return TESTIMONIALS[next].id;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const active = useMemo(() => TESTIMONIALS.find((item) => item.id === activeId) ?? TESTIMONIALS[0], [activeId]);

  return (
    <section
      className="marketing-testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Customer stories"
    >
      <div className="marketing-testimonials__headline">
        <h2>Teams trust Artifically to automate their mission critical work</h2>
        <p>See how operators, support leaders, and revenue teams ship secure automations faster.</p>
      </div>
      <Testimonial {...active} />
      <div className="marketing-testimonials__selector" role="tablist" aria-label="Select testimonial">
        {TESTIMONIALS.map((item) => (
          <button
            type="button"
            key={item.id}
            role="tab"
            data-active={item.id === activeId}
            aria-selected={item.id === activeId}
            onClick={() => setActiveId(item.id)}
          >
            <span>{item.author.split(" ")[0]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default memo(Testimonials);