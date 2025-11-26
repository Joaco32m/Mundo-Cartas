import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

const rutasPublicas = [
  "productos",
  "productos/",
  "/productos",
  "/productos/",
];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  const metodo = config.method.toUpperCase();
  const url = config.url.replace(/^\/+/, "");

  const esPublica =
    metodo === "GET" &&
    rutasPublicas.some((ruta) => url.startsWith(ruta));

  if (esPublica) {
    delete config.headers.Authorization;
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail || "";

    // 🔥 FIX: NO cerrar sesión por errores de stock
    const esErrorStock =
      detail.toLowerCase().includes("stock") ||
      detail.toLowerCase().includes("insuficiente");

    // 🔥 SOLO cerrar sesión con un 401 REAL, no un 400 del backend
    if (status === 401 && !esErrorStock) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("rol");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
