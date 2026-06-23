import React from "react";
import "./Input.css";

/**
 * Dynamic Robotics & Integrations — Input
 * Text field for forms (contact, quote, discovery).
 */
export function Input({
  label = null,
  hint = null,
  error = null,
  type = "text",
  size = "md",
  fullWidth = true,
  multiline = false,
  rows = 4,
  iconLeft = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizeClass = { sm: "dr-input--sm", md: "dr-input--md", lg: "dr-input--lg" }[size] || "dr-input--md";

  const rootClass = [
    "dr-input",
    !fullWidth && "dr-input--auto",
    sizeClass,
    multiline && "dr-input--multiline",
    iconLeft && !multiline && "dr-input--icon",
    error && "dr-input--error",
  ]
    .filter(Boolean)
    .join(" ");

  const Field = multiline ? "textarea" : "input";

  return (
    <div className={rootClass} style={style}>
      {label && <label className="dr-input__label">{label}</label>}
      <div className="dr-input__field-wrap">
        {iconLeft && !multiline && <span className="dr-input__icon">{iconLeft}</span>}
        <Field
          className="dr-input__field"
          type={multiline ? undefined : type}
          rows={multiline ? rows : undefined}
          disabled={disabled}
          {...rest}
        />
      </div>
      {(hint || error) && <div className="dr-input__msg">{error || hint}</div>}
    </div>
  );
}
