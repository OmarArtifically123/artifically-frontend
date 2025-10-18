"use client";

import { useCallback } from "react";

import apiClient from "@/api";
import { toast } from "@/components/Toast";
import Button from "@/components/ui/Button";
import { useAppShell } from "@/context/AppShellContext";

export default function AppShellVerificationBanner() {
  const { user, authChecking } = useAppShell();

  const handleResend = useCallback(async () => {
    try {
      await apiClient.post("/auth/resend-verification");
      toast("Verification email sent. Check your inbox.", { type: "success" });
    } catch (error) {
      const fallbackMessage = "Could not resend verification";
      let message = fallbackMessage;
      if (error instanceof Error) {
        message = error.message || fallbackMessage;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        message = String((error as { message?: unknown }).message ?? fallbackMessage);
      }
      toast(message, { type: "error" });
    }
  }, []);

  if (!user || user.verified || authChecking) {
    return null;
  }

  return (
    <div className="banner warn">
      <div className="container">
        <strong>Verify your email</strong> to unlock deployments and AI features.
        <Button
          size="sm"
          variant="secondary"
          glowOnHover={false}
          style={{ marginLeft: 12 }}
          onClick={handleResend}
        >
          Resend link
        </Button>
      </div>
    </div>
  );
}