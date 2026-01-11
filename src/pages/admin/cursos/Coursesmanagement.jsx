import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
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
  Avatar,
  Menu,
} from '@mui/material';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
} from 'lucide-react';

const CoursesManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Introducción a After Effects',
      tutor: { id: 1, name: 'Carlos Albarrán', avatar: 'CA' },
      category: '3D y Animación',
      students: 234,
      lessons: 45,
      duration: '12h 30m',
      status: 'Activo',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300',
      modules: [],
    },
    {
      id: 2,
      name: 'Figma de principio a fin',
      tutor: { id: 2, name: 'Samuel Hermoso', avatar: 'SH' },
      category: 'Diseño Web y App',
      students: 189,
      lessons: 38,
      duration: '10h 15m',
      status: 'Activo',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300',
      modules: [],
    },
    {
      id: 3,
      name: 'Ilustración digital con Procreate',
      tutor: { id: 3, name: 'Ana García', avatar: 'AG' },
      category: 'Ilustración',
      students: 156,
      lessons: 32,
      duration: '8h 45m',
      status: 'Activo',
      thumbnail: 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=300',
      modules: [],
    },
    {
      id: 4,
      name: 'Animación 2D con Adobe Animate',
      tutor: { id: 1, name: 'Carlos Albarrán', avatar: 'CA' },
      category: '3D y Animación',
      students: 92,
      lessons: 28,
      duration: '7h 20m',
      status: 'Borrador',
      thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300',
      modules: [],
    },
  ]);

  const [tutors] = useState([
    { id: 1, name: 'Carlos Albarrán' },
    { id: 2, name: 'Samuel Hermoso' },
    { id: 3, name: 'Ana García' },
    { id: 4, name: 'Pedro Martínez' },
  ]);

  const [categories] = useState([
    '3D y Animación',
    'Diseño Web y App',
    'Ilustración',
    'Fotografía',
    'Marketing',
    'Programación',
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    tutorId: '',
    category: '',
    status: 'Borrador',
    description: '',
  });

  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        tutorId: course.tutor.id,
        category: course.category,
        status: course.status,
        description: '',
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        tutorId: '',
        category: '',
        status: 'Borrador',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
  };

  const handleSaveCourse = () => {
    if (editingCourse) {
      // Update existing course
      setCourses(
        courses.map((course) =>
          course.id === editingCourse.id
            ? {
              ...course,
              name: formData.name,
              tutor: tutors.find((t) => t.id === formData.tutorId),
              category: formData.category,
              status: formData.status,
            }
            : course
        )
      );
      handleCloseDialog();
      // Redirect to course detail
      navigate(`/admin/courses/${editingCourse.id}`);
    } else {
      // Create new course with basic data
      const newCourse = {
        id: courses.length + 1,
        name: formData.name,
        tutor: tutors.find((t) => t.id === formData.tutorId),
        category: formData.category,
        students: 0,
        lessons: 0,
        duration: '0h 0m',
        status: formData.status,
        thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300',
        modules: [],
      };
      setCourses([...courses, newCourse]);
      handleCloseDialog();
      // Redirect to course detail to configure it
      navigate(`/admin/courses/${newCourse.id}`);
    }
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('¿Estás seguro de eliminar este curso?')) {
      setCourses(courses.filter((course) => course.id !== courseId));
    }
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event, course) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCourse(null);
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Gestión de Cursos
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Administra todos los cursos de la plataforma
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
          Nuevo Curso
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Buscar cursos..."
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
              <TextField fullWidth select label="Categoría" defaultValue="">
                <MenuItem value="">Todas</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth select label="Estado" defaultValue="">
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Borrador">Borrador</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Curso</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tutor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estudiantes</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Lecciones</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow
                  key={course.id}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
                  }}
                  onClick={() => navigate(`/admin/courses/${course.id}`)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="img"
                        src={course.thumbnail}
                        alt={course.name}
                        sx={{
                          width: 60,
                          height: 40,
                          borderRadius: 1,
                          objectFit: 'cover',
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>{course.name}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {course.duration}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#ff5722',
                          fontSize: '0.75rem',
                        }}
                      >
                        {course.tutor.avatar}
                      </Avatar>
                      {course.tutor.name}
                    </Box>
                  </TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Users size={16} color="#666" />
                      {course.students}
                    </Box>
                  </TableCell>
                  <TableCell>{course.lessons}</TableCell>
                  <TableCell>
                    <Chip
                      label={course.status}
                      size="small"
                      sx={{
                        bgcolor: course.status === 'Activo' ? '#4caf500a' : '#ff57220a',
                        color: course.status === 'Activo' ? '#4caf50' : '#ff5722',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, course);
                      }}
                    >
                      <MoreVertical size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
          navigate(`/admin/courses/${selectedCourse?.id}`);
          handleMenuClose();
        }}>
          <Eye size={18} style={{ marginRight: 8 }} />
          Ver Detalles
        </MenuItem>
        <MenuItem onClick={() => {
          handleOpenDialog(selectedCourse);
          handleMenuClose();
        }}>
          <Edit size={18} style={{ marginRight: 8 }} />
          Editar Información Básica
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteCourse(selectedCourse?.id)}
          sx={{ color: 'error.main' }}
        >
          <Trash2 size={18} style={{ marginRight: 8 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingCourse ? 'Editar Información Básica del Curso' : 'Crear Nuevo Curso'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nombre del Curso"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Introducción a After Effects"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                select
                label="Tutor Principal"
                value={formData.tutorId}
                onChange={(e) => setFormData({ ...formData, tutorId: e.target.value })}
              >
                {tutors.map((tutor) => (
                  <MenuItem key={tutor.id} value={tutor.id}>
                    {tutor.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                select
                label="Categoría"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Borrador">Borrador</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descripción Corta"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Una breve descripción del curso..."
              />
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
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveCourse}
            sx={{
              bgcolor: '#ff5722',
              '&:hover': { bgcolor: '#e64a19' },
              textTransform: 'none',
            }}
          >
            {editingCourse ? 'Guardar y Ver Detalle' : 'Crear e Ir a Configurar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoursesManagement;