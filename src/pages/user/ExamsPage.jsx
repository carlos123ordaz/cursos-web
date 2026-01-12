import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    LinearProgress,
} from '@mui/material';
import {
    Calendar,
    Clock,
    FileText,
    CheckCircle2,
    AlertCircle,
    PlayCircle,
    Trophy,
} from 'lucide-react';
import examSubmissionService from '../../services/examSubmissionService';
import Navbar from '../../components/Navbar';
import exerciseService from '../../services/exerciseService';


const ExamsPage = () => {
    const navigate = useNavigate();

    // Estados
    const [availableExams, setAvailableExams] = useState([]);
    const [examHistory, setExamHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [eligibility, setEligibility] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [examsRes, historyRes] = await Promise.all([
                exerciseService.getAvailableExams(),
                examSubmissionService.getStudentHistory(),
            ]);

            setAvailableExams(examsRes.data);
            setExamHistory(historyRes.data);

            // Verificar elegibilidad para cada examen
            const eligibilityData = {};
            for (const exam of examsRes.data) {
                try {
                    const response = await examSubmissionService.checkEligibility(exam._id);
                    eligibilityData[exam._id] = response.data;
                } catch (err) {
                    console.error('Error checking eligibility:', err);
                }
            }
            setEligibility(eligibilityData);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = async (exam) => {
        // Verificar elegibilidad primero
        const eligible = eligibility[exam._id];
        if (!eligible?.canTake) {
            alert(eligible?.reason || 'No puedes tomar este examen en este momento');
            return;
        }

        // Navegar a la página de tomar examen
        navigate(`/exam/${exam._id}/take`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificado';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getExamStatus = (exam) => {
        const now = new Date();
        const startTime = exam.startTime ? new Date(exam.startTime) : null;
        const endTime = exam.endTime ? new Date(exam.endTime) : null;

        if (startTime && now < startTime) {
            return { status: 'upcoming', label: 'Próximo', color: '#ff9800' };
        }
        if (endTime && now > endTime) {
            return { status: 'ended', label: 'Finalizado', color: '#9e9e9e' };
        }
        return { status: 'active', label: 'Disponible', color: '#4caf50' };
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return '#4caf50';
        if (percentage >= 60) return '#ff9800';
        return '#f44336';
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                        <CircularProgress sx={{ color: '#ff5722' }} />
                    </Box>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Mis Exámenes
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        Visualiza y realiza los exámenes programados
                    </Typography>
                </Box>

                {/* Tabs */}
                <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            px: 2,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '1rem',
                            },
                        }}
                    >
                        <Tab label="Exámenes Disponibles" />
                        <Tab label="Mi Historial" />
                    </Tabs>
                </Card>

                {/* Tab Content */}
                {activeTab === 0 ? (
                    // Exámenes Disponibles
                    <Box>
                        {availableExams.length === 0 ? (
                            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                <CardContent sx={{ py: 8, textAlign: 'center' }}>
                                    <FileText size={64} color="#ccc" style={{ margin: '0 auto 16px' }} />
                                    <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                                        No hay exámenes disponibles
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>
                                        No tienes exámenes programados en este momento
                                    </Typography>
                                </CardContent>
                            </Card>
                        ) : (
                            <Grid container spacing={3}>
                                {availableExams.map((exam) => {
                                    const status = getExamStatus(exam);
                                    const eligible = eligibility[exam._id];
                                    const canTake = eligible?.canTake;

                                    return (
                                        <Grid key={exam._id} size={{ xs: 12, md: 6, lg: 4 }}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                    {/* Status Badge */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Chip
                                                            label={status.label}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: `${status.color}0a`,
                                                                color: status.color,
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                        {eligible?.previousAttempts > 0 && (
                                                            <Chip
                                                                label={`${eligible.previousAttempts} ${eligible.previousAttempts === 1 ? 'intento' : 'intentos'
                                                                    }`}
                                                                size="small"
                                                                sx={{ bgcolor: '#f5f5f5' }}
                                                            />
                                                        )}
                                                    </Box>

                                                    {/* Title & Course */}
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                        {exam.title}
                                                    </Typography>
                                                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 2 }}>
                                                        {exam.course?.name}
                                                    </Typography>

                                                    {/* Description */}
                                                    {exam.description && (
                                                        <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 2 }}>
                                                            {exam.description}
                                                        </Typography>
                                                    )}

                                                    {/* Info */}
                                                    <Box sx={{ flex: 1, mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <Calendar size={16} color="#666" />
                                                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                                                Inicio: {formatDate(exam.startTime)}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <Clock size={16} color="#666" />
                                                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                                                Duración: {exam.duration} minutos
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <FileText size={16} color="#666" />
                                                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                                                {exam.questions?.length || 0} preguntas
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Previous Score */}
                                                    {eligible?.latestScore !== null && (
                                                        <Alert
                                                            severity={eligible.latestScore >= exam.passingScore ? 'success' : 'warning'}
                                                            sx={{ mb: 2 }}
                                                        >
                                                            Último intento: {eligible.latestScore}%
                                                        </Alert>
                                                    )}

                                                    {/* Warning if can't take */}
                                                    {!canTake && eligible?.reason && (
                                                        <Alert severity="info" sx={{ mb: 2 }}>
                                                            {eligible.reason}
                                                        </Alert>
                                                    )}

                                                    {/* Action Button */}
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        startIcon={<PlayCircle size={18} />}
                                                        onClick={() => handleStartExam(exam)}
                                                        disabled={!canTake || status.status === 'ended'}
                                                        sx={{
                                                            bgcolor: '#ff5722',
                                                            '&:hover': { bgcolor: '#e64a19' },
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {status.status === 'upcoming'
                                                            ? 'Próximamente'
                                                            : status.status === 'ended'
                                                                ? 'Finalizado'
                                                                : canTake
                                                                    ? 'Comenzar Examen'
                                                                    : 'No Disponible'}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )}
                    </Box>
                ) : (
                    // Historial
                    <Box>
                        {examHistory.length === 0 ? (
                            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                <CardContent sx={{ py: 8, textAlign: 'center' }}>
                                    <Trophy size={64} color="#ccc" style={{ margin: '0 auto 16px' }} />
                                    <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                                        No tienes historial aún
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>
                                        Tus exámenes completados aparecerán aquí
                                    </Typography>
                                </CardContent>
                            </Card>
                        ) : (
                            <Grid container spacing={3}>
                                {examHistory.map((submission) => (
                                    <Grid key={submission._id} size={{ xs: 12, md: 6 }}>
                                        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                            <CardContent>
                                                {/* Header */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                            {submission.exercise?.title}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                                            {submission.exercise?.course?.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Chip
                                                            icon={submission.passed ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                                            label={submission.passed ? 'Aprobado' : 'Reprobado'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: submission.passed ? '#4caf500a' : '#f443360a',
                                                                color: submission.passed ? '#4caf50' : '#f44336',
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>

                                                {/* Score Display */}
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                                            Calificación
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                                            {submission.score}/{submission.totalPoints} puntos ({submission.percentage}%)
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={submission.percentage}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 1,
                                                            bgcolor: '#f5f5f5',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: getScoreColor(submission.percentage),
                                                            },
                                                        }}
                                                    />
                                                </Box>

                                                {/* Stats */}
                                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                                                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff5722' }}>
                                                                {submission.percentage}%
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                                                Porcentaje
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                                                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#00acc1' }}>
                                                                {Math.floor(submission.timeSpent / 60)}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                                                Minutos
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                {/* Date & Attempt */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                                        {new Date(submission.submittedAt).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        onClick={() => navigate(`/exam/${submission._id}/results`)}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Ver Detalles
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                )}
            </Container>
        </>
    );
};

export default ExamsPage;