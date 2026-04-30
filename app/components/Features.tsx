"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    emoji: "🥬",
    title: "Smart Inventory",
    desc: "Know what's in your fridge before you forget. Track expiry dates and never waste food again.",
    color: "#7A9A65",
  },
  {
    emoji: "🤖",
    title: "AI Meal Planner",
    desc: "A full week of meals auto-generated based on your preferences and what you already have at home.",
    color: "#4E7A3A",
  },
  {
    emoji: "🍳",
    title: "Intelligent Recipes",
    desc: "Step-by-step instructions with smart substitutions, serving-size scaling, and nutritional breakdown.",
    color: "#7A9A65",
  },
  {
    emoji: "🛒",
    title: "Grocery Lists",
    desc: "Shopping lists built automatically from your meal plan — grouped by category, synced to your phone.",
    color: "#4E7A3A",
  }
];

function FCard({ f, i }: { f: typeof features[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.12 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 24, padding: "28px 22px", position: "relative", overflow: "hidden",
        cursor: "default"
      }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `rgba(${f.color === "#7A9A65" ? "122,154,101" : "78,122,58"},0.12)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, fontSize: "1.5rem"
      }}>
        {f.emoji}
      </div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontWeight: 700, color: "var(--heading)", marginBottom: 8 }}>{f.title}</h3>
      <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="features" style={{ padding: "100px 0" }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ display: "inline-block", background: "rgba(122,154,101,0.12)", color: "var(--primary-dark)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16 }}>Features ✨</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: "var(--heading)", marginBottom: 14 }}>Everything your kitchen needs</h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}>From tracking what&apos;s in your fridge to building a full week of meals — Cookest handles the planning so you can focus on the cooking.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {features.map((f, i) => <FCard key={f.title} f={f} i={i} />)}
        </div>
      </div>
    </section>
  );
}
