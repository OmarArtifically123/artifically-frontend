import { space } from "../styles/spacing";
// src/components/DebugHydration.jsx
import { useEffect, useState } from "react";

export function DebugHydration({ children, name = "Component" }) {
  const [renderInfo, setRenderInfo] = useState({
    renderCount: 0,
    isClient: false,
    hasHydrated: false,
  });

  useEffect(() => {
    setRenderInfo((prev) => ({
      ...prev,
      isClient: true,
      hasHydrated: true,
    }));

    if (process.env.NODE_ENV !== "production") {
      console.log(`🔍 ${name} hydrated successfully`);
    }
  }, [name]);

  useEffect(() => {
    setRenderInfo((prev) => ({
      ...prev,
      renderCount: prev.renderCount + 1,
    }));
  });

  if (!process.env.NODE_ENV !== "production") {
    return <>{children}</>;
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: space("xs"),
          fontSize: "12px",
          zIndex: 9999,
          fontFamily: "monospace",
        }}
      >
        {name}: R#{renderInfo.renderCount} |
        {renderInfo.isClient ? " CLIENT" : " SERVER"} |
        {renderInfo.hasHydrated ? " HYDRATED" : " PENDING"}
      </div>
      {children}
    </>
  );
}

export default DebugHydration;