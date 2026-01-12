import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  MenuItem, Avatar, Menu, CircularProgress, Alert, Snackbar,
} from '@mui/material';
import { Plus, Search, MoreVertical, Edit, Trash2, Mail, BookOpen, Calendar, Eye } from 'lucide-react';
import courseService from '../../../services/courseService';
import studentService from '../../../services/studentService';
import enrollmentService from '../../../services/enrollmentService';


const StudentsManagement = () => {
  // Estados principales
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Estados de diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudentForEnroll, setSelectedStudentForEnroll] = useState(null);
  const [savingStudent, setSavingStudent] = useState(false);

  // Estado del menú contextual
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    documentType: 'DNI',
    documentNumber: '',
    email: '',
    phone: '',
    password: '',
    status: 'Activo',
  });

  const [enrollFormData, setEnrollFormData] = useState({
    courseIds: [],
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => loadStudents(), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterStatus]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [studentsRes, coursesRes] = await Promise.all([
        studentService.getStudents(),
        courseService.getCourses()
      ]);

      const transformedStudents = studentsRes.data.map(student => ({
        id: student._id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        email: student.user.email,
        phone: student.user.phone || 'N/A',
        documentType: student.user.documentType,
        documentNumber: student.user.documentNumber,
        enrolledCourses: student.enrolledCourses || [],
        completedCourses: student.completedCourses || 0,
        enrollDate: student.enrollDate || student.createdAt,
        lastAccess: student.lastAccess,
        status: student.user.status,
        avatar: `${student.user.firstName[0]}${student.user.lastName[0]}`.toUpperCase(),
      }));

      const transformedCourses = coursesRes.data.map(course => ({
        id: course._id,
        name: course.name,
      }));

      setStudents(transformedStudents);
      setCourses(transformedCourses);
    } catch (err) {
      console.error('Error loading data:', err);
      showSnackbar('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const filters = { search: searchTerm, status: filterStatus };
      const response = await studentService.getStudents(filters);

      const transformedStudents = response.data.map(student => ({
        id: student._id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        email: student.user.email,
        phone: student.user.phone || 'N/A',
        documentType: student.user.documentType,
        documentNumber: student.user.documentNumber,
        enrolledCourses: student.enrolledCourses || [],
        completedCourses: student.completedCourses || 0,
        enrollDate: student.enrollDate || student.createdAt,
        lastAccess: student.lastAccess,
        status: student.user.status,
        avatar: `${student.user.firstName[0]}${student.user.lastName[0]}`.toUpperCase(),
      }));

      setStudents(transformedStudents);
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        documentType: student.documentType,
        documentNumber: student.documentNumber,
        email: student.email,
        phone: student.phone,
        password: '',
        status: student.status,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        firstName: '',
        lastName: '',
        documentType: 'DNI',
        documentNumber: '',
        email: '',
        phone: '',
        password: '',
        status: 'Activo',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
  };

  const handleSaveStudent = async () => {
    // Validación
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.documentNumber) {
      showSnackbar('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    if (!editingStudent && !formData.password) {
      showSnackbar('La contraseña es requerida para crear un nuevo estudiante', 'error');
      return;
    }

    try {
      setSavingStudent(true);

      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, formData);
        showSnackbar('Estudiante actualizado exitosamente', 'success');
      } else {
        await studentService.createStudent(formData);
        showSnackbar('Estudiante creado exitosamente', 'success');
      }

      handleCloseDialog();
      loadStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      showSnackbar(err.message || 'Error al guardar el estudiante', 'error');
    } finally {
      setSavingStudent(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('¿Estás seguro de eliminar este estudiante? Esta acción eliminará también sus inscripciones.')) {
      return;
    }

    try {
      await studentService.deleteStudent(studentId);
      showSnackbar('Estudiante eliminado exitosamente', 'success');
      loadStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      showSnackbar(err.message || 'Error al eliminar el estudiante', 'error');
    } finally {
      setMenuAnchor(null);
    }
  };

  const handleOpenEnrollDialog = (student) => {
    setSelectedStudentForEnroll(student);
    setEnrollFormData({ courseIds: [] });
    setOpenEnrollDialog(true);
    setMenuAnchor(null);
  };

  const handleCloseEnrollDialog = () => {
    setOpenEnrollDialog(false);
    setSelectedStudentForEnroll(null);
    setEnrollFormData({ courseIds: [] });
  };

  const handleEnrollCourses = async () => {
    if (enrollFormData.courseIds.length === 0) {
      showSnackbar('Selecciona al menos un curso', 'error');
      return;
    }

    try {
      // Inscribir en cada curso seleccionado
      const enrollPromises = enrollFormData.courseIds.map(courseId =>
        enrollmentService.createEnrollment({
          studentId: selectedStudentForEnroll.id,
          courseId: courseId,
        })
      );

      await Promise.all(enrollPromises);
      showSnackbar(`Estudiante inscrito en ${enrollFormData.courseIds.length} curso(s)`, 'success');
      handleCloseEnrollDialog();
      loadStudents();
    } catch (err) {
      console.error('Error enrolling student:', err);
      showSnackbar(err.message || 'Error al inscribir estudiante', 'error');
    }
  };

  const handleMenuOpen = (event, student) => {
    setMenuAnchor(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedStudent(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getCourseName = (courseId) => {
    return courses.find(c => c.id === courseId)?.name || 'Curso';
  };

  // Calcular estadísticas
  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'Activo').length,
    avgCourses: students.length > 0
      ? (students.reduce((acc, s) => acc + s.enrolledCourses.length, 0) / students.length).toFixed(1)
      : 0,
    totalCompleted: students.reduce((acc, s) => acc + s.completedCourses, 0),
  };

  if (loading && students.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#ff5722' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Gestión de Estudiantes</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Administra los estudiantes y sus cursos asignados</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={20} />} onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none', fontWeight: 600, px: 3 }}>
          Nuevo Estudiante
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>Total Estudiantes</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>Estudiantes Activos</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>{stats.active}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>Promedio Cursos/Estudiante</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#00acc1' }}>{stats.avgCourses}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>Total Cursos Completados</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fbc02d' }}>{stats.totalCompleted}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField fullWidth placeholder="Buscar estudiantes..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search size={20} /></InputAdornment> }} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth select label="Estado" value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Estudiante', 'Contacto', 'Cursos Inscritos', 'Completados', 'Fecha Inscripción', 'Último Acceso', 'Estado', 'Acciones'].map(h =>
                  <TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} sx={{ color: '#ff5722' }} />
                </TableCell></TableRow>
              ) : students.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>No se encontraron estudiantes</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    {searchTerm || filterStatus ? 'Intenta ajustar los filtros' : 'Comienza creando tu primer estudiante'}
                  </Typography>
                </TableCell></TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: '#00acc1', fontWeight: 600 }}>
                          {student.avatar}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 500 }}>{student.name}</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                            {student.documentType}: {student.documentNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Mail size={14} color="#666" />
                          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{student.email}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{student.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BookOpen size={16} color="#666" />
                        <Typography sx={{ fontWeight: 600 }}>{student.enrolledCourses.length}</Typography>
                      </Box>
                      <Box sx={{ mt: 0.5 }}>
                        {student.enrolledCourses.slice(0, 2).map((course) => (
                          <Chip key={course._id} label={course.name} size="small"
                            sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem', height: 20, bgcolor: '#f5f5f5' }} />
                        ))}
                        {student.enrolledCourses.length > 2 && (
                          <Chip label={`+${student.enrolledCourses.length - 2}`} size="small"
                            sx={{ fontSize: '0.7rem', height: 20, bgcolor: '#ff57220a', color: '#ff5722' }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: '#4caf50' }}>{student.completedCourses}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Calendar size={14} color="#666" />
                        <Typography sx={{ fontSize: '0.875rem' }}>
                          {new Date(student.enrollDate).toLocaleDateString('es-ES')}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {new Date(student.lastAccess).toLocaleDateString('es-ES')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={student.status} size="small" sx={{
                        bgcolor: student.status === 'Activo' ? '#4caf500a' : '#9e9e9e0a',
                        color: student.status === 'Activo' ? '#4caf50' : '#9e9e9e', fontWeight: 600
                      }} />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, student)}>
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
        <MenuItem onClick={() => { handleOpenDialog(selectedStudent); handleMenuClose(); }}>
          <Edit size={18} style={{ marginRight: 8 }} />Editar
        </MenuItem>
        <MenuItem onClick={() => handleOpenEnrollDialog(selectedStudent)}>
          <Plus size={18} style={{ marginRight: 8 }} />Inscribir en Cursos
        </MenuItem>
        <MenuItem onClick={() => handleDeleteStudent(selectedStudent?.id)} sx={{ color: 'error.main' }}>
          <Trash2 size={18} style={{ marginRight: 8 }} />Eliminar
        </MenuItem>
      </Menu>

      {/* Create/Edit Student Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingStudent ? 'Editar Estudiante' : 'Crear Nuevo Estudiante'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Nombres" value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={savingStudent} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Apellidos" value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={savingStudent} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth select label="Tipo de Documento" value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                disabled={savingStudent}>
                <MenuItem value="DNI">DNI</MenuItem>
                <MenuItem value="CE">Carnet de Extranjería</MenuItem>
                <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Número de Documento" value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                disabled={savingStudent} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Email" type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={savingStudent || editingStudent} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Teléfono" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={savingStudent} />
            </Grid>
            {!editingStudent && (
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Contraseña" type="password" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres" disabled={savingStudent}
                  helperText="Contraseña de acceso del estudiante" />
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth select label="Estado" value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={savingStudent}>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} disabled={savingStudent}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveStudent} disabled={savingStudent}
            sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none', minWidth: 120 }}>
            {savingStudent ? <CircularProgress size={24} sx={{ color: 'white' }} /> :
              (editingStudent ? 'Guardar Cambios' : 'Crear Estudiante')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enroll Student Dialog */}
      <Dialog open={openEnrollDialog} onClose={handleCloseEnrollDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Inscribir Estudiante en Cursos
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Estudiante: <strong>{selectedStudentForEnroll?.name}</strong>
            </Typography>
            <TextField fullWidth select label="Selecciona Cursos" value={enrollFormData.courseIds}
              onChange={(e) => setEnrollFormData({ courseIds: e.target.value })}
              SelectProps={{ multiple: true }}>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEnrollDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleEnrollCourses}
            sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none' }}>
            Inscribir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentsManagement;