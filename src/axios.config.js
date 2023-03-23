import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 180000,
  headers: {
    "Content-Type": "application/json",
  },
});
