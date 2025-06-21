import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "@/utils/constants/configuration";

// Create instance without baseURL so it's overrideable per request
const axiosInstance = axios.create();

// ✅ Request Interceptor
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  const csrf = localStorage.getItem("csrfToken");

  // Use default baseURL only if not set
  if (!config.baseURL) {
    config.baseURL = API_BASE_URL;
  }

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (csrf) {
    config.headers["x-csrf-token"] = csrf;
  }

  return config;
});

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<never> => {
    if (!error.response) return Promise.reject(error);

    const data = error.response.data as { token?: boolean; message?: string };

    if (data?.token === false || data?.message === "Missing token") {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
