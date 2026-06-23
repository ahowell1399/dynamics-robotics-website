import React from "react";
import { createPortal } from "react-dom";
import "./Gallery.css";

/**
 * Dynamic Robotics & Integrations — Gallery
 * Selectable image gallery. Users pick one or many machines/services;
 * a floating action bar rises with a CTA that routes to Contact carrying
 * the selection.
 *
 * items: Array<{ id, title, category?, image?, spec? }>
 */
export function Gallery({
  items = [],
  selected = [],            // string[] of item ids
  onChange,
  onRequest,                // (selectedItems) => void
  columns = 3,
  ctaLabel = "Request a quote for selection",
  style = {},
}) {
  const sel = Array.isArray(selected) ? selected : [];

  function toggle(id) {
    const set = new Set(sel);
    set.has(id) ? set.delete(id) : set.add(id);
    onChange && onChange(Array.from(set));
  }

  const selectedItems = items.filter((it) => sel.includes(it.id));

  return (
    <div className="dr-gallery" style={{ ...style }}>
      <div className="dr-gallery__grid" style={{ "--dr-gallery-cols": columns }}>
        {items.map((it) => {
          const on = sel.includes(it.id);
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => toggle(it.id)}
              className={`dr-gallery__item${on ? " is-selected" : ""}`}
            >
              {/* image / placeholder */}
              <div className="dr-gallery__media">
                {it.image ? (
                  <img src={it.image} alt={it.title} className="dr-gallery__img" />
                ) : (
                  <div className="dr-gallery__placeholder">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span className="dr-gallery__placeholder-label">Add photo</span>
                  </div>
                )}

                {/* select checkmark */}
                <span className="dr-gallery__check">
                  {on && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </span>

                {it.category && (
                  <span className="dr-gallery__cat">{it.category}</span>
                )}
              </div>

              {/* caption */}
              <div className="dr-gallery__caption">
                <div className="dr-gallery__title">{it.title}</div>
                {it.spec && <div className="dr-gallery__spec">{it.spec}</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* floating action bar — portaled to <body> so it floats against the
          viewport (the page wrapper's animation transform would otherwise
          become the containing block and trap a position:fixed element). */}
      {onRequest && typeof document !== "undefined" &&
        createPortal(
          <div className={`dr-gallery__bar${sel.length > 0 ? " is-active" : ""}`}>
            <span className="dr-gallery__bar-info">
              <span className="dr-gallery__count">{sel.length}</span>
              <span className="dr-gallery__label">{sel.length === 1 ? "item selected" : "items selected"}</span>
            </span>
            <button
              type="button"
              onClick={() => onRequest && onRequest(selectedItems)}
              className="dr-gallery__cta"
            >
              {ctaLabel}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
