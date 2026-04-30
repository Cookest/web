"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function RecipePhone() {
  return (
    <div style={{ width: 200, background: "#111827", borderRadius: 36, padding: 11, position: "relative" }}>
      <div style={{ background: "var(--bg)", borderRadius: 26, overflow: "hidden" }}>
        <div style={{ background: "var(--primary-dark)", padding: "10px 14px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "white", fontSize: 7, fontWeight: 700 }}>9:41</span>
          <span style={{ color: "white", fontSize: 7 }}>●●●</span>
        </div>
        <div style={{ padding: 11 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 11, color: "var(--heading)", marginBottom: 8 }}>🔍 Find Recipes</div>
          <div style={{ background: "white", borderRadius: 8, padding: "6px 8px", marginBottom: 8, display: "flex", alignItems: "center", gap: 5, border: "1px solid var(--border)" }}>
            <span style={{ fontSize: 8, color: "var(--text-muted)" }}>🔍</span>
            <span style={{ fontSize: 7, color: "var(--text-muted)" }}>Search recipes...</span>
          </div>
          {[["🍜","Thai Noodle Soup","28 min","Easy"],["🥘","Chicken Curry","45 min","Med"],["🫕","Veggie Stew","35 min","Easy"]].map(([icon, name, time, diff]) => (
            <div key={name} style={{ background: "white", borderRadius: 8, padding: "7px 8px", marginBottom: 5, display: "flex", alignItems: "center", gap: 7, boxShadow: "0 1px 3px rgba(28,58,42,0.05)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(122,154,101,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 7, fontWeight: 700, color: "var(--heading)" }}>{name}</div>
                <div style={{ fontSize: 6, color: "var(--text-muted)", marginTop: 1 }}>{time} · {diff}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardPhone() {
  return (
    <div style={{ width: 240, background: "#111827", borderRadius: 42, padding: 13, position: "relative" }}>
      <div style={{ position: "absolute", top: 13, left: "50%", transform: "translateX(-50%)", width: 70, height: 22, background: "#111827", borderRadius: "0 0 16px 16px", zIndex: 10 }}/>
      <div style={{ background: "var(--bg)", borderRadius: 30, overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", padding: "14px 14px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 7, marginBottom: 3 }}>Good morning 👋</div>
            <div style={{ color: "white", fontSize: 11, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>Today&apos;s Menu</div>
          </div>
          <span style={{ color: "white", fontSize: 7 }}>9:41</span>
        </div>
        <div style={{ padding: 12 }}>
          <div style={{ background: "white", borderRadius: 12, padding: 10, marginBottom: 8, boxShadow: "0 2px 8px rgba(28,58,42,0.07)" }}>
            <div style={{ fontSize: 7, color: "var(--primary-dark)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Breakfast</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🥞</span>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "var(--heading)" }}>Blueberry Pancakes</div>
                <div style={{ fontSize: 7, color: "var(--text-muted)", marginTop: 1 }}>480 kcal · 15 min</div>
              </div>
            </div>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: 10, marginBottom: 8, boxShadow: "0 2px 8px rgba(28,58,42,0.07)" }}>
            <div style={{ fontSize: 7, color: "var(--primary-dark)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Lunch</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🥗</span>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "var(--heading)" }}>Greek Salad</div>
                <div style={{ fontSize: 7, color: "var(--text-muted)", marginTop: 1 }}>320 kcal · 10 min</div>
              </div>
            </div>
          </div>
          <div style={{ background: "rgba(122,154,101,0.08)", borderRadius: 10, padding: "7px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 7, color: "var(--primary-dark)", fontWeight: 600 }}>🌱 On track today</span>
            <div style={{ background: "var(--primary)", borderRadius: 6, padding: "2px 7px" }}>
              <span style={{ fontSize: 6, color: "white", fontWeight: 700 }}>1,640 kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroceryPhone() {
  return (
    <div style={{ width: 200, background: "#111827", borderRadius: 36, padding: 11, position: "relative" }}>
      <div style={{ background: "var(--bg)", borderRadius: 26, overflow: "hidden" }}>
        <div style={{ background: "var(--primary)", padding: "10px 14px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "white", fontSize: 7, fontWeight: 700 }}>9:41</span>
          <span style={{ color: "white", fontSize: 7 }}>●●●</span>
        </div>
        <div style={{ padding: 11 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 11, color: "var(--heading)", marginBottom: 8 }}>🛒 Shopping List</div>
          <div style={{ fontSize: 7, fontWeight: 700, color: "var(--primary-dark)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Produce</div>
          {["🥦 Broccoli (1 head)","🧅 Onions (3)","🫑 Bell peppers (2)"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 6px", marginBottom: 3, borderRadius: 6, background: "white" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, border: "1.5px solid var(--primary)", flexShrink: 0 }}/>
              <span style={{ fontSize: 7, color: "var(--text)" }}>{item}</span>
            </div>
          ))}
          <div style={{ fontSize: 7, fontWeight: 700, color: "var(--primary-dark)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "8px 0 5px" }}>Proteins</div>
          {["🍗 Chicken breast (500g)","🥚 Eggs (12)"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 6px", marginBottom: 3, borderRadius: 6, background: "white" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, border: "1.5px solid var(--primary)", flexShrink: 0 }}/>
              <span style={{ fontSize: 7, color: "var(--text)" }}>{item}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, background: "rgba(122,154,101,0.1)", borderRadius: 8, padding: "5px 8px", textAlign: "center" }}>
            <span style={{ fontSize: 7, color: "var(--primary-dark)", fontWeight: 600 }}>5 items · ~€12.40</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Showcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="showcase" style={{ padding: "100px 0", background: "linear-gradient(180deg, var(--bg) 0%, rgba(180,204,158,0.12) 50%, var(--bg) 100%)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ display: "inline-block", background: "rgba(122,154,101,0.12)", color: "var(--primary-dark)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16 }}>The App 📱</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: "var(--heading)", marginBottom: 14 }}>Beautiful, intuitive, powerful</h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>Every screen designed to make your daily cooking routine a joy.</p>
        </motion.div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 28 }}>
          <motion.div
            initial={{ opacity: 0, x: -60, rotate: -8 }}
            animate={inView ? { opacity: 1, x: 0, rotate: -8 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ rotate: -3, transition: { duration: 0.3 } }}
            style={{ filter: "drop-shadow(0 24px 40px rgba(28,58,42,0.18))", transformOrigin: "bottom center" }}>
            <RecipePhone />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            style={{ filter: "drop-shadow(0 40px 60px rgba(28,58,42,0.28))", zIndex: 2 }}>
            <DashboardPhone />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60, rotate: 8 }}
            animate={inView ? { opacity: 1, x: 0, rotate: 8 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ rotate: 3, transition: { duration: 0.3 } }}
            style={{ filter: "drop-shadow(0 24px 40px rgba(28,58,42,0.18))", transformOrigin: "bottom center" }}>
            <GroceryPhone />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
