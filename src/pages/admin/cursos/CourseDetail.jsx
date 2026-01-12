// NOTA: Este archivo es muy extenso. Lo dividiré conceptualmente en secciones
// Para uso real, considerar dividir en componentes más pequeños

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Typography, Grid, TextField, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, Chip, List, ListItem,
  ListItemText, ListItemSecondaryAction, Divider, Tab, Tabs, Alert,
  CircularProgress, Snackbar, LinearProgress,
} from '@mui/material';
import {
  ArrowLeft, Save, Plus, Edit, Trash2, ChevronDown, GripVertical,
  PlayCircle, FileText, Paperclip, Clock, Eye, EyeOff, Upload,
} from 'lucide-react';
import tutorService from '../../../services/tutorService';
import courseService from '../../../services/courseService';
import lessonService from '../../../services/lessonService';
import moduleService from '../../../services/moduleService';


const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados principales
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);

  // Datos
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
  const [tutors, setTutors] = useState([]);

  // Diálogos
  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // Estados de upload
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [uploadingResource, setUploadingResource] = useState(false);
  const [resourceProgress, setResourceProgress] = useState(0);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Forms
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', isPublished: false });
  const [lessonForm, setLessonForm] = useState({
    title: '', description: '', duration: 0, videoUrl: '', tutorId: '',
    isPublished: false, resources: [], videoFile: null
  });
  const [resourceForm, setResourceForm] = useState({ name: '', type: 'pdf', file: null });

  useEffect(() => {
    loadCourseData();
    loadTutors();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourse(id);
      const course = response.data;

      setCourseData({
        id: course._id,
        name: course.name,
        tutor: course.tutor?._id || '',
        category: course.category,
        status: course.status,
        description: course.description || '',
        thumbnail: course.thumbnail || '',
        whatYouWillLearn: course.whatYouWillLearn || [],
        requirements: course.requirements || [],
        targetAudience: course.targetAudience || '',
      });

      if (course.modules) {
        const transformedModules = course.modules.map(m => ({
          id: m._id,
          title: m.title,
          description: m.description,
          order: m.order,
          isPublished: m.isPublished,
          lessons: (m.lessons || []).map(l => ({
            id: l._id,
            title: l.title,
            description: l.description,
            duration: l.duration || 0,
            videoUrl: l.videoUrl || '',
            videoId: l.videoId || '',
            tutor: l.tutor?._id || '',
            resources: l.resources || [],
            isPublished: l.isPublished,
            order: l.order,
          }))
        }));
        setModules(transformedModules);
      }
    } catch (err) {
      console.error('Error loading course:', err);
      showSnackbar('Error al cargar el curso', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadTutors = async () => {
    try {
      const response = await tutorService.getTutors();
      const transformedTutors = response.data.map(t => ({
        id: t._id,
        name: `${t.user.firstName} ${t.user.lastName}`
      }));
      setTutors(transformedTutors);
    } catch (err) {
      console.error('Error loading tutors:', err);
    }
  };

  const handleSaveCourseInfo = async () => {
    try {
      setSaving(true);
      await courseService.updateCourse(id, courseData);
      showSnackbar('Información del curso guardada', 'success');
      loadCourseData();
    } catch (err) {
      showSnackbar(err.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadThumbnail = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingThumbnail(true);
      const response = await courseService.uploadThumbnail(id, file);
      setCourseData({ ...courseData, thumbnail: response.data.thumbnail });
      showSnackbar('Imagen actualizada', 'success');
    } catch (err) {
      showSnackbar('Error al subir imagen', 'error');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // ===== MÓDULOS =====
  const handleOpenModuleDialog = (module = null) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({ title: module.title, description: module.description, isPublished: module.isPublished });
    } else {
      setEditingModule(null);
      setModuleForm({ title: '', description: '', isPublished: false });
    }
    setOpenModuleDialog(true);
  };

  const handleSaveModule = async () => {
    if (!moduleForm.title) {
      showSnackbar('El título es requerido', 'error');
      return;
    }

    try {
      if (editingModule) {
        await moduleService.updateModule(editingModule.id, moduleForm);
        showSnackbar('Módulo actualizado', 'success');
      } else {
        await moduleService.createModule({ ...moduleForm, course: id });
        showSnackbar('Módulo creado', 'success');
      }
      setOpenModuleDialog(false);
      loadCourseData();
    } catch (err) {
      showSnackbar(err.message || 'Error al guardar módulo', 'error');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('¿Eliminar este módulo y todas sus lecciones?')) return;

    try {
      await moduleService.deleteModule(moduleId);
      showSnackbar('Módulo eliminado', 'success');
      loadCourseData();
    } catch (err) {
      showSnackbar('Error al eliminar módulo', 'error');
    }
  };

  // ===== LECCIONES =====
  const handleOpenLessonDialog = (moduleId, lesson = null) => {
    setSelectedModuleId(moduleId);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
        tutorId: lesson.tutor,
        isPublished: lesson.isPublished,
        resources: lesson.resources,
        videoFile: null,
      });
    } else {
      setEditingLesson(null);
      setLessonForm({
        title: '', description: '', duration: 0, videoUrl: '', tutorId: tutors[0]?.id || '',
        isPublished: false, resources: [], videoFile: null
      });
    }
    setOpenLessonDialog(true);
  };

  const handleSaveLesson = async () => {
    if (!lessonForm.title) {
      showSnackbar('El título es requerido', 'error');
      return;
    }

    try {
      const lessonData = {
        title: lessonForm.title,
        description: lessonForm.description,
        duration: lessonForm.duration,
        tutor: lessonForm.tutorId,
        isPublished: lessonForm.isPublished,
        module: selectedModuleId,
        course: id,
      };

      let lessonId;
      if (editingLesson) {
        await lessonService.updateLesson(editingLesson.id, lessonData);
        lessonId = editingLesson.id;
        showSnackbar('Lección actualizada', 'success');
      } else {
        const response = await lessonService.createLesson(lessonData);
        lessonId = response.data._id;
        showSnackbar('Lección creada', 'success');
      }

      // Subir video si hay uno nuevo
      if (lessonForm.videoFile) {
        setUploadingVideo(true);
        await lessonService.uploadVideo(lessonId, lessonForm.videoFile, (progress) => {
          setVideoProgress(progress);
        });
        setUploadingVideo(false);
        setVideoProgress(0);
        showSnackbar('Video subido exitosamente', 'success');
      }

      setOpenLessonDialog(false);
      loadCourseData();
    } catch (err) {
      showSnackbar(err.message || 'Error al guardar lección', 'error');
      setUploadingVideo(false);
    }
  };

  const handleDeleteLesson = async (moduleId, lessonId) => {
    if (!window.confirm('¿Eliminar esta lección?')) return;

    try {
      await lessonService.deleteLesson(lessonId);
      showSnackbar('Lección eliminada', 'success');
      loadCourseData();
    } catch (err) {
      showSnackbar('Error al eliminar lección', 'error');
    }
  };

  const handleVideoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLessonForm({ ...lessonForm, videoFile: file });
    }
  };

  // ===== RECURSOS =====
  const handleAddResource = async () => {
    if (!resourceForm.file) {
      showSnackbar('Selecciona un archivo', 'error');
      return;
    }

    try {
      setUploadingResource(true);
      const response = await lessonService.addResource(
        editingLesson.id,
        resourceForm.file,
        { name: resourceForm.name || resourceForm.file.name, type: resourceForm.type },
        (progress) => setResourceProgress(progress)
      );

      setLessonForm({ ...lessonForm, resources: response.data });
      setResourceForm({ name: '', type: 'pdf', file: null });
      setOpenResourceDialog(false);
      showSnackbar('Recurso agregado', 'success');
    } catch (err) {
      showSnackbar('Error al agregar recurso', 'error');
    } finally {
      setUploadingResource(false);
      setResourceProgress(0);
    }
  };

  const handleRemoveResource = async (resourceId) => {
    if (!editingLesson) return;

    try {
      await lessonService.deleteResource(editingLesson.id, resourceId);
      setLessonForm({
        ...lessonForm,
        resources: lessonForm.resources.filter(r => r._id !== resourceId)
      });
      showSnackbar('Recurso eliminado', 'success');
    } catch (err) {
      showSnackbar('Error al eliminar recurso', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDuration = modules.reduce((acc, m) =>
    acc + m.lessons.reduce((sum, l) => sum + (l.duration || 0), 0), 0
  );
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#ff5722' }} />
      </Box>
    );
  }

  if (!courseData) {
    return <Alert severity="error">Curso no encontrado</Alert>;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/courses')}>
          <ArrowLeft />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{courseData.name}</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip label={courseData.status} size="small" color="primary" />
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              {totalLessons} lecciones · {hours}h {minutes}m
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<Save size={18} />} onClick={handleSaveCourseInfo}
          disabled={saving} sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none' }}>
          {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Guardar Cambios'}
        </Button>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '1rem' } }}>
          <Tab label="Información General" />
          <Tab label={'Contenido del Curso'} />
        </Tabs>
      </Card>

      {/* Tab 0: Información General */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Información del Curso</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Título del Curso" value={courseData.name}
                      onChange={(e) => setCourseData({ ...courseData, name: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Descripción" multiline rows={4} value={courseData.description}
                      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth select label="Categoría" value={courseData.category}
                      onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}>
                      {['3D y Animación', 'Diseño Web y App', 'Ilustración', 'Fotografía', 'Marketing', 'Programación'].map(cat =>
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      )}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth select label="Estado" value={courseData.status}
                      onChange={(e) => setCourseData({ ...courseData, status: e.target.value })}>
                      <MenuItem value="Activo">Activo</MenuItem>
                      <MenuItem value="Borrador">Borrador</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Público Objetivo" multiline rows={2} value={courseData.targetAudience}
                      onChange={(e) => setCourseData({ ...courseData, targetAudience: e.target.value })} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Imagen del Curso</Typography>
                {courseData.thumbnail && (
                  <Box component="img" src={courseData.thumbnail}
                    sx={{ width: '100%', borderRadius: 2, mb: 2 }} />
                )}
                <input accept="image/*" style={{ display: 'none' }} id="thumbnail-upload" type="file"
                  onChange={handleUploadThumbnail} />
                <label htmlFor="thumbnail-upload">
                  <Button fullWidth variant="outlined" component="span" disabled={uploadingThumbnail}
                    sx={{ textTransform: 'none' }}>
                    {uploadingThumbnail ? <CircularProgress size={20} /> : 'Cambiar Imagen'}
                  </Button>
                </label>
              </CardContent>
            </Card>

            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Estadísticas</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Total Módulos</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{modules.length}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Total Lecciones</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{totalLessons}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Duración Total</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{hours}h {minutes}m</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Contenido del Curso */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => handleOpenModuleDialog()}
              sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none' }}>
              Agregar Módulo
            </Button>
          </Box>

          {modules.length === 0 ? (
            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>No hay módulos creados</Typography>
                <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                  Comienza agregando el primer módulo de tu curso
                </Typography>
                <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => handleOpenModuleDialog()}
                  sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none' }}>
                  Crear Primer Módulo
                </Button>
              </CardContent>
            </Card>
          ) : (
            modules.map((module) => (
              <Accordion key={module.id} sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ChevronDown />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                    <GripVertical size={20} color="#999" />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>{module.title}</Typography>
                        <Chip label={module.isPublished ? 'Publicado' : 'Borrador'} size="small"
                          sx={{
                            bgcolor: module.isPublished ? '#4caf500a' : '#ff57220a',
                            color: module.isPublished ? '#4caf50' : '#ff5722', fontWeight: 600
                          }} />
                      </Box>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                        {module.lessons.length} lecciones
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenModuleDialog(module); }}>
                        <Edit size={18} />
                      </IconButton>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.id); }}>
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: 'text.secondary', mb: 3 }}>{module.description}</Typography>

                  {module.lessons.length > 0 ? (
                    <List sx={{ bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
                      {module.lessons.map((lesson, idx) => (
                        <ListItem key={lesson.id}
                          sx={{ borderBottom: idx < module.lessons.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <GripVertical size={16} color="#999" />
                            <PlayCircle size={20} color="#666" />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontWeight: 500 }}>{lesson.title}</Typography>
                                {!lesson.isPublished && <EyeOff size={14} color="#ff5722" />}
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                  <Clock size={12} style={{ verticalAlign: 'middle' }} /> {formatDuration(lesson.duration)}
                                </Typography>
                                {lesson.resources.length > 0 && (
                                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                    <Paperclip size={12} style={{ verticalAlign: 'middle' }} /> {lesson.resources.length} recursos
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" onClick={() => handleOpenLessonDialog(module.id, lesson)}>
                                <Edit size={16} />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteLesson(module.id, lesson.id)}>
                                <Trash2 size={16} />
                              </IconButton>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>Este módulo no tiene lecciones aún</Alert>
                  )}

                  <Button startIcon={<Plus size={16} />} onClick={() => handleOpenLessonDialog(module.id)}
                    sx={{ textTransform: 'none' }}>
                    Agregar Lección
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>
      )}

      {/* Tab 2: Configuración */}
      {activeTab === 2 && (
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Configuración del Curso</Typography>
            <Typography sx={{ color: 'text.secondary' }}>Configuraciones adicionales próximamente...</Typography>
          </CardContent>
        </Card>
      )}

      {/* Module Dialog */}
      <Dialog open={openModuleDialog} onClose={() => setOpenModuleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editingModule ? 'Editar Módulo' : 'Nuevo Módulo'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Título del Módulo" value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                placeholder="Ej: Módulo 1: Fundamentos" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Descripción" multiline rows={3} value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Estado:</Typography>
                <Chip label={moduleForm.isPublished ? 'Publicado' : 'Borrador'} size="small"
                  onClick={() => setModuleForm({ ...moduleForm, isPublished: !moduleForm.isPublished })}
                  sx={{
                    cursor: 'pointer', bgcolor: moduleForm.isPublished ? '#4caf500a' : '#ff57220a',
                    color: moduleForm.isPublished ? '#4caf50' : '#ff5722'
                  }} />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenModuleDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveModule}
            sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none' }}>
            {editingModule ? 'Guardar Cambios' : 'Crear Módulo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={openLessonDialog} onClose={() => setOpenLessonDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editingLesson ? 'Editar Lección' : 'Nueva Lección'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Título de la Lección" value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                placeholder="Ej: Bienvenida al curso" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Descripción" multiline rows={3} value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Duración (segundos)" type="number" value={lessonForm.duration}
                onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth select label="Tutor" value={lessonForm.tutorId}
                onChange={(e) => setLessonForm({ ...lessonForm, tutorId: e.target.value })}>
                {tutors.map((tutor) => <MenuItem key={tutor.id} value={tutor.id}>{tutor.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ border: '1px dashed #ddd', borderRadius: 1, p: 2, textAlign: 'center' }}>
                <input accept="video/*" style={{ display: 'none' }} id="video-upload" type="file"
                  onChange={handleVideoFileChange} />
                <label htmlFor="video-upload">
                  <Button variant="outlined" component="span" startIcon={<Upload size={18} />}
                    sx={{ textTransform: 'none' }}>
                    {lessonForm.videoFile ? lessonForm.videoFile.name : 'Seleccionar Video'}
                  </Button>
                </label>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                  El video se subirá a Bunny.net al guardar
                </Typography>
              </Box>
              {uploadingVideo && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={videoProgress} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Subiendo video: {videoProgress}%
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Estado:</Typography>
                <Chip label={lessonForm.isPublished ? 'Publicado' : 'Borrador'} size="small"
                  onClick={() => setLessonForm({ ...lessonForm, isPublished: !lessonForm.isPublished })}
                  sx={{
                    cursor: 'pointer', bgcolor: lessonForm.isPublished ? '#4caf500a' : '#ff57220a',
                    color: lessonForm.isPublished ? '#4caf50' : '#ff5722'
                  }} />
              </Box>
            </Grid>
            {editingLesson && (
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Recursos Adjuntos</Typography>
                  <Button size="small" startIcon={<Plus size={16} />} onClick={() => setOpenResourceDialog(true)}
                    sx={{ textTransform: 'none' }}>
                    Agregar Recurso
                  </Button>
                </Box>
                {lessonForm.resources.length > 0 ? (
                  <List sx={{ bgcolor: '#f8f9fa', borderRadius: 1 }}>
                    {lessonForm.resources.map((resource) => (
                      <ListItem key={resource._id}>
                        <FileText size={16} style={{ marginRight: 8 }} />
                        <ListItemText primary={resource.name} secondary={resource.type.toUpperCase()} />
                        <ListItemSecondaryAction>
                          <IconButton size="small" onClick={() => handleRemoveResource(resource._id)}>
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
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenLessonDialog(false)} disabled={uploadingVideo}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveLesson} disabled={uploadingVideo}
            sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none' }}>
            {editingLesson ? 'Guardar Cambios' : 'Crear Lección'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resource Dialog */}
      <Dialog open={openResourceDialog} onClose={() => setOpenResourceDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Agregar Recurso</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Nombre del Archivo" value={resourceForm.name}
                onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                placeholder="Ej: Slides-Introduccion.pdf" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth select label="Tipo" value={resourceForm.type}
                onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="zip">ZIP</MenuItem>
                <MenuItem value="doc">Documento</MenuItem>
                <MenuItem value="link">Enlace</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <input accept="*/*" style={{ display: 'none' }} id="resource-upload" type="file"
                onChange={(e) => setResourceForm({ ...resourceForm, file: e.target.files[0] })} />
              <label htmlFor="resource-upload">
                <Button fullWidth variant="outlined" component="span" startIcon={<Upload size={18} />}
                  sx={{ textTransform: 'none' }}>
                  {resourceForm.file ? resourceForm.file.name : 'Seleccionar Archivo'}
                </Button>
              </label>
            </Grid>
            {uploadingResource && (
              <Grid size={{ xs: 12 }}>
                <LinearProgress variant="determinate" value={resourceProgress} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Subiendo: {resourceProgress}%
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenResourceDialog(false)} disabled={uploadingResource}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddResource} disabled={uploadingResource}
            sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' }, textTransform: 'none' }}>
            Agregar
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

export default CourseDetail;