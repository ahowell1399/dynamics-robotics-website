import React from "react";
import "./Reveal.css";

/**
 * Dynamic Robotics & Integrations — Reveal
 * Fades + slides its content up the first time it scrolls into view. Wrap any
 * element; pass `as` to pick the tag and `delay` (ms) to stagger a group.
 * Honors prefers-reduced-motion (shows instantly, no transition).
 */
export function Reveal({ children, as: Tag = "div", delay = 0, className = "", style = {}, ...rest }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect(); // reveal once, then stay
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={"dr-reveal" + (visible ? " is-visible" : "") + (className ? " " + className : "")}
      style={{ "--dr-reveal-delay": delay + "ms", ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
