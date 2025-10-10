import { useEffect, useMemo, useRef, useState, useId } from "react";

const COLORS = [
  "#34d399",
  "#60a5fa",
  "#f472b6",
  "#facc15",
  "#c084fc",
];

function pickColor(seed) {
  const index = Math.abs(seed.charCodeAt(0) + seed.charCodeAt(seed.length - 1)) % COLORS.length;
  return COLORS[index];
}

export default function MarketplaceCollaborationLayer({
  focus,
  onVote,
  channel,
  sessionId: providedSessionId,
}) {
  const [peers, setPeers] = useState([]);
  const [discussion, setDiscussion] = useState([]);
  const channelRef = useRef(null);
  const fallbackSessionId = useId();
  const sessionId = useMemo(
    () => providedSessionId || `mp-${fallbackSessionId.replace(/[:]/g, "-")}`,
    [fallbackSessionId, providedSessionId],
  );

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const supportsBroadcast = typeof BroadcastChannel !== "undefined";
    if (!supportsBroadcast && !channel) {
      return () => {};
    }

    const instance = channel ?? new BroadcastChannel("marketplace-collaboration");
    channelRef.current = instance;

    const announce = () => {
      channelRef.current?.postMessage({ type: "join", sessionId, focus });
    };

    const interval = setInterval(announce, 4000);
    announce();

    const handleMessage = (event) => {
      const payload = event.data;
      if (!payload) return;
      if (payload.sessionId === sessionId) return;

      if (payload.type === "join") {
        setPeers((prev) => {
          if (prev.some((peer) => peer.id === payload.sessionId)) {
            return prev.map((peer) =>
              peer.id === payload.sessionId
                ? { ...peer, focus: payload.focus, lastSeen: Date.now() }
                : peer,
            );
          }
          return [
            ...prev,
            {
              id: payload.sessionId,
              color: pickColor(payload.sessionId),
              focus: payload.focus,
              lastSeen: Date.now(),
              x: 120 + Math.random() * 160,
              y: 120 + Math.random() * 120,
              votes: 0,
            },
          ];
        });
      }

      if (payload.type === "cursor") {
        setPeers((prev) =>
          prev.map((peer) =>
            peer.id === payload.sessionId
              ? { ...peer, x: payload.x, y: payload.y, lastSeen: Date.now() }
              : peer,
          ),
        );
      }

      if (payload.type === "discovery") {
        setDiscussion((prev) => [
          ...prev.slice(-8),
          {
            id: `${payload.sessionId}-${Date.now()}`,
            author: payload.author,
            text: payload.text,
            color: pickColor(payload.sessionId),
            votes: payload.votes || 0,
          },
        ]);
      }

      if (payload.type === "vote" && onVote) {
        onVote(payload);
      }
    };

    instance.addEventListener("message", handleMessage);

    return () => {
      clearInterval(interval);
      instance.removeEventListener("message", handleMessage);
      if (!channel) {
        instance.close();
      }
    };
  }, [channel, focus, onVote, sessionId]);

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    if (!channelRef.current && typeof BroadcastChannel === "undefined") {
      return () => {};
    }
    const handlePointerMove = (event) => {
      channelRef.current?.postMessage({
        type: "cursor",
        sessionId,
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [sessionId]);

  useEffect(() => {
    const pruneInterval = setInterval(() => {
      setPeers((prev) => prev.filter((peer) => Date.now() - peer.lastSeen < 6000));
    }, 5000);
    return () => clearInterval(pruneInterval);
  }, []);

  const shareDiscovery = (text) => {
    channelRef.current?.postMessage({
      type: "discovery",
      sessionId,
      author: `Teammate ${sessionId.slice(0, 2).toUpperCase()}`,
      text,
      votes: Math.round(Math.random() * 5),
    });
  };

  useEffect(() => {
    if (!focus) return;
    shareDiscovery(`Spotlight on ${focus}. Should we shortlist it?`);
  }, [focus]);

  return (
    <div className="marketplace-collaboration" aria-hidden="true">
      {peers.map((peer) => (
        <div
          key={peer.id}
          className="marketplace-collaboration__cursor"
          style={{
            transform: `translate(${peer.x}px, ${peer.y}px)`,
            borderColor: peer.color,
          }}
        >
          <span style={{ backgroundColor: peer.color }}>{peer.focus || "Exploring"}</span>
        </div>
      ))}
      <div className="marketplace-collaboration__discussion">
        {discussion.map((entry) => (
          <div key={entry.id} style={{ borderColor: entry.color }}>
            <strong>{entry.author}</strong>
            <p>{entry.text}</p>
            <span>{entry.votes} votes</span>
          </div>
        ))}
      </div>
    </div>
  );
}