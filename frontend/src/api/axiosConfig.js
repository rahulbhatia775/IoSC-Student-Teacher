import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        console.log('🔍 AXIOS DEBUG - Step 1: Request interceptor called');
        console.log('🔍 AXIOS DEBUG - Step 2: Config received:', {
            method: config.method,
            url: config.url,
            baseURL: config.baseURL,
            headers: config.headers
        });
        
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔍 AXIOS DEBUG - Step 3: Token added to headers');
        } else {
            console.log('🔍 AXIOS DEBUG - Step 3: No token found');
        }
        
        const fullURL = config.baseURL + config.url;
        console.log('🔍 AXIOS DEBUG - Step 4: Final request details:', {
            method: config.method?.toUpperCase(),
            endpoint: config.url,
            fullURL: fullURL,
            hasToken: !!token
        });
        
        return config;
    },
    (error) => {
        console.error('🚨 AXIOS ERROR - Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;