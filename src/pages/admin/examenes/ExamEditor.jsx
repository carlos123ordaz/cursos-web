import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Card, CardContent, Typography, TextField, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem,
    List, ListItem, Divider, Chip, CircularProgress, Alert, Snackbar,
    FormControlLabel, Switch, Paper,
} from '@mui/material';
import {
    ArrowLeft, Save, Plus, Edit, Trash2, Image as ImageIcon,
    Check, X, GripVertical, Calendar, Clock,
} from 'lucide-react';
import exerciseService from '../../../services/exerciseService';

const ExamEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados principales
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Diálogos
    const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form de pregunta
    const [questionForm, setQuestionForm] = useState({
        questionText: '',
        questionImage: null,
        options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
        ],
        points: 1,
        explanation: '',
    });

    useEffect(() => {
        loadExercise();
    }, [id]);

    const loadExercise = async () => {
        try {
            setLoading(true);
            const response = await exerciseService.getExercise(id);
            setExercise(response.data);
        } catch (err) {
            console.error('Error loading exercise:', err);
            showSnackbar('Error al cargar el examen', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveExerciseInfo = async () => {
        try {
            setSaving(true);
            await exerciseService.updateExercise(id, {
                title: exercise.title,
                description: exercise.description,
                type: exercise.type,
                duration: exercise.duration,
                scheduledDate: exercise.scheduledDate,
                startTime: exercise.startTime,
                endTime: exercise.endTime,
                passingScore: exercise.passingScore,
                allowRetake: exercise.allowRetake,
                showResults: exercise.showResults,
                shuffleQuestions: exercise.shuffleQuestions,
                shuffleOptions: exercise.shuffleOptions,
                status: exercise.status,
            });
            showSnackbar('Información guardada exitosamente', 'success');
            loadExercise();
        } catch (err) {
            showSnackbar('Error al guardar', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleOpenQuestionDialog = (question = null) => {
        if (question) {
            setEditingQuestion(question);
            setQuestionForm({
                questionText: question.questionText,
                questionImage: question.questionImage,
                options: question.options.length > 0 ? question.options : [
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                ],
                points: question.points || 1,
                explanation: question.explanation || '',
            });
        } else {
            setEditingQuestion(null);
            setQuestionForm({
                questionText: '',
                questionImage: null,
                options: [
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                ],
                points: 1,
                explanation: '',
            });
        }
        setOpenQuestionDialog(true);
    };

    const handleSaveQuestion = async () => {
        // Validaciones
        if (!questionForm.questionText.trim()) {
            showSnackbar('La pregunta no puede estar vacía', 'error');
            return;
        }

        const filledOptions = questionForm.options.filter(opt => opt.text.trim());
        if (filledOptions.length < 2) {
            showSnackbar('Debe haber al menos 2 opciones', 'error');
            return;
        }

        const correctOptions = questionForm.options.filter(opt => opt.isCorrect);
        if (correctOptions.length === 0) {
            showSnackbar('Debe marcar al menos una respuesta correcta', 'error');
            return;
        }

        try {
            // Filtrar opciones vacías
            const validOptions = questionForm.options.filter(opt => opt.text.trim());

            const questionData = {
                questionText: questionForm.questionText,
                questionImage: questionForm.questionImage,
                options: validOptions,
                points: questionForm.points,
                explanation: questionForm.explanation,
            };

            if (editingQuestion) {
                await exerciseService.updateQuestion(id, editingQuestion._id, questionData);
                showSnackbar('Pregunta actualizada', 'success');
            } else {
                await exerciseService.addQuestion(id, questionData);
                showSnackbar('Pregunta agregada', 'success');
            }

            setOpenQuestionDialog(false);
            loadExercise();
        } catch (err) {
            showSnackbar('Error al guardar pregunta', 'error');
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('¿Eliminar esta pregunta?')) return;

        try {
            await exerciseService.deleteQuestion(id, questionId);
            showSnackbar('Pregunta eliminada', 'success');
            loadExercise();
        } catch (err) {
            showSnackbar('Error al eliminar pregunta', 'error');
        }
    };

    const handleImageUpload = async (event, questionId = null) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUploadingImage(true);

            if (questionId) {
                // Subir imagen a pregunta existente
                const response = await exerciseService.uploadQuestionImage(id, questionId, file);
                showSnackbar('Imagen subida exitosamente', 'success');
                loadExercise();
            } else {
                // Para nueva pregunta, guardar temporalmente
                const reader = new FileReader();
                reader.onloadend = () => {
                    setQuestionForm({ ...questionForm, questionImage: reader.result });
                };
                reader.readAsDataURL(file);
            }
        } catch (err) {
            showSnackbar('Error al subir imagen', 'error');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAddOption = () => {
        setQuestionForm({
            ...questionForm,
            options: [...questionForm.options, { text: '', isCorrect: false }],
        });
    };

    const handleRemoveOption = (index) => {
        const newOptions = questionForm.options.filter((_, i) => i !== index);
        setQuestionForm({ ...questionForm, options: newOptions });
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...questionForm.options];
        newOptions[index][field] = value;
        setQuestionForm({ ...questionForm, options: newOptions });
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress sx={{ color: '#ff5722' }} />
            </Box>
        );
    }

    if (!exercise) {
        return <Alert severity="error">Examen no encontrado</Alert>;
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <IconButton onClick={() => navigate('/admin/exams')}>
                    <ArrowLeft />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {exercise.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Chip
                            label={exercise.type === 'lesson' ? 'Por Lección' : 'General'}
                            size="small"
                            sx={{
                                bgcolor: exercise.type === 'lesson' ? '#00acc10a' : '#9c27b00a',
                                color: exercise.type === 'lesson' ? '#00acc1' : '#9c27b0',
                            }}
                        />
                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                            {exercise.questions.length} preguntas
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Save size={18} />}
                    onClick={handleSaveExerciseInfo}
                    disabled={saving}
                    sx={{
                        bgcolor: '#ff5722',
                        '&:hover': { bgcolor: '#e64a19' },
                        textTransform: 'none',
                    }}
                >
                    {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Guardar Cambios'}
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Left Column - Exercise Info */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Información General
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Título"
                                        value={exercise.title}
                                        onChange={(e) => setExercise({ ...exercise, title: e.target.value })}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Descripción"
                                        multiline
                                        rows={3}
                                        value={exercise.description}
                                        onChange={(e) => setExercise({ ...exercise, description: e.target.value })}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Estado"
                                        value={exercise.status}
                                        onChange={(e) => setExercise({ ...exercise, status: e.target.value })}
                                    >
                                        <MenuItem value="Activo">Activo</MenuItem>
                                        <MenuItem value="Borrador">Borrador</MenuItem>
                                        <MenuItem value="Finalizado">Finalizado</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Configuración
                            </Typography>
                            <Grid container spacing={2}>
                                {exercise.type === 'general' && (
                                    <>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                type="datetime-local"
                                                label="Fecha y Hora de Inicio"
                                                value={exercise.startTime ? new Date(exercise.startTime).toISOString().slice(0, 16) : ''}
                                                onChange={(e) => setExercise({ ...exercise, startTime: e.target.value })}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                type="datetime-local"
                                                label="Fecha y Hora de Fin"
                                                value={exercise.endTime ? new Date(exercise.endTime).toISOString().slice(0, 16) : ''}
                                                onChange={(e) => setExercise({ ...exercise, endTime: e.target.value })}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Duración (minutos)"
                                                value={exercise.duration}
                                                onChange={(e) => setExercise({ ...exercise, duration: parseInt(e.target.value) })}
                                            />
                                        </Grid>
                                    </>
                                )}
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Puntuación para Aprobar (%)"
                                        value={exercise.passingScore}
                                        onChange={(e) => setExercise({ ...exercise, passingScore: parseInt(e.target.value) })}
                                        inputProps={{ min: 0, max: 100 }}
                                    />
                                </Grid>
                                {exercise.type === 'general' && (
                                    <Grid size={{ xs: 12 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={exercise.allowRetake}
                                                    onChange={(e) => setExercise({ ...exercise, allowRetake: e.target.checked })}
                                                />
                                            }
                                            label="Permitir Reintentos"
                                        />
                                    </Grid>
                                )}
                                <Grid size={{ xs: 12 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={exercise.showResults}
                                                onChange={(e) => setExercise({ ...exercise, showResults: e.target.checked })}
                                            />
                                        }
                                        label="Mostrar Resultados Inmediatos"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={exercise.shuffleQuestions}
                                                onChange={(e) => setExercise({ ...exercise, shuffleQuestions: e.target.checked })}
                                            />
                                        }
                                        label="Mezclar Preguntas"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={exercise.shuffleOptions}
                                                onChange={(e) => setExercise({ ...exercise, shuffleOptions: e.target.checked })}
                                            />
                                        }
                                        label="Mezclar Opciones"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column - Questions */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Preguntas ({exercise.questions.length})
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Plus size={18} />}
                                    onClick={() => handleOpenQuestionDialog()}
                                    sx={{
                                        bgcolor: '#ff5722',
                                        '&:hover': { bgcolor: '#e64a19' },
                                        textTransform: 'none',
                                    }}
                                >
                                    Agregar Pregunta
                                </Button>
                            </Box>

                            {exercise.questions.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                                        No hay preguntas agregadas
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                                        Comienza agregando la primera pregunta de tu examen
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Plus size={18} />}
                                        onClick={() => handleOpenQuestionDialog()}
                                        sx={{
                                            bgcolor: '#ff5722',
                                            '&:hover': { bgcolor: '#e64a19' },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Agregar Primera Pregunta
                                    </Button>
                                </Box>
                            ) : (
                                <List sx={{ bgcolor: '#fafafa', borderRadius: 2 }}>
                                    {exercise.questions.map((question, index) => (
                                        <Paper
                                            key={question._id}
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                borderLeft: '3px solid #ff5722',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <GripVertical size={20} color="#999" />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography sx={{ fontWeight: 600 }}>
                                                            Pregunta {index + 1}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Chip
                                                                label={`${question.points} ${question.points === 1 ? 'punto' : 'puntos'}`}
                                                                size="small"
                                                                sx={{ bgcolor: '#ffc1070a', color: '#ffc107' }}
                                                            />
                                                            <IconButton size="small" onClick={() => handleOpenQuestionDialog(question)}>
                                                                <Edit size={16} />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={() => handleDeleteQuestion(question._id)}>
                                                                <Trash2 size={16} />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                    <Typography sx={{ mb: 2 }}>{question.questionText}</Typography>
                                                    {question.questionImage && (
                                                        <Box
                                                            component="img"
                                                            src={question.questionImage}
                                                            sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 1, mb: 2 }}
                                                        />
                                                    )}
                                                    <Box sx={{ pl: 2 }}>
                                                        {question.options.map((option, optIndex) => (
                                                            <Box
                                                                key={optIndex}
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1,
                                                                    py: 0.5,
                                                                    color: option.isCorrect ? '#4caf50' : 'text.primary',
                                                                }}
                                                            >
                                                                {option.isCorrect ? <Check size={16} /> : <X size={16} color="#ccc" />}
                                                                <Typography sx={{ fontSize: '0.875rem' }}>{option.text}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Question Dialog */}
            <Dialog open={openQuestionDialog} onClose={() => setOpenQuestionDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingQuestion ? 'Editar Pregunta' : 'Agregar Nueva Pregunta'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Pregunta"
                                multiline
                                rows={3}
                                value={questionForm.questionText}
                                onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                                placeholder="Escribe tu pregunta aquí..."
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ border: '1px dashed #ddd', borderRadius: 1, p: 2, textAlign: 'center' }}>
                                {questionForm.questionImage ? (
                                    <Box>
                                        <Box
                                            component="img"
                                            src={questionForm.questionImage}
                                            sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 1, mb: 2 }}
                                        />
                                        <Button
                                            size="small"
                                            onClick={() => setQuestionForm({ ...questionForm, questionImage: null })}
                                        >
                                            Eliminar Imagen
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="question-image-upload"
                                            type="file"
                                            onChange={(e) => handleImageUpload(e)}
                                        />
                                        <label htmlFor="question-image-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<ImageIcon size={18} />}
                                                disabled={uploadingImage}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                {uploadingImage ? 'Subiendo...' : 'Agregar Imagen (Opcional)'}
                                            </Button>
                                        </label>
                                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                                            Para preguntas complejas que requieren diagrama o imagen
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                Opciones de Respuesta
                            </Typography>
                            {questionForm.options.map((option, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={option.isCorrect}
                                                onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                                                color="success"
                                            />
                                        }
                                        label=""
                                        sx={{ m: 0 }}
                                    />
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder={`Opción ${index + 1}`}
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                    />
                                    {questionForm.options.length > 2 && (
                                        <IconButton size="small" onClick={() => handleRemoveOption(index)}>
                                            <Trash2 size={16} />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                            {questionForm.options.length < 6 && (
                                <Button size="small" startIcon={<Plus size={16} />} onClick={handleAddOption}>
                                    Agregar Opción
                                </Button>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Puntos"
                                value={questionForm.points}
                                onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })}
                                inputProps={{ min: 1 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Explicación (Opcional)"
                                multiline
                                rows={2}
                                value={questionForm.explanation}
                                onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                                placeholder="Explicación de la respuesta correcta..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setOpenQuestionDialog(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveQuestion}
                        sx={{
                            bgcolor: '#ff5722',
                            '&:hover': { bgcolor: '#e64a19' },
                            textTransform: 'none',
                        }}
                    >
                        {editingQuestion ? 'Guardar Cambios' : 'Agregar Pregunta'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ExamEditor;