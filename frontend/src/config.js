// src/config.js

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8001" // Local backend for development
    : "https://manasmedimart.onrender.com"; // Deployed backend for production

export default API_BASE_URL;