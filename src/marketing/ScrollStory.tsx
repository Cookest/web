"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent, useInView, AnimatePresence, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import { ScanBarcode, Calendar, ChefHat, ShoppingCart, type LucideIcon } from "lucide-react";
import { useMediaQuery } from "./useMediaQuery";
import { useTranslation, type TranslationKey } from "./TranslationProvider";

interface Chapter {
  num: string;
  Icon: LucideIcon;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  phone: string;
}

const chapters: Chapter[] = [
  { num: "01", Icon: ScanBarcode, titleKey: "story.ch1.title", descKey: "story.ch1.desc", phone: "/phones/screen-1.svg" },
  { num: "02", Icon: Calendar, titleKey: "story.ch2.title", descKey: "story.ch2.desc", phone: "/phones/screen-3.svg" },
  { num: "03", Icon: ChefHat, titleKey: "story.ch3.title", descKey: "story.ch3.desc", phone: "/phones/screen-2.svg" },
  { num: "04", Icon: ShoppingCart, titleKey: "story.ch4.title", descKey: "story.ch4.desc", phone: "/phones/screen-4.svg" },
];

function ProgressTrack({ progress, active }: { progress: MotionValue<number>; active: number }) {
  const fillHeight = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        height: 180,
        width: 20,
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 0,
          bottom: 0,
          width: 2,
          background: "var(--border)",
          borderRadius: 1,
        }}
      >
        <motion.div style={{ width: "100%", height: fillHeight, background: "var(--primary)", borderRadius: 1 }} />
      </div>

      {chapters.map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${(i / (chapters.length - 1)) * 100}%`,
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: active >= i ? 12 : 7,
            height: active >= i ? 12 : 7,
            borderRadius: "50%",
            background: active >= i ? "var(--primary)" : "var(--bg-card)",
            border: `2px solid ${active >= i ? "var(--primary)" : "var(--border)"}`,
            transition: "all 0.35s ease",
            boxShadow: active === i ? "0 0 0 4px rgba(122,154,101,0.15)" : "none",
            zIndex: 1,
          }}
        />
      ))}
    </div>
  );
}

function DesktopStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(Math.floor(v * chapters.length), chapters.length - 1));
  });

  const phoneRotate = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, -2, 0, 2, 0]);
  const blobY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const blobOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.04, 0.1, 0.04]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [0.5, 0]);

  const ch = chapters[active];

  return (
    <section id="how" ref={containerRef} style={{ height: "400vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: "15%",
            right: "-5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "var(--primary)",
            opacity: blobOpacity,
            y: blobY,
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "-8%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "var(--primary-dark)",
            opacity: blobOpacity,
            y: blobY,
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />

        <div className="mx-auto w-full max-w-6xl px-6" style={{ position: "relative" }}>
          <div style={{ marginBottom: 32, paddingLeft: 48 }}>
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
              {t("story.label")}
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(1.8rem,3vw,2.6rem)",
                fontWeight: 700,
                color: "var(--heading)",
              }}
            >
              {t("story.title")}
            </h2>
          </div>

          <div style={{ position: "relative", height: 480 }}>
            <ProgressTrack progress={scrollYProgress} active={active} />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  alignItems: "center",
                  gap: 48,
                }}
              >
                <div style={{ paddingLeft: 48 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 13,
                        background: "rgba(122,154,101,0.10)",
                        border: "1px solid rgba(122,154,101,0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ch.Icon size={22} color="var(--primary-dark)" strokeWidth={1.8} />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "var(--primary)",
                      }}
                    >
                      {ch.num}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
                      fontWeight: 700,
                      color: "var(--heading)",
                      lineHeight: 1.15,
                      marginBottom: 14,
                    }}
                  >
                    {t(ch.titleKey)}
                  </h3>

                  <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.78, maxWidth: 380, margin: 0 }}>
                    {t(ch.descKey)}
                  </p>
                </div>

                <motion.div style={{ display: "flex", justifyContent: "center", rotate: phoneRotate }}>
                  <Image
                    src={ch.phone}
                    alt=""
                    width={220}
                    height={400}
                    style={{
                      maxHeight: 400,
                      objectFit: "contain",
                      filter: "drop-shadow(0 32px 48px rgba(28,58,42,0.22))",
                    }}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: hintOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3 L8 13 M4 9 L8 13 L12 9"
                stroke="var(--text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <span
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {t("hero.scroll")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function MobileChapter({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { t } = useTranslation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      style={{ display: "flex", gap: 20, position: "relative" }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 24 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: inView ? "var(--primary)" : "var(--border)",
            border: "2px solid var(--primary-light)",
            transition: "background 0.4s",
            flexShrink: 0,
            marginTop: 6,
          }}
        />
        {index < chapters.length - 1 && (
          <div style={{ width: 2, flex: 1, background: "var(--border)", marginTop: 8 }} />
        )}
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "20px 18px",
          flex: 1,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(122,154,101,0.10)",
              border: "1px solid rgba(122,154,101,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <chapter.Icon size={18} color="var(--primary-dark)" strokeWidth={1.8} />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--primary)",
              letterSpacing: "0.08em",
            }}
          >
            {chapter.num}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "var(--heading)",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          {t(chapter.titleKey)}
        </h3>

        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            margin: "0 0 16px",
          }}
        >
          {t(chapter.descKey)}
        </p>

        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={chapter.phone}
            alt=""
            style={{ width: 120, height: "auto", filter: "drop-shadow(0 16px 24px rgba(28,58,42,0.15))" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function MobileStory() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const { t } = useTranslation();

  return (
    <section id="how" style={{ padding: "clamp(60px, 10vw, 100px) 0" }}>
      <div className="mx-auto max-w-lg px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 40 }}
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
            {t("story.label")}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1.6rem,4vw,2.2rem)",
              fontWeight: 700,
              color: "var(--heading)",
              marginBottom: 12,
            }}
          >
            {t("story.title")}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{t("story.subtitle")}</p>
        </motion.div>

        {chapters.map((ch, i) => (
          <MobileChapter key={ch.num} chapter={ch} index={i} />
        ))}
      </div>
    </section>
  );
}

export default function ScrollStory() {
  const mobile = useMediaQuery("(max-width: 767px)");
  return mobile ? <MobileStory /> : <DesktopStory />;
}
