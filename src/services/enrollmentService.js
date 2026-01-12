import api from '../config/api';

// Servicio de inscripciones
const enrollmentService = {
    // Obtener todas las inscripciones
    getEnrollments: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.studentId) params.append('studentId', filters.studentId);
            if (filters.courseId) params.append('courseId', filters.courseId);
            if (filters.status) params.append('status', filters.status);

            const response = await api.get(`/enrollments?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener una inscripción específica
    getEnrollment: async (id) => {
        try {
            const response = await api.get(`/enrollments/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Crear nueva inscripción (inscribir estudiante en curso)
    createEnrollment: async (enrollmentData) => {
        try {
            const response = await api.post('/enrollments', enrollmentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Actualizar inscripción
    updateEnrollment: async (id, enrollmentData) => {
        try {
            const response = await api.put(`/enrollments/${id}`, enrollmentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Eliminar inscripción (desinscribir estudiante)
    deleteEnrollment: async (id) => {
        try {
            const response = await api.delete(`/enrollments/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Marcar lección como completada
    completeLesson: async (enrollmentId, lessonId, watchTime = 0) => {
        try {
            const response = await api.post(`/enrollments/${enrollmentId}/complete-lesson`, {
                lessonId,
                watchTime,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener progreso de una inscripción
    getProgress: async (enrollmentId) => {
        try {
            const response = await api.get(`/enrollments/${enrollmentId}/progress`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener inscripción por estudiante y curso
    getEnrollmentByStudentAndCourse: async (studentId, courseId) => {
        try {
            const response = await api.get(`/enrollments/student/${studentId}/course/${courseId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default enrollmentService;