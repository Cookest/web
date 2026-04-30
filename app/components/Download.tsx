"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

function StoreButton({ href, store }: { href: string; store: "apple" | "google" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        background: hovered ? "rgba(255,255,255,0.95)" : "white",
        borderRadius: 12, padding: "12px 22px", textDecoration: "none",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.2)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 0.25s, box-shadow 0.25s, background 0.2s",
        minWidth: 168,
      }}>
      {store === "apple" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#1C3A2A"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#1C3A2A"><path d="M3.18 23.76c.28.15.6.2.93.14l12.35-12.35L12.5 7.6 3.18 23.76zm17.04-10.8L17.5 11.5l-2.14 2.14 2.8 2.8c.5.28.8.3 1.08.02.26-.27.26-.74-.02-1.5zM3.54.25C3.26.52 3.1.96 3.1 1.56v20.9c0 .6.16 1.04.44 1.3L3.62 23.8 15.97 11.5 3.62.2l-.08.05zm14.07 8.14l-2.13-1.23L13.4 9.24l2.08 2.08 2.13-1.23c.6-.35.85-.7.85-1.08s-.25-.74-.85-1.08z"/></svg>
      )}
      <div>
        <div style={{ fontSize: "0.65rem", color: "rgba(28,58,42,0.55)", fontWeight: 500, lineHeight: 1 }}>
          {store === "apple" ? "Download on the" : "Get it on"}
        </div>
        <div style={{ fontSize: "0.95rem", color: "#1C3A2A", fontWeight: 700, lineHeight: 1.4 }}>
          {store === "apple" ? "App Store" : "Google Play"}
        </div>
      </div>
    </a>
  );
}

export default function Download() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="download" style={{ padding: "100px 0", background: "var(--heading)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(122,154,101,0.12)", filter: "blur(60px)", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", bottom: "-20%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "rgba(78,122,58,0.15)", filter: "blur(50px)", pointerEvents: "none" }}/>

      <div className="max-w-6xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(180,204,158,0.15)", color: "var(--primary-light)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 24, border: "1px solid rgba(180,204,158,0.2)" }}>Download</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, color: "white", marginBottom: 16, lineHeight: 1.15 }}>
            Start planning smarter<br /><em style={{ color: "var(--primary-light)", fontStyle: "italic" }}>meals today.</em>
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 440, margin: "0 auto 40px" }}>
            Free to download. No credit card needed. Join thousands of home cooks already using Cookest.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <StoreButton href="#" store="apple" />
            <StoreButton href="#" store="google" />
          </div>

          <p style={{ marginTop: 32, fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>Available on iOS 16+ and Android 10+</p>
        </motion.div>
      </div>
    </section>
  );
}

