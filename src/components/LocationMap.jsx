import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LocationMap.css";
import { Button } from "./Button.jsx";

/**
 * Dynamic Robotics And Integration — LocationMap
 * Interactive Leaflet map on keyless OpenStreetMap tiles (rendered dark via a
 * CSS filter) with a branded, pulsing marker, a cinematic fly-in intro,
 * focus-gated scroll zoom (so it never traps the page scroll), and a glass info
 * card with a directions CTA.
 */

const SPRINGFIELD = { lat: 37.2089572, lng: -93.2922989 };

const ArrowR = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

export function LocationMap({
  lat = SPRINGFIELD.lat,
  lng = SPRINGFIELD.lng,
  zoom = 13,
  label = "Dynamic Robotics And Integration",
  address = "Springfield, MO",
  style = {},
}) {
  const containerRef = React.useRef(null);
  const mapRef = React.useRef(null);
  // On touch devices, one-finger drag would hijack page scrolling, so the map
  // starts non-draggable behind a "tap to explore" veil until the user opts in.
  const [locked, setLocked] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const map = L.map(el, {
      center: [lat, lng],
      zoom: reduced ? zoom : Math.max(zoom - 4, 3),
      zoomControl: false,
      scrollWheelZoom: false, // enabled only while focused — see below
      attributionControl: true,
    });
    mapRef.current = map;

    // OpenStreetMap standard tiles — the only keyless, no-signup, commercial-OK
    // provider in 2026. The dark/modern look comes from a CSS filter on the tile
    // pane (see app.css), not from a paid dark basemap.
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: "dr-map-marker",
        html: '<span class="dr-map-marker__pulse"></span><span class="dr-map-marker__dot"></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
      title: label,
      keyboard: false,
    }).addTo(map);
    marker.bindPopup(
      `<strong>${label}</strong><br/><span style="color:#4fb463">${address}</span>`
    );

    // Scroll-zoom only while the map is engaged, so it never hijacks page scroll.
    const enable = () => map.scrollWheelZoom.enable();
    const disable = () => map.scrollWheelZoom.disable();
    map.on("focus", enable);
    map.on("blur", disable);
    el.addEventListener("mouseleave", disable);

    // Touch: hold off dragging until the user taps the veil (prevents scroll-trap).
    if (isTouch) {
      map.dragging.disable();
      setLocked(true);
    }

    if (!reduced) map.flyTo([lat, lng], zoom, { duration: 1.8 });

    // Leaflet needs a correct size after the page's entrance animation settles.
    const t = setTimeout(() => map.invalidateSize(), 220);

    // Leaflet doesn't observe CSS-driven container resizes (the height changes at
    // the mobile breakpoint / on rotation), so recompute on any container resize.
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => map.invalidateSize())
        : null;
    if (ro) ro.observe(el);

    return () => {
      clearTimeout(t);
      if (ro) ro.disconnect();
      el.removeEventListener("mouseleave", disable);
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, zoom, label, address]);

  function recenter() {
    if (mapRef.current) mapRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
  }

  function unlock() {
    if (mapRef.current) mapRef.current.dragging.enable();
    setLocked(false);
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;

  return (
    <div className="dr-locmap" style={style}>
      <div
        ref={containerRef}
        className="dr-locmap__canvas"
        role="application"
        aria-label={`Interactive map showing ${label} in ${address}`}
      />

      {/* glass info card — z-index above Leaflet's panes (which go up to ~700) */}
      <div className="dr-locmap__card">
        <div className="dr-locmap__card-row">
          <span className="dr-locmap__dot" />
          <span className="dr-locmap__name">{label}</span>
        </div>
        <div className="dr-locmap__addr">
          {address}
        </div>
        <Button size="sm" iconRight={<ArrowR />} onClick={() => window.open(directionsUrl, "_blank", "noopener,noreferrer")}>
          Get directions
        </Button>
      </div>

      {/* recenter control */}
      <button
        type="button"
        onClick={recenter}
        aria-label="Recenter map"
        title="Recenter"
        className="dr-locmap__recenter"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      </button>

      {/* touch veil — tap to enable panning without trapping page scroll */}
      {locked && (
        <button
          type="button"
          onClick={unlock}
          aria-label="Tap to interact with the map"
          className="dr-locmap__veil"
        >
          <span className="dr-locmap__veil-label">
            Tap to explore the map
          </span>
        </button>
      )}
    </div>
  );
}
