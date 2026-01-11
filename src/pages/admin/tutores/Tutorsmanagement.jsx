import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  Users,
  Star,
  Eye,
} from 'lucide-react';
import TutorDialog from '../../../components/TutorDialog';
import tutorService from '../../../services/tutorService';

const TutorsManagement = () => {
  // Estado para los tutores
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Estado para el diálogo
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [savingTutor, setSavingTutor] = useState(false);

  // Estado para el menú contextual
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);

  // Estado para el formulario
  const [tutorData, setTutorData] = useState({
    firstName: '',
    lastName: '',
    documentType: 'DNI',
    documentNumber: '',
    email: '',
    phone: '',
    specialty: '',
    status: 'Activo',
    bio: '',
    password: '',
  });

  const specialties = [
    '3D y Animación',
    'Diseño Web y App',
    'Ilustración',
    'Fotografía',
    'Marketing',
    'Programación',
  ];

  // Cargar tutores al montar el componente
  useEffect(() => {
    loadTutors();
  }, []);

  // Cargar tutores con filtros
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadTutors();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterSpecialty, filterStatus]);

  const loadTutors = async () => {
    try {
      setLoading(true);
      setError('');

      const filters = {
        search: searchTerm,
        specialty: filterSpecialty,
        status: filterStatus,
      };

      const response = await tutorService.getTutors(filters);

      // Transformar los datos del backend al formato del frontend
      const transformedTutors = response.data.map(tutor => ({
        id: tutor._id,
        firstName: tutor.user.firstName,
        lastName: tutor.user.lastName,
        documentType: tutor.user.documentType,
        documentNumber: tutor.user.documentNumber,
        email: tutor.user.email,
        phone: tutor.user.phone,
        specialty: tutor.specialty,
        courses: tutor.totalCourses || 0,
        students: tutor.totalStudents || 0,
        rating: tutor.rating || 5.0,
        status: tutor.user.status,
        avatar: `${tutor.user.firstName[0]}${tutor.user.lastName[0]}`.toUpperCase(),
        joinDate: tutor.createdAt,
        bio: tutor.bio,
        userId: tutor.user._id,
      }));

      setTutors(transformedTutors);
    } catch (err) {
      console.error('Error loading tutors:', err);
      setError(err.message || 'Error al cargar los tutores');
      showSnackbar('Error al cargar los tutores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tutor = null) => {
    if (tutor) {
      setEditingTutor(tutor);
      setTutorData({
        firstName: tutor.firstName,
        lastName: tutor.lastName,
        documentType: tutor.documentType,
        documentNumber: tutor.documentNumber,
        email: tutor.email,
        phone: tutor.phone,
        specialty: tutor.specialty,
        status: tutor.status,
        bio: tutor.bio,
        password: '',
      });
    } else {
      setEditingTutor(null);
      setTutorData({
        firstName: '',
        lastName: '',
        documentType: 'DNI',
        documentNumber: '',
        email: '',
        phone: '',
        specialty: '',
        status: 'Activo',
        bio: '',
        password: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTutor(null);
    setShowPassword(false);
  };

  const handleSaveTutor = async () => {
    // Validación básica
    if (!tutorData.firstName || !tutorData.lastName || !tutorData.email || !tutorData.documentNumber) {
      showSnackbar('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    if (!editingTutor && !tutorData.password) {
      showSnackbar('La contraseña es requerida para crear un nuevo tutor', 'error');
      return;
    }

    if (!tutorData.specialty) {
      showSnackbar('Por favor seleccione una especialidad', 'error');
      return;
    }

    try {
      setSavingTutor(true);

      if (editingTutor) {
        // Actualizar tutor existente
        await tutorService.updateTutor(editingTutor.id, tutorData);
        showSnackbar('Tutor actualizado exitosamente', 'success');
      } else {
        // Crear nuevo tutor
        await tutorService.createTutor(tutorData);
        showSnackbar('Tutor creado exitosamente', 'success');
      }

      handleCloseDialog();
      loadTutors();
    } catch (err) {
      console.error('Error saving tutor:', err);
      showSnackbar(err.message || 'Error al guardar el tutor', 'error');
    } finally {
      setSavingTutor(false);
    }
  };

  const handleDeleteTutor = async (tutorId) => {
    if (!window.confirm('¿Estás seguro de eliminar este tutor? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await tutorService.deleteTutor(tutorId);
      showSnackbar('Tutor eliminado exitosamente', 'success');
      loadTutors();
    } catch (err) {
      console.error('Error deleting tutor:', err);
      showSnackbar(err.message || 'Error al eliminar el tutor', 'error');
    } finally {
      setMenuAnchor(null);
    }
  };

  const handleMenuOpen = (event, tutor) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTutor(tutor);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTutor(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calcular estadísticas
  const stats = {
    total: tutors.length,
    active: tutors.filter(t => t.status === 'Activo').length,
    totalCourses: tutors.reduce((acc, t) => acc + t.courses, 0),
    totalStudents: tutors.reduce((acc, t) => acc + t.students, 0),
  };

  if (loading && tutors.length === 0) {
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
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Gestión de Tutores
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Administra los instructores de la plataforma
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#ff5722',
            '&:hover': { bgcolor: '#e64a19' },
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          Nuevo Tutor
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Total Tutores
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
                Tutores Activos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                {stats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Total Cursos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#00acc1' }}>
                {stats.totalCourses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Total Estudiantes
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fbc02d' }}>
                {stats.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre o email..."
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
                label="Especialidad"
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {specialties.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
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
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tutors Table */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Tutor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Documento</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contacto</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Especialidad</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Cursos</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estudiantes</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={32} sx={{ color: '#ff5722' }} />
                  </TableCell>
                </TableRow>
              ) : tutors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                      No se encontraron tutores
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      {searchTerm || filterSpecialty || filterStatus
                        ? 'Intenta ajustar los filtros de búsqueda'
                        : 'Comienza creando tu primer tutor'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tutors.map((tutor) => (
                  <TableRow
                    key={tutor.id}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#ff5722',
                            fontWeight: 600,
                          }}
                        >
                          {tutor.avatar}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 500 }}>
                            {tutor.firstName} {tutor.lastName}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                            Desde {new Date(tutor.joinDate).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {tutor.documentType}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {tutor.documentNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Mail size={14} color="#666" />
                          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                            {tutor.email}
                          </Typography>
                        </Box>
                        {tutor.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Phone size={14} color="#666" />
                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                              {tutor.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tutor.specialty}
                        size="small"
                        sx={{
                          bgcolor: '#ff57220a',
                          color: '#ff5722',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BookOpen size={16} color="#666" />
                        <Typography sx={{ fontWeight: 600 }}>{tutor.courses}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Users size={16} color="#666" />
                        <Typography sx={{ fontWeight: 600 }}>{tutor.students}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star size={16} color="#fbc02d" fill="#fbc02d" />
                        <Typography sx={{ fontWeight: 600 }}>{tutor.rating.toFixed(1)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tutor.status}
                        size="small"
                        sx={{
                          bgcolor: tutor.status === 'Activo' ? '#4caf500a' : '#9e9e9e0a',
                          color: tutor.status === 'Activo' ? '#4caf50' : '#9e9e9e',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, tutor)}
                      >
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
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleOpenDialog(selectedTutor);
          handleMenuClose();
        }}>
          <Edit size={18} style={{ marginRight: 8 }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteTutor(selectedTutor?.id)}
          sx={{ color: 'error.main' }}
        >
          <Trash2 size={18} style={{ marginRight: 8 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Tutor Dialog */}
      <TutorDialog
        open={openDialog}
        onClose={handleCloseDialog}
        tutorData={tutorData}
        onChange={setTutorData}
        onSave={handleSaveTutor}
        isEditing={!!editingTutor}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        saving={savingTutor}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TutorsManagement;  