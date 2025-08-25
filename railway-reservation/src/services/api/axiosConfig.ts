import axios from 'axios';
import { checkTokenAndLogout } from '../../utils/tokenUtils';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8222';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token and check expiration
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired before making request
      if (checkTokenAndLogout()) {
        return Promise.reject(new Error('Token expired'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized access, token may be expired');
      checkTokenAndLogout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;