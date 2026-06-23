import React from "react";
import { createPortal } from "react-dom";
import "./Lightbox.css";

/**
 * Dynamic Robotics & Integrations — Lightbox
 * Full-screen image viewer for the Gallery. Opens one large image with
 * prev/next navigation, keyboard control (← → Esc) and a click-to-dismiss
 * backdrop. Body scroll is locked while open.
 *
 * Rendered through a portal on <body> so it escapes the page wrapper's
 * transform (an animated ancestor would otherwise become the containing block
 * for `position: fixed` and trap the overlay inside the page).
 *
 * items: Array<{ image, title, category?, spec? }>
 * index: active item index, or -1 to stay closed.
 */
export function Lightbox({ items = [], index = -1, onIndexChange, onClose }) {
  const open = index >= 0 && index < items.length;
  const item = open ? items[index] : null;

  const go = React.useCallback(
    (dir) => {
      if (!items.length) return;
      const next = (index + dir + items.length) % items.length;
      onIndexChange && onIndexChange(next);
    },
    [index, items.length, onIndexChange]
  );

  React.useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose && onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    // Lock background scroll while the overlay is up; restore on close.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go, onClose]);

  if (!open || typeof document === "undefined") return null;

  const total = items.length;
  const pad = (n) => String(n).padStart(2, "0");

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || "Gallery image"}
      onClick={onClose}
      className="dr-lightbox"
    >
      <CircleButton label="Close" onClick={onClose} variant="close">
        <path d="M6 6l12 12M18 6L6 18" />
      </CircleButton>

      {total > 1 && (
        <CircleButton label="Previous image" onClick={() => go(-1)} variant="prev">
          <path d="M15 6l-6 6 6 6" />
        </CircleButton>
      )}
      {total > 1 && (
        <CircleButton label="Next image" onClick={() => go(1)} variant="next">
          <path d="M9 6l6 6-6 6" />
        </CircleButton>
      )}

      <figure onClick={(e) => e.stopPropagation()} className="dr-lightbox__figure">
        <img
          key={item.image}
          src={item.image}
          alt={item.title || ""}
          className="dr-lightbox__img"
        />
        <figcaption className="dr-lightbox__caption">
          {item.category && <span className="dr-lightbox__cat">{item.category}</span>}
          {item.title && <div className="dr-lightbox__title">{item.title}</div>}
          {item.spec && <div className="dr-lightbox__spec">{item.spec}</div>}
          {total > 1 && (
            <div className="dr-lightbox__counter">
              {pad(index + 1)} / {pad(total)}
            </div>
          )}
        </figcaption>
      </figure>
    </div>,
    document.body
  );
}

/** Circular translucent control used for close / prev / next. */
function CircleButton({ label, onClick, children, variant }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
      className={`dr-lightbox__btn dr-lightbox__btn--${variant}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}
