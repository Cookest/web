"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground flex items-center justify-center ${className}`}
      aria-label="Toggle Theme"
      title="Toggle Theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
