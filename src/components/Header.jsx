import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import LogoLight from "../assets/logos/1_Primary.svg";
import LogoDark from "../assets/logos/3_Dark_Mode.svg";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function Header({ user, onSignIn, onSignUp, onSignOut }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { darkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = useMemo(
    () => [
      { path: "/marketplace", label: "Marketplace" },
      { path: "/pricing", label: "Pricing" },
      { path: "/docs", label: "Docs" },
    ],
    []
  );

  const headerBackground = useMemo(
    () => ({
      background: darkMode
        ? "linear-gradient(120deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.9))"
        : "linear-gradient(120deg, rgba(255, 255, 255, 0.95), rgba(226, 232, 240, 0.9))",
      borderBottom: `1px solid ${darkMode ? "rgba(148, 163, 184, 0.28)" : "rgba(148, 163, 184, 0.35)"}`,
      boxShadow: scrolled
        ? darkMode
          ? "0 20px 45px rgba(8, 15, 34, 0.65)"
          : "0 20px 45px rgba(148, 163, 184, 0.45)"
        : "none",
    }),
    [darkMode, scrolled]
  );

  return (
    <header
      className={`site-header ${scrolled ? "scrolled" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "0.65rem 0" : "1rem 0",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "all var(--transition-normal)",
        ...headerBackground,
      }}
    >
      <div
        className="header-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.75rem",
          position: "relative",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "1.5rem",
            background: darkMode
              ? "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 55%), radial-gradient(circle at 80% 30%, rgba(6,182,212,0.18), transparent 55%)"
              : "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.12), transparent 55%), radial-gradient(circle at 80% 30%, rgba(6,182,212,0.12), transparent 55%)",
            opacity: scrolled ? 1 : 0.65,
            transition: "opacity var(--transition-normal)",
            pointerEvents: "none",
          }}
        />

        <div
          className="brand"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              navigate("/");
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
            padding: "0.35rem 0.5rem",
            borderRadius: "0.9rem",
            transition: "transform var(--transition-fast)",
          }}
        >
          <img
            src={darkMode ? LogoDark : LogoLight}
            alt="Artifically"
            style={{
              height: "56px",
              width: "auto",
              display: "block",
              filter: darkMode
                ? "drop-shadow(0 0 10px rgba(99, 102, 241, 0.55))"
                : "drop-shadow(0 0 6px rgba(99, 102, 241, 0.35))",
              transition: "filter var(--transition-normal)",
            }}
          />
        </div>

        <nav
          className="nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {navItems.map(({ path, label }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className="nav-item"
                style={{
                  position: "relative",
                  padding: "0.55rem 1.15rem",
                  borderRadius: "0.85rem",
                  textDecoration: "none",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  color: isActive
                    ? darkMode
                      ? "#ffffff"
                      : "#0f172a"
                    : darkMode
                    ? "#cbd5e1"
                    : "#475569",
                  background: isActive
                    ? darkMode
                      ? "rgba(148, 163, 184, 0.16)"
                      : "rgba(99, 102, 241, 0.15)"
                    : "transparent",
                  transition: "all var(--transition-fast)",
                }}
              >
                {label}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "auto 15% -6px 15%",
                    height: "2px",
                    borderRadius: "999px",
                    background: isActive
                      ? "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)"
                      : "transparent",
                    transition: "opacity var(--transition-fast)",
                  }}
                />
              </Link>
            );
          })}
        </nav>

        <div
          className="header-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <ThemeToggle />

          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => navigate("/dashboard")}
                style={{
                  padding: "0.5rem 1.15rem",
                  borderRadius: "0.85rem",
                  border: `1px solid ${darkMode ? "rgba(148, 163, 184, 0.35)" : "rgba(148, 163, 184, 0.45)"}`,
                  background: darkMode
                    ? "rgba(148, 163, 184, 0.18)"
                    : "rgba(99, 102, 241, 0.12)",
                  color: darkMode ? "#e2e8f0" : "#1f2937",
                  transition: "all var(--transition-fast)",
                }}
              >
                Dashboard
              </button>
              <button
                className="btn btn-primary"
                onClick={onSignOut}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "0.85rem",
                  boxShadow: darkMode
                    ? "0 18px 30px rgba(99, 102, 241, 0.35)"
                    : "0 18px 30px rgba(99, 102, 241, 0.25)",
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={onSignIn}
                style={{
                  padding: "0.5rem 1.1rem",
                  borderRadius: "0.85rem",
                  border: `1px solid ${darkMode ? "rgba(148, 163, 184, 0.35)" : "rgba(148, 163, 184, 0.45)"}`,
                  background: darkMode
                    ? "rgba(148, 163, 184, 0.18)"
                    : "rgba(99, 102, 241, 0.12)",
                  color: darkMode ? "#e2e8f0" : "#1f2937",
                  transition: "all var(--transition-fast)",
                }}
              >
                Sign in
              </button>
              <button
                className="btn btn-primary"
                onClick={onSignUp}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "0.85rem",
                  boxShadow: darkMode
                    ? "0 18px 30px rgba(99, 102, 241, 0.35)"
                    : "0 18px 30px rgba(99, 102, 241, 0.25)",
                }}
              >
                Get started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
