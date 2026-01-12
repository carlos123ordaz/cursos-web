import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Menu,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Users,
  FileText,
} from 'lucide-react';
import exerciseService from '../../../services/exerciseService';
import courseService from '../../../services/courseService';

const ExamsManagement = () => {
  const navigate = useNavigate();

  // Estados principales
  const [exercises, setExercises] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Filtros
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [savingExercise, setSavingExercise] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'general',
    course: '',
    lesson: null,
    duration: 60,
    scheduledDate: '',
    startTime: '',
    endTime: '',
    passingScore: 60,
    allowRetake: false,
    showResults: true,
    shuffleQuestions: false,
    shuffleOptions: false,
    status: 'Borrador',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const delayDebounceFn = setTimeout(() => loadExercises(), 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, filterCourse, filterStatus, activeTab]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');

      const [exercisesRes, coursesRes] = await Promise.all([
        exerciseService.getExercises(),
        courseService.getCourses(),
      ]);

      // Validar que la respuesta tenga el formato correcto
      const exercisesData = exercisesRes?.data || [];
      const coursesData = coursesRes?.data || [];

      setExercises(Array.isArray(exercisesData) ? exercisesData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);

      console.log('Exercises loaded:', exercisesData.length);
      console.log('Courses loaded:', coursesData.length);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      showSnackbar('Error al cargar los datos', 'error');
      setExercises([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const loadExercises = async () => {
    try {
      const filters = {};

      if (searchTerm) filters.search = searchTerm;
      if (filterCourse) filters.courseId = filterCourse;
      if (filterStatus) filters.status = filterStatus;

      // Filtrar por tipo según el tab
      if (activeTab === 1) filters.type = 'lesson';
      if (activeTab === 2) filters.type = 'general';

      const response = await exerciseService.getExercises(filters);
      const exercisesData = response?.data || [];

      setExercises(Array.isArray(exercisesData) ? exercisesData : []);
      console.log('Exercises filtered:', exercisesData.length);
    } catch (err) {
      console.error('Error loading exercises:', err);
      setExercises([]);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      title: '',
      description: '',
      type: 'general',
      course: '',
      lesson: null,
      duration: 60,
      scheduledDate: '',
      startTime: '',
      endTime: '',
      passingScore: 60,
      allowRetake: false,
      showResults: true,
      shuffleQuestions: false,
      shuffleOptions: false,
      status: 'Borrador',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveExercise = async () => {
    if (!formData.title || !formData.course) {
      showSnackbar('Por favor complete los campos requeridos', 'error');
      return;
    }

    try {
      setSavingExercise(true);
      console.log('Creating exercise with data:', formData);

      const response = await exerciseService.createExercise(formData);

      console.log('Exercise created response:', response);
      console.log('Exercise data:', response.data);
      console.log('Exercise ID:', response.data?._id);

      if (!response.data || !response.data._id) {
        console.error('Response missing _id:', response);
        showSnackbar('Error: El examen se creó pero no se obtuvo el ID', 'error');
        handleCloseDialog();
        loadExercises();
        return;
      }

      showSnackbar('Examen creado exitosamente', 'success');
      handleCloseDialog();

      // Navegar al editor con el ID correcto
      const exerciseId = response.data._id;
      console.log('Navigating to:', `/admin/exams/${exerciseId}/edit`);
      navigate(`/admin/exams/${exerciseId}/edit`);
    } catch (err) {
      console.error('Error saving exercise:', err);
      console.error('Error response:', err.response);
      showSnackbar(err.response?.data?.message || 'Error al crear examen', 'error');
    } finally {
      setSavingExercise(false);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm('¿Estás seguro de eliminar este examen? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await exerciseService.deleteExercise(exerciseId);
      showSnackbar('Examen eliminado exitosamente', 'success');
      loadExercises();
    } catch (err) {
      console.error('Error deleting exercise:', err);
      showSnackbar(err.response?.data?.message || 'Error al eliminar examen', 'error');
    } finally {
      setMenuAnchor(null);
    }
  };

  const handleMenuOpen = (event, exercise) => {
    setMenuAnchor(event.currentTarget);
    setSelectedExercise(exercise);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedExercise(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No programado';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      return 'Fecha inválida';
    }
  };

  const getTypeLabel = (type) => {
    return type === 'lesson' ? 'Por Lección' : 'General';
  };

  // Asegurar que exercises sea un array antes de filtrar
  const filteredExercises = Array.isArray(exercises) ? exercises : [];

  // Estadísticas
  const stats = {
    total: filteredExercises.length,
    lesson: filteredExercises.filter(e => e.type === 'lesson').length,
    general: filteredExercises.filter(e => e.type === 'general').length,
    active: filteredExercises.filter(e => e.status === 'Activo').length,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#ff5722' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadInitialData}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Gestión de Exámenes
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Administra exámenes generales y ejercicios por lección
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleOpenDialog}
          sx={{
            bgcolor: '#ff5722',
            '&:hover': { bgcolor: '#e64a19' },
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          Nuevo Examen
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Total Exámenes
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Por Lección
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#00acc1' }}>
                {stats.lesson}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Generales
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#9c27b0' }}>
                {stats.general}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Activos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                {stats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          <Tab label="Todos los Exámenes" />
          <Tab label="Por Lección" />
          <Tab label="Exámenes Generales" />
        </Tabs>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Buscar exámenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                select
                label="Curso"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Borrador">Borrador</MenuItem>
                <MenuItem value="Finalizado">Finalizado</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Examen', 'Tipo', 'Curso', 'Preguntas', 'Programación', 'Estado', 'Acciones'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExercises.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                      No se encontraron exámenes
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      {searchTerm || filterCourse || filterStatus
                        ? 'Intenta ajustar los filtros'
                        : 'Comienza creando tu primer examen'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredExercises.map((exercise) => (
                  <TableRow
                    key={exercise._id}
                    sx={{ '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' } }}
                    onClick={() => navigate(`/admin/exams/${exercise._id}/edit`)}
                  >
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>{exercise.title}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {exercise.description || 'Sin descripción'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeLabel(exercise.type)}
                        size="small"
                        sx={{
                          bgcolor: exercise.type === 'lesson' ? '#00acc10a' : '#9c27b00a',
                          color: exercise.type === 'lesson' ? '#00acc1' : '#9c27b0',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem' }}>
                        {exercise.course?.name || 'N/A'}
                      </Typography>
                      {exercise.lesson && (
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {exercise.lesson.title}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FileText size={16} color="#666" />
                        <Typography>{exercise.questions?.length || 0}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {exercise.type === 'general' ? (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <Calendar size={14} color="#666" />
                            <Typography sx={{ fontSize: '0.75rem' }}>
                              {formatDate(exercise.startTime)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Clock size={14} color="#666" />
                            <Typography sx={{ fontSize: '0.75rem' }}>
                              {exercise.duration} min
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                          No programado
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exercise.status}
                        size="small"
                        sx={{
                          bgcolor:
                            exercise.status === 'Activo'
                              ? '#4caf500a'
                              : exercise.status === 'Borrador'
                                ? '#ff57220a'
                                : '#9e9e9e0a',
                          color:
                            exercise.status === 'Activo'
                              ? '#4caf50'
                              : exercise.status === 'Borrador'
                                ? '#ff5722'
                                : '#9e9e9e',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, exercise)}>
                        <MoreVertical size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Context Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            navigate(`/admin/exams/${selectedExercise?._id}/edit`);
            handleMenuClose();
          }}
        >
          <Edit size={18} style={{ marginRight: 8 }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/admin/exams/${selectedExercise?._id}/results`);
            handleMenuClose();
          }}
        >
          <Eye size={18} style={{ marginRight: 8 }} />
          Ver Resultados
        </MenuItem>
        <MenuItem onClick={() => handleDeleteExercise(selectedExercise?._id)} sx={{ color: 'error.main' }}>
          <Trash2 size={18} style={{ marginRight: 8 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Create Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Crear Nuevo Examen</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Título del Examen"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Examen Final de Matemáticas"
                disabled={savingExercise}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={savingExercise}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Tipo de Examen"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={savingExercise}
              >
                <MenuItem value="general">Examen General (Programado)</MenuItem>
                <MenuItem value="lesson">Ejercicio por Lección</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Curso"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                disabled={savingExercise}
              >
                <MenuItem value="">Selecciona un curso</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                💡 Después de crear el examen, podrás agregar las preguntas en el editor
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} disabled={savingExercise}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveExercise}
            disabled={savingExercise}
            sx={{
              bgcolor: '#ff5722',
              '&:hover': { bgcolor: '#e64a19' },
              textTransform: 'none',
              minWidth: 120,
            }}
          >
            {savingExercise ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Crear e Ir al Editor'}
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExamsManagement;