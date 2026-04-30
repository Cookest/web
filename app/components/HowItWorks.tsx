"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ScanBarcode, Calendar, ChefHat, type LucideIcon } from "lucide-react";
import { useMediaQuery } from "./useMediaQuery";
import { useTranslation, type TranslationKey } from "./TranslationProvider";

const steps: { num: string; Icon: LucideIcon; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { num: "1", Icon: ScanBarcode, titleKey: "how.step1.title", descKey: "how.step1.desc" },
  { num: "2", Icon: Calendar, titleKey: "how.step2.title", descKey: "how.step2.desc" },
  { num: "3", Icon: ChefHat, titleKey: "how.step3.title", descKey: "how.step3.desc" },
];

function Connector({ inView }: { inView: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 30, flex: "0 0 80px" }}>
      <svg width="80" height="24" viewBox="0 0 80 24">
        <motion.path
          d="M0 12 Q20 12 40 12 Q60 12 72 12"
          stroke="var(--primary-light)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.path
          d="M68 8 L74 12 L68 16"
          stroke="var(--primary)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 }}
        />
      </svg>
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mobile = useMediaQuery("(max-width: 767px)");
  const { t } = useTranslation();

  return (
    <section id="how" style={{ padding: "clamp(60px, 10vw, 100px) 0" }}>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: mobile ? 40 : 64 }}
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
            {t("how.label")}
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
            {t("how.title")}
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: 480, margin: "0 auto" }}>
            {t("how.subtitle")}
          </p>
        </motion.div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            flexDirection: mobile ? "column" : "row",
            gap: mobile ? 32 : 0,
          }}
        >
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: mobile ? "block" : "contents" }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                style={{ textAlign: "center", flex: mobile ? undefined : 1, padding: mobile ? "0" : "0 24px" }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    background: "var(--primary)",
                    color: "#ffffff",
                    borderColor: "var(--primary)",
                  }}
                  transition={{ duration: 0.25 }}
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: "50%",
                    background: "rgba(122,154,101,0.10)",
                    border: "2px solid rgba(122,154,101,0.22)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "var(--primary-dark)",
                    margin: "0 auto 18px",
                  }}
                >
                  {s.num}
                </motion.div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(122,154,101,0.1)",
                    border: "1px solid rgba(122,154,101,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                  }}
                >
                  <s.Icon size={20} color="var(--primary-dark)" strokeWidth={1.8} />
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
                  {t(s.titleKey)}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>
                  {t(s.descKey)}
                </p>
              </motion.div>
              {!mobile && i < steps.length - 1 && <Connector key={`conn-${i}`} inView={inView} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
