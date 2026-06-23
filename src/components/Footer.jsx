import React from "react";
import { useIsMobile } from "../hooks/useIsMobile.js";

/**
 * Dynamic Robotics And Integration — Footer
 * Dark marketing-site footer with link columns.
 */
export function Footer({
  columns = [
    { title: "Capabilities", links: ["Robotic & laser welding", "Custom control panels", "Collaborative cells", "Enclosures & fabrication"] },
    { title: "Company", links: ["About", "Careers", "Case studies", "Contact"] },
    { title: "Resources", links: ["Process guide", "Safety & standards", "FAQ"] },
  ],
  logoSrc = "assets/logo-emblem.png",
  tagline = "Robotic integration engineered for your floor.",
  contact = { phone: "(417) 773-3372", email: "jimmy.holaday@dynamicrobotics.com", location: "1630 N Eldon Ave, Springfield, MO 65802" },
  style = {},
}) {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: "var(--surface-ink)", color: "var(--neutral-300)", fontFamily: "var(--font-body)", padding: "var(--space-9) var(--gutter) var(--space-6)", ...style }}>
      <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr repeat(3, 1fr)", gap: isMobile ? "var(--space-6)" : "var(--space-7)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 16 }}>
            <img src={logoSrc} alt="" style={{ width: 46, height: 46 }} />
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--font-logo)", fontWeight: 700, fontSize: 17, color: "#fff", letterSpacing: "-0.01em" }}>Dynamic Robotics</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--green-400)", marginTop: 3 }}>And Integration</span>
            </span>
          </div>
          <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.6, color: "var(--neutral-400)", maxWidth: 280, margin: "0 0 18px" }}>{tagline}</p>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", lineHeight: 2, color: "var(--neutral-400)" }}>
            <div>{contact.location}</div>
            <div>{contact.phone}</div>
            <div style={{ color: "var(--green-400)" }}>{contact.email}</div>
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--green-400)", marginBottom: 16 }}>{col.title}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" style={{ fontSize: "var(--text-sm)", color: "var(--neutral-300)", textDecoration: "none", transition: "color var(--dur-fast)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--neutral-300)")}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: "var(--container-xl)", margin: "var(--space-7) auto 0", paddingTop: "var(--space-5)", borderTop: "1px solid var(--neutral-800)", display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 0, justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--neutral-500)", letterSpacing: "0.04em" }}>
        <span>© 2026 DYNAMIC ROBOTICS AND INTEGRATION</span>
        <span>PRIVACY · TERMS · ISO 10218 COMPLIANT</span>
      </div>
    </footer>
  );
}
