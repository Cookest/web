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

  const inner = (
    <>
      <svg
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          borderRadius: "inherit", pointerEvents: "none", overflow: "visible"
        }}
        preserveAspectRatio="none">
        <rect
          x="1.5" y="1.5"
          rx="11" ry="11"
          fill="none"
          stroke={isPrimary ? "rgba(255,255,255,0.8)" : "var(--primary)"}
          strokeWidth="2"
          strokeDasharray="1000"
          strokeDashoffset={hovered ? "0" : "1000"}
          style={{ width: "calc(100% - 3px)", height: "calc(100% - 3px)", transition: "stroke-dashoffset 0.55s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
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
    color: isPrimary ? "white" : "var(--heading)",
    boxShadow: hovered && isPrimary ? "0 8px 28px rgba(122,154,101,0.5)" : isPrimary ? "0 4px 16px rgba(122,154,101,0.35)" : "none",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
    transition: "transform 0.25s, box-shadow 0.25s",
  };

  if (href) {
    return (
      <a href={href}
        style={baseStyle} className={className}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        {inner}
      </a>
    );
  }
  return (
    <button
      style={baseStyle} className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {inner}
    </button>
  );
}
