import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5000",
  // baseURL:"http://localhost:8080",

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
export default apiClient;
