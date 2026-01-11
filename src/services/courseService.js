import api from '../config/api';

// Servicio de cursos
const courseService = {
    // Obtener todos los cursos
    getCourses: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`/courses?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener un curso específico con módulos y lecciones
    getCourse: async (id) => {
        try {
            const response = await api.get(`/courses/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Crear nuevo curso
    createCourse: async (courseData) => {
        try {
            const response = await api.post('/courses', courseData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Actualizar curso
    updateCourse: async (id, courseData) => {
        try {
            const response = await api.put(`/courses/${id}`, courseData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Eliminar curso
    deleteCourse: async (id) => {
        try {
            const response = await api.delete(`/courses/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Subir thumbnail del curso
    uploadThumbnail: async (courseId, file) => {
        try {
            const formData = new FormData();
            formData.append('thumbnail', file);

            const response = await api.post(`/courses/${courseId}/thumbnail`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener módulos de un curso
    getCourseModules: async (courseId) => {
        try {
            const response = await api.get(`/courses/${courseId}/modules`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default courseService;