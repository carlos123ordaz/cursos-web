import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/Authcontext';

const PublicRoute = ({ children }) => {
    const { user, loading, isAuthenticated } = useAuth();

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

    // Si ya está autenticado, redirigir según el rol
    if (isAuthenticated && user) {
        switch (user.role) {
            case 'admin':
                return <Navigate to="/admin" replace />;
            case 'tutor':
                return <Navigate to="/tutor" replace />;
            case 'student':
            default:
                return <Navigate to="/" replace />;
        }
    }

    // Si no está autenticado, mostrar la página pública (login)
    return children;
};

export default PublicRoute;