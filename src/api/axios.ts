import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();

  if (!token) {
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default instance;
