import axios from "axios";
import { notify } from "../utils/tostr"; // tumcha notify util
import jwt_decode from "jwt-decode";

// 1️⃣ Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// 2️⃣ Attach JWT token automatically to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 3️⃣ Response interceptor – handle errors & token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      notify.show({ success: false, message: error.response.data?.detail || "Session expired. Please login again." });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } else {
      let message = error.response?.data?.detail || error.response?.data?.message || error.message || "Server error";
      if (typeof message === "object") message = JSON.stringify(message);
      notify.show({ success: false, message });
    }

    return Promise.reject(error);
  }
);

// 4️⃣ Optional helper – check token expiry locally
export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const decoded = jwt_decode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    console.error("Token decode error:", err);
    return true;
  }
};

export default api;
