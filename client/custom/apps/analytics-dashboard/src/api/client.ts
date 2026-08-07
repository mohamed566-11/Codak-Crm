import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_ESPO_API_URL || '../../../api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 15000
});

// Response Interceptor for Error Handling & Session Expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[Analytics BI Platform] EspoCRM session expired or unauthorized request.');
    }
    return Promise.reject(error);
  }
);
