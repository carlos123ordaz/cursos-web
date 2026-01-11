import api from '../config/api';

// Servicio de módulos
const moduleService = {
    // Obtener todos los módulos
    getModules: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.courseId) params.append('courseId', filters.courseId);

            const response = await api.get(`/modules?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener un módulo específico con sus lecciones
    getModule: async (id) => {
        try {
            const response = await api.get(`/modules/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Crear nuevo módulo
    createModule: async (moduleData) => {
        try {
            const response = await api.post('/modules', moduleData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Actualizar módulo
    updateModule: async (id, moduleData) => {
        try {
            const response = await api.put(`/modules/${id}`, moduleData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Eliminar módulo
    deleteModule: async (id) => {
        try {
            const response = await api.delete(`/modules/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Reordenar módulos
    reorderModules: async (modules) => {
        try {
            const response = await api.put('/modules/reorder', { modules });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default moduleService;