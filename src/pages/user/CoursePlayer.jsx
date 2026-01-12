import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Container,
    IconButton,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Check,
    Clock,
    FileText,
    Download,
    PlayCircle,
    ChevronDown,
    ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/Authcontext';
import BunnyVideoPlayer from '../../components/user/BunnyVideoPlayer';
import courseService from '../../services/courseService';
import moduleService from '../../services/moduleService';
import lessonService from '../../services/lessonService';
import studentService from '../../services/studentService';
import enrollmentService from '../../services/enrollmentService';

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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress sx={{ color: '#00acc1' }} />
            </Box>
        );
    }

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
                    </Tabs>
                </Box>

                {/* Main Content */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Left Side - Video Player */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            {currentLesson ? (
                                <>
                                    {/* Video Player */}
                                    <Box sx={{ position: 'relative', bgcolor: '#000', aspectRatio: '16/9' }}>
                                        {currentLesson.videoId ? (
                                            <BunnyVideoPlayer
                                                videoId={currentLesson.videoId}
                                                libraryId="578582"
                                                title={currentLesson.title}
                                                responsive={true}
                                                preload={true}
                                            />
                                        ) : (
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%',
                                                color: 'white'
                                            }}>
                                                <Typography>No hay video disponible para esta lección</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <Box sx={{ p: 3, bgcolor: 'white' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                            {currentLesson.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                            <Chip
                                                icon={<Clock size={14} />}
                                                label={formatDuration(currentLesson.duration)}
                                                size="small"
                                                sx={{ bgcolor: '#f5f5f5' }}
                                            />
                                            {isLessonCompleted(currentLesson._id) && (
                                                <Chip
                                                    icon={<Check size={14} />}
                                                    label="Completada"
                                                    size="small"
                                                    sx={{ bgcolor: '#4caf500a', color: '#4caf50' }}
                                                />
                                            )}
                                            {currentLesson.published ? (
                                                <Chip
                                                    label="Publicado"
                                                    size="small"
                                                    sx={{ bgcolor: '#4caf500a', color: '#4caf50' }}
                                                />
                                            ) : (
                                                <Chip
                                                    label="Borrador"
                                                    size="small"
                                                    sx={{ bgcolor: '#9e9e9e0a', color: '#9e9e9e' }}
                                                />
                                            )}
                                        </Box>
                                        <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 2 }}>
                                            {currentLesson.description || 'No hay descripción disponible para esta lección.'}
                                        </Typography>
                                        {!isLessonCompleted(currentLesson._id) && (
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Chip
                                                    icon={<Check size={16} />}
                                                    label="Marcar como completada"
                                                    onClick={handleCompleteLesson}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        bgcolor: '#00acc1',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        '&:hover': { bgcolor: '#00838f' }
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ p: 8, textAlign: 'center' }}>
                                    <PlayCircle size={64} color="#ccc" style={{ margin: '0 auto 16px' }} />
                                    <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                                        Selecciona una lección para comenzar
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        {/* Course Resources */}
                        {currentLesson?.resources && currentLesson.resources.length > 0 && (
                            <Paper sx={{ borderRadius: 2, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Materiales de la lección
                                </Typography>
                                <List sx={{ bgcolor: '#f8f9fa', borderRadius: 1 }}>
                                    {currentLesson.resources.map((resource, index) => (
                                        <ListItem
                                            key={resource._id || index}
                                            sx={{
                                                borderBottom: index < currentLesson.resources.length - 1 ? '1px solid #e0e0e0' : 'none',
                                                '&:hover': { bgcolor: '#f0f0f0' }
                                            }}
                                        >
                                            <FileText size={20} color="#666" style={{ marginRight: 16 }} />
                                            <ListItemText
                                                primary={resource.name || resource.title}
                                                secondary={resource.type || 'Archivo'}
                                                primaryTypographyProps={{ fontWeight: 500 }}
                                            />
                                            <IconButton
                                                size="small"
                                                component="a"
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Download size={18} />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}
                    </Box>

                    {/* Right Sidebar - Course Content */}
                    <Box sx={{ width: 400 }}>
                        <Paper sx={{
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            maxHeight: 'calc(100vh - 200px)',
                            overflowY: 'auto'
                        }}>
                            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f8f9fa', position: 'sticky', top: 0, zIndex: 1 }}>
                                <Typography sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'text.secondary',
                                    textTransform: 'uppercase'
                                }}>
                                    Contenido del Curso
                                </Typography>
                                <Typography sx={{ fontSize: '0.875rem', mt: 0.5 }}>
                                    {completedLessons} de {totalLessons} lecciones completadas
                                </Typography>
                            </Box>
                            {modules.map((module) => (
                                <Accordion
                                    key={module._id}
                                    expanded={expandedModule === module._id}
                                    onChange={() => setExpandedModule(expandedModule === module._id ? null : module._id)}
                                    sx={{
                                        boxShadow: 'none',
                                        '&:before': { display: 'none' },
                                        borderBottom: '1px solid #e0e0e0'
                                    }}
                                >
                                    <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                                                {module.title}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                                {module.lessons.length} lecciones • {module.lessons.filter(l => isLessonCompleted(l._id)).length} completadas
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 0 }}>
                                        <List sx={{ py: 0 }}>
                                            {module.lessons.map((lesson) => {
                                                const isCompleted = isLessonCompleted(lesson._id);
                                                const isCurrent = currentLesson?._id === lesson._id;

                                                return (
                                                    <ListItem
                                                        key={lesson._id}
                                                        button
                                                        onClick={() => handleLessonClick(lesson)}
                                                        sx={{
                                                            py: 1.5,
                                                            px: 3,
                                                            bgcolor: isCurrent ? '#ff57220a' : 'transparent',
                                                            borderLeft: isCurrent ? '3px solid #ff5722' : '3px solid transparent',
                                                            '&:hover': { bgcolor: isCurrent ? '#ff57220a' : '#f5f5f5' }
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                                            <Box sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: '50%',
                                                                bgcolor: isCurrent ? '#ff5722' : isCompleted ? '#4caf50' : '#f5f5f5',
                                                                color: isCurrent || isCompleted ? 'white' : 'text.secondary',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0
                                                            }}>
                                                                {isCompleted ? <Check size={16} /> : <PlayCircle size={16} />}
                                                            </Box>
                                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                <Typography sx={{
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: isCurrent ? 600 : 400,
                                                                    mb: 0.5,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                }}>
                                                                    {lesson.title}
                                                                </Typography>
                                                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                                                    <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                                    {formatDuration(lesson.duration)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CoursePlayer;