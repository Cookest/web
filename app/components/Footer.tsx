"use client";
import { useState } from "react";
import { Sun, Moon, Monitor, Globe } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useTranslation, SUPPORTED_LOCALES, type Locale, type TranslationKey } from "./TranslationProvider";

const footerLinks: { key: TranslationKey; href: string }[] = [
  { key: "nav.features", href: "#features" },
  { key: "nav.howItWorks", href: "#how" },
  { key: "nav.mission", href: "#sustain" },
  { key: "download.label", href: "#download" },
];

export default function Footer() {
  const { t, locale, setLocale } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const themeIcons = { dark: Moon, light: Sun, system: Monitor } as const;
  const ThemeIcon = themeIcons[theme];

  return (
    <footer style={{ background: "var(--section-dark)", padding: "48px 0 32px" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-6">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="var(--primary)" opacity="0.2" />
              <path
                d="M14 6 C14 6 20 10 20 16 C20 20 17 22 14 22 C11 22 8 20 8 16 C8 10 14 6 14 6Z"
                fill="var(--primary)"
              />
              <line
                x1="14"
                y1="10"
                x2="14"
                y2="22"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Cookest
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 md:gap-7">
            {footerLinks.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.45)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              >
                {t(key)}
              </a>
            ))}
            <a
              href="https://docs.cookest.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              {t("nav.docs")} ↗
            </a>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Theme picker */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setThemeOpen(!themeOpen); setLangOpen(false); }}
                onBlur={() => setTimeout(() => setThemeOpen(false), 150)}
                aria-label="Change theme"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.55)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <ThemeIcon size={15} />
              </button>
              {themeOpen && (
                <div style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
                  right: 0,
                  background: "#1c2a20",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: 4,
                  minWidth: 130,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                  zIndex: 100,
                }}>
                  {(["light", "dark", "system"] as const).map((val) => {
                    const iconMap = { light: Sun, dark: Moon, system: Monitor } as const;
                    const Icon = iconMap[val];
                    const themeLabels = { light: t("theme.light"), dark: t("theme.dark"), system: t("theme.system") };
                    return (
                      <button
                        key={val}
                        onClick={() => { setTheme(val); setThemeOpen(false); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          width: "100%",
                          padding: "7px 11px",
                          border: "none",
                          borderRadius: 7,
                          background: theme === val ? "rgba(255,255,255,0.08)" : "transparent",
                          color: theme === val ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                          fontSize: "0.8rem",
                          fontWeight: theme === val ? 600 : 400,
                          cursor: "pointer",
                        }}
                      >
                        <Icon size={13} />
                        {themeLabels[val]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Language picker */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setLangOpen(!langOpen); setThemeOpen(false); }}
                onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                aria-label="Change language"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  height: 34,
                  padding: "0 10px",
                  borderRadius: 9,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.55)",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                <Globe size={13} />
                {locale.toUpperCase()}
              </button>
              {langOpen && (
                <div style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
                  right: 0,
                  background: "#1c2a20",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: 4,
                  minWidth: 145,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                  zIndex: 100,
                }}>
                  {(Object.entries(SUPPORTED_LOCALES) as [Locale, string][]).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => { setLocale(code); setLangOpen(false); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "7px 11px",
                        border: "none",
                        borderRadius: 7,
                        background: locale === code ? "rgba(255,255,255,0.08)" : "transparent",
                        color: locale === code ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                        fontSize: "0.8rem",
                        fontWeight: locale === code ? 600 : 400,
                        cursor: "pointer",
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/Cookest"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        <div
          style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}
        >
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", margin: 0 }}>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
