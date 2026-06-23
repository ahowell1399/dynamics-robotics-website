import React from "react";
import "./Checkbox.css";

/**
 * Dynamic Robotics & Integrations — Checkbox
 */
export function Checkbox({
  checked = false,
  onChange,
  label = null,
  hint = null,
  disabled = false,
  style = {},
}) {
  const className = [
    "dr-checkbox",
    hint ? "dr-checkbox--hint" : "",
    disabled ? "dr-checkbox--disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={className} style={style}>
      <input
        type="checkbox"
        className="dr-checkbox__input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      <span className="dr-checkbox__box">
        {checked && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5 9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label && (
        <span className="dr-checkbox__text">
          <span className="dr-checkbox__label">{label}</span>
          {hint && <span className="dr-checkbox__hint">{hint}</span>}
        </span>
      )}
    </label>
  );
}
