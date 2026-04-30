"use client";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import en from "../messages/en.json";
import fr from "../messages/fr.json";
import es from "../messages/es.json";
import de from "../messages/de.json";
import pt from "../messages/pt.json";

export type TranslationKey = keyof typeof en;

export const SUPPORTED_LOCALES = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  pt: "Português",
} as const;

export type Locale = keyof typeof SUPPORTED_LOCALES;

const messages: Record<Locale, Record<string, string>> = { en, fr, es, de, pt };

interface TranslationContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function useTranslation() {
  return useContext(TranslationContext);
}

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem("locale");
    if (saved && saved in SUPPORTED_LOCALES) return saved as Locale;
  } catch {}

  if (typeof navigator !== "undefined") {
    const languages = navigator.languages ?? [navigator.language];
    for (const lang of languages) {
      const code = lang.slice(0, 2).toLowerCase() as Locale;
      if (code in SUPPORTED_LOCALES) return code;
    }
  }

  return "en";
}

export default function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return messages[locale]?.[key] ?? messages.en[key] ?? key;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}
