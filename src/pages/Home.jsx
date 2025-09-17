import { useEffect } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Marketplace from "../components/Marketplace";

export default function Home({ user, onRequireAuth, onNotify, scrollTo }) {
  useEffect(() => {
    if (!scrollTo) return;
    // wait next paint so sections exist, then scroll
    requestAnimationFrame(() => {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  }, [scrollTo]);

  return (
    <main>
      <Hero />
      <Features />
      {/* Give the marketplace section an id to scroll to */}
      <div id="marketplace">
        <Marketplace user={user} onRequireAuth={onRequireAuth} onNotify={onNotify} />
      </div>
    </main>
  );
}
