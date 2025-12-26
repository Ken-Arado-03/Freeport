import { API_BASE_URL } from "../services/api";

// Base origin for media (e.g. http://localhost:8000)
const API_ORIGIN = API_BASE_URL.replace(/\/(api)\/?$/, "");

/**
 * Resolve a media URL coming from the Laravel backend.
 * - If it's already an absolute URL (http/https), return as-is.
 * - If it's a relative path like "/storage/..." or "storage/...",
 *   prefix it with the API origin so the browser can load it correctly.
 */
export function resolveMediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;

  // Absolute URL, leave it alone
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Normalise to have a single leading slash
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${API_ORIGIN}${normalised}`;
}
