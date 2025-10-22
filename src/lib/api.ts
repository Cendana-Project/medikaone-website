// src/lib/api.ts

import axios from 'axios';

// 1. Definisikan API Key sebagai konstanta
// NOTE: Karena ini hanya untuk Reqres dan nilainya konstan, kita hardcode.
// UNTUK PRODUKSI, Anda harus menggunakan process.env.NEXT_PUBLIC_API_KEY
const REQRES_API_KEY = "reqres-free-v1";

// 2. Buat instance Axios
const api = axios.create({
  // Atur base URL jika Anda hanya berinteraksi dengan satu domain
  baseURL: 'https://reqres.in/api', 
  
  // Header dasar
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Tambahkan Axios Interceptor (Opsional, tapi Praktik Terbaik)
// Interceptor menambahkan header kustom ke setiap request SEBELUM dikirim
api.interceptors.request.use(
  (config) => {
    // ✅ Tambahkan header 'x-api-key' ke SETIAP permintaan
    config.headers['x-api-key'] = REQRES_API_KEY; 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;