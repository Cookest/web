"use client";
import { motion } from "framer-motion";
import ShaderCanvas from "./ShaderCanvas";
import AnimatedBorderButton from "./AnimatedBorderButton";

function FloatingAccent({ style, delay = 0 }: { style: React.CSSProperties; delay?: number }) {
  return (
    <motion.div
      style={{ position: "absolute", opacity: 0.18, pointerEvents: "none", ...style }}
      animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 4 C20 4 32 12 32 24 C32 32 26 36 20 36 C14 36 8 32 8 24 C8 12 20 4 20 4Z" fill="var(--primary)"/>
        <line x1="20" y1="8" x2="20" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M14 16 Q20 13 26 16" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
      </svg>
    </motion.div>
  );
}

function HeroPhone() {
  return (
    <motion.div
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ filter: "drop-shadow(0 40px 60px rgba(28,58,42,0.28))" }}>
      <div style={{ width: 240, background: "#111827", borderRadius: 42, padding: 13, position: "relative" }}>
        <div style={{ position: "absolute", top: 13, left: "50%", transform: "translateX(-50%)", width: 70, height: 22, background: "#111827", borderRadius: "0 0 16px 16px", zIndex: 10 }}/>
        <div style={{ background: "var(--bg)", borderRadius: 30, overflow: "hidden" }}>
          <div style={{ background: "var(--primary)", padding: "10px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "white", fontSize: 8, fontWeight: 700 }}>9:41</span>
            <span style={{ color: "white", fontSize: 8 }}>●●●</span>
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 13, color: "var(--heading)", marginBottom: 10 }}>This Week 🗓</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 12 }}>
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 6, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 3 }}>{d}</div>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: i===0 ? "var(--primary)" : "transparent", color: i===0 ? "white" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 600, margin: "0 auto" }}>{14+i}</div>
                </div>
              ))}
            </div>
            {[["🥑","Breakfast","Avocado Toast"],["🥗","Lunch","Quinoa Bowl"],["🍝","Dinner","Pasta Primavera"]].map(([icon, type, name]) => (
              <div key={name} style={{ background: "white", borderRadius: 8, padding: "7px 9px", marginBottom: 5, display: "flex", alignItems: "center", gap: 7, boxShadow: "0 1px 4px rgba(28,58,42,0.06)" }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(122,154,101,0.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 6, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--primary-dark)", fontWeight: 700 }}>{type}</div>
                  <div style={{ fontSize: 8, fontWeight: 600, color: "var(--heading)", marginTop: 1 }}>{name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
      <ShaderCanvas />

      <FloatingAccent style={{ top: "15%", right: "8%", transform: "rotate(20deg)" }} delay={0} />
      <FloatingAccent style={{ bottom: "20%", left: "5%", transform: "rotate(-15deg)" }} delay={1.5} />
      <FloatingAccent style={{ top: "60%", right: "30%", transform: "rotate(40deg) scale(0.6)" }} delay={3} />

      <div className="max-w-6xl mx-auto px-6 w-full" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", border: "1px solid var(--border)", borderRadius: 100, padding: "8px 16px", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 28, boxShadow: "0 2px 8px rgba(28,58,42,0.06)" }}>
              <span style={{ width: 8, height: 8, background: "var(--primary)", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }}/>
              Now available · iOS & Android
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.6rem, 5vw, 3.8rem)", fontWeight: 700, lineHeight: 1.1, color: "var(--heading)", marginBottom: 20 }}>
              Plan your meals,<br /><em style={{ color: "var(--primary-dark)", fontStyle: "italic" }}>effortlessly.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: "1.08rem", color: "var(--text-muted)", lineHeight: 1.78, marginBottom: 36, maxWidth: 440 }}>
              AI-powered meal planning that works around your schedule, your pantry, and your taste. Less waste 🌱, better food, every week.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <AnimatedBorderButton href="#download">↓ Download Now</AnimatedBorderButton>
              <AnimatedBorderButton href="#how" variant="ghost">See how it works →</AnimatedBorderButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", fontSize: "0.82rem" }}>
              <div style={{ display: "flex" }}>
                {["A","B","C"].map((l, i) => (
                  <div key={l} style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid white", marginLeft: i === 0 ? 0 : -8, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "var(--heading)" }}>{l}</div>
                ))}
              </div>
              <span>Built for everyday home cooks · PAP 2025</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 3 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
            style={{ display: "flex", justifyContent: "center" }}>
            <HeroPhone />
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: 0.45 }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4 L10 16 M6 12 L10 16 L14 12" stroke="var(--primary-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll</span>
      </motion.div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }`}</style>
    </section>
  );
}
