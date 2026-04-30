"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
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
          {["Features", "App", "How it works", "Mission"].map((l, i) => (
            <li key={l}>
              <a
                href={["#features", "#showcase", "#how", "#sustain"][i]}
                className="text-sm font-medium transition-colors duration-200 hover:text-[var(--primary-dark)]"
                style={{ color: "var(--text)", textDecoration: "none" }}
              >
                {l}
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
              Docs ↗
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
                {([["light", Sun, "Light"], ["dark", Moon, "Dark"], ["system", Monitor, "System"]] as const).map(([value, Icon, label]) => (
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
            Get the App ↓
          </a>
        </div>
      </div>
    </nav>
  );
}
