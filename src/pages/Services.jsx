import React from "react";
import { useNavigate } from "react-router-dom";
import { Gallery } from "../components/index.js";
import { MACHINES } from "../data/machines.js";
import { usePageContext } from "../App.jsx";
import { useIsMobile } from "../hooks/useIsMobile.js";

export default function Services() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { selected, setSelected } = usePageContext();
  return (
    <main style={{ padding: "0 var(--gutter) var(--space-9)", maxWidth: "var(--container-xl)", margin: "0 auto" }}>
      <div style={{ textAlign: isMobile ? "center" : "left" }}>
        <h1 style={{ fontSize: "var(--text-3xl)", margin: "10px 0 10px" }}>Select Your Machines &amp; Services</h1>
        <p style={{ fontSize: "var(--text-lg)", color: "var(--text-body)", maxWidth: isMobile ? "100%" : 560, margin: isMobile ? "0 auto var(--space-6)" : "0 0 var(--space-6)" }}>
          Tap any cell to add it to your request. Choose as many as you like.
        </p>
      </div>
      <Gallery
        items={MACHINES}
        selected={selected}
        onChange={setSelected}
        columns={isMobile ? 1 : 4}
        ctaLabel={isMobile ? "Request a quote" : "Request a quote for selection"}
        // onRequest={() => navigate("/contact")}  /* contact page disabled */
      />
    </main>
  );
}
