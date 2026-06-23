import React from "react";
import "./Select.css";

/**
 * Dynamic Robotics & Integrations — Select
 * A polished custom dropdown. Supports single and multi-select,
 * optional groups, smooth open animation, and keyboard escape.
 *
 * options: Array<{ value, label, hint?, group? }>
 */
export function Select({
  options = [],
  value = null,          // string (single) | string[] (multi)
  onChange,
  placeholder = "Select an option",
  label = null,
  multiple = false,
  disabled = false,
  size = "md",
  fullWidth = true,
  style = {},
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef(null);

  const selected = multiple ? (Array.isArray(value) ? value : []) : value;

  React.useEffect(() => {
    function onDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const heights = { sm: 36, md: 44, lg: 52 };
  const h = heights[size] || 44;

  function pick(opt) {
    if (multiple) {
      const set = new Set(selected);
      set.has(opt.value) ? set.delete(opt.value) : set.add(opt.value);
      onChange && onChange(Array.from(set));
    } else {
      onChange && onChange(opt.value);
      setOpen(false);
    }
  }

  function isSelected(v) {
    return multiple ? selected.includes(v) : selected === v;
  }

  let triggerText = placeholder;
  let isPlaceholder = true;
  if (multiple && selected.length) {
    triggerText = selected.length === 1
      ? (options.find((o) => o.value === selected[0])?.label || `${selected.length} selected`)
      : `${selected.length} selected`;
    isPlaceholder = false;
  } else if (!multiple && selected != null) {
    const o = options.find((o) => o.value === selected);
    if (o) { triggerText = o.label; isPlaceholder = false; }
  }

  return (
    <div
      ref={rootRef}
      className={`dr-select${fullWidth ? "" : " dr-select--auto"}`}
      style={style}
    >
      {label && <label className="dr-select__label">{label}</label>}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`dr-select__trigger${isPlaceholder ? " dr-select__trigger--placeholder" : ""}${open ? " is-open" : ""}`}
        style={{ "--dr-select-h": `${h}px` }}
      >
        <span className="dr-select__trigger-text">
          {triggerText}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          className={`dr-select__chevron${open ? " is-open" : ""}`}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        role="listbox"
        className={`dr-select__menu${open ? " is-open" : ""}`}
      >
        {options.map((opt) => {
          const sel = isSelected(opt.value);
          return (
            <div
              key={opt.value}
              role="option"
              aria-selected={sel}
              onClick={() => pick(opt)}
              className={`dr-select__option${sel ? " is-selected" : ""}`}
            >
              {multiple && (
                <span className="dr-select__check">
                  {sel && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5 9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              )}
              <span className="dr-select__option-body">
                <span className="dr-select__option-label">
                  {opt.label}
                </span>
                {opt.hint && (
                  <span className="dr-select__option-hint">
                    {opt.hint}
                  </span>
                )}
              </span>
              {!multiple && sel && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="dr-select__checkmark">
                  <path d="M5 12l5 5 9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
