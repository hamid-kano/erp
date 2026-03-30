import axios from 'axios';

const api = axios.create({
    baseURL:        '/api',
    withCredentials: true,
    withXSRFToken:   true,
});

api.interceptors.request.use((config) => {
    const stored = localStorage.getItem('erp-ui-store');
    const lang   = stored ? (JSON.parse(stored)?.state?.lang ?? 'ar') : 'ar';
    config.headers['Accept-Language'] = lang;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) window.location.href = '/login';
        return Promise.reject(error);
    }
);

export { api };
