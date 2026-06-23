import React from "react";
import { useNavigate } from "react-router-dom";
import { VideoPlayer, Lightbox, Button, Carousel, Reveal } from "../components/index.js";
import { MACHINES } from "../data/machines.js";
import { VIDEOS } from "../data/videos.js";
import { useIsMobile } from "../hooks/useIsMobile.js";

const ArrowR = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const PHOTOS = MACHINES; // real shop-floor photos, reused as the gallery set

/**
 * One photo tile — fills its row box, zooms slightly on hover and opens the
 * full-screen Lightbox on click. The bottom gradient keeps the caption legible
 * over any image.
 */
function PhotoTile({ item, height, onOpen }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`View ${item.title}`}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        height,
        padding: 0,
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        cursor: "pointer",
        background: "var(--surface-sunken)",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
        transition: "box-shadow var(--dur-base) var(--ease-standard)",
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: hover ? "scale(1.05)" : "scale(1)",
          transition: "transform var(--dur-slow) var(--ease-out)",
        }}
      />

      {/* legibility gradient */}
      <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,17,15,0.72) 0%, rgba(15,17,15,0.10) 38%, transparent 62%)" }} />

      {item.category && (
        <span style={{
          position: "absolute", top: 12, left: 12,
          padding: "3px 9px", borderRadius: "var(--radius-pill)",
          background: "rgba(20,22,20,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
          fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500,
          letterSpacing: "0.05em", textTransform: "uppercase", color: "#fff",
        }}>{item.category}</span>
      )}

      {/* expand affordance, appears on hover */}
      <span style={{
        position: "absolute", top: 12, right: 12,
        width: 34, height: 34, borderRadius: "50%",
        background: "rgba(20,22,20,0.6)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: hover ? 1 : 0, transform: hover ? "scale(1)" : "scale(0.9)",
        transition: "opacity var(--dur-fast), transform var(--dur-fast)",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </span>

      <span style={{ position: "absolute", left: 16, right: 16, bottom: 14, textAlign: "left" }}>
        <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--text-lg)", color: "#fff", lineHeight: 1.2 }}>{item.title}</span>
        {item.spec && (
          <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", letterSpacing: "0.04em", color: "var(--neutral-300)", marginTop: 4 }}>{item.spec}</span>
        )}
      </span>
    </button>
  );
}

/**
 * Editorial photo mosaic. Desktop lays out alternating wide/narrow rows
 * (2fr·1fr, then 1fr·2fr) so the wall reads big and varied; mobile stacks each
 * photo full-width. Tiles keep their data order so the Lightbox index lines up.
 */
function PhotoMosaic({ photos, onOpen, isMobile }) {
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {photos.map((it, i) => (
          <PhotoTile key={it.id} item={it} height="clamp(220px, 64vw, 340px)" onOpen={() => onOpen(i)} />
        ))}
      </div>
    );
  }

  const rowH = "clamp(260px, 27vw, 400px)";
  const rows = [];
  for (let i = 0; i < photos.length; i += 2) rows.push(photos.slice(i, i + 2).map((it, j) => ({ it, index: i + j })));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {rows.map((pair, r) => {
        if (pair.length === 1) {
          const { it, index } = pair[0];
          return <PhotoTile key={it.id} item={it} height={rowH} onOpen={() => onOpen(index)} />;
        }
        return (
          <div key={pair[0].it.id} style={{ display: "grid", gridTemplateColumns: r % 2 === 0 ? "2fr 1fr" : "1fr 2fr", gap: "var(--space-4)" }}>
            {pair.map(({ it, index }) => (
              <PhotoTile key={it.id} item={it} height={rowH} onOpen={() => onOpen(index)} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function Gallery() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [active, setActive] = React.useState(-1); // lightbox index, -1 = closed

  return (
    <main style={{ padding: "var(--space-8) var(--gutter) var(--space-9)", maxWidth: "var(--container-xl)", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-7)" }}>
        <Reveal as="span" className="dr-eyebrow" style={{ display: "inline-block" }}>// Gallery</Reveal>
        <Reveal as="h1" delay={90} style={{ fontSize: "var(--text-3xl)", margin: "12px 0 10px" }}>Our Work, Up Close</Reveal>
        <Reveal as="p" delay={180} style={{ fontSize: "var(--text-lg)", color: "var(--text-body)", maxWidth: 620, margin: "0 auto", lineHeight: 1.55 }}>
          Welding cells, control panels and fabrication from our Springfield floor. Tap any photo to open it full-screen, or scroll on for our robots in motion.
        </Reveal>
      </div>

      <PhotoMosaic photos={PHOTOS} onOpen={setActive} isMobile={isMobile} />

      {/* Full-bleed dark band: breaks out of the centered page column to span
          the whole window, then re-constrains its contents to the container. */}
      <section style={{ marginTop: "var(--space-9)", background: "var(--surface-ink)", width: "100vw", marginLeft: "calc(50% - 50vw)", padding: isMobile ? "var(--space-7) 0" : "var(--space-9) 0" }}>
        <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
            <Reveal as="span" className="dr-eyebrow" style={{ display: "inline-block", color: "var(--green-400)" }}>// In motion</Reveal>
            <Reveal as="h2" delay={90} style={{ color: "#fff", fontSize: "var(--text-2xl)", margin: "12px 0 8px" }}>See Our Robots Run</Reveal>
            <Reveal as="p" delay={180} style={{ fontSize: "var(--text-md)", color: "var(--neutral-300)", maxWidth: 560, margin: "0 auto" }}>
              Real footage from our cells — laser and MIG welding, live. Clips play as they scroll into view; tap any one to scrub or unmute.
            </Reveal>
          </div>
          <Carousel tone="dark" autoAdvance ariaLabel="Shop-floor videos">
            {VIDEOS.map((v) => (
              <VideoPlayer key={v.id} src={v.src} poster={v.poster} title={v.title} caption={v.caption} />
            ))}
          </Carousel>
        </div>
      </section>

      <section style={{ marginTop: "var(--space-9)" }}>
        <div style={{ background: "var(--color-primary)", borderRadius: "var(--radius-xl)", padding: isMobile ? "var(--space-6)" : "var(--space-8)", display: "flex", justifyContent: isMobile ? "center" : "space-between", alignItems: "center", gap: 24, flexWrap: "wrap", textAlign: isMobile ? "center" : "left" }}>
          <div>
            <h2 style={{ color: "#fff", fontSize: "var(--text-2xl)", marginBottom: 8 }}>See A Fit For Your Floor?</h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "var(--text-md)", margin: 0 }}>Pick the machines you need and we'll scope a cell around them.</p>
          </div>
          {/* <Button size="lg" fullWidth={isMobile} variant="inverse" iconRight={<ArrowR />} onClick={() => navigate("/services")}>Browse Services</Button> */}
        </div>
      </section>

      <Lightbox items={PHOTOS} index={active} onIndexChange={setActive} onClose={() => setActive(-1)} />
    </main>
  );
}
