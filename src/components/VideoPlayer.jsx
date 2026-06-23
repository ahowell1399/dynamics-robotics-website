import React from "react";
import "./VideoPlayer.css";

/**
 * Dynamic Robotics & Integrations — VideoPlayer
 * A muted shop clip. By default it lazily autoplays once the visitor scrolls it
 * into view and pauses when it leaves — so a wall of them stays light on CPU and
 * bandwidth. Native `controls` let visitors scrub or unmute (the only way to
 * hear sound, since browsers block autoplay with audio).
 *
 * Playback can also be parent-controlled: pass a boolean `playing` and the clip
 * plays/pauses to match (used by the auto-advancing Carousel, where only the
 * centred clip plays). `onEnded` fires when a non-looping clip finishes, and
 * `loop` (default true) can be turned off so it plays through once.
 *
 * Accessibility: honors `prefers-reduced-motion` — when motion is reduced the
 * uncontrolled path never autoplays; the poster shows and controls still work.
 */
export function VideoPlayer({
  src,
  poster,
  title,
  caption,
  aspect = "9 / 16",
  style = {},
  playing,
  loop = true,
  onEnded,
}) {
  const videoRef = React.useRef(null);

  // muted is required for autoplay and isn't reliably reflected by React.
  React.useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = true;
  }, []);

  // Controlled playback: the parent decides via `playing`.
  React.useEffect(() => {
    const el = videoRef.current;
    if (!el || playing === undefined) return;
    if (playing) el.play().catch(() => {}); // autoplay may be rejected — ignore
    else el.pause();
  }, [playing]);

  // Uncontrolled fallback: autoplay only once the visitor has actually scrolled
  // AND the clip is in view — so a clip already on-screen at page load stays
  // paused on its poster until the user scrolls down to it.
  React.useEffect(() => {
    const el = videoRef.current;
    if (!el || playing !== undefined) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let visible = false;
    let armed = false;
    const sync = () => {
      if (armed && visible) el.play().catch(() => {});
      else if (!el.paused) el.pause();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    const onScroll = () => {
      armed = true;
      sync();
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [playing]);

  return (
    <figure className="dr-video" style={{ "--dr-video-aspect": aspect, ...style }}>
      <div className="dr-video__frame">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop={loop}
          playsInline
          controls
          // Strip the download item from the native controls menu, and block the
          // right-click "Save video as…" path — visitors can watch but not pull
          // the source file.
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          disablePictureInPicture
          preload="metadata"
          aria-label={title}
          onEnded={onEnded}
          className="dr-video__media"
        />
      </div>
      {(title || caption) && (
        <figcaption className="dr-video__caption">
          {title && <div className="dr-video__title">{title}</div>}
          {caption && <div className="dr-video__sub">{caption}</div>}
        </figcaption>
      )}
    </figure>
  );
}
