"use client";

import { ChefHat } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  brandingTagline?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  brandingTagline = "Plan meals, manage your pantry, and cook with confidence — all powered by intelligent recommendations.",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left — Hero / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#7a9a65] via-[#6b8a56] to-[#1c3a2a] items-center justify-center">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-12 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-8 shadow-lg">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-serif text-5xl font-bold text-white mb-4 leading-tight">
            Cookest
          </h1>
          <p className="text-white/80 text-lg font-sans leading-relaxed mb-8">
            AI-assisted meal planning
          </p>
          <div className="w-16 h-px bg-white/30 mb-8" />
          <p className="text-white/60 text-sm font-sans leading-relaxed max-w-xs">
            {brandingTagline}
          </p>
        </div>
      </div>

      {/* Right — Form Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-[#f5f5f0]">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="flex flex-col items-center mb-10 lg:hidden">
            <div className="w-14 h-14 rounded-xl bg-[#7a9a65] flex items-center justify-center mb-4 shadow-md">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#1c3a2a]">
              Cookest
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#7a9a65]/10 p-8">
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-[#1c3a2a] mb-2">
                {title}
              </h2>
              <p className="text-[#7a8e74] font-sans text-sm">
                {subtitle}
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
