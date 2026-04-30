import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cookest — Smart Meal Planning",
  description: "AI-powered meal planning that works around your schedule, your pantry, and your taste.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
