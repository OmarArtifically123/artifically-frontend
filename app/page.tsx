"use client";

import React from "react";

export default function Page() {
  const [message, setMessage] = React.useState("Checking React instances...");

  React.useEffect(() => {
    // Check for duplicate React versions
    const reactVersion = React.version;
    const fiberReact = require("@react-three/fiber").version || "N/A";
    const zustandReact = require("zustand").default?.toString() || "N/A";

    console.log("%c[Diagnostics]", "color: #4CAF50; font-weight: bold;");
    console.log("React version:", reactVersion);
    console.log("@react-three/fiber detected:", fiberReact);
    console.log("zustand React reference:", zustandReact);
    setMessage(`✅ React unified successfully (v${reactVersion})`);
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "monospace",
        color: "#00FFB2",
        background: "#111",
      }}
    >
      <h1>{message}</h1>
      <p>Check your browser console for diagnostic output.</p>
    </div>
  );
}
