
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from 'src/utils/constants/configuration';


const defaultOptions: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosInstance = axios.create(defaultOptions);

// ✅ Request Interceptor
axiosInstance.interceptors.request.use((config: any) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isClient = typeof window !== 'undefined';
  
  if (token) {
    if (config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      config.headers = { Authorization: `Bearer ${token}` };
    }
  } else if (isClient) {
    // Only abort on client
    const controller = new AbortController();
    config.signal = controller.signal;
    controller.abort();
  }


  return config;
});

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {

    if (!error.response) {
      return Promise.reject(error);
    }

    const message = (error.response.data as any)?.message;

    if (message === 'jwt expired' || message === 'Auth Failed (Unauthorized)') {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      try {
        await axios.post(
          `${API_BASE_URL}auth/logout`,
          { accessToken: token },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        localStorage.clear();
        window.location.href = '/login';
      } catch (logoutError) {
        console.error('Logout failed:', logoutError);
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
