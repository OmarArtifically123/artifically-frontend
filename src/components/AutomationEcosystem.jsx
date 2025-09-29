import { useEffect, useMemo, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;
const NODE_RADIUS = 32;

function normalize(value) {
  return String(value || "").toLowerCase();
}

function createNode(item, index, total) {
  const angle = (index / Math.max(1, total)) * Math.PI * 2;
  const radius = 120 + (index % 3) * 18;
  return {
    id: item.id,
    label: item.name,
    category: item.category || item.vertical || "Automation",
    x: CANVAS_WIDTH / 2 + Math.cos(angle) * radius,
    y: CANVAS_HEIGHT / 2 + Math.sin(angle) * radius * 0.72,
    vx: 0,
    vy: 0,
    linked: false,
    stackable: item.tags || [],
  };
}

export default function AutomationEcosystem({ automations, focus, onCombine }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [connections, setConnections] = useState([]);
  const dragRef = useRef(null);

  useEffect(() => {
    const subset = automations.slice(0, 12);
    setNodes(subset.map((item, index) => createNode(item, index, subset.length)));
    setConnections([]);
    setActiveNode(null);
  }, [automations]);

  const relatedTags = useMemo(() => normalize(focus), [focus]);

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return () => {};

    let frame;

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.save();
      ctx.translate(0.5, 0.5);

      connections.forEach((connection) => {
        const source = nodes.find((node) => node.id === connection.source);
        const target = nodes.find((node) => node.id === connection.target);
        if (!source || !target) return;
        const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
        gradient.addColorStop(0, "rgba(79,70,229,0.85)");
        gradient.addColorStop(1, "rgba(16,185,129,0.85)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.quadraticCurveTo(
          (source.x + target.x) / 2 + Math.sin(connection.weight) * 28,
          (source.y + target.y) / 2 + Math.cos(connection.weight) * 24,
          target.x,
          target.y,
        );
        ctx.stroke();
      });

      nodes.forEach((node) => {
        const gradient = ctx.createRadialGradient(node.x, node.y, 8, node.x, node.y, NODE_RADIUS);
        gradient.addColorStop(0, node.linked ? "rgba(16,185,129,0.9)" : "rgba(99,102,241,0.95)");
        gradient.addColorStop(1, node.linked ? "rgba(5,150,105,0.35)" : "rgba(79,70,229,0.32)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(15,23,42,0.92)";
        ctx.font = "14px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label.slice(0, 18), node.x, node.y + 4);
      });

      ctx.restore();
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [nodes, connections]);

  useEffect(() => {
    if (!relatedTags) return;
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        linked: node.stackable.some((tag) => normalize(tag).includes(relatedTags)),
      })),
    );
  }, [relatedTags]);

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const canvas = canvasRef.current;
    if (!canvas) return () => {};

    const getNodeAt = (x, y) => {
      return nodes.find((node) => (node.x - x) ** 2 + (node.y - y) ** 2 <= NODE_RADIUS ** 2);
    };

    const handlePointerDown = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const node = getNodeAt(x, y);
      if (node) {
        dragRef.current = { id: node.id, offsetX: x - node.x, offsetY: y - node.y };
        setActiveNode(node);
      }
    };

    const handlePointerMove = (event) => {
      if (!dragRef.current) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left - dragRef.current.offsetX;
      const y = event.clientY - rect.top - dragRef.current.offsetY;
      setNodes((prev) =>
        prev.map((node) =>
          node.id === dragRef.current.id
            ? {
                ...node,
                x: Math.max(NODE_RADIUS, Math.min(CANVAS_WIDTH - NODE_RADIUS, x)),
                y: Math.max(NODE_RADIUS, Math.min(CANVAS_HEIGHT - NODE_RADIUS, y)),
              }
            : node,
        ),
      );
    };

    const handlePointerUp = () => {
      if (!dragRef.current) return;
      const dragged = nodes.find((node) => node.id === dragRef.current.id);
      if (dragged) {
        const linked = nodes.filter((node) => node.id !== dragged.id && node.linked);
        const closeTargets = linked.filter(
          (node) => (node.x - dragged.x) ** 2 + (node.y - dragged.y) ** 2 <= 220 ** 2,
        );
        if (closeTargets.length) {
          setConnections((prev) => {
            const existing = new Set(prev.map((connection) => `${connection.source}-${connection.target}`));
            const updates = [...prev];
            closeTargets.forEach((target) => {
              const key = `${dragged.id}-${target.id}`;
              if (!existing.has(key)) {
                updates.push({ source: dragged.id, target: target.id, weight: Math.random() * 3.14 });
              }
            });
            return updates;
          });
          if (onCombine) {
            onCombine({
              source: dragged,
              targets: closeTargets,
            });
          }
        }
      }
      dragRef.current = null;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [nodes, onCombine]);

  return (
    <section className="automation-ecosystem">
      <header>
        <span>Automation ecosystem visualization</span>
        <h3>Drag automations together to reveal integrations</h3>
        <p>
          Pull related automations closer and watch connection lines animate between compatible
          workflows.
        </p>
      </header>
      <div className="automation-ecosystem__canvas" role="application">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
        {activeNode ? (
          <div className="automation-ecosystem__active" aria-live="assertive">
            <strong>{activeNode.label}</strong>
            <span>{activeNode.category}</span>
            {activeNode.linked ? <em>Perfect fit for your current focus.</em> : <em>Drag towards a glowing node to explore combos.</em>}
          </div>
        ) : null}
      </div>
    </section>
  );
}