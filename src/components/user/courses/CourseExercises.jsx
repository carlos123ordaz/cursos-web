import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Paper,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    LinearProgress,
} from '@mui/material';
import {
    BookOpen,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
} from 'lucide-react';

const CourseExercises = ({ currentLesson, enrollment }) => {
    const [exercises, setExercises] = useState([]);
    const [completedExercises, setCompletedExercises] = useState([]);

    useEffect(() => {
        if (currentLesson) {
            // Cargar ejercicios cuando cambia la lección
            loadExercises();
        }
    }, [currentLesson]);

    const loadExercises = async () => {
        // TODO: Reemplaza esto con tu llamada API real
        // Ejemplo: const response = await exerciseService.getExercisesByLesson(currentLesson._id);
        // setExercises(response.data);

        // Simulación de ejercicios vinculados a la lección actual
        const mockExercises = [
            {
                id: `${currentLesson._id}-1`,
                lessonId: currentLesson._id,
                title: `Quiz: ${currentLesson.title}`,
                description: 'Evalúa tu comprensión de los conceptos clave de esta lección',
                type: 'quiz',
                status: 'available',
                points: 10,
                duration: 15 // minutos
            },
            {
                id: `${currentLesson._id}-2`,
                lessonId: currentLesson._id,
                title: 'Práctica: Ejercicio aplicado',
                description: 'Aplica lo aprendido en un ejercicio práctico',
                type: 'practice',
                status: 'available',
                points: 15,
                duration: 30
            },
        ];

        setExercises(mockExercises);

        // TODO: Cargar ejercicios completados del enrollment
        // const completed = enrollment?.completedExercises?.filter(e => e.lessonId === currentLesson._id) || [];
        // setCompletedExercises(completed);

        // Por ahora simulamos ejercicios completados vacíos
        setCompletedExercises([]);
    };

    const calculateProgress = () => {
        if (exercises.length === 0) return 0;
        return (completedExercises.length / exercises.length) * 100;
    };

    const getExerciseStatus = (exercise) => {
        if (completedExercises.some(ce => ce.id === exercise.id)) {
            return 'completed';
        }
        return exercise.status;
    };

    const handleStartExercise = (exercise) => {
        // TODO: Implementa la navegación o modal para realizar el ejercicio
        console.log('Starting exercise:', exercise);

        // Opciones de implementación:
        // 1. Navegar a una página de ejercicio:
        //    navigate(`/exercise/${exercise.id}`);

        // 2. Abrir modal con el ejercicio:
        //    setSelectedExercise(exercise);
        //    setExerciseModalOpen(true);

        // 3. Abrir en nueva pestaña:
        //    window.open(`/exercise/${exercise.id}`, '_blank');
    };

    return (
        <Box sx={{ flex: 1 }}>
            <Paper sx={{ borderRadius: 2, p: 4, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <BookOpen size={28} color="#ff5722" />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Ejercicios de la Lección
                    </Typography>
                </Box>

                {currentLesson ? (
                    <>
                        <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                            Completa los ejercicios para reforzar tu aprendizaje de: <strong>{currentLesson.title}</strong>
                        </Typography>

                        {exercises.length > 0 ? (
                            <>
                                {/* Progreso de ejercicios */}
                                <Box sx={{ mb: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                            Progreso de ejercicios
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                            {completedExercises.length}/{exercises.length} completados
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={calculateProgress()}
                                        sx={{
                                            height: 8,
                                            borderRadius: 1,
                                            bgcolor: '#f5f5f5',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: '#4caf50'
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Lista de ejercicios */}
                                <List sx={{ bgcolor: '#fafafa', borderRadius: 2, mb: 3 }}>
                                    {exercises.map((exercise, index) => {
                                        const status = getExerciseStatus(exercise);
                                        const isCompleted = status === 'completed';
                                        const isLocked = status === 'locked';

                                        return (
                                            <ListItem
                                                key={exercise.id}
                                                sx={{
                                                    borderBottom: index < exercises.length - 1 ? '1px solid #e0e0e0' : 'none',
                                                    py: 2,
                                                    '&:hover': { bgcolor: isLocked ? '#fafafa' : '#f5f5f5' },
                                                    cursor: isLocked ? 'default' : 'pointer'
                                                }}
                                            >
                                                <Box sx={{
                                                    mr: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    bgcolor: isCompleted ? '#4caf500a' :
                                                        isLocked ? '#9e9e9e0a' : '#ff57220a'
                                                }}>
                                                    {isCompleted ? (
                                                        <CheckCircle2 size={20} color="#4caf50" />
                                                    ) : isLocked ? (
                                                        <Clock size={20} color="#9e9e9e" />
                                                    ) : (
                                                        <AlertCircle size={20} color="#ff5722" />
                                                    )}
                                                </Box>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                            <Typography sx={{ fontWeight: 500 }}>
                                                                {exercise.title}
                                                            </Typography>
                                                            {exercise.type === 'quiz' && (
                                                                <Chip
                                                                    label="Quiz"
                                                                    size="small"
                                                                    sx={{ bgcolor: '#2196f30a', color: '#2196f3', height: 20, fontSize: '0.75rem' }}
                                                                />
                                                            )}
                                                            {exercise.type === 'practice' && (
                                                                <Chip
                                                                    label="Práctica"
                                                                    size="small"
                                                                    sx={{ bgcolor: '#9c27b00a', color: '#9c27b0', height: 20, fontSize: '0.75rem' }}
                                                                />
                                                            )}
                                                            {exercise.type === 'challenge' && (
                                                                <Chip
                                                                    label="Desafío"
                                                                    size="small"
                                                                    sx={{ bgcolor: '#ff57220a', color: '#ff5722', height: 20, fontSize: '0.75rem' }}
                                                                />
                                                            )}
                                                            {exercise.points && (
                                                                <Chip
                                                                    label={`${exercise.points} pts`}
                                                                    size="small"
                                                                    sx={{ bgcolor: '#ffc1070a', color: '#ffc107', height: 20, fontSize: '0.75rem' }}
                                                                />
                                                            )}
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 0.5 }}>
                                                                {exercise.description}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                                {exercise.duration && (
                                                                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                        <Clock size={12} />
                                                                        {exercise.duration} min
                                                                    </Typography>
                                                                )}
                                                                {isCompleted && (
                                                                    <Chip
                                                                        icon={<CheckCircle2 size={12} />}
                                                                        label="Completado"
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: '#4caf500a',
                                                                            color: '#4caf50',
                                                                            height: 18,
                                                                            fontSize: '0.7rem'
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    }
                                                />
                                                <Button
                                                    variant={isCompleted ? 'outlined' : 'contained'}
                                                    disabled={isLocked}
                                                    onClick={() => handleStartExercise(exercise)}
                                                    sx={{
                                                        bgcolor: isCompleted ? 'transparent' : '#ff5722',
                                                        color: isCompleted ? '#ff5722' : 'white',
                                                        borderColor: '#ff5722',
                                                        textTransform: 'none',
                                                        '&:hover': {
                                                            bgcolor: isCompleted ? '#ff57220a' : '#e64a19',
                                                        },
                                                        '&.Mui-disabled': {
                                                            bgcolor: '#f5f5f5',
                                                            color: '#9e9e9e',
                                                            borderColor: '#e0e0e0'
                                                        }
                                                    }}
                                                >
                                                    {isCompleted ? 'Revisar' :
                                                        isLocked ? 'Bloqueado' : 'Comenzar'}
                                                </Button>
                                            </ListItem>
                                        );
                                    })}
                                </List>

                                {/* Tip informativo */}
                                <Paper sx={{ bgcolor: '#e3f2fd', p: 3, borderRadius: 2, border: '1px solid #90caf9' }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <AlertCircle size={24} color="#2196f3" style={{ flexShrink: 0 }} />
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, mb: 1 }}>
                                                💡 Tip de aprendizaje
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                                Completar los ejercicios te ayudará a retener mejor el conocimiento.
                                                Intenta realizarlos sin volver a ver el video para poner a prueba tu comprensión.
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </>
                        ) : (
                            // Estado cuando no hay ejercicios
                            <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <FileText size={48} color="#ccc" style={{ margin: '0 auto 16px' }} />
                                <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                                    No hay ejercicios disponibles
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                    Esta lección no tiene ejercicios asignados aún
                                </Typography>
                            </Box>
                        )}
                    </>
                ) : (
                    // Estado cuando no hay lección seleccionada
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <BookOpen size={64} color="#ccc" style={{ margin: '0 auto 16px' }} />
                        <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                            Selecciona una lección
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                            Los ejercicios aparecerán cuando selecciones una lección del sidebar
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default CourseExercises;