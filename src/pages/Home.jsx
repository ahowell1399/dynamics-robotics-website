import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "../components/index.js";
import { useIsMobile } from "../hooks/useIsMobile.js";

// Interactive 3D welding-cobot demo — a self-contained WebGL/Three.js HTML file
// served statically from /public and embedded in an iframe so its full-viewport
// layout resolves against the iframe rather than the page. Prefixed with
// BASE_URL so it resolves under the GitHub Pages sub-path.
const ROBOT_DEMO = import.meta.env.BASE_URL + "assets/robot-demo/rbw-cobot-weld-final.html";

const ArrowR = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

export default function Home() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const caps = [
    { n: "01", t: "Robotic & Laser Welding", d: "RBW cobot cells for MIG and laser welding — fixtured tables and repeatable beads." },
    { n: "02", t: "Custom Control Panels", d: "UL-ready panel builds: PLC, VFD and safety, point-to-point wired and labeled." },
    { n: "03", t: "Collaborative Cells", d: "Cobot welding and tending that share the floor with your team — ISO/TS 15066." },
    { n: "04", t: "Enclosures & Fabrication", d: "Machine enclosures, guarding and custom steel — cut, formed and finished in-house." },
  ];
  return (
    <main>
      <section style={{ padding: "var(--space-9) var(--gutter) var(--space-8)", maxWidth: "var(--container-xl)", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.15fr", gap: "var(--space-7)", alignItems: "center" }}>
          <div style={{ textAlign: isMobile ? "center" : "left" }}>
            <span className="dr-eyebrow">// Robotic system integrator · Springfield, MO</span>
            <h1 style={{ fontSize: isMobile ? "var(--text-3xl)" : "var(--text-4xl)", lineHeight: 1.02, marginTop: 18, marginBottom: 22 }}>
              Automation,<br/>Engineered For<br/><span style={{ color: "var(--color-primary)" }}>Your Floor.</span>
            </h1>
            <p style={{ fontSize: "var(--text-lg)", lineHeight: 1.55, color: "var(--text-body)", maxWidth: isMobile ? "100%" : 460, margin: isMobile ? "0 auto 30" : "0 0 30" }}>
              We design, build and integrate robotic welding cells, custom control panels and automation — from a single cobot to a full production line.
            </p>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
              {/* <Button size="lg" fullWidth={isMobile} iconRight={<ArrowR/>} onClick={() => navigate("/services")}>Browse Services</Button> */}
              {/* <Button size="lg" fullWidth={isMobile} variant="secondary" onClick={() => navigate("/contact")}>Talk To An Engineer</Button> */}
            </div>
          </div>
          {/* Interactive 3D welding-cobot demo (iframe-isolated — see ROBOT_DEMO). */}
          <div style={{
            position: "relative",
            width: "100%",
            height: isMobile ? 400 : 540,
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid var(--border-subtle)",
            background: "#0c0e12",
            boxShadow: "var(--shadow-sm)",
          }}>
            <iframe
              src={ROBOT_DEMO}
              title="Interactive welding cobot demo"
              loading="lazy"
              allow="fullscreen; accelerometer; gyroscope"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, display: "block" }}
            />
          </div>
        </div>
      </section>

      <section style={{ padding: "0 var(--gutter) var(--space-9)", maxWidth: "var(--container-xl)", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: isMobile ? "center" : "space-between", alignItems: isMobile ? "center" : "flex-end", gap: 16, flexWrap: "wrap", textAlign: isMobile ? "center" : "left", marginBottom: "var(--space-6)" }}>
          <div>
            <span className="dr-eyebrow">// Capabilities</span>
            <h2 style={{ fontSize: "var(--text-2xl)", marginTop: 12 }}>What We Integrate</h2>
          </div>
          {/* <Button variant="ghost" iconRight={<ArrowR/>} onClick={() => navigate("/services")}>See All Machines</Button> */}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "var(--space-4)" }}>
          {caps.map((c) => (
            <Card key={c.n} accent /* services nav disabled */>
              <span className="dr-eyebrow">// {c.n}</span>
              <h3 style={{ fontSize: "var(--text-lg)", margin: "10px 0 8px" }}>{c.t}</h3>
              <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.55, color: "var(--text-body)", margin: 0 }}>{c.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 var(--gutter) var(--space-9)", maxWidth: "var(--container-xl)", margin: "0 auto" }}>
        <div style={{ background: "var(--color-primary)", borderRadius: "var(--radius-xl)", padding: isMobile ? "var(--space-6)" : "var(--space-8)", display: "flex", justifyContent: isMobile ? "center" : "space-between", alignItems: "center", gap: 24, flexWrap: "wrap", textAlign: isMobile ? "center" : "left" }}>
          <div>
            <h2 style={{ color: "#fff", fontSize: "var(--text-2xl)", marginBottom: 8 }}>Know What You Need? Build A Request.</h2>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "var(--text-md)", margin: 0 }}>Pick the machines you need and we'll scope a cell around them.</p>
          </div>
          {/* <Button size="lg" fullWidth={isMobile} variant="inverse" iconRight={<ArrowR/>} onClick={() => navigate("/services")}>View Services</Button> */}
        </div>
      </section>
    </main>
  );
}
