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
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="var(--primary)" opacity="0.15"/>
            <path d="M14 6 C14 6 20 10 20 16 C20 20 17 22 14 22 C11 22 8 20 8 16 C8 10 14 6 14 6Z" fill="var(--primary)">
              <animate attributeName="d" dur="4s" repeatCount="indefinite"
                values="M14 6 C14 6 20 10 20 16 C20 20 17 22 14 22 C11 22 8 20 8 16 C8 10 14 6 14 6Z;M14 6 C14 6 21 11 20 17 C19 21 16 23 14 22 C12 23 9 21 8 17 C7 11 14 6 14 6Z;M14 6 C14 6 20 10 20 16 C20 20 17 22 14 22 C11 22 8 20 8 16 C8 10 14 6 14 6Z"/>
            </path>
            <line x1="14" y1="10" x2="14" y2="22" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          </svg>
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
          className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white", textDecoration: "none", boxShadow: "0 4px 16px rgba(122,154,101,0.35)" }}>
          Get the App ↓
        </a>
      </div>
    </nav>
  );
}
