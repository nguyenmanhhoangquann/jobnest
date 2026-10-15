import axios from 'axios';

const axiosClient = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:8080/api',
  timeout: 90000, // 90s để chịu được cold-start của Render free tier (thường mất 50-70s khởi động)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Gắn JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý 401 tự động đăng xuất
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jn_token');
      localStorage.removeItem('jn_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
