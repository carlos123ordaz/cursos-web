import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  BookOpen,
  Calendar,
} from 'lucide-react';

const StudentsManagement = () => {
  const [courses] = useState([
    { id: 1, name: 'Introducción a After Effects' },
    { id: 2, name: 'Figma de principio a fin' },
    { id: 3, name: 'Ilustración digital con Procreate' },
    { id: 4, name: 'Animación 2D con Adobe Animate' },
    { id: 5, name: 'Fotografía de Producto' },
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'María López',
      email: 'maria.lopez@example.com',
      phone: '+51 999 888 777',
      enrolledCourses: [1, 2, 3],
      completedCourses: 1,
      enrollDate: '2024-01-15',
      lastAccess: '2024-01-09',
      status: 'Activo',
      avatar: 'ML',
    },
    {
      id: 2,
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: '+51 888 777 666',
      enrolledCourses: [2, 4],
      completedCourses: 2,
      enrollDate: '2023-11-20',
      lastAccess: '2024-01-10',
      status: 'Activo',
      avatar: 'JP',
    },
    {
      id: 3,
      name: 'Lucía Fernández',
      email: 'lucia.fernandez@example.com',
      phone: '+51 777 666 555',
      enrolledCourses: [1, 3, 4, 5],
      completedCourses: 0,
      enrollDate: '2024-01-05',
      lastAccess: '2024-01-08',
      status: 'Activo',
      avatar: 'LF',
    },
    {
      id: 4,
      name: 'Carlos Ramírez',
      email: 'carlos.ramirez@example.com',
      phone: '+51 666 555 444',
      enrolledCourses: [2],
      completedCourses: 1,
      enrollDate: '2023-10-10',
      lastAccess: '2023-12-25',
      status: 'Inactivo',
      avatar: 'CR',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrolledCourses: [],
    status: 'Activo',
  });

  const handleOpenDialog = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone,
        enrolledCourses: student.enrolledCourses,
        status: student.status,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        enrolledCourses: [],
        status: 'Activo',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
  };

  const handleSaveStudent = () => {
    if (editingStudent) {
      setStudents(
        students.map((student) =>
          student.id === editingStudent.id
            ? {
                ...student,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                enrolledCourses: formData.enrolledCourses,
                status: formData.status,
              }
            : student
        )
      );
    } else {
      const newStudent = {
        id: students.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        enrolledCourses: formData.enrolledCourses,
        completedCourses: 0,
        enrollDate: new Date().toISOString().split('T')[0],
        lastAccess: new Date().toISOString().split('T')[0],
        status: formData.status,
        avatar: formData.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
      };
      setStudents([...students, newStudent]);
    }
    handleCloseDialog();
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('¿Estás seguro de eliminar este estudiante?')) {
      setStudents(students.filter((student) => student.id !== studentId));
    }
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event, student) => {
    setMenuAnchor(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedStudent(null);
  };

  const getCourseName = (courseId) => {
    return courses.find((c) => c.id === courseId)?.name || 'Desconocido';
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Gestión de Estudiantes
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Administra los estudiantes y sus cursos asignados
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
          Nuevo Estudiante
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{xs:12,sm:6,md:3}}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Total Estudiantes
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {students.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:12,sm:6,md:3}}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Estudiantes Activos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                {students.filter((s) => s.status === 'Activo').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:12,sm:6,md:3}}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Promedio Cursos/Estudiante
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#00acc1' }}>
                {(
                  students.reduce((acc, s) => acc + s.enrolledCourses.length, 0) /
                  students.length
                ).toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:12,sm:6,md:3}}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 1 }}>
                Total Cursos Completados
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fbc02d' }}>
                {students.reduce((acc, s) => acc + s.completedCourses, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{xs:12}} md={8}>
              <TextField
                fullWidth
                placeholder="Buscar estudiantes..."
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
            <Grid size={{xs:12}} md={4}>
              <TextField fullWidth select label="Estado" defaultValue="">
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
                <TableCell sx={{ fontWeight: 600 }}>Estudiante</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contacto</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Cursos Inscritos</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Completados</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha Inscripción</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Último Acceso</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: '#00acc1',
                          fontWeight: 600,
                        }}
                      >
                        {student.avatar}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>{student.name}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Mail size={14} color="#666" />
                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                          {student.email}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {student.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BookOpen size={16} color="#666" />
                      <Typography sx={{ fontWeight: 600 }}>
                        {student.enrolledCourses.length}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 0.5 }}>
                      {student.enrolledCourses.slice(0, 2).map((courseId) => (
                        <Chip
                          key={courseId}
                          label={getCourseName(courseId)}
                          size="small"
                          sx={{
                            mr: 0.5,
                            mb: 0.5,
                            fontSize: '0.7rem',
                            height: 20,
                            bgcolor: '#f5f5f5',
                          }}
                        />
                      ))}
                      {student.enrolledCourses.length > 2 && (
                        <Chip
                          label={`+${student.enrolledCourses.length - 2}`}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            bgcolor: '#ff57220a',
                            color: '#ff5722',
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, color: '#4caf50' }}>
                      {student.completedCourses}
                    </Typography>
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
                    <Chip
                      label={student.status}
                      size="small"
                      sx={{
                        bgcolor: student.status === 'Activo' ? '#4caf500a' : '#9e9e9e0a',
                        color: student.status === 'Activo' ? '#4caf50' : '#9e9e9e',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, student)}
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
          handleOpenDialog(selectedStudent);
          handleMenuClose();
        }}>
          <Edit size={18} style={{ marginRight: 8 }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteStudent(selectedStudent?.id)}
          sx={{ color: 'error.main' }}
        >
          <Trash2 size={18} style={{ marginRight: 8 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingStudent ? 'Editar Estudiante' : 'Crear Nuevo Estudiante'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <FormControl fullWidth>
                <InputLabel>Cursos Inscritos</InputLabel>
                <Select
                  multiple
                  value={formData.enrolledCourses}
                  onChange={(e) =>
                    setFormData({ ...formData, enrolledCourses: e.target.value })
                  }
                  input={<OutlinedInput label="Cursos Inscritos" />}
                  renderValue={(selected) =>
                    selected.map((id) => getCourseName(id)).join(', ')
                  }
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      <Checkbox checked={formData.enrolledCourses.indexOf(course.id) > -1} />
                      <ListItemText primary={course.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveStudent}
            sx={{
              bgcolor: '#ff5722',
              '&:hover': { bgcolor: '#e64a19' },
              textTransform: 'none',
            }}
          >
            {editingStudent ? 'Guardar Cambios' : 'Crear Estudiante'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsManagement;