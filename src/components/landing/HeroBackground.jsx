import { useEffect, useRef, useState } from "react";
import useDocumentVisibility from "../../hooks/useDocumentVisibility";
import { getNetworkInformation, prefersLowPower } from "../../utils/networkPreferences";

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
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [prefersLowPowerMode, setPrefersLowPowerMode] = useState(() => prefersLowPower());
  const [isInViewport, setIsInViewport] = useState(false);
  const isDocumentVisible = useDocumentVisibility();

  const shouldAnimate =
    variant === "particles" &&
    isInViewport &&
    isDocumentVisible &&
    !prefersReducedMotion &&
    !prefersLowPowerMode;

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => setPrefersReducedMotion(event.matches);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const connection = getNetworkInformation();
    if (!connection) {
      return undefined;
    }

    const updatePreference = () => setPrefersLowPowerMode(prefersLowPower(connection));

    if (typeof connection.addEventListener === "function") {
      connection.addEventListener("change", updatePreference);
      return () => connection.removeEventListener("change", updatePreference);
    }

    connection.onchange = updatePreference;
    return () => {
      connection.onchange = null;
    };
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === node) {
            setIsInViewport(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [variant]);

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

    const drawParticles = (advance = false) => {
      const { width, height } = canvas;
      const scaledWidth = width / window.devicePixelRatio;
      const scaledHeight = height / window.devicePixelRatio;
      context.clearRect(0, 0, scaledWidth, scaledHeight);
      context.globalCompositeOperation = "lighter";

      particlesRef.current.forEach((particle) => {
        if (advance) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < -50 || particle.x > scaledWidth + 50) {
            particle.vx *= -1;
          }
          if (particle.y < -50 || particle.y > scaledHeight + 50) {
            particle.vy *= -1;
          }
        }

        context.beginPath();
        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 12,
        );
        gradient.addColorStop(0, "rgba(132, 204, 255, 0.45)");
        gradient.addColorStop(0.45, "rgba(129, 140, 248, 0.35)");
        gradient.addColorStop(1, "rgba(14, 23, 46, 0)");
        context.fillStyle = gradient;
        context.arc(particle.x, particle.y, particle.radius * 12, 0, Math.PI * 2);
        context.fill();
      });
    };

    resize();
    window.addEventListener("resize", resize);

    if (!shouldAnimate) {
      drawParticles(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    const animate = () => {
      drawParticles(true);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [shouldAnimate, variant]);

  return (
    <div ref={containerRef} className="hero-background" aria-hidden="true">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}