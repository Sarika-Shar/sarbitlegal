// Central API and Media URL configuration
const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "::1");

const resolveApiUrl = () => {
  // If running locally in browser, connect to local backend on port 5000
  if (isLocalhost) {
    return "http://localhost:5000";
  }
  // When running online (e.g. on Vercel), use same-domain relative path ("")
  // which is handled directly by vercel.json serverless API
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || envUrl.includes("onrender.com")) {
    return "";
  }
  return envUrl;
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
