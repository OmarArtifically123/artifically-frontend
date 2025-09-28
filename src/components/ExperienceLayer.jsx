import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import useInteractiveEffects from "../hooks/useInteractiveEffects";

const PARTICLE_COUNT = 120;
const GYRO_SMOOTHING = 0.08;
const COLOR_SAMPLE_INTERVAL = 320; // milliseconds

function withAlphaChannel(color, alpha = 0.2) {
  const trimmed = color.trim();

  if (!trimmed) {
    return `rgba(56, 189, 248, ${alpha})`;
  }

  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    const expand = (value) => value.split("").map((ch) => `${ch}${ch}`).join("");
    let normalized = hex;
    if (hex.length === 3 || hex.length === 4) {
      normalized = expand(hex.slice(0, 3));
    }
    if (normalized.length === 6) {
      return `#${normalized}${Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
    }
    if (normalized.length === 8) {
      return `#${normalized.slice(0, 6)}${Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
    }
  }

  const hslMatch = trimmed.match(/^hsla?\(([^)]+)\)$/i);
  if (hslMatch) {
    const parts = hslMatch[1]
      .split(",")
      .map((part) => part.trim())
      .slice(0, 3);
    while (parts.length < 3) {
      parts.push("0%");
    }
    return `hsla(${parts.join(", ")}, ${alpha})`;
  }

  const rgbMatch = trimmed.match(/^rgba?\(([^)]+)\)$/i);
  if (rgbMatch) {
    const parts = rgbMatch[1]
      .split(",")
      .map((part) => part.trim())
      .slice(0, 3);
    while (parts.length < 3) {
      parts.push("0");
    }
    return `rgba(${parts.join(", ")}, ${alpha})`;
  }

  return `rgba(56, 189, 248, ${alpha})`;
}

function useCssHoudini() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.CSS || !CSS.paintWorklet) {
      return;
    }

    const moduleUrl = "/worklets/sparkle-paint.js";
    CSS.paintWorklet.addModule(moduleUrl).catch((error) => {
      console.warn("Failed to load paint worklet", error);
    });
  }, []);
}

function useAmbientNeumorphism() {
  const { darkMode } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let sensor;
    let rafId;
    let currentLevel = 100;
    const applyLevel = (level) => {
      currentLevel = Math.max(5, Math.min(1000, level));
      const normalized = Math.min(1, Math.log10(currentLevel + 1) / 3);
      document.documentElement.style.setProperty("--ambient-level", String(normalized));
      document.documentElement.style.setProperty(
        "--ambient-shadow-strength",
        darkMode ? String(0.45 + normalized * 0.45) : String(0.25 + normalized * 0.35)
      );
    };

    if ("AmbientLightSensor" in window) {
      try {
        sensor = new window.AmbientLightSensor({ frequency: 10 });
        sensor.addEventListener("reading", () => applyLevel(sensor.illuminance || 100));
        sensor.addEventListener("error", (event) => {
          console.warn("Ambient light sensor error", event.error);
        });
        sensor.start();
      } catch (error) {
        console.warn("Ambient light sensor unavailable", error);
      }
    } else if (typeof window.matchMedia === "function") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const fallbackLevel = mq.matches ? 60 : 200;
      applyLevel(fallbackLevel);
      const listener = (event) => applyLevel(event.matches ? 60 : 200);
      mq.addEventListener("change", listener);
      return () => {
        mq.removeEventListener("change", listener);
      };
    }

    if (!sensor) {
      applyLevel(120);
      return () => {};
    }

    const update = () => {
      applyLevel(currentLevel);
      rafId = window.requestAnimationFrame(update);
    };

    update();

    return () => {
      if (sensor && typeof sensor.stop === "function") {
        sensor.stop();
      }
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [darkMode]);
}

function useStaticThemeTokens() {
  const { darkMode } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const palette = darkMode
      ? {
          primary: "hsl(240, 92%, 72%)",
          secondary: "hsl(199, 94%, 66%)",
          accent: "hsl(318, 89%, 75%)",
          gradient: "linear-gradient(135deg, hsla(222, 47%, 15%, 0.92), hsla(199, 94%, 32%, 0.88))",
          sparkleHue: "210",
          sparkleAlpha: "0.32",
          themeKey: "midnight",
        }
      : {
          primary: "hsl(241, 85%, 62%)",
          secondary: "hsl(199, 94%, 58%)",
          accent: "hsl(319, 88%, 68%)",
          gradient: "linear-gradient(135deg, hsla(210, 100%, 97%, 0.95), hsla(199, 94%, 88%, 0.9))",
          sparkleHue: "205",
          sparkleAlpha: "0.24",
          themeKey: "daylight",
        };

    const root = document.documentElement;
    root.style.setProperty("--dynamic-primary", palette.primary);
    root.style.setProperty("--dynamic-secondary", palette.secondary);
    root.style.setProperty("--dynamic-accent", palette.accent);
    root.style.setProperty("--dynamic-gradient", palette.gradient);
    root.style.setProperty("--sparkle-hue", palette.sparkleHue);
    root.style.setProperty("--sparkle-alpha", palette.sparkleAlpha);

    if (document.body) {
      document.body.dataset.timeTheme = palette.themeKey;
    }
  }, [darkMode]);
}


const DEFAULT_DYNAMIC_PALETTE = {
  primary: "hsl(241, 85%, 62%)",
  secondary: "hsl(199, 94%, 58%)",
  accent: "hsl(319, 88%, 68%)",
};

function readDynamicPalette() {
  if (typeof window === "undefined") return DEFAULT_DYNAMIC_PALETTE;
  const root = getComputedStyle(document.documentElement);
  const read = (token, fallback) => root.getPropertyValue(token).trim() || fallback;
  return {
    primary: read("--dynamic-primary", DEFAULT_DYNAMIC_PALETTE.primary),
    secondary: read("--dynamic-secondary", DEFAULT_DYNAMIC_PALETTE.secondary),
    accent: read("--dynamic-accent", DEFAULT_DYNAMIC_PALETTE.accent),
  };
}

function useRootDynamicPalette() {
  const [palette, setPalette] = useState(() => readDynamicPalette());

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const update = () => setPalette(readDynamicPalette());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "data-theme"],
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-time-theme"],
      });
    }

    const interval = window.setInterval(update, 60 * 1000);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      window.removeEventListener("resize", update);
    };
  }, []);

  return palette;
}

let tsParticlesLoader;

function ensureTsParticles() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.tsParticles) return Promise.resolve(window.tsParticles);
  if (tsParticlesLoader) return tsParticlesLoader;

  tsParticlesLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-tsparticles]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.tsParticles));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tsparticles@3.0.3/tsparticles.bundle.min.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.tsparticles = "true";
    script.addEventListener("load", () => resolve(window.tsParticles));
    script.addEventListener("error", (error) => reject(error));
    document.head.appendChild(script);
  });

  return tsParticlesLoader;
}

function buildParticleOptions(palette, darkMode) {
  return {
    background: { color: { value: "transparent" } },
    detectRetina: true,
    fpsLimit: 90,
    particles: {
      number: {
        value: 80,
        density: { enable: true, area: 900 },
      },
      color: {
        value: [palette.primary, palette.secondary, palette.accent],
      },
      shape: {
        type: ["circle", "polygon", "square"],
        options: {
          polygon: { sides: 6 },
        },
      },
      opacity: {
        value: { min: 0.08, max: darkMode ? 0.35 : 0.28 },
        animation: {
          enable: true,
          speed: 0.6,
          minimumValue: 0.05,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3.6 },
        animation: {
          enable: true,
          speed: 3.2,
          minimumValue: 0.3,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 1.4,
        direction: "none",
        outModes: { default: "out" },
        trail: {
          enable: true,
          length: 12,
          fill: {
            color: { value: darkMode ? "#0f172a" : "#ffffff" },
          },
        },
      },
      links: {
        enable: true,
        distance: 130,
        color: palette.primary,
        opacity: darkMode ? 0.36 : 0.28,
        width: 1.1,
        triangles: {
          enable: true,
          color: palette.accent,
          opacity: 0.05,
        },
      },
      wobble: {
        enable: true,
        distance: 3,
        speed: { min: 0.2, max: 1.4 },
      },
      rotate: {
        value: { min: 0, max: 360 },
        direction: "random",
        animation: {
          enable: true,
          speed: 15,
        },
      },
      twinkle: {
        particles: {
          enable: true,
          color: palette.accent,
          frequency: 0.045,
          opacity: 0.6,
        },
        lines: {
          enable: true,
          frequency: 0.08,
          opacity: 0.35,
        },
      },
      life: {
        duration: {
          sync: false,
          value: {
            min: 4,
            max: 9,
          },
        },
        delay: {
          value: {
            min: 0.2,
            max: 1.2,
          },
        },
      },
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: {
          enable: true,
          mode: ["bubble", "attract"],
          parallax: { enable: true, force: 60, smooth: 14 },
        },
        onClick: {
          enable: true,
          mode: ["push", "repulse"],
        },
        resize: true,
      },
      modes: {
        attract: {
          distance: 180,
          duration: 0.4,
          speed: 1,
        },
        bubble: {
          distance: 150,
          duration: 2,
          size: 6,
          opacity: 0.4,
          color: {
            value: palette.accent,
          },
        },
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 160,
          duration: 0.5,
        },
      },
    },
  };
}

function TsParticlesLayer() {
  const containerRef = useRef(null);
  const [elementId] = useState(() => `ts-particles-${Math.random().toString(36).slice(2)}`);
  const palette = useRootDynamicPalette();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let destroyed = false;
    let instance;

    ensureTsParticles()
      .then((tsParticles) => {
        if (!tsParticles || destroyed || !containerRef.current) return null;
        const options = buildParticleOptions(palette, darkMode);
        return tsParticles
          .load({ id: elementId, options })
          .then((loaded) => {
            instance = loaded;
            return loaded;
          })
          .catch((error) => {
            console.warn("tsParticles load failed", error);
            return null;
          });
      })
      .catch((error) => console.warn("tsParticles failed to initialise", error));

    return () => {
      destroyed = true;
      if (instance && typeof instance.destroy === "function") {
        instance.destroy();
      } else if (window.tsParticles?.dom) {
        window.tsParticles
          .dom()
          .filter((item) => item.id === elementId)
          .forEach((item) => item.destroy());
      }
    };
  }, [palette.primary, palette.secondary, palette.accent, darkMode, elementId]);

  return <div ref={containerRef} id={elementId} className="particlejs-layer" aria-hidden="true" />;
}

function LiquidShaderCanvas() {
  const canvasRef = useRef(null);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dprListener = () => setDevicePixelRatio(Math.min(1.75, window.devicePixelRatio || 1));
    dprListener();
    window.addEventListener("resize", dprListener);
    return () => window.removeEventListener("resize", dprListener);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) return;

    const vertexSrc = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentSrc = `
      precision highp float;
      varying vec2 vUv;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec3 u_colorA;
      uniform vec3 u_colorB;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;
        vec2 uvFlow = uv * 2.4;
        float time = u_time * 0.05;
        float n1 = noise(uvFlow + time);
        float n2 = noise(uvFlow - time * 0.8);
        float mask = smoothstep(0.25, 0.75, n1 + n2 * 0.5);
        vec3 color = mix(u_colorA, u_colorB, mask);
        float highlight = smoothstep(0.7, 0.95, mask);
        color += highlight * 0.25;
        gl_FragColor = vec4(color, smoothstep(0.25, 0.95, mask));
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]),
      gl.STATIC_DRAW
    );

    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const colorALocation = gl.getUniformLocation(program, "u_colorA");
    const colorBLocation = gl.getUniformLocation(program, "u_colorB");

    let frameId;
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = 1;
    colorCanvas.height = 1;
    const colorCtx = colorCanvas.getContext("2d");

    let lastSampleTime = -Infinity;
    let cachedColorA = "";
    let cachedColorB = "";
    let cachedRGB1 = [0.3, 0.4, 0.9];
    let cachedRGB2 = [0.1, 0.7, 0.8];

    const toRGB = (color) => {
      if (!colorCtx) return [0.3, 0.4, 0.9];
      colorCtx.fillStyle = color;
      const computed = colorCtx.fillStyle;
      const match = computed.match(/rgb[a]?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (!match) return [0.3, 0.4, 0.9];
      return [Number(match[1]) / 255, Number(match[2]) / 255, Number(match[3]) / 255];
    };

    const sampleColors = () => {
      const root = getComputedStyle(document.documentElement);
      const nextColorA = root.getPropertyValue("--dynamic-primary").trim() || "#6366f1";
      const nextColorB = root.getPropertyValue("--dynamic-accent").trim() || "#06b6d4";
      if (nextColorA !== cachedColorA) {
        cachedColorA = nextColorA;
        cachedRGB1 = toRGB(nextColorA);
      }
      if (nextColorB !== cachedColorB) {
        cachedColorB = nextColorB;
        cachedRGB2 = toRGB(nextColorB);
      }
    };

    sampleColors();

    const render = (time) => {
      if (!canvas.parentElement) return;
      if (typeof document !== "undefined" && document.hidden) {
        frameId = requestAnimationFrame(render);
        return;
      }
      const { clientWidth, clientHeight } = canvas.parentElement;
      const width = clientWidth * devicePixelRatio;
      const height = clientHeight * devicePixelRatio;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, width, height);

      if (time - lastSampleTime > COLOR_SAMPLE_INTERVAL) {
        lastSampleTime = time;
        sampleColors();
      }

      const setUniforms = (rgb, location) => {
        gl.uniform3f(location, rgb[0], rgb[1], rgb[2]);
      };

      setUniforms(cachedRGB1, colorALocation);
      setUniforms(cachedRGB2, colorBLocation);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [devicePixelRatio]);

  return <canvas className="liquid-morphing-layer" ref={canvasRef} />;
}

function ParticleField() {
  const canvasRef = useRef(null);
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.0025,
      vy: (Math.random() - 0.5) * 0.0025,
      size: 0.4 + Math.random() * 1.2,
      hue: Math.random() * 360,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId;
    let cachedAccent = "";
    let cachedAccentWithAlpha = "rgba(56, 189, 248, 0.2)";
    let lastSampleTime = -Infinity;

    const render = (time) => {
      if (!canvas.parentElement) return;
      if (typeof document !== "undefined" && document.hidden) {
        frameId = requestAnimationFrame(render);
        return;
      }
      const { clientWidth, clientHeight } = canvas.parentElement;
      const dpr = Math.min(1.75, window.devicePixelRatio || 1);
      if (canvas.width !== clientWidth * dpr || canvas.height !== clientHeight * dpr) {
        canvas.width = clientWidth * dpr;
        canvas.height = clientHeight * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, clientWidth, clientHeight);
      const gradient = ctx.createLinearGradient(0, 0, clientWidth, clientHeight);

      if (time - lastSampleTime > COLOR_SAMPLE_INTERVAL) {
        lastSampleTime = time;
        const root = getComputedStyle(document.documentElement);
        const accent = root.getPropertyValue("--dynamic-accent").trim() || "#38bdf8";
        if (accent !== cachedAccent) {
          cachedAccent = accent;
          cachedAccentWithAlpha = withAlphaChannel(accent, 0.2);
        }
      }

      gradient.addColorStop(0, "rgba(15, 23, 42, 0.35)");
      gradient.addColorStop(1, cachedAccentWithAlpha);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, clientWidth, clientHeight);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
        if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
        const px = particle.x * clientWidth;
        const py = particle.y * clientHeight;
        const radius = particle.size + Math.sin(Date.now() * 0.001 + particle.hue) * 0.25;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${particle.hue.toFixed(1)}, 85%, 65%, 0.65)`;
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(frameId);
  }, [particles]);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
}

function useParallaxDepth(containerRef) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    const layers = Array.from(container.querySelectorAll("[data-depth]"));
    if (!layers.length) return;

    let pointerX = 0;
    let pointerY = 0;
    let gyroX = 0;
    let gyroY = 0;
    let rafId;

    const apply = () => {
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || "1");
        const translateX = (pointerX + gyroX) * depth * 12;
        const translateY = (pointerY + gyroY) * depth * 12;
        layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });
      rafId = requestAnimationFrame(apply);
    };

    const handlePointer = (event) => {
      const { innerWidth, innerHeight } = window;
      pointerX = ((event.clientX / innerWidth) - 0.5) * 2;
      pointerY = ((event.clientY / innerHeight) - 0.5) * 2;
    };

    const handleOrientation = (event) => {
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;
      gyroX += ((gamma / 45) - gyroX) * GYRO_SMOOTHING;
      gyroY += ((beta / 45) - gyroY) * GYRO_SMOOTHING;
    };

    window.addEventListener("pointermove", handlePointer);
    window.addEventListener("deviceorientation", handleOrientation, true);
    apply();

    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("deviceorientation", handleOrientation, true);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);
}

function useBackdropBlurWatcher() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new ResizeObserver(() => {
      document.querySelectorAll("[data-glass]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const radius = Math.min(24, Math.max(12, Math.round(rect.width / 48)));
        el.style.backdropFilter = `blur(${radius}px) saturate(1.3)`;
        el.style.setProperty("--glass-blur", `${radius}px`);
      });
    });
    document.querySelectorAll("[data-glass]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function ExperienceLayer({ children }) {
  const containerRef = useRef(null);
  useCssHoudini();
  useAmbientNeumorphism();
  useStaticThemeTokens();
  useBackdropBlurWatcher();
  useInteractiveEffects();
  useParallaxDepth(containerRef);

  return (
    <div className="experience-shell" ref={containerRef}>
      <LiquidShaderCanvas />
      <ParticleField />
      <TsParticlesLayer />
      <div className="parallax-layer" data-depth="0.25" aria-hidden="true" />
      <div className="parallax-layer" data-depth="0.45" aria-hidden="true" />
      <div className="parallax-layer" data-depth="0.65" aria-hidden="true" />
      <div className="experience-content">{children}</div>
    </div>
  );
}