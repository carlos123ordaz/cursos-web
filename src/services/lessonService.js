import api from '../config/api';

// Servicio de lecciones
const lessonService = {
    // Obtener todas las lecciones
    getLessons: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.moduleId) params.append('moduleId', filters.moduleId);
            if (filters.courseId) params.append('courseId', filters.courseId);

            const response = await api.get(`/lessons?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener una lección específica
    getLesson: async (id) => {
        try {
            const response = await api.get(`/lessons/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Crear nueva lección
    createLesson: async (lessonData) => {
        try {
            const response = await api.post('/lessons', lessonData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Actualizar lección
    updateLesson: async (id, lessonData) => {
        try {
            const response = await api.put(`/lessons/${id}`, lessonData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Eliminar lección
    deleteLesson: async (id) => {
        try {
            const response = await api.delete(`/lessons/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Subir video a Bunny.net
    uploadVideo: async (lessonId, videoFile, onProgress) => {
        try {
            const formData = new FormData();
            formData.append('video', videoFile);

            const response = await api.post(`/lessons/${lessonId}/video`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Agregar recurso (archivo) a una lección
    addResource: async (lessonId, file, resourceData, onProgress) => {
        try {
            const formData = new FormData();
            formData.append('resource', file);
            formData.append('name', resourceData.name || file.name);
            formData.append('type', resourceData.type || 'pdf');

            const response = await api.post(`/lessons/${lessonId}/resources`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Eliminar recurso de una lección
    deleteResource: async (lessonId, resourceId) => {
        try {
            const response = await api.delete(`/lessons/${lessonId}/resources/${resourceId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default lessonService;