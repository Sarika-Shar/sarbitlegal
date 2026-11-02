// Central API and Media URL configuration
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/**
 * Formats image URLs whether they come as:
 * - Full URL: "https://example.com/pic.jpg"
 * - Stored path: "images/123.jpg"
 * - Prefix path: "backend/images/123.jpg" or "/images/123.jpg"
 */
export const getImageUrl = (path, fallback = "") => {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  let clean = path.replace(/^\/+/, "");
  if (clean.startsWith("backend/")) {
    clean = clean.substring("backend/".length);
  }
  return `${API_BASE_URL}/${clean}`;
};

/**
 * Formats PDF URLs
 */
export const getPdfUrl = (path, fallback = "#") => {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  let clean = path.replace(/^\/+/, "");
  if (clean.startsWith("backend/")) {
    clean = clean.substring("backend/".length);
  }
  return `${API_BASE_URL}/${clean}`;
};
