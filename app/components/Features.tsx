"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Archive, Sparkles, ChefHat, ShoppingCart, type LucideIcon } from "lucide-react";
import { useTranslation, type TranslationKey } from "./TranslationProvider";

const features: { Icon: LucideIcon; titleKey: TranslationKey; descKey: TranslationKey; color: string }[] = [
  { Icon: Archive, titleKey: "features.inventory.title", descKey: "features.inventory.desc", color: "#7A9A65" },
  { Icon: Sparkles, titleKey: "features.planner.title", descKey: "features.planner.desc", color: "#4E7A3A" },
  { Icon: ChefHat, titleKey: "features.recipes.title", descKey: "features.recipes.desc", color: "#7A9A65" },
  { Icon: ShoppingCart, titleKey: "features.grocery.title", descKey: "features.grocery.desc", color: "#4E7A3A" },
];

function FCard({ f, i }: { f: (typeof features)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useTranslation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.12 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 24,
        padding: "28px 22px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: `rgba(${f.color === "#7A9A65" ? "122,154,101" : "78,122,58"},0.12)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <f.Icon size={24} color={f.color} strokeWidth={1.8} />
      </div>
      <h3
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--heading)",
          marginBottom: 8,
        }}
      >
        {t(f.titleKey)}
      </h3>
      <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>{t(f.descKey)}</p>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const { t } = useTranslation();

  return (
    <section id="features" style={{ padding: "clamp(60px, 10vw, 100px) 0" }}>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(122,154,101,0.12)",
              color: "var(--primary-dark)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: 100,
              marginBottom: 16,
            }}
          >
            {t("features.label")}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1.8rem,3vw,2.6rem)",
              fontWeight: 700,
              color: "var(--heading)",
              marginBottom: 14,
            }}
          >
            {t("features.title")}
          </h2>
          <p
            style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}
          >
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <FCard key={f.titleKey} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
