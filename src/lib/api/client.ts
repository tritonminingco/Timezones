/**
 * Axios Client Configuration
 * 
 * Simple axios instance for API calls
 */

import axios from 'axios';

// Custom API Error class
export class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const axiosClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
axiosClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
axiosClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`);

    // Handle authentication errors
    if (error.response?.status === 401) {
      window.location.href = '/auth/signin';
    }

    return Promise.reject(error);
  }
);
