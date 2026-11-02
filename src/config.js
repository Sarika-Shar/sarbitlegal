// Central API and Media URL configuration
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/**
 * Formats image URLs:
 * Since images are bundled in public/images, they are served directly by Vercel CDN at lightning speed.
 */
export const getImageUrl = (path, fallback = "") => {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  let clean = path.replace(/^\/+/, "");
  if (clean.startsWith("backend/")) {
    clean = clean.substring("backend/".length);
  }
  return `/${clean}`;
};

/**
 * Formats PDF URLs:
 * Served directly by Vercel CDN.
 */
export const getPdfUrl = (path, fallback = "#") => {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  let clean = path.replace(/^\/+/, "");
  if (clean.startsWith("backend/")) {
    clean = clean.substring("backend/".length);
  }
  return `/${clean}`;
};
