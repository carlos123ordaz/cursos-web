import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  MenuItem, Avatar, Menu, CircularProgress, Alert, Snackbar,
} from '@mui/material';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Users } from 'lucide-react';
import courseService from '../../../services/courseService';
import tutorService from '../../../services/tutorService';


const CoursesManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [savingCourse, setSavingCourse] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '', tutor: '', category: '', status: 'Borrador', description: '',
  });

  const categories = [
    'Matemáticas',
    'Razonamiento',
    'Comunicación',
    'Ciencias',
    'Ciencias Sociales',
    'Humanidades',
    'Aptitud Académica',
    'Cultura General',
    'Otros'
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => loadCourses(), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterCategory, filterStatus]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [coursesRes, tutorsRes] = await Promise.all([
        courseService.getCourses(),
        tutorService.getTutors()
      ]);

      const transformedCourses = coursesRes.data.map(course => ({
        id: course._id,
        name: course.name,
        tutor: {
          id: course.tutor._id,
          name: `${course.tutor.user.firstName} ${course.tutor.user.lastName}`,
          avatar: `${course.tutor.user.firstName[0]}${course.tutor.user.lastName[0]}`.toUpperCase(),
        },
        category: course.category,
        students: course.totalStudents || 0,
        lessons: course.totalLessons || 0,
        duration: formatDuration(course.totalDuration || 0),
        status: course.status,
        thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300',
      }));

      const transformedTutors = tutorsRes.data.map(tutor => ({
        id: tutor._id,
        name: `${tutor.user.firstName} ${tutor.user.lastName}`,
      }));

      setCourses(transformedCourses);
      setTutors(transformedTutors);
    } catch (err) {
      console.error('Error loading data:', err);
      showSnackbar('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const filters = { search: searchTerm, category: filterCategory, status: filterStatus };
      const response = await courseService.getCourses(filters);

      const transformedCourses = response.data.map(course => ({
        id: course._id,
        name: course.name,
        tutor: {
          id: course.tutor._id,
          name: `${course.tutor.user.firstName} ${course.tutor.user.lastName}`,
          avatar: `${course.tutor.user.firstName[0]}${course.tutor.user.lastName[0]}`.toUpperCase(),
        },
        category: course.category,
        students: course.totalStudents || 0,
        lessons: course.totalLessons || 0,
        duration: formatDuration(course.totalDuration || 0),
        status: course.status,
        thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300',
      }));

      setCourses(transformedCourses);
    } catch (err) {
      console.error('Error loading courses:', err);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        tutor: course.tutor.id,
        category: course.category,
        status: course.status,
        description: '',
      });
    } else {
      setEditingCourse(null);
      setFormData({ name: '', tutor: '', category: '', status: 'Borrador', description: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
  };

  const handleSaveCourse = async () => {
    if (!formData.name || !formData.tutor || !formData.category) {
      showSnackbar('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    try {
      setSavingCourse(true);
      if (editingCourse) {
        const response = await courseService.updateCourse(editingCourse.id, formData);
        showSnackbar('Curso actualizado exitosamente', 'success');
        navigate(`/admin/courses/${editingCourse.id}`);
      } else {
        const response = await courseService.createCourse(formData);
        showSnackbar('Curso creado exitosamente', 'success');
        navigate(`/admin/courses/${response.data._id}`);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving course:', err);
      showSnackbar(err.message || 'Error al guardar el curso', 'error');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('¿Estás seguro de eliminar este curso? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      showSnackbar('Curso eliminado exitosamente', 'success');
      loadCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
      showSnackbar(err.message || 'Error al eliminar el curso', 'error');
    } finally {
      setMenuAnchor(null);
    }
  };

  const handleMenuOpen = (event, course) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCourse(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredCourses = courses;

  if (loading && courses.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#ff5722' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Gestión de Cursos</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Administra todos los cursos de la plataforma</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={20} />} onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none', fontWeight: 600, px: 3 }}>
          Nuevo Curso
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth placeholder="Buscar cursos..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search size={20} /></InputAdornment> }} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth select label="Categoría" value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}>
                <MenuItem value="">Todas</MenuItem>
                {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth select label="Estado" value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Borrador">Borrador</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Curso', 'Tutor', 'Categoría', 'Estudiantes', 'Lecciones', 'Estado', 'Acciones'].map(h =>
                  <TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} sx={{ color: '#ff5722' }} />
                </TableCell></TableRow>
              ) : filteredCourses.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>No se encontraron cursos</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    {searchTerm || filterCategory || filterStatus ? 'Intenta ajustar los filtros' : 'Comienza creando tu primer curso'}
                  </Typography>
                </TableCell></TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id} sx={{ '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' } }}
                    onClick={() => navigate(`/admin/courses/${course.id}`)}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box component="img" src={course.thumbnail} alt={course.name}
                          sx={{ width: 60, height: 40, borderRadius: 1, objectFit: 'cover' }} />
                        <Box>
                          <Typography sx={{ fontWeight: 500 }}>{course.name}</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{course.duration}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff5722', fontSize: '0.75rem' }}>
                          {course.tutor.avatar}
                        </Avatar>
                        {course.tutor.name}
                      </Box>
                    </TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Users size={16} color="#666" />{course.students}
                      </Box>
                    </TableCell>
                    <TableCell>{course.lessons}</TableCell>
                    <TableCell>
                      <Chip label={course.status} size="small" sx={{
                        bgcolor: course.status === 'Activo' ? '#4caf500a' : '#ff57220a',
                        color: course.status === 'Activo' ? '#4caf50' : '#ff5722', fontWeight: 600
                      }} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, course); }}>
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

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { navigate(`/admin/courses/${selectedCourse?.id}`); handleMenuClose(); }}>
          <Eye size={18} style={{ marginRight: 8 }} />Ver Detalles
        </MenuItem>
        <MenuItem onClick={() => { handleOpenDialog(selectedCourse); handleMenuClose(); }}>
          <Edit size={18} style={{ marginRight: 8 }} />Editar Información Básica
        </MenuItem>
        <MenuItem onClick={() => handleDeleteCourse(selectedCourse?.id)} sx={{ color: 'error.main' }}>
          <Trash2 size={18} style={{ marginRight: 8 }} />Eliminar
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingCourse ? 'Editar Información Básica del Curso' : 'Crear Nuevo Curso'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Nombre del Curso" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Introducción a After Effects" disabled={savingCourse} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth select label="Tutor Principal" value={formData.tutor}
                onChange={(e) => setFormData({ ...formData, tutor: e.target.value })} disabled={savingCourse}>
                {tutors.map((tutor) => <MenuItem key={tutor.id} value={tutor.id}>{tutor.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth select label="Categoría" value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} disabled={savingCourse}>
                {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth select label="Estado" value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })} disabled={savingCourse}>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Borrador">Borrador</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Descripción Corta" multiline rows={3} value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Una breve descripción del curso..." disabled={savingCourse} />
            </Grid>
            {!editingCourse && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  💡 Después de crear el curso, serás redirigido a la página de configuración donde podrás agregar módulos, temas, videos y más contenido.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} disabled={savingCourse}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveCourse} disabled={savingCourse}
            sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none', minWidth: 120 }}>
            {savingCourse ? <CircularProgress size={24} sx={{ color: 'white' }} /> :
              (editingCourse ? 'Guardar y Ver Detalle' : 'Crear e Ir a Configurar')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CoursesManagement;