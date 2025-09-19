// src/api.js
import axios from "axios";

const base =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "") + "/api/v1";

export const api = axios.create({
  baseURL: base || "/api/v1",
  withCredentials: false, // set true if you switch to HttpOnly cookies
  timeout: 20000,
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize server errors -> { message, requestId, status }
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const fallback = { message: "Request failed", status: 500 };

    if (!err.response) {
      throw fallback;
    }

    const { status, data } = err.response;

    // Optional: handle 401 auto-logout or refresh
    if (status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/"; // uncomment if you want auto-redirect
    }

    const normalized = {
      status,
      message: data?.message || data?.error || "Request failed",
      requestId: data?.requestId,
      details: data,
    };
    throw normalized;
  }
);

// Tiny helper to unwrap data
export const pick = (p) => (r) => (p ? r?.data?.[p] : r?.data);

export default api;
