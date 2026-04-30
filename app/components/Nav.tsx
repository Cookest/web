"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useTranslation, SUPPORTED_LOCALES, type Locale } from "./TranslationProvider";
import { Sun, Moon, Monitor, Globe, Menu, X } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useTranslation();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.app"), href: "#showcase" },
    { label: t("nav.howItWorks"), href: "#how" },
    { label: t("nav.mission"), href: "#sustain" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3 shadow-sm" : "py-5"}`}
        style={{
          background: scrolled ? "var(--surface-muted)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-2"
            style={{ textDecoration: "none" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon-app.png"
              alt="Cookest"
              style={{ width: 32, height: 32, borderRadius: 8 }}
            />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "1.35rem",
                color: "var(--heading)",
              }}
            >
              Cookest
            </span>
          </a>
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm font-medium transition-colors duration-200 hover:text-[var(--primary-dark)]"
                  style={{ color: "var(--text)", textDecoration: "none" }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://docs.cookest.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors duration-200 hover:text-[var(--primary-dark)]"
                style={{ color: "var(--text)", textDecoration: "none" }}
              >
                {t("nav.docs")} ↗
              </a>
            </li>
          </ul>
          <div className="hidden md:flex items-center gap-3">
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                onBlur={() => setTimeout(() => setThemeMenuOpen(false), 150)}
                aria-label="Toggle theme"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {theme === "system" ? <Monitor size={16} /> : theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              {themeMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    right: 0,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 4,
                    minWidth: 140,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 100,
                  }}
                >
                  {(["light", "dark", "system"] as const).map((value) => {
                    const Icon = value === "light" ? Sun : value === "dark" ? Moon : Monitor;
                    const label = t(`theme.${value}` as "theme.light" | "theme.dark" | "theme.system");
                    return (
                    <button
                      key={value}
                      onClick={() => { setTheme(value); setThemeMenuOpen(false); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: 8,
                        background: theme === value ? "var(--border)" : "transparent",
                        color: "var(--text)",
                        fontSize: "0.82rem",
                        fontWeight: theme === value ? 600 : 400,
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  );})}
                </div>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                onBlur={() => setTimeout(() => setLangMenuOpen(false), 150)}
                aria-label="Change language"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  height: 36,
                  padding: "0 10px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                }}
              >
                <Globe size={14} />
                {locale.toUpperCase()}
              </button>
              {langMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    right: 0,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 4,
                    minWidth: 150,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 100,
                  }}
                >
                  {(Object.entries(SUPPORTED_LOCALES) as [Locale, string][]).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => { setLocale(code); setLangMenuOpen(false); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: 8,
                        background: locale === code ? "var(--border)" : "transparent",
                        color: "var(--text)",
                        fontSize: "0.82rem",
                        fontWeight: locale === code ? 600 : 400,
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a
              href="#download"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                color: "white",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(122,154,101,0.35)",
              }}
            >
              {t("nav.getApp")}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--bg-card)",
              color: "var(--text)", cursor: "pointer",
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            position: "fixed", inset: 0, zIndex: 49,
            background: "var(--bg)", paddingTop: 80,
          }}
        >
          <div className="px-6 flex flex-col gap-2">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block", padding: "14px 0",
                  fontSize: "1.1rem", fontWeight: 600,
                  color: "var(--heading)", textDecoration: "none",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://docs.cookest.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block", padding: "14px 0",
                fontSize: "1.1rem", fontWeight: 600,
                color: "var(--heading)", textDecoration: "none",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {t("nav.docs")} ↗
            </a>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {(["light", "dark", "system"] as const).map((value) => {
                const Icon = value === "light" ? Sun : value === "dark" ? Moon : Monitor;
                return (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "10px 0", borderRadius: 10,
                      border: theme === value ? "2px solid var(--primary)" : "1px solid var(--border)",
                      background: theme === value ? "rgba(122,154,101,0.1)" : "var(--bg-card)",
                      color: "var(--text)", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer",
                    }}
                  >
                    <Icon size={14} />
                    {t(`theme.${value}` as "theme.light" | "theme.dark" | "theme.system")}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {(Object.entries(SUPPORTED_LOCALES) as [Locale, string][]).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => setLocale(code)}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 10,
                    border: locale === code ? "2px solid var(--primary)" : "1px solid var(--border)",
                    background: locale === code ? "rgba(122,154,101,0.1)" : "var(--bg-card)",
                    color: "var(--text)", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
                  }}
                >
                  {name}
                </button>
              ))}
            </div>

            <a
              href="#download"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block", textAlign: "center", marginTop: 16, padding: "14px 0",
                borderRadius: 14, fontWeight: 700, fontSize: "1rem",
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                color: "white", textDecoration: "none",
                boxShadow: "0 4px 16px rgba(122,154,101,0.35)",
              }}
            >
              {t("nav.getApp")}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
