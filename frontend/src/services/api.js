// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// // Interceptor to inject JWT token automatically into headers
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// // CRITICAL: Make sure this exact line exists at the bottom!
// export default API;


import axios from 'axios';

const API = axios.create({
  // 🚀 DYNAMIC ROUTING CORE:
  // If Vite detects a production environment variable on Render, it uses it.
  // Otherwise, it seamlessly falls back to your local port 5000!
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Interceptor to inject JWT token automatically into headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// CRITICAL: Make sure this exact line exists at the bottom!
export default API;