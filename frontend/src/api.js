const API_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

export const apiFetch = (path, options) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${API_URL}${normalizedPath}`, options);
};
