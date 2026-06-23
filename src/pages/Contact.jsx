import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Select, Checkbox, LocationMap } from "../components/index.js";
import { MACHINES } from "../data/machines.js";
import { usePageContext } from "../App.jsx";
import { useIsMobile } from "../hooks/useIsMobile.js";

const ArrowR = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// Form delivery via Web3Forms (works on a static host — no server needed).
// The access key is public by design and safe to ship in the client bundle.
// Get a free key at https://web3forms.com using littledawgar13@gmail.com;
// submissions are emailed there. Replace the placeholder below, or set
// VITE_WEB3FORMS_KEY at build time.
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_KEY || "REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY";

const TIMELINE_OPTS = [
  { value: "q", label: "This quarter" },
  { value: "h", label: "Within 6 months" },
  { value: "y", label: "This year" },
  { value: "plan", label: "Just planning" },
];

function MachineThumb({ item }) {
  return (
    <div style={{ width: 60, height: 46, flexShrink: 0, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--surface-sunken)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--neutral-400)", backgroundImage: "repeating-linear-gradient(135deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 9px)" }}>
      {item.image
        ? <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>}
    </div>
  );
}

export default function Contact() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { selected, setSelected } = usePageContext();
  const [sent, setSent] = React.useState(false);
  const [service, setService] = React.useState(null);
  const [callback, setCallback] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const chosen = MACHINES.filter((m) => selected.includes(m.id));
  const serviceOpts = MACHINES.map((m) => ({ value: m.id, label: m.title, hint: m.category }));

  function removeChip(id) { setSelected(selected.filter((x) => x !== id)); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    // Build payload synchronously (before any await) from the native inputs.
    const fd = new FormData(e.currentTarget);
    fd.append("access_key", WEB3FORMS_ACCESS_KEY);
    fd.append("subject", "New quote request — Dynamic Robotics website");
    fd.append("from_name", "Dynamic Robotics website");
    // Custom <Select> values aren't native inputs, so add them explicitly.
    fd.append("machines", chosen.map((m) => m.title).join(", ") || "None specified");
    fd.append("timeline", TIMELINE_OPTS.find((o) => o.value === service)?.label || "Not specified");
    fd.append("callback", callback ? "Yes" : "No");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else setError(data.message || "Something went wrong — please try again.");
    } catch {
      setError("Network error — please try again, or email us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <main style={{ padding: "var(--space-10) var(--gutter)", maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-primary-tint)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-9" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: 12 }}>Request received</h1>
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-body)", marginBottom: 28 }}>A controls engineer will reach out within one business day to scope your {chosen.length || ""} {chosen.length === 1 ? "cell" : "cells"}.</p>
        <Button onClick={() => navigate("/")}>Back to home</Button>
      </main>
    );
  }

  const hasSel = chosen.length > 0;

  return (
    <main style={{ padding: "var(--space-8) var(--gutter) var(--space-9)", maxWidth: hasSel ? "var(--container-lg)" : "var(--container-md)", margin: "0 auto" }}>
      <div style={{ textAlign: (hasSel && !isMobile) ? "left" : "center" }}>
        <span className="dr-eyebrow">// {hasSel ? "Your selection" : "Get started"}</span>
        <h1 style={{ fontSize: "var(--text-2xl)", margin: "12px 0 24px" }}>Request a quote</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: (hasSel && !isMobile) ? "0.92fr 1.18fr" : "1fr", gap: "var(--space-8)", alignItems: "start" }}>
        {hasSel && (
          <Card padding="var(--space-5)">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>
              {chosen.length} {chosen.length === 1 ? "item" : "items"} selected
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {chosen.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", background: "var(--surface-page)" }}>
                  <MachineThumb item={m} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-primary)", marginTop: 3 }}>{m.category}{m.spec ? " · " + m.spec : ""}</div>
                  </div>
                  <button onClick={() => removeChip(m.id)} aria-label={"Remove " + m.title} style={{ display: "inline-flex", border: "none", background: "var(--surface-sunken)", color: "var(--text-muted)", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate("/services")}>+ Add more services</Button>
          </Card>
        )}

        <Card padding="var(--space-6)">
          <form onSubmit={handleSubmit}>
            {/* Honeypot — hidden from users; bots that tick it are rejected by Web3Forms. */}
            <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "var(--space-4)" }}>
              <Input label="Full name" name="name" placeholder="Jordan Smith" required />
              <Input label="Company" name="company" placeholder="Acme Manufacturing" />
              <Input label="Work email" name="email" type="email" placeholder="you@company.com" required />
              <Input label="Phone" name="phone" type="tel" placeholder="(417) 555-0142" />
              <div style={{ gridColumn: "1 / -1" }}>
                <Select multiple label="Machines & services of interest" options={serviceOpts} value={selected} onChange={setSelected} placeholder="Select machines" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <Select label="Primary timeline" placeholder="When do you need it running?" value={service} onChange={setService} options={TIMELINE_OPTS} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <Input label="Tell us about your line" name="message" multiline rows={4} placeholder="Parts, cycle time, current bottleneck…" />
              </div>
              <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
                <Checkbox checked={callback} onChange={setCallback} label="I'd like a callback" hint="A controls engineer will reach out within 1 business day." />
                {error && (
                  <div role="alert" style={{ fontSize: "var(--text-sm)", color: "var(--status-danger)" }}>{error}</div>
                )}
                <Button type="submit" size="lg" fullWidth disabled={submitting} iconRight={<ArrowR/>}>
                  {submitting ? "Sending…" : "Submit request"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>

      <section style={{ marginTop: "var(--space-8)" }}>
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <span className="dr-eyebrow">// Visit us</span>
          <h2 style={{ fontSize: "var(--text-xl)", margin: "10px 0 10px" }}>Find us in Springfield, MO</h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--text-body)", margin: "0 0 18px", lineHeight: 1.9 }}>
            1630 N Eldon Ave, Springfield, MO 65802<br/>
            <a href="tel:+14177733372" style={{ color: "var(--color-primary)", textDecoration: "none" }}>(417) 773-3372</a>
            {"  ·  "}
            <a href="mailto:jimmy.holaday@dynamicrobotics.com" style={{ color: "var(--color-primary)", textDecoration: "none" }}>jimmy.holaday@dynamicrobotics.com</a>
          </p>
        </div>
        <LocationMap
          lat={37.228369}
          lng={-93.3571434}
          zoom={16}
          label="Dynamic Robotics And Integration"
          address="1630 N Eldon Ave, Springfield, MO 65802"
        />
      </section>
    </main>
  );
}
