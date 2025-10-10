import { useEffect, useMemo, useRef } from "react";

const PARTICLE_COUNT = 18;
const BLOOM_COUNT = 8;

function createParticles(count) {
  return Array.from({ length: count }, (_, index) => {
    const hueBase = index % 2 === 0 ? 198 : 268;
    return {
      offset: Math.random() * Math.PI * 2,
      varianceX: 0.35 + Math.random() * 0.2,
      varianceY: 0.28 + Math.random() * 0.16,
      baseX: 0.5 + (Math.random() - 0.5) * 0.12,
      baseY: 0.48 + (Math.random() - 0.5) * 0.16,
      size: 180 + Math.random() * 180,
      hue: hueBase + Math.random() * 28,
      speed: 0.12 + Math.random() * 0.08,
    };
  });
}

function createBlooms(count) {
  return Array.from({ length: count }, () => ({
    radius: 120 + Math.random() * 80,
    angle: Math.random() * Math.PI * 2,
    distance: 0.2 + Math.random() * 0.3,
    hue: 180 + Math.random() * 40,
    alpha: 0.25 + Math.random() * 0.25,
  }));
}

function drawBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(56, 189, 248, 0.12)");
  gradient.addColorStop(1, "rgba(99, 102, 241, 0.16)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
  const cell = Math.max(70, Math.min(width, height) / 9);
  for (let x = cell; x < width; x += cell) {
    ctx.fillRect(x - 0.5, 0, 1, height);
  }
  for (let y = cell; y < height; y += cell) {
    ctx.fillRect(0, y - 0.5, width, 1);
  }
  ctx.restore();
}

function drawBlooms(ctx, width, height, blooms, tick) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  blooms.forEach((bloom, index) => {
    const wobble = Math.sin(tick * 0.6 + index) * 0.04;
    const radius = bloom.radius * (1 + wobble * 0.12);
    const angle = bloom.angle + tick * 0.12;
    const x = width * (0.5 + Math.cos(angle) * bloom.distance * 0.85);
    const y = height * (0.55 + Math.sin(angle) * bloom.distance * 0.6);

    const gradient = ctx.createRadialGradient(x, y, radius * 0.15, x, y, radius);
    gradient.addColorStop(0, `hsla(${bloom.hue}, 85%, 68%, ${bloom.alpha})`);
    gradient.addColorStop(1, `hsla(${bloom.hue}, 85%, 58%, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawParticles(ctx, width, height, particles, tick) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  particles.forEach((particle, index) => {
    const motion = tick * particle.speed;
    const px = width * (particle.baseX + Math.sin(motion + particle.offset) * particle.varianceX * 0.5);
    const py = height * (particle.baseY + Math.cos(motion * 0.82 + index) * particle.varianceY * 0.5);
    const size = particle.size * (1 + Math.sin(motion * 1.2) * 0.12);

    const gradient = ctx.createRadialGradient(px, py, size * 0.1, px, py, size);
    gradient.addColorStop(0, `hsla(${particle.hue}, 88%, 70%, 0.55)`);
    gradient.addColorStop(1, `hsla(${particle.hue}, 88%, 62%, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

export default function HeroScene({ width = 1280, height = 720 }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef(null);
  const bloomsRef = useRef(null);

  const { particles, blooms } = useMemo(() => ({
    particles: createParticles(PARTICLE_COUNT),
    blooms: createBlooms(BLOOM_COUNT),
  }), []);

  particlesRef.current = particles;
  bloomsRef.current = blooms;

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return undefined;
    }

    let frameId;
    let animationActive = true;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      const dpr = window.devicePixelRatio || 1;
      const targetWidth = Math.max(clientWidth || width, 1);
      const targetHeight = Math.max(clientHeight || height, 1);
      canvas.width = targetWidth * dpr;
      canvas.height = targetHeight * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const renderFrame = (time = 0) => {
      const dpr = window.devicePixelRatio || 1;
      const drawWidth = canvas.width / dpr;
      const drawHeight = canvas.height / dpr;
      const tick = time * 0.001;

      context.clearRect(0, 0, drawWidth, drawHeight);
      drawBackground(context, drawWidth, drawHeight);
      drawBlooms(context, drawWidth, drawHeight, bloomsRef.current, tick);
      drawParticles(context, drawWidth, drawHeight, particlesRef.current, tick);

      if (animationActive) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const startAnimation = () => {
      if (animationActive) {
        return;
      }
      animationActive = true;
      frameId = window.requestAnimationFrame(renderFrame);
    };

    const stopAnimation = () => {
      animationActive = false;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      renderFrame();
    };

    const handleMotionChange = (event) => {
      if (event.matches) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    resize();

    let resizeObserver;
    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", resize, { passive: true });
    }

    if (mediaQuery.matches) {
      animationActive = false;
      renderFrame();
    } else {
      frameId = window.requestAnimationFrame(renderFrame);
    }

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleMotionChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      animationActive = false;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleMotionChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-hidden="true"
      role="presentation"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        borderRadius: "inherit",
        pointerEvents: "none",
        background:
          "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.18), transparent 60%), radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.14), transparent 65%)",
        boxShadow: "0 30px 120px rgba(15, 23, 42, 0.38)",
      }}
    />
  );
}