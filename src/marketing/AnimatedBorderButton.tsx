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
  const [active, setActive] = useState(false);
  const isPrimary = variant === "primary";

  const sheen = isPrimary && (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: hovered ? "130%" : "-60%",
        width: "35%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
        transform: "skewX(-20deg)",
        transition: hovered ? "left 0.75s cubic-bezier(0.19, 1, 0.22, 1)" : "none",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
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
    background: isPrimary
      ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
      : hovered
        ? "var(--bg-card)"
        : "transparent",
    color: isPrimary ? "#ffffff" : "var(--heading)",
    boxShadow: isPrimary
      ? hovered
        ? "0 8px 24px var(--btn-shadow-hover)"
        : "0 4px 14px var(--btn-shadow)"
      : "none",
    transform: active
      ? "translateY(0) scale(0.98)"
      : hovered
        ? "translateY(-2px) scale(1.015)"
        : "translateY(0) scale(1)",
    transition: "transform 0.18s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s ease, background 0.2s ease",
    overflow: "hidden",
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    setHovered(false);
    setActive(false);
  };
  const handleMouseDown = () => setActive(true);
  const handleMouseUp = () => setActive(false);

  const content = (
    <>
      {sheen}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        style={baseStyle}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {content}
    </button>
  );
}
