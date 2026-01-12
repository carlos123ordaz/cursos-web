import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Box,
    Container,
    Card,
    CardMedia,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
    LinearProgress,
} from '@mui/material';
import {
    ChevronDown,
    ArrowRight,
    BookOpen,
    Clock,
} from 'lucide-react';
import { useAuth } from '../../contexts/Authcontext';
import studentService from '../../services/studentService';

const CoursesPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            loadStudentCourses();
        }
    }, [user]);

    const loadStudentCourses = async () => {
        try {
            setLoading(true);
            setError('');

            // Primero obtener el perfil del estudiante
            const studentsResponse = await studentService.getStudents({
                search: user.email
            });

            if (studentsResponse.data.length === 0) {
                setError('No se encontró el perfil de estudiante');
                setLoading(false);
                return;
            }

            const studentProfile = studentsResponse.data[0];

            // Obtener los cursos inscritos
            const coursesResponse = await studentService.getStudentCourses(studentProfile._id);

            setEnrollments(coursesResponse.data);
        } catch (err) {
            console.error('Error loading courses:', err);
            setError('Error al cargar los cursos');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress sx={{ color: '#00acc1' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
            {/* Breadcrumb / Navigation */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                borderBottom: '3px solid #1a1a1a',
                                pb: 2,
                                mb: -2,
                            }}
                        >
                            Mis cursos
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                            Mis cursos
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                            Tienes {enrollments.length} {enrollments.length === 1 ? 'curso inscrito' : 'cursos inscritos'}
                        </Typography>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Course Cards */}
                {enrollments.length === 0 ? (
                    <Card sx={{ p: 8, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <BookOpen size={64} color="#ccc" style={{ margin: '0 auto 16px' }} />
                        <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                            No tienes cursos inscritos
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                            Contacta con tu administrador para que te inscriba en los cursos disponibles
                        </Typography>
                    </Card>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {enrollments.map((enrollment) => (
                            <Card
                                key={enrollment._id}
                                sx={{
                                    display: 'flex',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                    },
                                }}
                            >
                                <Box sx={{ position: 'relative', width: 280, flexShrink: 0 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        image={enrollment.course.thumbnail || 'https://via.placeholder.com/280x200?text=Curso'}
                                        alt={enrollment.course.name}
                                    />
                                    <Chip
                                        label={enrollment.course.category || 'Curso'}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            left: 12,
                                            bgcolor: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            fontSize: '0.65rem',
                                            fontWeight: 600,
                                            height: 24,
                                        }}
                                    />
                                </Box>

                                <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <Chip
                                            label={`${enrollment.progress}% COMPLETADO`}
                                            size="small"
                                            sx={{
                                                bgcolor: enrollment.progress === 100 ? '#4caf50' : '#1976d2',
                                                color: 'white',
                                                fontSize: '0.65rem',
                                                fontWeight: 700,
                                                height: 22,
                                            }}
                                        />
                                        {enrollment.status === 'Completado' && (
                                            <Chip
                                                label="COMPLETADO"
                                                size="small"
                                                sx={{
                                                    bgcolor: '#4caf50',
                                                    color: 'white',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                    height: 22,
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 600, mb: 1, fontSize: '1.25rem' }}
                                    >
                                        {enrollment.course.name}
                                    </Typography>

                                    <Typography sx={{ color: 'text.secondary', mb: 2, fontSize: '0.875rem' }}>
                                        {enrollment.course.description || 'Aprende con los mejores instructores'}
                                    </Typography>

                                    {/* Progress Bar */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                Progreso del curso
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                {enrollment.progress}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={enrollment.progress}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: '#e0e0e0',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: enrollment.progress === 100 ? '#4caf50' : '#00acc1',
                                                    borderRadius: 4,
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Chip
                                            icon={<BookOpen size={14} />}
                                            label={`${enrollment.completedLessons?.length || 0}/${enrollment.course.totalLessons || 0} lecciones`}
                                            size="small"
                                            sx={{ bgcolor: '#f5f5f5' }}
                                        />
                                        <Chip
                                            icon={<Clock size={14} />}
                                            label={`Última vez: ${new Date(enrollment.lastAccessDate).toLocaleDateString('es-ES')}`}
                                            size="small"
                                            sx={{ bgcolor: '#f5f5f5' }}
                                        />
                                    </Box>

                                    <Box sx={{ mt: 'auto', display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Button
                                            onClick={() => navigate(`/course/${enrollment.course._id}`)}
                                            variant="contained"
                                            endIcon={<ArrowRight size={18} />}
                                            sx={{
                                                bgcolor: '#00acc1',
                                                '&:hover': { bgcolor: '#00838f' },
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderRadius: 1,
                                                px: 3,
                                            }}
                                        >
                                            {enrollment.progress === 0 ? 'Comenzar' : 'Continuar'}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default CoursesPage;