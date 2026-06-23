import React from "react";
import "./Card.css";

/**
 * Dynamic Robotics & Integrations — Card
 * Surface container. Optional hover lift and accent top-rule.
 */
export function Card({
  children,
  interactive = false,
  accent = false,
  padding = "var(--space-5)",
  style = {},
  onClick,
  ...rest
}) {
  return (
    <div
      onClick={onClick}
      className={`dr-card${interactive ? " dr-card--interactive" : ""}`}
      style={{ "--dr-card-pad": padding, ...style }}
      {...rest}
    >
      {accent && <span className="dr-card__accent" />}
      {children}
    </div>
  );
}
