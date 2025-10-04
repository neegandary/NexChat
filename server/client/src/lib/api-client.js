import { HOST } from "@/utils/constants";
import axios from "axios";

const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true,
    // Tối ưu timeout và connection
    timeout: 30000, // 30 seconds
    maxContentLength: 50 * 1024 * 1024, // 50MB
    maxBodyLength: 50 * 1024 * 1024, // 50MB
    // Keep alive connection
    headers: {
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=5, max=1000'
    }
});

// Add a request interceptor to include the token in all requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Token expired or invalid, redirect to login
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export default apiClient;