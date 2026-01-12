import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Chip,
    Paper,
} from '@mui/material';
import { Clock, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import exerciseService from '../../services/exerciseService';
import studentService from '../../services/studentService';
import enrollmentService from '../../services/enrollmentService';
import examSubmissionService from '../../services/examSubmissionService';
import { useAuth } from '../../contexts/Authcontext';


const ExamTaking = () => {
    const { id: examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth()
    // Estados
    const [exercise, setExercise] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    useEffect(() => {
        initializeExam();
    }, [examId]);

    useEffect(() => {
        if (timeLeft <= 0 || !submission) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, submission]);

    const initializeExam = async () => {
        try {
            setLoading(true);

            // Si venimos del estado de navegación (desde ExamsPage)
            if (location.state?.exercise && location.state?.submission) {
                setExercise(location.state.exercise);
                setSubmission(location.state.submission);
                setTimeLeft(location.state.exercise.duration * 60);

                // Inicializar respuestas vacías
                const initialAnswers = {};
                location.state.exercise.questions.forEach((q) => {
                    initialAnswers[q._id] = null;
                });
                setAnswers(initialAnswers);
            } else {
                // Si entramos directamente por URL, necesitamos iniciar el examen
                // Primero obtener el ejercicio
                const exerciseRes = await exerciseService.getExercise(examId);
                const exerciseData = exerciseRes.data;

                // Obtener perfil del estudiante y enrollment
                const studentsRes = await studentService.getStudents({ search: user.email });
                const studentData = studentsRes.data[0];

                // Buscar enrollment en el curso del examen
                const enrollmentsRes = await enrollmentService.getEnrollmentByStudentAndCourse(
                    studentData._id,
                    exerciseData.course._id
                );

                // Iniciar examen
                const startRes = await examSubmissionService.startExam(
                    examId,
                    enrollmentsRes.data._id
                );

                setExercise(startRes.data.exercise);
                setSubmission(startRes.data.submission);
                setTimeLeft(startRes.data.exercise.duration * 60);

                // Inicializar respuestas vacías
                const initialAnswers = {};
                startRes.data.exercise.questions.forEach((q) => {
                    initialAnswers[q._id] = null;
                });
                setAnswers(initialAnswers);
            }
        } catch (err) {
            console.error('Error initializing exam:', err);
            alert('Error al iniciar el examen: ' + (err.response?.data?.message || err.message));
            navigate('/exams');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, optionIndex) => {
        setAnswers({
            ...answers,
            [questionId]: optionIndex,
        });
    };

    const handleSubmit = () => {
        setOpenConfirmDialog(true);
    };

    const handleConfirmSubmit = async () => {
        setOpenConfirmDialog(false);
        await submitExam();
    };

    const handleAutoSubmit = async () => {
        await submitExam();
    };

    const submitExam = async () => {
        try {
            setSubmitting(true);

            // Convertir respuestas al formato esperado
            const formattedAnswers = Object.entries(answers)
                .filter(([_, optionIndex]) => optionIndex !== null)
                .map(([questionId, optionIndex]) => ({
                    questionId,
                    selectedOptionIndex: optionIndex,
                }));

            const response = await examSubmissionService.submitExam(submission._id, formattedAnswers);

            // Navegar a resultados
            navigate(`/exam/${submission._id}/results`, {
                state: { submission: response.data, exercise },
            });
        } catch (err) {
            console.error('Error submitting exam:', err);
            alert('Error al enviar el examen');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getAnsweredCount = () => {
        return Object.values(answers).filter((answer) => answer !== null).length;
    };

    const getProgress = () => {
        if (!exercise) return 0;
        return (getAnsweredCount() / exercise.questions.length) * 100;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress sx={{ color: '#ff5722' }} />
            </Box>
        );
    }

    if (!exercise || !submission) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Alert severity="error">No se pudo cargar el examen</Alert>
            </Container>
        );
    }

    const timeWarning = timeLeft < 300; // 5 minutos

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pb: 8 }}>
            {/* Sticky Header */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    bgcolor: 'white',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Título */}
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {exercise.title}
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                {exercise.course?.name}
                            </Typography>
                        </Box>

                        {/* Timer */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Box sx={{ textAlign: 'right' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Clock size={20} color={timeWarning ? '#f44336' : '#666'} />
                                    <Typography
                                        sx={{
                                            fontSize: '1.25rem',
                                            fontWeight: 700,
                                            color: timeWarning ? '#f44336' : 'text.primary',
                                        }}
                                    >
                                        {formatTime(timeLeft)}
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                    {getAnsweredCount()}/{exercise.questions.length} respondidas
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                startIcon={<Send size={18} />}
                                onClick={handleSubmit}
                                disabled={submitting}
                                sx={{
                                    bgcolor: '#ff5722',
                                    '&:hover': { bgcolor: '#e64a19' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                {submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Enviar Examen'}
                            </Button>
                        </Box>
                    </Box>

                    {/* Progress Bar */}
                    <LinearProgress
                        variant="determinate"
                        value={getProgress()}
                        sx={{
                            height: 4,
                            '& .MuiLinearProgress-bar': { bgcolor: '#ff5722' },
                        }}
                    />
                </Container>
            </Box>

            {/* Content */}
            <Container maxWidth="lg" sx={{ pt: 4 }}>
                {/* Warning si queda poco tiempo */}
                {timeWarning && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AlertCircle size={20} />
                            <Typography sx={{ fontWeight: 600 }}>
                                ¡Quedan menos de 5 minutos! El examen se enviará automáticamente cuando se acabe el tiempo.
                            </Typography>
                        </Box>
                    </Alert>
                )}

                {/* Questions */}
                {exercise.questions.map((question, index) => (
                    <Card key={question._id} sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <CardContent sx={{ p: 4 }}>
                            {/* Question Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: answers[question._id] !== null ? '#4caf500a' : '#f5f5f5',
                                            color: answers[question._id] !== null ? '#4caf50' : 'text.secondary',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {answers[question._id] !== null ? <CheckCircle2 size={20} /> : index + 1}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Pregunta {index + 1}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={`${question.points} ${question.points === 1 ? 'punto' : 'puntos'}`}
                                    size="small"
                                    sx={{ bgcolor: '#ffc1070a', color: '#ffc107', fontWeight: 600 }}
                                />
                            </Box>

                            {/* Question Text */}
                            <Typography sx={{ fontSize: '1.1rem', mb: 3, lineHeight: 1.6 }}>
                                {question.questionText}
                            </Typography>

                            {/* Question Image */}
                            {question.questionImage && (
                                <Box sx={{ mb: 3, textAlign: 'center' }}>
                                    <Box
                                        component="img"
                                        src={question.questionImage}
                                        alt="Pregunta"
                                        sx={{
                                            maxWidth: '100%',
                                            maxHeight: 400,
                                            borderRadius: 2,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                </Box>
                            )}

                            {/* Options */}
                            <RadioGroup
                                value={answers[question._id] ?? ''}
                                onChange={(e) => handleAnswerChange(question._id, parseInt(e.target.value))}
                            >
                                {question.options.map((option, optionIndex) => (
                                    <Paper
                                        key={optionIndex}
                                        sx={{
                                            mb: 1.5,
                                            border: '2px solid',
                                            borderColor:
                                                answers[question._id] === optionIndex ? '#ff5722' : '#e0e0e0',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: '#ff5722',
                                                bgcolor: '#ff57220a',
                                            },
                                        }}
                                    >
                                        <FormControlLabel
                                            value={optionIndex}
                                            control={<Radio sx={{ color: '#ff5722', '&.Mui-checked': { color: '#ff5722' } }} />}
                                            label={
                                                <Typography sx={{ py: 1, fontSize: '1rem' }}>
                                                    {option.text}
                                                </Typography>
                                            }
                                            sx={{
                                                width: '100%',
                                                m: 0,
                                                px: 2,
                                                py: 0.5,
                                            }}
                                        />
                                    </Paper>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                ))}

                {/* Submit Button at Bottom */}
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Send size={20} />}
                        onClick={handleSubmit}
                        disabled={submitting}
                        sx={{
                            bgcolor: '#ff5722',
                            '&:hover': { bgcolor: '#e64a19' },
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 6,
                            py: 1.5,
                        }}
                    >
                        {submitting ? (
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                            'Enviar Examen'
                        )}
                    </Button>
                    <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
                        {getAnsweredCount()} de {exercise.questions.length} preguntas respondidas
                    </Typography>
                </Box>
            </Container>

            {/* Confirm Dialog */}
            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle sx={{ fontWeight: 600 }}>Confirmar Envío</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        ¿Estás seguro de que quieres enviar tu examen?
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Has respondido {getAnsweredCount()} de {exercise.questions.length} preguntas.
                    </Alert>
                    {getAnsweredCount() < exercise.questions.length && (
                        <Alert severity="warning">
                            Aún tienes {exercise.questions.length - getAnsweredCount()} preguntas sin responder.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmSubmit}
                        sx={{
                            bgcolor: '#ff5722',
                            '&:hover': { bgcolor: '#e64a19' },
                            textTransform: 'none',
                        }}
                    >
                        Sí, Enviar Examen
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ExamTaking;