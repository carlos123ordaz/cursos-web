import React, { useState } from 'react';
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
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  FileText,
  CheckCircle,
  ClipboardList,
} from 'lucide-react';

const ExamsManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [courses] = useState([
    { id: 1, name: 'Introducción a After Effects' },
    { id: 2, name: 'Figma de principio a fin' },
    { id: 3, name: 'Ilustración digital con Procreate' },
  ]);

  const [exams, setExams] = useState([
    {
      id: 1,
      title: 'Examen Final After Effects',
      course: { id: 1, name: 'Introducción a After Effects' },
      questions: 25,
      duration: 60,
      passingScore: 70,
      attempts: 156,
      avgScore: 78,
      status: 'Activo',
      isPublished: true,
    },
    {
      id: 2,
      title: 'Evaluación Intermedia Figma',
      course: { id: 2, name: 'Figma de principio a fin' },
      questions: 15,
      duration: 30,
      passingScore: 60,
      attempts: 98,
      avgScore: 82,
      status: 'Activo',
      isPublished: true,
    },
    {
      id: 3,
      title: 'Quiz de Conceptos Básicos',
      course: { id: 3, name: 'Ilustración digital con Procreate' },
      questions: 10,
      duration: 15,
      passingScore: 50,
      attempts: 0,
      avgScore: 0,
      status: 'Borrador',
      isPublished: false,
    },
  ]);

  const [simulations, setSimulations] = useState([
    {
      id: 1,
      title: 'Simulacro Certificación After Effects',
      course: { id: 1, name: 'Introducción a After Effects' },
      questions: 50,
      duration: 120,
      passingScore: 75,
      attempts: 89,
      avgScore: 72,
      status: 'Activo',
      isPublished: true,
      difficulty: 'Avanzado',
    },
    {
      id: 2,
      title: 'Práctica General Diseño UX',
      course: { id: 2, name: 'Figma de principio a fin' },
      questions: 40,
      duration: 90,
      passingScore: 70,
      attempts: 67,
      avgScore: 76,
      status: 'Activo',
      isPublished: true,
      difficulty: 'Intermedio',
    },
    {
      id: 3,
      title: 'Simulacro Básico Ilustración',
      course: { id: 3, name: 'Ilustración digital con Procreate' },
      questions: 20,
      duration: 45,
      passingScore: 60,
      attempts: 0,
      avgScore: 0,
      status: 'Borrador',
      isPublished: false,
      difficulty: 'Básico',
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    questions: '',
    duration: '',
    passingScore: '',
    status: 'Borrador',
    isPublished: false,
    difficulty: 'Intermedio',
  });

  const handleOpenDialog = (item = null, type = 'exam') => {
    if (item) {
      setEditingItem({ ...item, type });
      setFormData({
        title: item.title,
        courseId: item.course.id,
        questions: item.questions,
        duration: item.duration,
        passingScore: item.passingScore,
        status: item.status,
        isPublished: item.isPublished,
        difficulty: item.difficulty || 'Intermedio',
      });
    } else {
      setEditingItem({ type });
      setFormData({
        title: '',
        courseId: '',
        questions: '',
        duration: '',
        passingScore: '',
        status: 'Borrador',
        isPublished: false,
        difficulty: 'Intermedio',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    const itemData = {
      title: formData.title,
      course: courses.find((c) => c.id === formData.courseId),
      questions: parseInt(formData.questions),
      duration: parseInt(formData.duration),
      passingScore: parseInt(formData.passingScore),
      status: formData.status,
      isPublished: formData.isPublished,
      attempts: 0,
      avgScore: 0,
    };

    if (editingItem?.type === 'simulation') {
      itemData.difficulty = formData.difficulty;
    }

    if (editingItem?.id) {
      // Update existing
      if (editingItem.type === 'exam') {
        setExams(exams.map((e) => (e.id === editingItem.id ? { ...e, ...itemData } : e)));
      } else {
        setSimulations(
          simulations.map((s) => (s.id === editingItem.id ? { ...s, ...itemData } : s))
        );
      }
    } else {
      // Create new
      if (editingItem?.type === 'exam') {
        setExams([...exams, { ...itemData, id: exams.length + 1 }]);
      } else {
        setSimulations([
          ...simulations,
          { ...itemData, id: simulations.length + 1 },
        ]);
      }
    }
    handleCloseDialog();
  };

  const handleDelete = (id, type) => {
    if (!id || !type) {
      console.error('Missing id or type for deletion');
      setMenuAnchor(null);
      return;
    }
    
    if (window.confirm(`¿Estás seguro de eliminar este ${type === 'exam' ? 'examen' : 'simulacro'}?`)) {
      if (type === 'exam') {
        setExams(exams.filter((e) => e.id !== id));
      } else {
        setSimulations(simulations.filter((s) => s.id !== id));
      }
    }
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event, item, type) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItem({ ...item, type });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedItem(null);
  };

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSimulations = simulations.filter((sim) =>
    sim.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTable = (data, type) => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>{type === 'exam' ? 'Examen' : 'Simulacro'}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Curso</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Preguntas</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Duración</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Puntuación Min.</TableCell>
            {type === 'simulation' && (
              <TableCell sx={{ fontWeight: 600 }}>Dificultad</TableCell>
            )}
            <TableCell sx={{ fontWeight: 600 }}>Intentos</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Prom. Puntos</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
              <TableCell>
                <Box>
                  <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
                  {!item.isPublished && (
                    <Chip
                      label="No Publicado"
                      size="small"
                      sx={{
                        mt: 0.5,
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: '#ff57220a',
                        color: '#ff5722',
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: '0.875rem' }}>
                  {item.course.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FileText size={16} color="#666" />
                  {item.questions}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Clock size={16} color="#666" />
                  {item.duration} min
                </Box>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>{item.passingScore}%</Typography>
              </TableCell>
              {type === 'simulation' && (
                <TableCell>
                  <Chip
                    label={item.difficulty}
                    size="small"
                    sx={{
                      bgcolor:
                        item.difficulty === 'Básico'
                          ? '#4caf500a'
                          : item.difficulty === 'Intermedio'
                          ? '#00acc10a'
                          : '#ff57220a',
                      color:
                        item.difficulty === 'Básico'
                          ? '#4caf50'
                          : item.difficulty === 'Intermedio'
                          ? '#00acc1'
                          : '#ff5722',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
              )}
              <TableCell>
                <Typography sx={{ fontWeight: 500 }}>{item.attempts}</Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircle
                    size={16}
                    color={item.avgScore >= item.passingScore ? '#4caf50' : '#ff5722'}
                  />
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: item.avgScore >= item.passingScore ? '#4caf50' : '#ff5722',
                    }}
                  >
                    {item.avgScore}%
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={item.status}
                  size="small"
                  sx={{
                    bgcolor: item.status === 'Activo' ? '#4caf500a' : '#9e9e9e0a',
                    color: item.status === 'Activo' ? '#4caf50' : '#9e9e9e',
                    fontWeight: 600,
                  }}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, item, type)}
                >
                  <MoreVertical size={18} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Exámenes y Simulacros
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Gestiona las evaluaciones de los cursos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenDialog(null, activeTab === 0 ? 'exam' : 'simulation')}
          sx={{
            bgcolor: '#ff5722',
            '&:hover': { bgcolor: '#e64a19' },
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          {activeTab === 0 ? 'Nuevo Examen' : 'Nuevo Simulacro'}
        </Button>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
            },
          }}
        >
          <Tab
            icon={<FileText size={20} />}
            iconPosition="start"
            label={`Exámenes (${exams.length})`}
          />
          <Tab
            icon={<ClipboardList size={20} />}
            iconPosition="start"
            label={`Simulacros (${simulations.length})`}
          />
        </Tabs>
      </Card>

      {/* Search */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder={`Buscar ${activeTab === 0 ? 'exámenes' : 'simulacros'}...`}
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
        </CardContent>
      </Card>

      {/* Table */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {activeTab === 0
          ? renderTable(filteredExams, 'exam')
          : renderTable(filteredSimulations, 'simulation')}
      </Card>

      {/* Context Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleOpenDialog(selectedItem, selectedItem?.type);
            handleMenuClose();
          }}
        >
          <Edit size={18} style={{ marginRight: 8 }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => handleDelete(selectedItem?.id, selectedItem?.type)}
          sx={{ color: 'error.main' }}
        >
          <Trash2 size={18} style={{ marginRight: 8 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingItem?.id
            ? `Editar ${editingItem?.type === 'exam' ? 'Examen' : 'Simulacro'}`
            : `Crear Nuevo ${editingItem?.type === 'exam' ? 'Examen' : 'Simulacro'}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                select
                label="Curso"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{xs:12}} md={4}>
              <TextField
                fullWidth
                label="Número de Preguntas"
                type="number"
                value={formData.questions}
                onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
              />
            </Grid>
            <Grid size={{xs:12}} md={4}>
              <TextField
                fullWidth
                label="Duración (minutos)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </Grid>
            <Grid size={{xs:12}} md={4}>
              <TextField
                fullWidth
                label="Puntuación Mínima (%)"
                type="number"
                value={formData.passingScore}
                onChange={(e) =>
                  setFormData({ ...formData, passingScore: e.target.value })
                }
              />
            </Grid>
            {editingItem?.type === 'simulation' && (
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  select
                  label="Dificultad"
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value })
                  }
                >
                  <MenuItem value="Básico">Básico</MenuItem>
                  <MenuItem value="Intermedio">Intermedio</MenuItem>
                  <MenuItem value="Avanzado">Avanzado</MenuItem>
                </TextField>
              </Grid>
            )}
            <Grid size={{xs:12}} md={6}>
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
            <Grid size={{xs:12}} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublished: e.target.checked })
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#ff5722',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#ff5722',
                      },
                    }}
                  />
                }
                label="Publicado"
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: '#ff5722',
              '&:hover': { bgcolor: '#e64a19' },
              textTransform: 'none',
            }}
          >
            {editingItem?.id ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamsManagement;