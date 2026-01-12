import api from "../config/api";

const examSubmissionService = {
    // Start an exam
    startExam: async (exerciseId, enrollmentId) => {
        try {
            const response = await api.post('/exam-submissions/start', {
                exerciseId,
                enrollmentId,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Submit exam answers
    submitExam: async (submissionId, answers) => {
        try {
            const response = await api.post(`/exam-submissions/${submissionId}/submit`, { answers });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get results
    getResults: async (submissionId) => {
        try {
            const response = await api.get(`/exam-submissions/${submissionId}/results`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get student's submissions for an exercise
    getStudentSubmissions: async (exerciseId) => {
        try {
            const response = await api.get(`/exam-submissions/exercise/${exerciseId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get student's exam history
    getStudentHistory: async () => {
        try {
            const response = await api.get('/exam-submissions/student/history');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Check if student can take exam
    checkEligibility: async (exerciseId) => {
        try {
            const response = await api.get(`/exam-submissions/check/${exerciseId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default examSubmissionService;