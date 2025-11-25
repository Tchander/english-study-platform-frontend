// import axios from 'axios';

// const API_BASE_DOMAIN = 'http://localhost:3000';

// // Создаем экземпляр axios с базовыми настройками
// const api = axios.create({
//   baseURL: API_BASE_DOMAIN,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Интерцептор для добавления токена к запросам
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('auth_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Интерцептор для обработки ошибок авторизации
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('auth_token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );
