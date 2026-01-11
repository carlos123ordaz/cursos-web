import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(
    (config) => {
        // Buscar token en localStorage O sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Manejar errores comunes
        if (error.response) {
            // El servidor respondió con un código de error
            switch (error.response.status) {
                case 401:
                    // Solo redirigir si NO es un intento de login
                    const isLoginRequest = error.config.url?.includes('/auth/login');

                    if (!isLoginRequest) {
                        // Token expirado o inválido en una petición autenticada
                        console.error('No autorizado - Token inválido o expirado');
                        // Limpiar tokens
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                        // Redirigir a login
                        window.location.href = '/login';
                    }
                    // Si es login, dejar que el error se propague
                    break;
                case 403:
                    console.error('Acceso prohibido');
                    break;
                case 404:
                    console.error('Recurso no encontrado');
                    break;
                case 500:
                    console.error('Error del servidor');
                    break;
                default:
                    console.error('Error en la petición:', error.response.data?.message);
            }
        } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta
            console.error('No se recibió respuesta del servidor');
        } else {
            // Algo pasó al configurar la petición
            console.error('Error al configurar la petición:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;