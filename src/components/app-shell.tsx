"use client";

import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const publicPaths = ["/login", "/register"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPage = publicPaths.includes(pathname);
  const isRootPath = pathname === "/";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicPage && !isRootPath) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, isPublicPage, isRootPath, router]);

  // Public pages (login, register) — no sidebar
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Root path: loading spinner while determining auth state
  if (isLoading && isRootPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 animate-pulse" />
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Root path unauthenticated — show marketing landing (no sidebar)
  if (isRootPath && !isAuthenticated) {
    return <>{children}</>;
  }

  // Loading state for protected pages
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 animate-pulse" />
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — will redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <BottomNav />
      <main className="lg:ml-64 md:ml-16 ml-0 min-h-screen pb-16 md:pb-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
