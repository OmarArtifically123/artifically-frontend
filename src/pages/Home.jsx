import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Marketplace from "../components/Marketplace";

export default function Home({ user, onRequireAuth, onNotify, scrollTo }) {
  const location = useLocation();

  useEffect(() => {
    let target = scrollTo;

    // If user landed with a hash (#marketplace)
    if (!target && location.hash) {
      target = location.hash.replace("#", "");
    }

    if (!target) return;

    // wait next paint so sections exist, then scroll
    requestAnimationFrame(() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  }, [scrollTo, location]);

  return (
    <main>
      <Hero />
      <Features />
      {/* Marketplace section with id to allow smooth scroll */}
      <div id="marketplace">
        <Marketplace
          user={user}
          onRequireAuth={onRequireAuth}
          onNotify={onNotify}
        />
      </div>
    </main>
  );
}
