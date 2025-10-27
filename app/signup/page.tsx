"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppShell } from "@/context/AppShellContext";

export default function SignupPage() {
  const router = useRouter();
  const { openAuth } = useAppShell();

  useEffect(() => {
    // Open signup modal and redirect to home
    openAuth("signup");
    router.push("/");
  }, [openAuth, router]);

  return (
    <div style={{ 
      minHeight: "50vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      color: "var(--gray-400)"
    }}>
      <p>Redirecting to signup...</p>
    </div>
  );
}

