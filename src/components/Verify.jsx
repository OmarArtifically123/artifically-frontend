import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api, { pick } from "../api";
import { toast } from "./Toast";

export default function Verify({ onVerified }) {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
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
        // Verify token with backend
        await api.get("/auth/verify-email", { params: { token } }).then(pick());

        // Refresh user state
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
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Verification failed";
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
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Resend failed";
      toast(msg, { type: "error" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 16px", textAlign: "center" }}>
      {status === "loading" && <h2>Verifying your email…</h2>}
      {status === "success" && <h2>✅ Verified! Redirecting…</h2>}
      {status === "error" && (
        <>
          <h2>Verification error</h2>
          <p>
            We couldn’t verify that link. The token may have expired. 
          </p>
          <button className="btn btn-primary" disabled={resending} onClick={resend}>
            {resending ? "Resending…" : "Resend Verification Email"}
          </button>
        </>
      )}
    </div>
  );
}
