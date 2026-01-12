import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    LinearProgress,
    Chip,
    CircularProgress,
    Alert,
    Paper,
    Divider,
} from '@mui/material';
import {
    CheckCircle2,
    XCircle,
    Trophy,
    Clock,
    ArrowLeft,
    AlertCircle,
    Info,
} from 'lucide-react';
import examSubmissionService from '../../services/examSubmissionService';
import exerciseService from '../../services/exerciseService';
import Navbar from '../../components/Navbar';


const ExamResults = () => {
    const { id: submissionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [submission, setSubmission] = useState(null);
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadResults();
    }, [submissionId]);

    const loadResults = async () => {
        try {
            setLoading(true);

            // Si venimos del estado de navegación
            if (location.state?.submission && location.state?.exercise) {
                setSubmission(location.state.submission);
                setExercise(location.state.exercise);
            } else {
                // Cargar desde API
                const submissionRes = await examSubmissionService.getResults(submissionId);
                setSubmission(submissionRes.data);

                const exerciseRes = await exerciseService.getExercise(submissionRes.data.exercise._id);
                setExercise(exerciseRes.data);
            }
        } catch (err) {
            console.error('Error loading results:', err);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return '#4caf50';
        if (percentage >= 60) return '#ff9800';
        return '#f44336';
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getAnswerForQuestion = (questionId) => {
        return submission.answers.find((a) => a.questionId.toString() === questionId.toString());
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                        <CircularProgress sx={{ color: '#ff5722' }} />
                    </Box>
                </Container>
            </>
        );
    }

    if (!submission || !exercise) {
        return (
            <>
                <Navbar />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Alert severity="error">No se pudieron cargar los resultados</Alert>
                </Container>
            </>
        );
    }

    const correctAnswers = submission.answers.filter((a) => a.isCorrect).length;
    const totalQuestions = exercise.questions.length;
    const scoreColor = getScoreColor(submission.percentage);

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowLeft size={18} />}
                        onClick={() => navigate('/exams')}
                        sx={{ mb: 2, textTransform: 'none' }}
                    >
                        Volver a Exámenes
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Resultados del Examen
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{exercise.title}</Typography>
                </Box>

                {/* Result Summary */}
                <Card
                    sx={{
                        mb: 4,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        background: submission.passed
                            ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                            : 'linear-gradient(135deg, #f44336 0%, #e53935 100%)',
                        color: 'white',
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={4} alignItems="center">
                            {/* Icon */}
                            <Grid size={{ xs: 12, md: 2 }} sx={{ textAlign: 'center' }}>
                                {submission.passed ? <Trophy size={80} /> : <AlertCircle size={80} />}
                            </Grid>

                            {/* Score */}
                            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
                                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                                    {submission.percentage}%
                                </Typography>
                                <Typography variant="h6">{submission.passed ? '¡Aprobado!' : 'No Aprobado'}</Typography>
                            </Grid>

                            {/* Stats */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {correctAnswers}/{totalQuestions}
                                            </Typography>
                                            <Typography>Correctas</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {submission.score}
                                            </Typography>
                                            <Typography>Puntos</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {formatTime(submission.timeSpent)}
                                            </Typography>
                                            <Typography>Tiempo</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {exercise.passingScore}%
                                            </Typography>
                                            <Typography>Mínimo</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Performance Chart */}
                <Card sx={{ mb: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Resumen de Respuestas
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Box sx={{ mb: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                            Tu Puntuación
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                            {submission.percentage}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={submission.percentage}
                                        sx={{
                                            height: 12,
                                            borderRadius: 1,
                                            bgcolor: '#f5f5f5',
                                            '& .MuiLinearProgress-bar': { bgcolor: scoreColor },
                                        }}
                                    />
                                </Box>
                                <Box sx={{ mt: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                            Puntuación Mínima
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                            {exercise.passingScore}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={exercise.passingScore}
                                        sx={{
                                            height: 12,
                                            borderRadius: 1,
                                            bgcolor: '#f5f5f5',
                                            '& .MuiLinearProgress-bar': { bgcolor: '#9e9e9e' },
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                                    <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>
                                        Fecha de Envío
                                    </Typography>
                                    <Typography sx={{ fontWeight: 600 }}>
                                        {new Date(submission.submittedAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.875rem' }}>
                                        {new Date(submission.submittedAt).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Question Review */}
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Revisión de Preguntas
                </Typography>

                {exercise.questions.map((question, index) => {
                    const answer = getAnswerForQuestion(question._id);
                    const isCorrect = answer?.isCorrect || false;
                    const selectedOption = answer ? question.options[answer.selectedOptionIndex] : null;
                    const correctOption = question.options.find((opt) => opt.isCorrect);

                    return (
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
                                                bgcolor: isCorrect ? '#4caf500a' : '#f443360a',
                                                color: isCorrect ? '#4caf50' : '#f44336',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Pregunta {index + 1}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`${answer?.pointsEarned || 0}/${question.points} pts`}
                                        size="small"
                                        sx={{
                                            bgcolor: isCorrect ? '#4caf500a' : '#f443360a',
                                            color: isCorrect ? '#4caf50' : '#f44336',
                                            fontWeight: 600,
                                        }}
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
                                                maxHeight: 300,
                                                borderRadius: 2,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                    </Box>
                                )}

                                {/* Options */}
                                <Box>
                                    {question.options.map((option, optionIndex) => {
                                        const isSelected = answer && answer.selectedOptionIndex === optionIndex;
                                        const isCorrectOption = option.isCorrect;

                                        return (
                                            <Paper
                                                key={optionIndex}
                                                sx={{
                                                    mb: 1.5,
                                                    p: 2,
                                                    border: '2px solid',
                                                    borderColor: isCorrectOption
                                                        ? '#4caf50'
                                                        : isSelected
                                                            ? '#f44336'
                                                            : '#e0e0e0',
                                                    bgcolor: isCorrectOption
                                                        ? '#4caf500a'
                                                        : isSelected
                                                            ? '#f443360a'
                                                            : 'transparent',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    {isCorrectOption ? (
                                                        <CheckCircle2 size={20} color="#4caf50" />
                                                    ) : isSelected ? (
                                                        <XCircle size={20} color="#f44336" />
                                                    ) : (
                                                        <Box sx={{ width: 20, height: 20 }} />
                                                    )}
                                                    <Typography sx={{ flex: 1 }}>{option.text}</Typography>
                                                    {isCorrectOption && (
                                                        <Chip label="Correcta" size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                                                    )}
                                                    {isSelected && !isCorrectOption && (
                                                        <Chip label="Tu respuesta" size="small" sx={{ bgcolor: '#f44336', color: 'white' }} />
                                                    )}
                                                </Box>
                                            </Paper>
                                        );
                                    })}
                                </Box>

                                {/* Explanation */}
                                {question.explanation && exercise.showResults && (
                                    <Alert severity="info" sx={{ mt: 3 }} icon={<Info size={20} />}>
                                        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Explicación:</Typography>
                                        <Typography>{question.explanation}</Typography>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}

                {/* Actions */}
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/exams')}
                        sx={{
                            bgcolor: '#ff5722',
                            '&:hover': { bgcolor: '#e64a19' },
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 6,
                        }}
                    >
                        Volver a Exámenes
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default ExamResults;