"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";
import { Card, CardBody } from "@cookest/ui";

export function ThemeSection() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <Card>
      <CardBody className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-heading">
          <Sun className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>

        <p className="text-sm text-muted">
          Choose your preferred theme mode for the Cookest Web application.
        </p>

        <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  isSelected
                    ? "border-[#7a9a65] bg-[#7a9a65]/5"
                    : "border-border hover:border-[#7a9a65]/40"
                }`}
              >
                <input
                  type="radio"
                  name="theme_preference"
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => setTheme(opt.value)}
                  className="accent-[#7a9a65]"
                />
                <Icon className="h-4 w-4 text-heading" />
                <span className="text-sm font-medium text-heading">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
