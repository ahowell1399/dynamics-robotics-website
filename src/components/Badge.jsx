import React from "react";
import "./Badge.css";

/**
 * Dynamic Robotics & Integrations — Badge
 * Compact status / category label.
 */
export function Badge({ children, variant = "neutral", size = "md", dot = false, style = {} }) {
  const variants = ["primary", "neutral", "solid", "success", "warning", "danger", "outline"];
  const v = variants.includes(variant) ? variant : "neutral";
  const sizes = ["sm", "md"];
  const s = sizes.includes(size) ? size : "md";
  return (
    <span
      className={`dr-badge dr-badge--${v} dr-badge--${s}`}
      style={style}
    >
      {dot && <span className="dr-badge__dot" />}
      {children}
    </span>
  );
}
