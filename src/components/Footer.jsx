import React from "react";
import "./Footer.css";

/**
 * Dynamic Robotics And Integration — Footer
 * Dark marketing-site footer with link columns.
 */
export function Footer({
  columns = [
    { title: "Capabilities", links: ["Robotic & Laser Welding", "Custom Control Panels", "Collaborative Cells", "Enclosures & Fabrication"] },
    { title: "Company", links: ["About", "Careers", "Case Studies"] },
    { title: "Resources", links: ["Process Guide", "Safety & Standards", "FAQ"] },
  ],
  logoSrc = "assets/logo-emblem.png",
  tagline = "Robotic integration engineered for your floor.",
  contact = { phone: "(417) 773-3372", email: "", location: "1630 N Eldon Ave, Springfield, MO 65802" },
  style = {},
}) {
  return (
    <footer className="dr-footer" style={style}>
      <div className="dr-footer__inner">
        <div className="dr-footer__brand">
          <div className="dr-footer__brand-row">
            <img src={logoSrc} alt="" className="dr-footer__logo" />
            <span className="dr-footer__name">
              <span className="dr-footer__name-main">Dynamic Robotics</span>
              <span className="dr-footer__sub">And Integration</span>
            </span>
          </div>
          <p className="dr-footer__tagline">{tagline}</p>
          <div className="dr-footer__contact">
            <div>{contact.location}</div>
            <div>{contact.phone}</div>
            <div className="dr-footer__contact-email">{contact.email}</div>
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="dr-footer__col">
            <div className="dr-footer__col-title">{col.title}</div>
            <ul className="dr-footer__links">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="dr-footer__link">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="dr-footer__bottom">
        <span>© 2026 DYNAMIC ROBOTICS AND INTEGRATION</span>
        <span>PRIVACY · TERMS · ISO 10218 COMPLIANT</span>
      </div>
    </footer>
  );
}
