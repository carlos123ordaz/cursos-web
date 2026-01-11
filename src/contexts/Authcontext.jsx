import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar si hay un usuario logueado al cargar la app
    useEffect(() => {
        const checkAuth = async () => {
            // Buscar token en localStorage O sessionStorage
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                try {
                    const response = await authService.getMe();
                    setUser(response.data);
                } catch (error) {
                    console.error('Error verificando autenticación:', error);
                    // Limpiar ambos storages en caso de error
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Login
    const login = async (email, password, rememberMe = false) => {
        try {
            setError(null);
            const response = await authService.login(email, password);

            const { token, user: userData } = response;

            // Guardar token
            if (rememberMe) {
                localStorage.setItem('token', token);
            } else {
                sessionStorage.setItem('token', token);
            }

            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            const errorMessage = error.message || 'Error al iniciar sesión';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Logout
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            setUser(null);
        }
    };

    // Update password
    const updatePassword = async (currentPassword, newPassword) => {
        try {
            setError(null);
            const response = await authService.updatePassword(currentPassword, newPassword);

            // Actualizar token si es necesario
            if (response.token) {
                localStorage.setItem('token', response.token);
            }

            return { success: true, message: response.message };
        } catch (error) {
            const errorMessage = error.message || 'Error al actualizar contraseña';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        updatePassword,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        isTutor: user?.role === 'tutor',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};