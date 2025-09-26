import { useState } from "react";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", topic: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setFormState({ name: "", email: "", topic: "", message: "" });
    setTimeout(() => setStatus(""), 2500);
  };

  return (
    <main className="container" style={{ padding: "64px 0", minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: "0 auto 48px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: "16px" }}>Contact our team</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Tell us about your automation initiative and we'll craft a tailored success plan.
        </p>
      </header>

      <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          <label style={{ display: "grid", gap: "8px" }}>
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>
          <label style={{ display: "grid", gap: "8px" }}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>
          <label style={{ display: "grid", gap: "8px" }}>
            <span>Topic</span>
            <input
              type="text"
              name="topic"
              value={formState.topic}
              onChange={handleChange}
              placeholder="Deployment, pricing, partnership..."
              style={inputStyle}
            />
          </label>
          <label style={{ display: "grid", gap: "8px" }}>
            <span>Message</span>
            <textarea
              name="message"
              value={formState.message}
              onChange={handleChange}
              rows={4}
              style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }}
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "loading"}
            style={{ padding: "12px 20px", borderRadius: "12px" }}
          >
            {status === "loading" ? "Sending..." : "Submit"}
          </button>

          <div aria-live="polite" style={{ color: status === "success" ? "#34d399" : "var(--gray-400)" }}>
            {status === "success" && "Thanks! We'll reach out shortly."}
          </div>
        </form>
      </section>
    </main>
  );
}

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(148, 163, 184, 0.32)",
  background: "rgba(15, 23, 42, 0.7)",
  color: "var(--white)",
};