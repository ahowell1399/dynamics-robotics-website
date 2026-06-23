import React from "react";
import "./Button.css";

/**
 * Dynamic Robotics & Integrations — Button
 * Primary action element. Spring lift on hover, colored glow, a light-sweep
 * sheen on filled variants, sliding icons, and a snappy tactile press.
 */

export function Button({
  children,
  variant = "primary",
  size = "md",
  onDark = false,
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = "button",
  onClick,
  style = {},
  ...rest
}) {
  const sizeMod = ["sm", "md", "lg"].includes(size) ? size : "md";
  const variantMod = ["primary", "secondary", "ghost", "inverse", "danger"].includes(variant)
    ? variant
    : "primary";

  const filled = variantMod === "primary" || variantMod === "danger";

  const className = [
    "dr-btn",
    `dr-btn--${variantMod}`,
    `dr-btn--${sizeMod}`,
    onDark && "dr-btn--on-dark",
    fullWidth && "dr-btn--full",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      {...rest}
    >
      {/* light-sweep sheen (filled variants only) */}
      {filled && !disabled && <span aria-hidden="true" className="dr-btn__sheen" />}
      <span className="dr-btn__label">
        {iconLeft && (
          <span className="dr-btn__icon dr-btn__icon--left">{iconLeft}</span>
        )}
        {children}
        {iconRight && (
          <span className="dr-btn__icon dr-btn__icon--right">{iconRight}</span>
        )}
      </span>
    </button>
  );
}
