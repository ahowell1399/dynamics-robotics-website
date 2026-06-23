import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// GitHub Pages PROJECT page: served from
// https://austin-s-howell.github.io/dynamic-robotics-website/
// For custom domains served at the root, build with a root base path.
// Use VITE_BASE=/dynamic-robotics-website/ only when deploying to the repo path.

// Copy the built index.html to 404.html. GitHub Pages serves 404.html (with the
// original URL preserved) for any unknown path, so client-side deep links can
// resolve to the SPA shell and React Router (with its basename) on hard refresh.
function spaFallback() {
  let outDir = "dist";
  return {
    name: "spa-404-fallback",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const index = path.resolve(outDir, "index.html");
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.resolve(outDir, "404.html"));
      }
    },
  };
}

export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE || "/",
  plugins: [react(), spaFallback()],
}));
