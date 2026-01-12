import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Container,
    IconButton,
    Tabs,
    Tab,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/Authcontext';

// Services
import courseService from '../../services/courseService';
import lessonService from '../../services/lessonService';
import studentService from '../../services/studentService';
import enrollmentService from '../../services/enrollmentService';
import CourseSidebar from '../../components/user/courses/CourseSidebar';
import CourseExercises from '../../components/user/courses/CourseExercises';
import CourseContent from '../../components/user/courses/CourseContent';



const CoursePlayer = () => {
    const { id: courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Estados principales
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados de UI
    const [activeTab, setActiveTab] = useState(0);
    const [expandedModule, setExpandedModule] = useState(null);

    useEffect(() => {
        loadCourseData();
    }, [courseId, user]);

    const loadCourseData = async () => {
        try {
            setLoading(true);
            setError('');

            // 1. Obtener perfil del estudiante
            const studentsResponse = await studentService.getStudents({
                search: user.email
            });

            if (studentsResponse.data.length === 0) {
                setError('No se encontró el perfil de estudiante');
                setLoading(false);
                return;
            }

            const studentData = studentsResponse.data[0];
            setStudentProfile(studentData);

            // 2. Obtener inscripción del estudiante en este curso
            let enrollmentData;
            try {
                const enrollmentResponse = await enrollmentService.getEnrollmentByStudentAndCourse(
                    studentData._id,
                    courseId
                );
                enrollmentData = enrollmentResponse.data;
                setEnrollment(enrollmentData);
            } catch (err) {
                setError('No estás inscrito en este curso');
                setLoading(false);
                return;
            }

            // 3. Obtener información del curso
            const courseResponse = await courseService.getCourse(courseId);
            setCourse(courseResponse.data);

            // 4. Obtener módulos del curso
            const modulesResponse = await courseService.getCourseModules(courseId);
            const modulesData = modulesResponse.data;

            // 5. Cargar lecciones de cada módulo
            const modulesWithLessons = await Promise.all(
                modulesData.map(async (module) => {
                    try {
                        const lessonsResponse = await lessonService.getLessons({
                            moduleId: module._id
                        });
                        return {
                            ...module,
                            lessons: lessonsResponse.data.sort((a, b) => a.order - b.order),
                        };
                    } catch (err) {
                        console.error(`Error loading lessons for module ${module._id}:`, err);
                        return {
                            ...module,
                            lessons: [],
                        };
                    }
                })
            );

            setModules(modulesWithLessons);

            // 6. Determinar la lección actual
            let initialLesson;
            if (enrollmentData.lastAccessedLesson) {
                // Buscar la última lección accedida
                for (const module of modulesWithLessons) {
                    const lesson = module.lessons.find(
                        l => l._id === enrollmentData.lastAccessedLesson
                    );
                    if (lesson) {
                        initialLesson = lesson;
                        setExpandedModule(module._id);
                        break;
                    }
                }
            }

            // Si no hay última lección, usar la primera lección del primer módulo
            if (!initialLesson && modulesWithLessons.length > 0 && modulesWithLessons[0].lessons.length > 0) {
                initialLesson = modulesWithLessons[0].lessons[0];
                setExpandedModule(modulesWithLessons[0]._id);
            }

            if (initialLesson) {
                setCurrentLesson(initialLesson);
            }

        } catch (err) {
            console.error('Error loading course data:', err);
            setError('Error al cargar el curso');
        } finally {
            setLoading(false);
        }
    };

    const handleLessonClick = async (lesson) => {
        setCurrentLesson(lesson);

        // Actualizar la última lección accedida en el enrollment
        try {
            await enrollmentService.updateEnrollment(enrollment._id, {
                lastAccessedLesson: lesson._id,
                lastAccessDate: new Date(),
            });
        } catch (err) {
            console.error('Error updating last accessed lesson:', err);
        }
    };

    const handleCompleteLesson = async () => {
        if (!currentLesson || !enrollment) return;

        try {
            await enrollmentService.completeLesson(
                enrollment._id,
                currentLesson._id,
                currentLesson.duration || 0
            );

            // Recargar enrollment para actualizar progreso
            const updatedEnrollment = await enrollmentService.getEnrollment(enrollment._id);
            setEnrollment(updatedEnrollment.data);

            // Marcar la lección como completada en el estado local
            const updatedModules = modules.map(module => ({
                ...module,
                lessons: module.lessons.map(lesson =>
                    lesson._id === currentLesson._id
                        ? { ...lesson, completed: true }
                        : lesson
                ),
            }));
            setModules(updatedModules);

        } catch (err) {
            console.error('Error completing lesson:', err);
        }
    };

    const isLessonCompleted = (lessonId) => {
        if (!enrollment || !enrollment.completedLessons) return false;
        return enrollment.completedLessons.some(cl => cl.lesson._id === lessonId);
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    // Loading State
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress sx={{ color: '#00acc1' }} />
            </Box>
        );
    }

    // Error State
    if (error || !course) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || 'No se pudo cargar el curso'}
                </Alert>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        ¿Necesitas ayuda?
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                        Contacta con tu administrador o intenta acceder desde "Mis Cursos"
                    </Typography>
                    <Box>
                        <IconButton onClick={() => navigate('/')} sx={{ color: '#00acc1' }}>
                            <ArrowLeft size={20} />
                        </IconButton>
                        <Typography
                            component="span"
                            onClick={() => navigate('/')}
                            sx={{
                                ml: 1,
                                cursor: 'pointer',
                                color: '#00acc1',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Volver a Mis Cursos
                        </Typography>
                    </Box>
                </Box>
            </Container>
        );
    }

    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = enrollment?.completedLessons?.length || 0;
    const progressPercentage = enrollment?.progress || 0;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pb: 4 }}>
            <Container maxWidth="xl" sx={{ pt: 3 }}>
                {/* Course Header */}
                <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 3, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <IconButton
                                    onClick={() => navigate('/')}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    <ArrowLeft size={20} />
                                </IconButton>
                                <Chip
                                    label={course.category?.toUpperCase() || 'CURSO'}
                                    size="small"
                                    sx={{ bgcolor: '#ff57220a', color: '#ff5722', fontWeight: 600 }}
                                />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                {course.name}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                                {course.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                        Prof. {course.tutor?.user?.firstName} {course.tutor?.user?.lastName}
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>•</Typography>
                                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                    {totalLessons} lecciones
                                </Typography>
                                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>•</Typography>
                                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                    {formatDuration(course.duration)} total
                                </Typography>
                                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>•</Typography>
                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#00acc1' }}>
                                    {progressPercentage}% completado
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ bgcolor: 'white', borderRadius: 2, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        sx={{
                            px: 2,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '1rem',
                                minWidth: 120
                            }
                        }}
                    >
                        <Tab label="Contenido del Curso" value={0} />
                        <Tab label="Ejercicios" value={1} />
                    </Tabs>
                </Box>

                {/* Main Content */}
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    {/* Left Side - Dynamic Content */}
                    <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                        {activeTab === 0 ? (
                            <CourseContent
                                currentLesson={currentLesson}
                                isLessonCompleted={isLessonCompleted}
                                handleCompleteLesson={handleCompleteLesson}
                                formatDuration={formatDuration}
                            />
                        ) : (
                            <CourseExercises
                                currentLesson={currentLesson}
                                enrollment={enrollment}
                            />
                        )}
                    </Box>

                    {/* Right Sidebar - Course Content */}
                    <Box sx={{ flexShrink: 0, width: 380 }}>
                        <CourseSidebar
                            modules={modules}
                            completedLessons={completedLessons}
                            totalLessons={totalLessons}
                            expandedModule={expandedModule}
                            setExpandedModule={setExpandedModule}
                            isLessonCompleted={isLessonCompleted}
                            currentLesson={currentLesson}
                            handleLessonClick={handleLessonClick}
                            formatDuration={formatDuration}
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CoursePlayer;