import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const HAPTIC_PATTERNS = {
  click: [6],
  gentle: [4, 20, 4],
  success: [12, 55, 12],
  error: [24, 120, 24],
  pulse: [14, 30, 14, 30, 14],
};

const SOUND_PROFILES = {
  click: { frequency: 520, duration: 0.12, type: "triangle" },
  resolve: { frequency: 660, duration: 0.18, type: "sine" },
  sparkle: { frequency: 840, duration: 0.24, type: "sine" },
  warn: { frequency: 300, duration: 0.2, type: "sawtooth" },
};

const PRESET_CONFIG = {
  "cta-primary": { haptic: "success", sound: "resolve", particles: true },
  "cta-secondary": { haptic: "click", sound: "click" },
  "cta-ghost": { haptic: "gentle" },
  success: { haptic: "success", sound: "sparkle", particles: true },
  error: { haptic: "error", sound: "warn" },
  interactive: { haptic: "click", sound: "click" },
  "interactive-nav": { haptic: "gentle", sound: "click" },
  "interactive-strong": { haptic: "success", sound: "sparkle", particles: true },
  "form-celebrate": { haptic: "success", sound: "resolve", particles: true },
};

const STORAGE_KEYS = {
  haptics: "__artifically_haptics_pref",
  sound: "__artifically_sound_pref",
};

const MicroInteractionContext = createContext(null);

const isClient = typeof window !== "undefined";

const supportsEvent = typeof Event !== "undefined";

const createAudioContext = () => {
  if (!isClient || typeof window.AudioContext === "undefined") {
    return null;
  }
  return new window.AudioContext();
};

const spawnParticles = ({
  particlesRef,
  canvasRef,
  contextRef,
  rafRef,
  reducedMotion,
}) => (payload = {}) => {
  if (!isClient || reducedMotion) return;
  const canvas = canvasRef.current;
  const ctx = contextRef.current;
  if (!canvas || !ctx) return;

  const { innerWidth, innerHeight, devicePixelRatio = 1 } = window;
  const originX =
    payload.x != null
      ? payload.x
      : innerWidth / 2;
  const originY =
    payload.y != null
      ? payload.y
      : innerHeight / 2;

  const colors =
    payload.colors || ["#6366f1", "#38bdf8", "#f472b6", "#22d3ee", "#facc15"];
  const count = Math.max(12, Math.min(60, payload.count || 32));

  const particles = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 2.5;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 2.6,
      life: 0,
      ttl: 750 + Math.random() * 450,
      size: 1.75 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.0026 + Math.random() * 0.001,
      fade: 0.002 + Math.random() * 0.0025,
    };
  });

  particlesRef.current.push(...particles);

  const render = (time) => {
    const ctx2d = contextRef.current;
    const currentCanvas = canvasRef.current;
    if (!ctx2d || !currentCanvas) {
      rafRef.current = null;
      return;
    }

    const width = currentCanvas.width / devicePixelRatio;
    const height = currentCanvas.height / devicePixelRatio;
    ctx2d.clearRect(0, 0, width, height);

    const now = time || performance.now();
    particlesRef.current = particlesRef.current.filter((particle) => {
      const next = particle;
      const delta = Math.min(32, Math.max(16, particle.delta || 16));
      next.life += delta;
      if (next.life > next.ttl) {
        return false;
      }

      next.x += next.vx * (delta / 16);
      next.y += next.vy * (delta / 16);
      next.vy += next.gravity * delta;
      next.opacity = Math.max(
        0,
        1 - next.life / next.ttl - next.fade * (next.life / next.ttl),
      );

      ctx2d.globalAlpha = next.opacity;
      ctx2d.fillStyle = next.color;
      ctx2d.beginPath();
      ctx2d.arc(next.x, next.y, next.size, 0, Math.PI * 2);
      ctx2d.fill();
      ctx2d.closePath();

      return next.opacity > 0.05;
    });

    if (particlesRef.current.length) {
      rafRef.current = window.requestAnimationFrame(render);
    } else {
      ctx2d.clearRect(0, 0, width, height);
      rafRef.current = null;
    }
  };

  if (!rafRef.current) {
    rafRef.current = window.requestAnimationFrame(render);
  }
};

export function MicroInteractionProvider({ children, enabled = true }) {
  const [hapticsEnabled, setHapticsEnabled] = useState(() => {
    if (!isClient) return true;
    const stored = window.localStorage.getItem(STORAGE_KEYS.haptics);
    return stored == null ? true : stored === "true";
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (!isClient) return false;
    const stored = window.localStorage.getItem(STORAGE_KEYS.sound);
    return stored === "true";
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    if (!isClient || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const audioContextRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isClient || typeof window.matchMedia !== "function") return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isClient || !enabled) return undefined;
    const canvas = document.createElement("canvas");
    canvas.dataset.microLayer = "true";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "2147483000";
    canvas.style.mixBlendMode = "screen";
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;
    contextRef.current = ctx;
    canvasRef.current = canvas;
    document.body.appendChild(canvas);

    const resize = () => {
      if (!canvasRef.current || !contextRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      contextRef.current.setTransform(1, 0, 0, 1, 0, 0);
      contextRef.current.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.remove();
      canvasRef.current = null;
      contextRef.current = null;
      particlesRef.current = [];
    };
  }, [enabled]);

  useEffect(() => {
    if (!isClient) return;
    window.localStorage.setItem(STORAGE_KEYS.haptics, String(hapticsEnabled));
  }, [hapticsEnabled]);

  useEffect(() => {
    if (!isClient) return;
    window.localStorage.setItem(STORAGE_KEYS.sound, String(soundEnabled));
  }, [soundEnabled]);

  const vibrate = useCallback(
    (patternKey = "click") => {
      if (!isClient || !hapticsEnabled) return;
      if (!("vibrate" in navigator)) return;
      const pattern = HAPTIC_PATTERNS[patternKey] || HAPTIC_PATTERNS.click;
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn("Failed to trigger haptic feedback", error);
      }
    },
    [hapticsEnabled],
  );

  const playTone = useCallback(
    async (profile = "click") => {
      if (!isClient || !soundEnabled) return;
      const settings = SOUND_PROFILES[profile] || SOUND_PROFILES.click;
      if (!settings) return;

      if (!audioContextRef.current) {
        audioContextRef.current = createAudioContext();
      }
      const ctx = audioContextRef.current;
      if (!ctx) return;

      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch (error) {
          console.warn("Audio context resume failed", error);
          return;
        }
      }

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = settings.type;
      oscillator.frequency.value = settings.frequency;

      const now = ctx.currentTime;
      const duration = settings.duration;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.05);
    },
    [soundEnabled],
  );

  const triggerParticles = useMemo(() => {
    if (!enabled) {
      return () => {};
    }
    return spawnParticles({
      particlesRef,
      canvasRef,
      contextRef,
      rafRef,
      reducedMotion,
    });
  }, [enabled, particlesRef, canvasRef, contextRef, rafRef, reducedMotion]);

  const dispatchInteraction = useCallback(
    (type, options = {}) => {
      if (options && typeof options === "object" && options.event) {
        try {
          Object.defineProperty(options.event, "__microInteractionHandled", {
            value: true,
            configurable: true,
            writable: true,
          });
        } catch (error) {
          options.event.__microInteractionHandled = true;
        }
      }

      const preset =
        typeof type === "string" && PRESET_CONFIG[type]
          ? PRESET_CONFIG[type]
          : {};

      const config = { ...preset, ...options };

      if (!enabled) {
        return config;
      }

      if (config.haptic !== false) {
        const pattern = config.haptic || preset.haptic || "click";
        vibrate(pattern);
      }

      if (config.sound) {
        playTone(config.sound);
      }

      if (config.particles) {
        const originEvent = config.event;
        const payload = { ...config.particles };
        if (supportsEvent && originEvent && originEvent instanceof Event) {
          const point =
            "clientX" in originEvent
              ? {
                  x: originEvent.clientX,
                  y: originEvent.clientY,
                }
              : null;
          if (point) {
            payload.x = point.x;
            payload.y = point.y;
          }
        }
        triggerParticles(payload);
      }

      return config;
    },
    [enabled, playTone, triggerParticles, vibrate],
  );

  const value = useMemo(
    () => ({
      hapticsEnabled,
      soundEnabled,
      reducedMotion: reducedMotion || !enabled,
      setHapticsEnabled,
      setSoundEnabled,
      dispatchInteraction,
    }),
    [dispatchInteraction, enabled, hapticsEnabled, reducedMotion, soundEnabled],
  );

  return (
    <MicroInteractionContext.Provider value={value}>
      {children}
    </MicroInteractionContext.Provider>
  );
}

export function useMicroInteractionContext() {
  const context = useContext(MicroInteractionContext);
  if (!context) {
    throw new Error(
      "useMicroInteractionContext must be used within a MicroInteractionProvider",
    );
  }
  return context;
}