import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/Authcontext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si se requiere un rol específico, verificar
    if (requiredRole && user.role !== requiredRole) {
        // Redirigir según el rol del usuario
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        } else if (user.role === 'student') {
            return <Navigate to="/" replace />;
        } else if (user.role === 'tutor') {
            return <Navigate to="/tutor" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;