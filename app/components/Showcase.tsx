"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Showcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const phones = [
    { src: "/phones/screen-2.svg", alt: "Recipe search screen", rotate: -8, x: -60, delay: 0.1, size: 210 },
    { src: "/phones/screen-3.svg", alt: "Home dashboard screen", rotate: 0, y: 40, delay: 0.2, size: 260 },
    { src: "/phones/screen-4.svg", alt: "Groceries list screen", rotate: 8, x: 60, delay: 0.3, size: 210 },
  ];

  return (
    <section id="showcase" style={{ padding: "100px 0", background: "linear-gradient(180deg, var(--bg) 0%, rgba(180,204,158,0.12) 50%, var(--bg) 100%)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ display: "inline-block", background: "rgba(122,154,101,0.12)", color: "var(--primary-dark)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16 }}>The App</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: "var(--heading)", marginBottom: 14 }}>Beautiful, intuitive, powerful</h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>Every screen designed to make your daily cooking routine a joy.</p>
        </motion.div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 28 }}>
          {phones.map((phone, i) => (
            <motion.div
              key={phone.src}
              initial={{ opacity: 0, x: (phone.x ?? 0), y: (phone.y ?? 0), rotate: phone.rotate }}
              animate={inView ? { opacity: 1, x: 0, y: 0, rotate: phone.rotate } : {}}
              transition={{ duration: 0.8, delay: phone.delay }}
              whileHover={{ rotate: phone.rotate / 2, y: -8, transition: { duration: 0.3 } }}
              style={{
                filter: i === 1 ? "drop-shadow(0 40px 60px rgba(28,58,42,0.28))" : "drop-shadow(0 24px 40px rgba(28,58,42,0.18))",
                transformOrigin: "bottom center",
                zIndex: i === 1 ? 2 : 1,
              }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={phone.src} alt={phone.alt} style={{ width: phone.size, height: "auto", display: "block" }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

