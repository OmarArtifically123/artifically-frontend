const TWO_PI = Math.PI * 2;

let frameTimer = null;
let graph = { nodes: [], edges: [] };
let nodeState = [];
let flowState = [];
let roiBase = 0;
let roiAccumulator = 0;
let roiRate = 0.25;
let throughputRate = 120;
let basePulsePhase = 0;
let random = (min = 0, max = 1) => Math.random() * (max - min) + min;
let lastTime = typeof performance !== "undefined" ? performance.now() : Date.now();

function createRandom(seed = Date.now()) {
  let state = Math.max(1, Math.floor(seed) % 2147483647);
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
}

function stopLoop() {
  if (frameTimer != null) {
    clearInterval(frameTimer);
    frameTimer = null;
  }
}

function configure(payload = {}) {
  const { graph: nextGraph, metrics = {}, seed } = payload;
  if (nextGraph && Array.isArray(nextGraph.nodes) && Array.isArray(nextGraph.edges)) {
    graph = {
      nodes: nextGraph.nodes.slice(0, 12),
      edges: nextGraph.edges.slice(0, 18),
    };
  }

  if (typeof seed === "number") {
    const seeded = createRandom(seed);
    random = (min = 0, max = 1) => seeded() * (max - min) + min;
  } else {
    random = (min = 0, max = 1) => Math.random() * (max - min) + min;
  }

  nodeState = graph.nodes.map((node, index) => ({
    id: node.id,
    phase: random(0, TWO_PI),
    pulse: 1,
    activity: 0.5,
    wobble: 0.9 + (index % 3) * 0.12 + random(0, 0.08),
  }));

  flowState = graph.edges.map((edge, index) => ({
    id: edge.id,
    progress: random(0, 1),
    speed: 0.00055 + (index % 3) * 0.00018 + random(0, 0.00025),
    intensity: 0.4,
    active: false,
  }));

  roiBase = Number(metrics.baselineSavings) || 0;
  roiAccumulator = 0;
  const velocity = Number(metrics.roiVelocity);
  if (Number.isFinite(velocity) && velocity > 0) {
    roiRate = velocity / 1000;
  } else {
    roiRate = 0.24;
  }

  const perMinute = Number(metrics.eventsPerMinute);
  if (Number.isFinite(perMinute) && perMinute > 0) {
    throughputRate = perMinute;
  } else {
    throughputRate = 120;
  }

  basePulsePhase = random(0, TWO_PI);
  lastTime = typeof performance !== "undefined" ? performance.now() : Date.now();

  stopLoop();
  frameTimer = setInterval(step, 1000 / 60);
}

function step() {
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  const rawDelta = now - lastTime;
  const delta = Math.max(8, Math.min(32, rawDelta));
  lastTime = now;

  basePulsePhase = (basePulsePhase + delta * 0.0012) % TWO_PI;

  nodeState = nodeState.map((state, index) => {
    const speed = 0.0015 + (index % 3) * 0.00045 + state.wobble * 0.00015;
    const nextPhase = (state.phase + delta * speed) % TWO_PI;
    const pulse = 0.93 + 0.09 * ((Math.sin(nextPhase) + 1) / 2);
    const activity = 0.35 + 0.65 * Math.pow(Math.sin(nextPhase * 0.75 + index), 2);
    return { ...state, phase: nextPhase, pulse, activity };
  });

  let activeConnections = 0;
  flowState = flowState.map((state) => {
    let progress = state.progress + delta * state.speed;
    if (progress > 1) {
      progress -= Math.floor(progress);
    }
    const intensity = 0.38 + 0.62 * Math.sin(progress * Math.PI);
    const active = progress < 0.22;
    if (active) activeConnections += 1;
    return { ...state, progress, intensity, active };
  });

  roiAccumulator += roiRate * delta;
  const roiTotal = roiBase + roiAccumulator;

  const throughput = {
    perMinute: throughputRate + Math.sin(now / 1400) * (throughputRate * 0.08),
    activeConnections,
  };

  const frame = {
    type: "frame",
    roi: roiTotal,
    pulse: 0.96 + 0.04 * Math.sin(basePulsePhase),
    flows: flowState.map(({ id, progress, intensity, active }) => ({
      id,
      progress,
      intensity,
      active,
    })),
    nodes: nodeState.map(({ id, pulse, activity }) => ({
      id,
      pulse,
      activity,
    })),
    throughput,
  };

  self.postMessage(frame);
}

self.onmessage = (event) => {
  const payload = event?.data;
  if (!payload || typeof payload !== "object") return;

  switch (payload.type) {
    case "init":
    case "configure":
      configure(payload.payload || payload);
      break;
    case "update":
      configure({ ...payload.payload, graph, metrics: { baselineSavings: roiBase, roiVelocity: roiRate * 1000, eventsPerMinute: throughputRate } });
      break;
    case "stop":
      stopLoop();
      break;
    default:
      break;
  }
};

self.onclose = stopLoop;
self.onerror = stopLoop;