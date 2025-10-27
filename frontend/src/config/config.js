// Configuration file to handle environment variables
const config = {
    baseURL: 'http://localhost:5000', // Hardcoded for now to fix the issue
    apiTimeout: 10000,
};

// Debug log to check if environment variable is loaded
console.log('Environment REACT_APP_BASE_URL:', process.env.REACT_APP_BASE_URL);
console.log('Using baseURL:', config.baseURL);

export default config;