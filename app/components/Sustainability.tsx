"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function useCountUp(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
}

const sdgs = [
  { num: "SDG 2", label: "Zero Hunger", icon: "🌾", color: "#DDA63A" },
  { num: "SDG 3", label: "Good Health", icon: "💚", color: "#4C9F38" },
  { num: "SDG 12", label: "Responsible Consumption", icon: "♻️", color: "#BF8B2E" },
];

export default function Sustainability() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const billionCount = useCountUp(13, inView, 2000);
  const percentCount = useCountUp(30, inView, 1600);
  const thousandCount = useCountUp(10000, inView, 2200);

  return (
    <section id="sustain" style={{ padding: "100px 0" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}>
              <span style={{ display: "inline-block", background: "rgba(122,154,101,0.12)", color: "var(--primary-dark)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16 }}>Our Mission 🌍</span>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: "var(--heading)", marginBottom: 16 }}>Cooking smarter for a better planet</h2>
              <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.78, marginBottom: 32 }}>Food waste is one of the biggest contributors to climate change. Cookest is built from the ground up to reduce it — one meal plan at a time.</p>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sdgs.map((sdg, i) => (
                <motion.div key={sdg.num}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 18px", cursor: "default" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${sdg.color}1A`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{sdg.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: sdg.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{sdg.num}</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--heading)" }}>{sdg.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: 16 }}>
            {/* Big stat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ gridColumn: "1 / -1", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", borderRadius: 20, padding: "28px 24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }}/>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "3rem", fontWeight: 700, color: "white", lineHeight: 1 }}>
                {billionCount >= 13 ? "1.3B" : `${billionCount}0M`}
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", marginTop: 6 }}>tonnes of food wasted globally every year</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "22px 20px" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.2rem", fontWeight: 700, color: "var(--primary-dark)", lineHeight: 1 }}>{percentCount}%</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 6 }}>of household food is thrown away unnecessarily</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "22px 20px" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.2rem", fontWeight: 700, color: "var(--primary-dark)", lineHeight: 1 }}>
                {thousandCount >= 10000 ? "10K+" : `${(thousandCount / 1000).toFixed(1)}K`}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 6 }}>meals already planned with less waste</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
