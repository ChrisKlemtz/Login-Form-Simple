import { useEffect, useState } from "react";
import { forms } from "./forms/registry.js";
import Gallery from "./components/Gallery.jsx";
import FormPage from "./components/FormPage.jsx";

// Hash-Routing (#/slug): funktioniert ohne Server-Konfiguration auf jedem statischen Hosting.
const readSlug = () => window.location.hash.replace(/^#\/?/, "");

export default function App() {
  const [slug, setSlug] = useState(readSlug);

  useEffect(() => {
    const onHashChange = () => {
      setSlug(readSlug());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const index = forms.findIndex((form) => form.slug === slug);

  if (index === -1) return <Gallery />;
  return <FormPage key={slug} index={index} />;
}
