import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api, { pick } from "./api";
import { toast } from "./Toast";

export default function Verify({ onVerified }) {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      return;
    }
    (async () => {
      try {
        const data = await api.get(`/auth/verify-email`, { params: { token } }).then(pick());
        // backend may send an email; but we also want fresh /auth/me if token was present
        // attempt to fetch user afterwards (in case backend sets verified on the account)
        try {
          const me = await api.get("/auth/me").then(pick("user"));
          if (me) onVerified?.(me);
        } catch {}
        setStatus("success");
        toast("Email verified! You’re good to go.", { type: "success" });
        setTimeout(() => navigate("/dashboard"), 1200);
      } catch (e) {
        setStatus("error");
        toast(e.message || "Verification failed", { type: "error" });
      }
    })();
  }, []);

  return (
    <div className="container" style={{ padding: "60px 16px", textAlign: "center" }}>
      {status === "loading" && <h2>Verifying your email…</h2>}
      {status === "success" && <h2>✅ Verified! Redirecting…</h2>}
      {status === "error" && (
        <>
          <h2>Verification error</h2>
          <p>We couldn’t verify that link. Try resending the verification email from the banner.</p>
        </>
      )}
    </div>
  );
}
