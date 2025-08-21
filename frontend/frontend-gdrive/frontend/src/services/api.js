import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Add JWT token automatically if logged in
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
