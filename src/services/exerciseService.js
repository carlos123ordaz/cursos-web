import api from "../config/api";

const exerciseService = {
    // Admin - Get all exercises
    getExercises: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await api.get(`/exercises${params ? `?${params}` : ''}`);
            return response.data; // ← Cambio principal: retornar solo data
        } catch (error) {
            console.error('Error getting exercises:', error);
            throw error.response?.data || error;
        }
    },

    // Admin - Get single exercise
    getExercise: async (exerciseId) => {
        try {
            const response = await api.get(`/exercises/${exerciseId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Admin - Create exercise
    createExercise: async (exerciseData) => {
        try {
            console.log('Sending exercise data to backend:', exerciseData);
            const response = await api.post('/exercises', exerciseData);
            console.log('Backend response:', response);
            console.log('Response data:', response.data);
            return response.data; // ← Cambio principal: retornar solo data
        } catch (error) {
            console.error('Error in createExercise service:', error);
            console.error('Error response:', error.response?.data);
            throw error.response?.data || error;
        }
    },

    // Admin - Update exercise
    updateExercise: async (exerciseId, exerciseData) => {
        try {
            const response = await api.put(`/exercises/${exerciseId}`, exerciseData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Admin - Delete exercise
    deleteExercise: async (exerciseId) => {
        try {
            const response = await api.delete(`/exercises/${exerciseId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Admin - Add question
    addQuestion: async (exerciseId, questionData) => {
        try {
            const response = await api.post(`/exercises/${exerciseId}/questions`, questionData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Admin - Update question
    updateQuestion: async (exerciseId, questionId, questionData) => {
        try {
            const response = await api.put(`/exercises/${exerciseId}/questions/${questionId}`, questionData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Admin - Delete question
    deleteQuestion: async (exerciseId, questionId) => {
        try {
            const response = await api.delete(`/exercises/${exerciseId}/questions/${questionId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Admin - Upload question image
    uploadQuestionImage: async (exerciseId, questionId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post(`/exercises/${exerciseId}/questions/${questionId}/image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Student - Get exercises by lesson
    getExercisesByLesson: async (lessonId) => {
        try {
            const response = await api.get(`/exercises/lesson/${lessonId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Student - Get available general exams
    getAvailableExams: async (courseId = null) => {
        try {
            const params = courseId ? `?courseId=${courseId}` : '';
            const response = await api.get(`/exercises/available${params}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Admin - Get submissions for an exercise
    getExerciseSubmissions: async (exerciseId) => {
        try {
            const response = await api.get(`/exam-submissions/exercise/${exerciseId}/all`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default exerciseService;