"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AuditEvent {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  status: "success" | "warning" | "error";
  ip: string;
}

/**
 * Live audit trail demonstration
 */
export default function AuditTrailDemo() {
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    // Simulate live audit events
    const generateEvent = (): AuditEvent => {
      const actions = [
        "User login",
        "Data export",
        "Workflow execution",
        "Permission change",
        "API key generated",
        "Configuration update",
        "Integration enabled",
      ];
      
      const resources = [
        "user:john.doe@company.com",
        "workflow:w-12345",
        "integration:salesforce",
        "api-key:ak-67890",
        "role:admin",
      ];

      const statuses: Array<"success" | "warning" | "error"> = ["success", "success", "success", "warning"];

      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        user: `user-${Math.floor(Math.random() * 100)}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        resource: resources[Math.floor(Math.random() * resources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      };
    };

    // Add initial events
    const initial = Array.from({ length: 5 }, generateEvent);
    setEvents(initial);

    // Add new event every 3 seconds
    const interval = setInterval(() => {
      setEvents((prev) => {
        const newEvents = [generateEvent(), ...prev];
        return newEvents.slice(0, 10); // Keep only last 10
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Live Audit Trail</h3>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-2">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className="p-4 rounded-lg border border-slate-700 bg-slate-900/50"
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Action */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`
                      w-2 h-2 rounded-full
                      ${event.status === "success" ? "bg-green-400" : ""}
                      ${event.status === "warning" ? "bg-yellow-400" : ""}
                      ${event.status === "error" ? "bg-red-400" : ""}
                    `}
                  />
                  <span className="text-white font-medium text-sm">
                    {event.action}
                  </span>
                </div>

                {/* Details */}
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Resource: <span className="text-cyan-400">{event.resource}</span></div>
                  <div>User: <span className="text-slate-300">{event.user}</span></div>
                  <div>IP: <span className="text-slate-300">{event.ip}</span></div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="text-slate-500">⏰</span>
                <span>{event.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer info */}
      <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/30 text-center">
        <p className="text-xs text-slate-400">
          All events are encrypted and immutably stored for 7 years
        </p>
      </div>
    </div>
  );
}


