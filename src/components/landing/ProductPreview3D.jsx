import { useEffect, useRef, useState } from "react";

export default function ProductPreview3D({ label = "Automation preview", theme = "dark" }) {
  const frameRef = useRef(null);
  const rafRef = useRef();
  const animationAngle = useRef({ x: -18, y: 32 });
  const targetAngle = useRef({ x: -12, y: 38 });
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const update = () => {
      animationAngle.current.x += (targetAngle.current.x - animationAngle.current.x) * 0.05;
      animationAngle.current.y += (targetAngle.current.y - animationAngle.current.y) * 0.05;

      const { x, y } = animationAngle.current;
      frame.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;

      if (!isInteracting) {
        targetAngle.current.y += 0.04;
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isInteracting]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const handlePointerMove = (event) => {
      const rect = frame.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const percentX = (offsetX / rect.width) * 2 - 1;
      const percentY = (offsetY / rect.height) * 2 - 1;

      targetAngle.current = {
        x: -18 * percentY,
        y: 32 * percentX,
      };
    };

    const handlePointerEnter = () => {
      setIsInteracting(true);
    };

    const handlePointerLeave = () => {
      setIsInteracting(false);
      targetAngle.current = { x: -12, y: 38 };
    };

    frame.addEventListener("pointermove", handlePointerMove);
    frame.addEventListener("pointerenter", handlePointerEnter);
    frame.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      frame.removeEventListener("pointermove", handlePointerMove);
      frame.removeEventListener("pointerenter", handlePointerEnter);
      frame.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div className={`product-preview product-preview--${theme}`}> 
      <div className="product-preview__glow" aria-hidden="true" />
      <div className="product-preview__frame" ref={frameRef} role="img" aria-label={label}>
        <div className="product-preview__surface">
          <header className="product-preview__toolbar">
            <span />
            <span />
            <span />
          </header>
          <div className="product-preview__grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="product-preview__node" data-index={index}>
                <div />
                <span />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}