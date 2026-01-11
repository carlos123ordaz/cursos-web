import api from '../config/api';

// Servicio de tutores
const tutorService = {
    // Obtener todos los tutores
    getTutors: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.specialty) params.append('specialty', filters.specialty);
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`/tutors?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener un tutor específico
    getTutor: async (id) => {
        try {
            const response = await api.get(`/tutors/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Crear nuevo tutor
    createTutor: async (tutorData) => {
        try {
            const response = await api.post('/tutors', tutorData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Actualizar tutor
    updateTutor: async (id, tutorData) => {
        try {
            const response = await api.put(`/tutors/${id}`, tutorData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Eliminar tutor
    deleteTutor: async (id) => {
        try {
            const response = await api.delete(`/tutors/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener cursos de un tutor
    getTutorCourses: async (id) => {
        try {
            const response = await api.get(`/tutors/${id}/courses`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener estadísticas de un tutor
    getTutorStats: async (id) => {
        try {
            const response = await api.get(`/tutors/${id}/stats`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default tutorService;