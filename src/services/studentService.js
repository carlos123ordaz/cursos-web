import api from '../config/api';

// Servicio de estudiantes
const studentService = {
    // Obtener todos los estudiantes
    getStudents: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`/students?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener un estudiante específico
    getStudent: async (id) => {
        try {
            const response = await api.get(`/students/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Crear nuevo estudiante
    createStudent: async (studentData) => {
        try {
            const response = await api.post('/students', studentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Actualizar estudiante
    updateStudent: async (id, studentData) => {
        try {
            const response = await api.put(`/students/${id}`, studentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Eliminar estudiante
    deleteStudent: async (id) => {
        try {
            const response = await api.delete(`/students/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener cursos de un estudiante
    getStudentCourses: async (id) => {
        try {
            const response = await api.get(`/students/${id}/courses`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Obtener progreso de un estudiante
    getStudentProgress: async (id) => {
        try {
            const response = await api.get(`/students/${id}/progress`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default studentService;