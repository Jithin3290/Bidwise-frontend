import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: false,
});

const PUBLIC_ENDPOINTS = [
  "/auth/login/",
  "/auth/register/",
  "/auth/google/",
  "/auth/refresh/",
  "/auth/mfa/setup/",
  "/auth/mfa/verify-setup/",
];

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    const isPublic = PUBLIC_ENDPOINTS.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (token && token !== "undefined" && token !== "null" && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
