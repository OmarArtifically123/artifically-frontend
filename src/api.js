// src/api.js
import axios from "axios";

const base =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "") + "/api/v1";

export const api = axios.create({
  baseURL: base || "/api/v1",
  withCredentials: false,
  timeout: 20000,
});

// attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// normalize server errors -> { message, requestId, status }
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const fallback = { message: "Request failed", status: 500 };
    if (!err.response) throw fallback;
    const { status, data } = err.response;
    const normalized = {
      status,
      message: data?.message || data?.error || "Request failed",
      requestId: data?.requestId,
      details: data,
    };
    throw normalized;
  }
);

// tiny helper to unwrap data
export const pick = (p) => (r) => r?.data?.[p] ?? r?.data;

export default api;
