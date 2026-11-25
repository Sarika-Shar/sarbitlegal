// Central API and Media URL configuration
const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "::1");

const resolveApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If running locally in browser and envUrl points to onrender or is empty, use localhost:5000
  if (isLocalhost) {
    if (!envUrl || envUrl.includes("onrender.com")) {
      return "http://localhost:5000";
    }
  }
  return envUrl || "http://localhost:5000";
};

export const API_BASE_URL = resolveApiUrl().replace(/\/+$/, "");

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
