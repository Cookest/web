"use client";
import { useState } from "react";

interface Props {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

export default function AnimatedBorderButton({ href, onClick, children, variant = "primary", className = "" }: Props) {
  const [hovered, setHovered] = useState(false);
  const isPrimary = variant === "primary";

  const borderColor = isPrimary ? "rgba(255,255,255,0.8)" : "var(--primary)";

  const inner = (
    <>
      {/* Rotating border highlight — only visible on hover */}
      <div
        style={{
          position: "absolute",
          inset: -2,
          borderRadius: "inherit",
          pointerEvents: "none",
          overflow: "hidden",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -50,
            background: `conic-gradient(from 0deg, transparent 0%, ${borderColor} 10%, transparent 20%)`,
            animation: hovered ? "spin-border 2s linear infinite" : "none",
          }}
        />
        {/* Inner mask to cut out center, leaving only border */}
        <div
          style={{
            position: "absolute",
            inset: 2,
            borderRadius: 10,
            background: isPrimary ? "linear-gradient(135deg, var(--primary), var(--primary-dark))" : "var(--bg)",
          }}
        />
      </div>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </>
  );

  const baseStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 28px",
    borderRadius: 12,
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    fontSize: "0.92rem",
    textDecoration: "none",
    cursor: "pointer",
    border: isPrimary ? "none" : "1.5px solid var(--border)",
    background: isPrimary ? "linear-gradient(135deg, var(--primary), var(--primary-dark))" : "transparent",
    color: isPrimary ? "#ffffff" : "var(--heading)",
    boxShadow:
      hovered && isPrimary
        ? "0 8px 28px rgba(122,154,101,0.5)"
        : isPrimary
          ? "0 4px 16px rgba(122,154,101,0.35)"
          : "none",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
    transition: "transform 0.25s, box-shadow 0.25s",
    overflow: "hidden",
  };

  const content = (
    <>
      {inner}
      <style>{`@keyframes spin-border { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        style={baseStyle}
        className={className}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      style={baseStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {content}
    </button>
  );
}
