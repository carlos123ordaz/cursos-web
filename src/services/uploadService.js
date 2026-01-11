import api from '../config/api';

// Servicio de upload general
const uploadService = {
    // Subir imagen a Google Cloud Storage
    uploadImage: async (file, onProgress) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/upload/image', formData, {
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

    // Subir documento a Google Cloud Storage
    uploadDocument: async (file, onProgress) => {
        try {
            const formData = new FormData();
            formData.append('document', file);

            const response = await api.post('/upload/document', formData, {
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

    // Subir video a Bunny.net
    uploadVideo: async (file, onProgress) => {
        try {
            const formData = new FormData();
            formData.append('video', file);

            const response = await api.post('/upload/video', formData, {
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

    // Subir múltiples archivos
    uploadMultiple: async (files, onProgress) => {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await api.post('/upload/multiple', formData, {
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

    // Eliminar archivo de Google Cloud Storage
    deleteFile: async (fileUrl) => {
        try {
            const response = await api.delete('/upload', {
                data: { fileUrl },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default uploadService;