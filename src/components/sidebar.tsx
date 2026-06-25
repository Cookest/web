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
  ChevronUp,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button, Badge, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@cookest/ui";
import { useTheme } from "./ThemeProvider";

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

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 bottom-0 hidden md:flex flex-col z-30 bg-[var(--ck-surface)] border-r border-[var(--ck-border)] transition-all duration-200 w-16 lg:w-64 group/sidebar hover:w-64">
      {/* Logo */}
      <div className="p-3 lg:p-6 border-b border-[var(--ck-border)] overflow-hidden">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--ck-primary)] flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div className="opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            <h1 className="font-serif text-xl font-bold text-[var(--ck-heading)] tracking-tight">
              Cookest
            </h1>
            <p className="text-xs text-[var(--ck-text-muted)] -mt-0.5">Meal Planning</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-2 lg:p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-[var(--ck-text-muted)] uppercase tracking-wider opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
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
                  ? "bg-[color:color-mix(in_srgb,var(--ck-primary)_12%,transparent)] text-[var(--ck-primary-dark)] font-medium"
                  : "text-[var(--ck-text)] hover:bg-[var(--ck-bg-card)] hover:text-[var(--ck-heading)]"
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
      <div className="p-2 lg:p-3 border-t border-[var(--ck-border)] mt-auto">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 lg:p-3 bg-transparent hover:bg-[var(--ck-bg-card)] rounded-lg transition-colors group/user">
                <div className="flex flex-col text-left overflow-hidden opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--ck-heading)] truncate">
                      {user.name}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--ck-text-muted)] truncate">{user.email}</p>
                </div>
                <div className="flex-shrink-0 opacity-0 lg:opacity-100 group-hover/sidebar:opacity-100 transition-opacity duration-200 hidden lg:block group-hover/sidebar:block">
                  <ChevronUp className="w-4 h-4 text-[var(--ck-text-muted)]" />
                </div>
                {/* Mobile/collapsed icon */}
                <div className="lg:hidden group-hover/sidebar:hidden flex items-center justify-center w-full">
                  <User className="w-5 h-5 text-[var(--ck-heading)]" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2 ml-2" align="end" side="right" sideOffset={12}>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer w-full flex items-center">
                  <User className="mr-2 w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/subscription" className="cursor-pointer w-full flex items-center">
                  <CreditCard className="mr-2 w-4 h-4" />
                  <span>Subscription</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer w-full flex items-center">
                  <Settings className="mr-2 w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/#download" className="cursor-pointer w-full flex items-center">
                  <Smartphone className="mr-2 w-4 h-4" />
                  <span>Get Mobile App</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="cursor-pointer">
                {resolvedTheme === "dark" ? (
                  <>
                    <Sun className="mr-2 w-4 h-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 w-4 h-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-[var(--ck-error)] focus:text-[var(--ck-error)] focus:bg-[color:color-mix(in_srgb,var(--ck-error)_10%,transparent)]">
                <LogOut className="mr-2 w-4 h-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </aside>
  );
}
