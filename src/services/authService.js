import api from '../config/api';

// Servicio de autenticación
const authService = {
    // Login
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener usuario actual
    getMe: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Logout
    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Actualizar contraseña
    updatePassword: async (currentPassword, newPassword) => {
        try {
            const response = await api.put('/auth/update-password', {
                currentPassword,
                newPassword,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Recuperar contraseña (para implementar después)
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Resetear contraseña (para implementar después)
    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post('/auth/reset-password', { token, newPassword });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default authService;