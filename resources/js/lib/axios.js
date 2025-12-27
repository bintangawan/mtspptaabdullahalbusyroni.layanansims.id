import axios from 'axios';

// baseURL otomatis sesuai Vite .env atau fallback ke 127.0.0.1:8000
axios.defaults.baseURL = '/';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Ambil token CSRF dari meta tag Blade
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
} else {
  console.warn('⚠️ CSRF token not found — make sure <meta name="csrf-token" content="{{ csrf_token() }}"> is in your layout.');
}

export default axios;
