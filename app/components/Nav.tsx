"use client";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3 shadow-sm" : "py-5"}`}
      style={{ background: scrolled ? "rgba(245,245,240,0.95)" : "transparent", backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? "1px solid var(--border)" : "none" }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-app.png" alt="Cookest" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.35rem", color: "var(--heading)" }}>Cookest</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {["Features","App","How it works","Mission"].map((l, i) => (
            <li key={l}><a href={["#features","#showcase","#how","#sustain"][i]}
              className="text-sm font-medium transition-colors duration-200 hover:text-[var(--primary-dark)]"
              style={{ color: "var(--text)", textDecoration: "none" }}>{l}</a></li>
          ))}
        </ul>
        <a href="#download"
          className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white", textDecoration: "none", boxShadow: "0 4px 16px rgba(122,154,101,0.35)" }}>
          Get the App ↓
        </a>
      </div>
    </nav>
  );
}
