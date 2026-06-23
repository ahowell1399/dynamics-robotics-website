import React from "react";
import { Routes, Route, Outlet, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { Navbar, Footer } from "./components/index.js";
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";

// Public-dir asset: prefix with BASE_URL so it resolves under the GitHub Pages
// sub-path (Vite does not rewrite absolute string paths inside JS).
const LOGO_EMBLEM = import.meta.env.BASE_URL + "assets/logo-emblem.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  // { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  // { label: "Contact", href: "/contact" },
];

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = React.useState([]);

  function onClickCapture(e) {
    const a = e.target.closest("a");
    if (!a) return;
    // Leaflet's zoom / attribution controls are <a href="#"> — let Leaflet
    // handle them instead of treating them as in-app navigation (which would
    // otherwise send "#" links to the home page).
    if (a.closest(".leaflet-container")) return;
    const href = a.getAttribute("href");
    if (!href) return;
    if (href === "#") { e.preventDefault(); navigate("/"); return; }
    if (href.startsWith("/")) { e.preventDefault(); navigate(href); }
  }

  return (
    <div className="dr-shell" onClickCapture={onClickCapture}>
      <Navbar logoSrc={LOGO_EMBLEM} activeHref={location.pathname} ctaLabel="Request A Quote" onCta={() => navigate("/contact")} links={NAV_LINKS} />
      <div className="dr-page" key={location.pathname}>
        <Outlet context={{ selected, setSelected }} />
      </div>
      <Footer logoSrc={LOGO_EMBLEM} />
    </div>
  );
}

export function usePageContext() { return useOutletContext(); }

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
