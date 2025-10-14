import { useEffect, useRef } from "react";

function createParticles(width, height, count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.7,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
  }));
}

export default function HeroBackground({ variant = "particles" }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);

  useEffect(() => {
    if (variant !== "particles") {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");

    const resize = () => {
      const { offsetWidth, offsetHeight } = canvas.parentElement || { offsetWidth: 0, offsetHeight: 0 };
      canvas.width = offsetWidth * window.devicePixelRatio;
      canvas.height = offsetHeight * window.devicePixelRatio;
      if (typeof context.resetTransform === "function") {
        context.resetTransform();
      } else {
        context.setTransform(1, 0, 0, 1, 0, 0);
      }
      context.scale(window.devicePixelRatio, window.devicePixelRatio);
      particlesRef.current = createParticles(offsetWidth, offsetHeight, Math.floor((offsetWidth + offsetHeight) / 12));
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const { width, height } = canvas;
      const scaledWidth = width / window.devicePixelRatio;
      const scaledHeight = height / window.devicePixelRatio;
      context.clearRect(0, 0, scaledWidth, scaledHeight);
      context.globalCompositeOperation = "lighter";

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -50 || particle.x > scaledWidth + 50) {
          particle.vx *= -1;
        }
        if (particle.y < -50 || particle.y > scaledHeight + 50) {
          particle.vy *= -1;
        }

        context.beginPath();
        const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 12);
        gradient.addColorStop(0, "rgba(132, 204, 255, 0.45)");
        gradient.addColorStop(0.45, "rgba(129, 140, 248, 0.35)");
        gradient.addColorStop(1, "rgba(14, 23, 46, 0)");
        context.fillStyle = gradient;
        context.arc(particle.x, particle.y, particle.radius * 12, 0, Math.PI * 2);
        context.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant]);

  return (
    <div className="hero-background" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}