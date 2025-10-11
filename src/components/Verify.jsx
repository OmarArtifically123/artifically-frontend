import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api, { pick } from "../api";
import { toast } from "./Toast";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { space } from "../styles/spacing";
import Button from "./ui/Button";

export default function Verify({ onVerified }) {
  const { darkMode } = useTheme();
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      toast("Missing verification token", { type: "error" });
      return;
    }

    (async () => {
      try {
        await api.get("/auth/verify-email", { params: { token } }).then(pick());
        try {
          const me = await api.get("/auth/me").then(pick("user"));
          if (me) {
            onVerified?.(me);
            setEmail(me.email);
          }
        } catch {
          /* ignore */
        }

        setStatus("success");
        toast("Email verified! You’re good to go.", { type: "success" });
        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (err) {
        setStatus("error");
        const msg = err?.response?.data?.message || err?.message || "Verification failed";
        toast(msg, { type: "error" });
      }
    })();
  }, []);

  const resend = async () => {
    if (!email) {
      toast("No email found. Please sign in first.", { type: "error" });
      return;
    }
    try {
      setResending(true);
      await api.post("/auth/resend-verification", { email });
      toast("Verification email resent", { type: "success" });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Resend failed";
      toast(msg, { type: "error" });
    } finally {
      setResending(false);
    }
  };

  const renderCard = (content) => (
    <section style={{ padding: `${space("2xl", 1.5)} 0` }}>
      <div
        className="container"
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          display: "grid",
          gap: space("md"),
          textAlign: "center",
          background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
          borderRadius: "1.5rem",
          padding: space("xl"),
          border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
          boxShadow: darkMode
            ? "0 35px 65px rgba(8, 15, 34, 0.55)"
            : "0 35px 65px rgba(148, 163, 184, 0.35)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, color: darkMode ? "#cbd5e1" : "#475569" }}>Email verification</div>
          <ThemeToggle />
        </div>
        {content}
      </div>
    </section>
  );

  if (status === "loading") {
    return renderCard(
      <>
        <h2 style={{ fontSize: "1.75rem" }}>Verifying your email…</h2>
        <div className="loading" style={{ width: "40px", height: "40px", margin: "0 auto" }}></div>
      </>
    );
  }

  if (status === "success") {
    return renderCard(
      <>
        <h2 style={{ fontSize: "1.75rem", color: darkMode ? "#6ee7b7" : "#047857" }}>✅ Verified! Redirecting…</h2>
        <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>Hang tight, taking you to the dashboard.</p>
      </>
    );
  }

  return renderCard(
    <>
      <h2 style={{ fontSize: "1.75rem", color: darkMode ? "#fda4af" : "#b91c1c" }}>Verification error</h2>
      <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
        We couldn’t verify that link. The token may have expired.
      </p>
      <Button variant="primary" onClick={resend} disabled={resending}>
        <span>{resending ? "Resending…" : "Resend Verification Email"}</span>
      </Button>
    </>
  );
}