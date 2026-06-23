import React from "react";
import "./Carousel.css";

/**
 * Dynamic Robotics & Integrations — Carousel
 * Horizontal, centre-snapping track for a row of cards (e.g. the video wall).
 * The active card centres in the viewport; the next/prev ones peek at the
 * edges. Native overflow scrolling drives it (trackpad / touch-swipe / drag),
 * with circular prev/next arrows that step one card at a time and reach the
 * very first and last cards, a slim scroll-progress bar, and soft edge fades.
 *
 * Dynamic inline side-padding lets the first and last cards reach the centre
 * (otherwise the scroll range would stop short of centring an edge card).
 *
 * tone="dark" turns on the cinematic spotlight: the centred card is lifted to
 * full size while its neighbours dim and recede, with glassy arrows tuned for a
 * dark surface.
 *
 * autoAdvance turns the reel into a playlist: only the centred child plays
 * (it receives a `playing` prop + `loop={false}` + `onEnded`), and when a clip
 * finishes the carousel advances to the next — wrapping back to the first at the
 * end. Playback only begins once the visitor has scrolled AND the reel is in
 * view, so nothing autoplays on page load. Children are expected to honor the
 * injected `playing` / `loop` / `onEnded` props (VideoPlayer does).
 *
 * children: each child is rendered as one snap-aligned card.
 */
export function Carousel({ children, ariaLabel = "Carousel", tone = "light", autoAdvance = false }) {
  const rootRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);
  const [scrollable, setScrollable] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [active, setActive] = React.useState(0);
  const [pad, setPad] = React.useState(4);

  // Auto-advance gating: don't play until the visitor scrolls and the reel is
  // on screen, and never autoplay under reduced-motion.
  const [armed, setArmed] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);

  const items = React.Children.toArray(children);
  const count = items.length;

  // Index of the card whose centre is nearest the viewport centre, computed
  // live from layout so it never goes stale between renders.
  const centeredIndex = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    el.querySelectorAll(".dr-carousel__item").forEach((it, i) => {
      const r = it.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }, []);

  const update = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    setAtStart(scrollLeft <= 2);
    setAtEnd(scrollLeft >= maxScroll - 2);
    setScrollable(maxScroll > 4);
    setProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
    setActive(centeredIndex());

    // Side padding so an edge card can sit dead-centre.
    const first = el.querySelector(".dr-carousel__item");
    const cardW = first ? first.offsetWidth : 0;
    setPad(Math.max(4, (clientWidth - cardW) / 2));
  }, [centeredIndex]);

  // Before first paint: apply the side padding and pin to the first card.
  // Otherwise mandatory snap centres whatever card is nearest at scrollLeft 0
  // (before the padding exists), landing the reel mid-way through.
  React.useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector(".dr-carousel__item");
    const cardW = first ? first.offsetWidth : 0;
    const p = Math.max(4, (el.clientWidth - cardW) / 2);
    el.style.setProperty("--dr-carousel-pad", p + "px"); // apply synchronously
    el.scrollLeft = 0;
    setPad(p);
    setActive(0);
  }, []);

  React.useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  // Arm-on-scroll + in-view + reduced-motion, only needed for auto-advance.
  React.useEffect(() => {
    if (!autoAdvance) return;
    const mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(!!(mq && mq.matches));

    const onScroll = () => {
      setArmed(true);
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let io;
    const root = rootRef.current;
    if (root && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
      io.observe(root);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (io) io.disconnect();
    };
  }, [autoAdvance]);

  function scrollToIndex(i, behavior = "smooth") {
    const el = trackRef.current;
    if (!el) return;
    const els = el.querySelectorAll(".dr-carousel__item");
    const idx = Math.max(0, Math.min(els.length - 1, i));
    const it = els[idx];
    if (!it) return;
    // offsetWidth/offsetLeft ignore the spotlight scale, so we centre the
    // card's true layout box; scrollTo clamps to the ends automatically.
    const target = it.offsetLeft - (el.clientWidth - it.offsetWidth) / 2;
    el.scrollTo({ left: target, behavior });
  }

  function step(dir) {
    scrollToIndex(centeredIndex() + dir);
  }

  // A clip finished: advance to the next, or jump back to the first at the end.
  function handleEnded(i) {
    if (i >= count - 1) scrollToIndex(0, "auto"); // restart the reel
    else scrollToIndex(i + 1, "smooth");
  }

  const canPlay = autoAdvance && armed && inView && !reduced;

  return (
    <div
      className={"dr-carousel" + (tone === "dark" ? " dr-carousel--dark" : "")}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      ref={rootRef}
    >
      <div className="dr-carousel__viewport">
        <div
          className="dr-carousel__track"
          ref={trackRef}
          style={{ "--dr-carousel-pad": pad + "px" }}
        >
          {items.map((child, i) => (
            <div
              className={"dr-carousel__item" + (i === active ? " is-active" : "")}
              key={child.key ?? i}
            >
              {autoAdvance
                ? React.cloneElement(child, {
                    playing: canPlay && i === active,
                    loop: false,
                    onEnded: () => handleEnded(i),
                  })
                : child}
            </div>
          ))}
        </div>
        <span className={"dr-carousel__fade dr-carousel__fade--left" + (atStart ? " is-hidden" : "")} aria-hidden="true" />
        <span className={"dr-carousel__fade dr-carousel__fade--right" + (atEnd ? " is-hidden" : "")} aria-hidden="true" />
      </div>

      <button
        type="button"
        className="dr-carousel__arrow dr-carousel__arrow--prev"
        aria-label="Previous"
        onClick={() => step(-1)}
        disabled={active <= 0}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        className="dr-carousel__arrow dr-carousel__arrow--next"
        aria-label="Next"
        onClick={() => step(1)}
        disabled={active >= count - 1}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {scrollable && (
        <div className="dr-carousel__progress" aria-hidden="true">
          <span className="dr-carousel__progress-fill" style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
      )}
    </div>
  );
}
