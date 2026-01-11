import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tab,
  Tabs,
  Paper,
  Alert,
} from '@mui/material';
import {
  ArrowLeft,
  Save,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  GripVertical,
  PlayCircle,
  FileText,
  Paperclip,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Datos básicos del curso
  const [courseData, setCourseData] = useState({
    id: parseInt(id),
    name: 'Introducción a After Effects',
    tutor: { id: 1, name: 'Carlos Albarrán' },
    category: '3D y Animación',
    status: 'Activo',
    description: 'Aprende los fundamentos de After Effects desde cero.',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    whatYouWillLearn: [
      'Dominar la interfaz de After Effects',
      'Crear animaciones básicas',
      'Trabajar con capas y composiciones',
    ],
    requirements: [
      'Computadora con After Effects instalado',
      'Conocimientos básicos de diseño',
    ],
    targetAudience: 'Diseñadores, animadores y creativos que quieran aprender motion graphics',
  });

  // Módulos y temas
  const [modules, setModules] = useState([
    {
      id: 1,
      title: 'Módulo 1: Fundamentos',
      description: 'Introducción a la interfaz y conceptos básicos',
      order: 1,
      isPublished: true,
      lessons: [
        {
          id: 1,
          title: 'Bienvenida al curso',
          description: 'Presentación del instructor y objetivos del curso',
          duration: '05:30',
          videoUrl: 'https://example.com/video1.mp4',
          tutor: { id: 1, name: 'Carlos Albarrán' },
          resources: [
            { id: 1, name: 'Slides-Introduccion.pdf', type: 'pdf', url: '#' },
            { id: 2, name: 'Recursos.zip', type: 'zip', url: '#' },
          ],
          isPublished: true,
          order: 1,
        },
        {
          id: 2,
          title: 'Instalación y configuración',
          description: 'Cómo instalar After Effects y configurar tu espacio de trabajo',
          duration: '12:45',
          videoUrl: '',
          tutor: { id: 1, name: 'Carlos Albarrán' },
          resources: [],
          isPublished: false,
          order: 2,
        },
      ],
    },
    {
      id: 2,
      title: 'Módulo 2: Herramientas Avanzadas',
      description: 'Profundiza en las capacidades de After Effects',
      order: 2,
      isPublished: false,
      lessons: [],
    },
  ]);

  const [tutors] = useState([
    { id: 1, name: 'Carlos Albarrán' },
    { id: 2, name: 'Samuel Hermoso' },
    { id: 3, name: 'Ana García' },
  ]);

  // Diálogos
  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // Form states
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    isPublished: false,
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    duration: '',
    videoUrl: '',
    tutorId: 1,
    isPublished: false,
    resources: [],
  });

  const [resourceForm, setResourceForm] = useState({
    name: '',
    type: 'pdf',
    url: '',
  });

  // Module handlers
  const handleOpenModuleDialog = (module = null) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({
        title: module.title,
        description: module.description,
        isPublished: module.isPublished,
      });
    } else {
      setEditingModule(null);
      setModuleForm({
        title: '',
        description: '',
        isPublished: false,
      });
    }
    setOpenModuleDialog(true);
  };

  const handleSaveModule = () => {
    if (editingModule) {
      setModules(
        modules.map((m) =>
          m.id === editingModule.id
            ? { ...m, ...moduleForm }
            : m
        )
      );
    } else {
      const newModule = {
        id: modules.length + 1,
        ...moduleForm,
        order: modules.length + 1,
        lessons: [],
      };
      setModules([...modules, newModule]);
    }
    setOpenModuleDialog(false);
  };

  const handleDeleteModule = (moduleId) => {
    if (window.confirm('¿Estás seguro de eliminar este módulo y todas sus lecciones?')) {
      setModules(modules.filter((m) => m.id !== moduleId));
    }
  };

  // Lesson handlers
  const handleOpenLessonDialog = (moduleId, lesson = null) => {
    setSelectedModuleId(moduleId);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
        tutorId: lesson.tutor.id,
        isPublished: lesson.isPublished,
        resources: lesson.resources,
      });
    } else {
      setEditingLesson(null);
      setLessonForm({
        title: '',
        description: '',
        duration: '',
        videoUrl: '',
        tutorId: 1,
        isPublished: false,
        resources: [],
      });
    }
    setOpenLessonDialog(true);
  };

  const handleSaveLesson = () => {
    const lessonData = {
      ...lessonForm,
      tutor: tutors.find((t) => t.id === lessonForm.tutorId),
    };

    setModules(
      modules.map((m) => {
        if (m.id === selectedModuleId) {
          if (editingLesson) {
            return {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === editingLesson.id ? { ...l, ...lessonData } : l
              ),
            };
          } else {
            const newLesson = {
              id: Date.now(),
              ...lessonData,
              order: m.lessons.length + 1,
            };
            return {
              ...m,
              lessons: [...m.lessons, newLesson],
            };
          }
        }
        return m;
      })
    );
    setOpenLessonDialog(false);
  };

  const handleDeleteLesson = (moduleId, lessonId) => {
    if (window.confirm('¿Estás seguro de eliminar esta lección?')) {
      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );
    }
  };

  // Resource handlers
  const handleAddResource = () => {
    if (resourceForm.name && resourceForm.url) {
      const newResource = {
        id: Date.now(),
        ...resourceForm,
      };
      setLessonForm({
        ...lessonForm,
        resources: [...lessonForm.resources, newResource],
      });
      setResourceForm({ name: '', type: 'pdf', url: '' });
      setOpenResourceDialog(false);
    }
  };

  const handleRemoveResource = (resourceId) => {
    setLessonForm({
      ...lessonForm,
      resources: lessonForm.resources.filter((r) => r.id !== resourceId),
    });
  };

  const handleSaveCourseInfo = () => {
    alert('Información del curso guardada');
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDuration = modules.reduce((acc, m) => {
    const moduleDuration = m.lessons.reduce((sum, l) => {
      const [min, sec] = l.duration.split(':').map(Number);
      return sum + (min * 60 + sec);
    }, 0);
    return acc + moduleDuration;
  }, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/courses')}>
          <ArrowLeft />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {courseData.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip label={courseData.status} size="small" color="primary" />
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              {totalLessons} lecciones · {hours}h {minutes}m
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Save size={18} />}
          onClick={handleSaveCourseInfo}
          sx={{
            bgcolor: '#ff5722',
            '&:hover': { bgcolor: '#e64a19' },
            textTransform: 'none',
          }}
        >
          Guardar Cambios
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
          <Tab label="Información General" />
          <Tab label={`Contenido del Curso (${modules.length} módulos)`} />
          <Tab label="Configuración" />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* General Info */}
          <Grid size={{xs:12}} md={8}>
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Información del Curso
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs:12}}>
                    <TextField
                      fullWidth
                      label="Título del Curso"
                      value={courseData.name}
                      onChange={(e) =>
                        setCourseData({ ...courseData, name: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid size={{xs:12}}>
                    <TextField
                      fullWidth
                      label="Descripción"
                      multiline
                      rows={4}
                      value={courseData.description}
                      onChange={(e) =>
                        setCourseData({ ...courseData, description: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid size={{xs:12,md:6}}>
                    <TextField
                      fullWidth
                      select
                      label="Categoría"
                      value={courseData.category}
                      onChange={(e) =>
                        setCourseData({ ...courseData, category: e.target.value })
                      }
                    >
                      <MenuItem value="3D y Animación">3D y Animación</MenuItem>
                      <MenuItem value="Diseño Web y App">Diseño Web y App</MenuItem>
                      <MenuItem value="Ilustración">Ilustración</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{xs:12,md:6}}>
                    <TextField
                      fullWidth
                      select
                      label="Estado"
                      value={courseData.status}
                      onChange={(e) =>
                        setCourseData({ ...courseData, status: e.target.value })
                      }
                    >
                      <MenuItem value="Activo">Activo</MenuItem>
                      <MenuItem value="Borrador">Borrador</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{xs:12}}>
                    <TextField
                      fullWidth
                      label="Público Objetivo"
                      multiline
                      rows={2}
                      value={courseData.targetAudience}
                      onChange={(e) =>
                        setCourseData({ ...courseData, targetAudience: e.target.value })
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* What you will learn */}
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  ¿Qué aprenderás?
                </Typography>
                <List>
                  {courseData.whatYouWillLearn.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={item} />
                      <ListItemSecondaryAction>
                        <IconButton size="small">
                          <Trash2 size={16} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button
                  startIcon={<Plus size={16} />}
                  sx={{ textTransform: 'none', mt: 1 }}
                >
                  Agregar objetivo
                </Button>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Requisitos
                </Typography>
                <List>
                  {courseData.requirements.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={item} />
                      <ListItemSecondaryAction>
                        <IconButton size="small">
                          <Trash2 size={16} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button
                  startIcon={<Plus size={16} />}
                  sx={{ textTransform: 'none', mt: 1 }}
                >
                  Agregar requisito
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid size={{xs:12}} md={4}>
            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Imagen del Curso
                </Typography>
                <Box
                  component="img"
                  src={courseData.thumbnail}
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                >
                  Cambiar Imagen
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Estadísticas
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Total Módulos
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {modules.length}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Total Lecciones
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {totalLessons}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Duración Total
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {hours}h {minutes}m
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          {/* Add Module Button */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => handleOpenModuleDialog()}
              sx={{
                bgcolor: '#ff5722',
                '&:hover': { bgcolor: '#e64a19' },
                textTransform: 'none',
              }}
            >
              Agregar Módulo
            </Button>
          </Box>

          {modules.length === 0 ? (
            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                  No hay módulos creados
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                  Comienza agregando el primer módulo de tu curso
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Plus size={18} />}
                  onClick={() => handleOpenModuleDialog()}
                  sx={{
                    bgcolor: '#ff5722',
                    '&:hover': { bgcolor: '#e64a19' },
                    textTransform: 'none',
                  }}
                >
                  Crear Primer Módulo
                </Button>
              </CardContent>
            </Card>
          ) : (
            modules.map((module, index) => (
              <Accordion
                key={module.id}
                sx={{
                  mb: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ChevronDown />}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      width: '100%',
                      pr: 2,
                    }}
                  >
                    <GripVertical size={20} color="#999" />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                          {module.title}
                        </Typography>
                        <Chip
                          label={module.isPublished ? 'Publicado' : 'Borrador'}
                          size="small"
                          sx={{
                            bgcolor: module.isPublished ? '#4caf500a' : '#ff57220a',
                            color: module.isPublished ? '#4caf50' : '#ff5722',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                        {module.lessons.length} lecciones
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModuleDialog(module);
                        }}
                      >
                        <Edit size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module.id);
                        }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                    {module.description}
                  </Typography>

                  {/* Lessons */}
                  {module.lessons.length > 0 ? (
                    <List sx={{ bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <ListItem
                          key={lesson.id}
                          sx={{
                            borderBottom:
                              lessonIndex < module.lessons.length - 1
                                ? '1px solid #e0e0e0'
                                : 'none',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <GripVertical size={16} color="#999" />
                            <PlayCircle size={20} color="#666" />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontWeight: 500 }}>{lesson.title}</Typography>
                                {!lesson.isPublished && (
                                  <EyeOff size={14} color="#ff5722" />
                                )}
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  mt: 0.5,
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
                                >
                                  <Clock size={12} style={{ verticalAlign: 'middle' }} />{' '}
                                  {lesson.duration}
                                </Typography>
                                {lesson.resources.length > 0 && (
                                  <Typography
                                    sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
                                  >
                                    <Paperclip size={12} style={{ verticalAlign: 'middle' }} />{' '}
                                    {lesson.resources.length} recursos
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenLessonDialog(module.id, lesson)}
                              >
                                <Edit size={16} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteLesson(module.id, lesson.id)}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Este módulo no tiene lecciones aún
                    </Alert>
                  )}

                  <Button
                    startIcon={<Plus size={16} />}
                    onClick={() => handleOpenLessonDialog(module.id)}
                    sx={{ textTransform: 'none' }}
                  >
                    Agregar Lección
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Configuración del Curso
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Configuraciones adicionales próximamente...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Module Dialog */}
      <Dialog open={openModuleDialog} onClose={() => setOpenModuleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingModule ? 'Editar Módulo' : 'Nuevo Módulo'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Título del Módulo"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                placeholder="Ej: Módulo 1: Fundamentos"
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={moduleForm.description}
                onChange={(e) =>
                  setModuleForm({ ...moduleForm, description: e.target.value })
                }
              />
            </Grid>
            <Grid size={{xs:12}}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Estado:</Typography>
                <Chip
                  label={moduleForm.isPublished ? 'Publicado' : 'Borrador'}
                  size="small"
                  onClick={() =>
                    setModuleForm({ ...moduleForm, isPublished: !moduleForm.isPublished })
                  }
                  sx={{
                    cursor: 'pointer',
                    bgcolor: moduleForm.isPublished ? '#4caf500a' : '#ff57220a',
                    color: moduleForm.isPublished ? '#4caf50' : '#ff5722',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenModuleDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveModule}
            sx={{
              bgcolor: '#ff5722',
              '&:hover': { bgcolor: '#e64a19' },
              textTransform: 'none',
            }}
          >
            {editingModule ? 'Guardar Cambios' : 'Crear Módulo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog
        open={openLessonDialog}
        onClose={() => setOpenLessonDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingLesson ? 'Editar Lección' : 'Nueva Lección'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Título de la Lección"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                placeholder="Ej: Bienvenida al curso"
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={lessonForm.description}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, description: e.target.value })
                }
              />
            </Grid>
            <Grid size={{xs:12,md:6}}>
              <TextField
                fullWidth
                label="Duración (MM:SS)"
                value={lessonForm.duration}
                onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                placeholder="05:30"
              />
            </Grid>
            <Grid size={{xs:12,md:6}}>
              <TextField
                fullWidth
                select
                label="Tutor"
                value={lessonForm.tutorId}
                onChange={(e) => setLessonForm({ ...lessonForm, tutorId: e.target.value })}
              >
                {tutors.map((tutor) => (
                  <MenuItem key={tutor.id} value={tutor.id}>
                    {tutor.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="URL del Video"
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                placeholder="https://ejemplo.com/video.mp4"
              />
            </Grid>
            <Grid size={{xs:12}}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Estado:</Typography>
                <Chip
                  label={lessonForm.isPublished ? 'Publicado' : 'Borrador'}
                  size="small"
                  onClick={() =>
                    setLessonForm({ ...lessonForm, isPublished: !lessonForm.isPublished })
                  }
                  sx={{
                    cursor: 'pointer',
                    bgcolor: lessonForm.isPublished ? '#4caf500a' : '#ff57220a',
                    color: lessonForm.isPublished ? '#4caf50' : '#ff5722',
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{xs:12}}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Recursos Adjuntos
                </Typography>
                <Button
                  size="small"
                  startIcon={<Plus size={16} />}
                  onClick={() => setOpenResourceDialog(true)}
                  sx={{ textTransform: 'none' }}
                >
                  Agregar Recurso
                </Button>
              </Box>
              {lessonForm.resources.length > 0 ? (
                <List sx={{ bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  {lessonForm.resources.map((resource) => (
                    <ListItem key={resource.id}>
                      <FileText size={16} style={{ marginRight: 8 }} />
                      <ListItemText
                        primary={resource.name}
                        secondary={resource.type.toUpperCase()}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveResource(resource.id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  No hay recursos adjuntos
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenLessonDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveLesson}
            sx={{
              bgcolor: '#ff5722',
              '&:hover': { bgcolor: '#e64a19' },
              textTransform: 'none',
            }}
          >
            {editingLesson ? 'Guardar Cambios' : 'Crear Lección'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resource Dialog */}
      <Dialog open={openResourceDialog} onClose={() => setOpenResourceDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Agregar Recurso</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Nombre del Archivo"
                value={resourceForm.name}
                onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                placeholder="Ej: Slides-Introduccion.pdf"
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                select
                label="Tipo"
                value={resourceForm.type}
                onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="zip">ZIP</MenuItem>
                <MenuItem value="doc">Documento</MenuItem>
                <MenuItem value="link">Enlace</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="URL del Recurso"
                value={resourceForm.url}
                onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                placeholder="https://..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenResourceDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAddResource}
            sx={{
              bgcolor: '#ff5722',
              '&:hover': { bgcolor: '#e64a19' },
              textTransform: 'none',
            }}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetail;