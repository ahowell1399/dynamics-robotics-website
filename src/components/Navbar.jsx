import React from "react";
import { useIsMobile } from "../hooks/useIsMobile.js";
import "./Navbar.css";

/**
 * Dynamic Robotics And Integration — Navbar
 * Sticky marketing-site top navigation. Desktop: inline links + CTA with a
 * wipe-in underline and a springy, sheened CTA. Mobile (<820px): emblem +
 * wordmark with a hamburger that opens a stacked menu.
 */

function NavLink({ link, active }) {
  return (
    <a
      href={link.href}
      className={"dr-navbar__link" + (active ? " dr-navbar__link--active" : "")}
    >
      {link.label}
      <span className="dr-navbar__underline" />
    </a>
  );
}

function CtaButton({ label, onClick, fullWidth = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={"dr-navbar__cta" + (fullWidth ? " dr-navbar__cta--full" : "")}
    >
      <span className="dr-navbar__cta-sheen" />
      <span className="dr-navbar__cta-label">{label}</span>
      <svg className="dr-navbar__cta-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function Wordmark({ logoSrc, mobile }) {
  return (
    <a
      href="#"
      aria-label="Dynamic Robotics And Integration — home"
      title="Back to home"
      className={"dr-navbar__brand" + (mobile ? " dr-navbar__brand--mobile" : "")}
    >
      <img src={logoSrc} alt="" className="dr-navbar__brand-logo" />
      <span className="dr-navbar__brand-text">
        <span className="dr-navbar__brand-name">
          DYNAMIC <span className="dr-navbar__brand-accent">ROBOTICS</span>
        </span>
        <span className="dr-navbar__brand-sub">&amp; Integration</span>
      </span>
    </a>
  );
}

export function Navbar({
  links = [
    { label: "Capabilities", href: "#" },
    { label: "Gallery", href: "#" },
    { label: "Industries", href: "#" },
    { label: "About", href: "#" },
  ],
  activeHref = null,
  ctaLabel = "Request A Quote",
  onCta,
  logoSrc = "assets/logo-emblem.png",
  style = {},
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  // Close the mobile menu whenever we switch to desktop or a link is tapped.
  React.useEffect(() => { if (!isMobile) setOpen(false); }, [isMobile]);

  return (
    <header
      className={"dr-navbar" + (isMobile ? " dr-navbar--mobile" : "")}
      style={style}
    >
      <Wordmark logoSrc={logoSrc} mobile={isMobile} />

      {!isMobile && (
        <React.Fragment>
          <nav className="dr-navbar__nav">
            {links.map((l) => <NavLink key={l.label} link={l} active={activeHref === l.href} />)}
          </nav>
          {/* <CtaButton label={ctaLabel} onClick={onCta} /> */}
        </React.Fragment>
      )}

      {isMobile && (
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={"dr-navbar__toggle" + (open ? " is-open" : "")}
        >
          <span className="dr-navbar__bar dr-navbar__bar--1" />
          <span className="dr-navbar__bar dr-navbar__bar--2" />
          <span className="dr-navbar__bar dr-navbar__bar--3" />
        </button>
      )}

      {/* mobile dropdown panel */}
      {isMobile && (
        <div className={"dr-navbar__menu" + (open ? " is-open" : "")}>
          {links.map((l) => {
            const active = activeHref === l.href;
            return (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                className={"dr-navbar__menu-link" + (active ? " dr-navbar__menu-link--active" : "")}>
                {l.label}
              </a>
            );
          })}
          {/* <div className="dr-navbar__menu-cta">
            <CtaButton label={ctaLabel} fullWidth onClick={() => { setOpen(false); onCta && onCta(); }} />
          </div> */}
        </div>
      )}
    </header>
  );
}
