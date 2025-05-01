import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // Sesuaikan URL dengan backend Anda
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
