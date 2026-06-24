"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  UtensilsCrossed,
  Refrigerator,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/meals", label: "Meals", icon: CalendarDays },
  { href: "/recipes", label: "Recipes", icon: UtensilsCrossed },
  { href: "/pantry", label: "Pantry", icon: Refrigerator },
  { href: "/groceries", label: "Groceries", icon: ShoppingCart },
  { href: "/chat", label: "AI Chef", icon: MessageSquare },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-surface border-t border-border">
      <div className="flex items-stretch h-16">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
              style={{ color: isActive ? "var(--color-primary-dark)" : "var(--color-muted)" }}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
