// src/api/config.js
// // заменить, на что нужно
// export const API_BASE_URL = 'http://' + 'localhost' + '/api'; 

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// timeout запроса
export const DEFAULT_API_TIMEOUT = 8000;