import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PageMeta({
  title = "LUMIÈRE GRAND HOTEL | 5-Star Luxury Stays",
  description = "Experience refined elegance, extraordinary suites, fine dining, and personalized hospitality at Lumière Grand Hotel.",
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title.includes("LUMIÈRE") || title.includes("Lumière")
      ? title
      : `${title} | Lumière Grand Hotel`;

    document.title = formattedTitle;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // 3. Open Graph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", formattedTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", description);

    // 4. Scroll to top on page navigation
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [title, description, location.pathname]);

  return null;
}
