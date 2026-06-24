"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UtensilsCrossed,
  CalendarDays,
  Refrigerator,
  ShoppingCart,
  MessageSquare,
  Settings,
  CreditCard,
  LogOut,
  ChefHat,
  Heart,
  Users,
  Leaf,
  Compass,
  MapPin,
  User,
  Smartphone,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/recipes", label: "Recipes", icon: UtensilsCrossed },
  { href: "/meals", label: "Meal Plans", icon: CalendarDays },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/pantry", label: "Pantry", icon: Refrigerator },
  { href: "/groceries", label: "Groceries", icon: ShoppingCart },
  { href: "/nutrition", label: "Nutrition", icon: Leaf },
  { href: "/favourites", label: "Favourites", icon: Heart },
  { href: "/stores", label: "Stores", icon: MapPin },
  { href: "/family", label: "Family", icon: Users },
  { href: "/chat", label: "AI Chef", icon: MessageSquare },
];

const bottomItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 hidden md:flex flex-col z-30 bg-surface border-r border-border transition-all duration-200 w-16 lg:w-64 group/sidebar hover:w-64">
      {/* Logo */}
      <div className="p-3 lg:p-6 border-b border-border overflow-hidden">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div className="opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            <h1 className="font-serif text-xl font-bold text-heading tracking-tight">
              Cookest
            </h1>
            <p className="text-xs text-muted -mt-0.5">Meal Planning</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-2 lg:p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wider opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "nav-link-active"
                  : "text-foreground hover:bg-card hover:text-heading"
              }`}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 lg:p-3 border-t border-border space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "nav-link-active"
                  : "text-foreground hover:bg-card hover:text-heading"
              }`}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </Link>
          );
        })}

        {user && (
          <button
            onClick={logout}
            title="Log Out"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-card hover:text-error w-full transition-colors"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
              Log Out
            </span>
          </button>
        )}

        {/* Get Mobile App link */}
        <a
          href="/#download"
          title="Get Mobile App"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-card hover:text-primary-dark w-full transition-colors"
        >
          <Smartphone className="w-[18px] h-[18px] flex-shrink-0" />
          <span className="opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            Get Mobile App
          </span>
        </a>

        {/* User info — desktop only */}
        {user && (
          <div className="mt-2 px-3 py-3 bg-card rounded-lg opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200 overflow-hidden">
            <p className="text-sm font-medium text-heading truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted truncate">{user.email}</p>
            <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary-dark font-medium capitalize">
              {user.tier}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
