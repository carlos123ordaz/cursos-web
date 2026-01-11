import React, { useState } from 'react';
import {
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
} from '@mui/material';
import {
    Play,
    Pause,
    Volume2,
    Settings,
    Maximize,
    SkipBack,
    SkipForward,
    Check,
    Clock,
    FileText,
    Download,
    PlayCircle,
    ChevronDown,
} from 'lucide-react';
import BunnyVideoPlayer from '../../components/user/BunnyVideoPlayer';

const CoursePlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [expandedModule, setExpandedModule] = useState('module1');

    const courseModules = [
        {
            id: 'module1',
            title: 'Módulo 1: Operaciones Básicas',
            description: 'Fundamentos de operaciones matemáticas',
            lessons: [
                { id: 'L1', title: 'Introducción al Razonamiento Matemático', duration: '12:30', completed: true, current: true },
                { id: 'L2', title: 'Suma y Resta de Números Enteros', duration: '15:45', completed: true, current: false },
                { id: 'L3', title: 'Multiplicación y División', duration: '18:20', completed: false, current: false },
                { id: 'L4', title: 'Ejercicios Prácticos - Operaciones', duration: '20:10', completed: false, current: false },
            ],
        },
        {
            id: 'module2',
            title: 'Módulo 2: Fracciones y Decimales',
            description: 'Operaciones con fracciones y números decimales',
            lessons: [
                { id: 'L5', title: 'Introducción a las Fracciones', duration: '14:25', completed: false, current: false },
                { id: 'L6', title: 'Suma y Resta de Fracciones', duration: '16:35', completed: false, current: false },
                { id: 'L7', title: 'Conversión entre Fracciones y Decimales', duration: '13:50', completed: false, current: false },
                { id: 'L8', title: 'Ejercicios Prácticos - Fracciones', duration: '22:15', completed: false, current: false },
            ],
        },
        {
            id: 'module3',
            title: 'Módulo 3: Proporciones y Porcentajes',
            description: 'Problemas de proporciones, regla de tres y porcentajes',
            lessons: [
                { id: 'L9', title: 'Concepto de Proporción', duration: '11:40', completed: false, current: false },
                { id: 'L10', title: 'Regla de Tres Simple', duration: '17:25', completed: false, current: false },
                { id: 'L11', title: 'Cálculo de Porcentajes', duration: '15:30', completed: false, current: false },
                { id: 'L12', title: 'Aplicaciones Prácticas', duration: '19:45', completed: false, current: false },
            ],
        },
        {
            id: 'module4',
            title: 'Módulo 4: Problemas de Razonamiento',
            description: 'Resolución de problemas aplicados',
            lessons: [
                { id: 'L13', title: 'Estrategias de Resolución', duration: '16:20', completed: false, current: false },
                { id: 'L14', title: 'Problemas de Edades', duration: '14:55', completed: false, current: false },
                { id: 'L15', title: 'Problemas de Tiempo y Distancia', duration: '18:40', completed: false, current: false },
                { id: 'L16', title: 'Simulacro Final', duration: '25:00', completed: false, current: false },
            ],
        },
    ];

    const courseResources = [
        { id: 1, name: 'Material de Estudio - Módulo 1.pdf', type: 'PDF', size: '2.5 MB' },
        { id: 2, name: 'Ejercicios Resueltos.pdf', type: 'PDF', size: '1.8 MB' },
        { id: 3, name: 'Formulario Matemático.pdf', type: 'PDF', size: '850 KB' },
    ];

    const totalLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = courseModules.reduce((acc, m) => acc + m.lessons.filter((l) => l.completed).length, 0);
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pb: 4 }}>
            <Container maxWidth="xl" sx={{ pt: 3 }}>
                {/* Course Header */}
                <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 3, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flex: 1 }}>
                            <Chip label="RAZONAMIENTO MATEMÁTICO" size="small" sx={{ bgcolor: '#ff57220a', color: '#ff5722', fontWeight: 600, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Razonamiento Matemático</Typography>
                            <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                                Desarrolla tus habilidades matemáticas para resolver problemas lógicos y numéricos
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Prof. María González</Typography>
                                </Box>
                                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>•</Typography>
                                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{totalLessons} lecciones</Typography>
                                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>•</Typography>
                                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>5h 30m duración</Typography>
                            </Box>
                        </Box>

                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ bgcolor: 'white', borderRadius: 2, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ px: 2, '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '1rem', minWidth: 120 } }}>
                        <Tab label="Presentación" value={0} />
                        <Tab label="Contenido del Curso" value={1} />
                        <Tab label="Recursos" value={2} />
                    </Tabs>
                </Box>

                {/* Main Content */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Left Side - Video Player */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            {/* Video Player */}
                            <Box sx={{ position: 'relative', bgcolor: '#000', aspectRatio: '16/9' }}>
                                <BunnyVideoPlayer
                                    videoId="d6427a8b-4c1d-40fe-8205-cb45912130a9"
                                    libraryId="578582"
                                    title="Introducción al Razonamiento Matemático"
                                    responsive={true}
                                    preload={true}
                                />
                            </Box>
                            <Box sx={{ p: 3, bgcolor: 'white' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Introducción al Razonamiento Matemático</Typography>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                    <Chip icon={<Clock size={14} />} label="12:30" size="small" sx={{ bgcolor: '#f5f5f5' }} />
                                    <Chip icon={<Check size={14} />} label="Completada" size="small" sx={{ bgcolor: '#4caf500a', color: '#4caf50' }} />
                                </Box>
                                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                    En esta lección aprenderás los conceptos fundamentales del razonamiento matemático, las estrategias básicas para resolver problemas y cómo aplicar el pensamiento lógico en diferentes contextos matemáticos.
                                </Typography>
                            </Box>
                        </Paper>
                        <Paper sx={{ borderRadius: 2, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Materiales del curso</Typography>
                            <List sx={{ bgcolor: '#f8f9fa', borderRadius: 1 }}>
                                {courseResources.map((resource) => (
                                    <ListItem key={resource.id} sx={{ borderBottom: resource.id < courseResources.length ? '1px solid #e0e0e0' : 'none', '&:hover': { bgcolor: '#f0f0f0' } }}>
                                        <FileText size={20} color="#666" style={{ marginRight: 16 }} />
                                        <ListItemText primary={resource.name} secondary={`${resource.type} • ${resource.size}`} primaryTypographyProps={{ fontWeight: 500 }} />
                                        <IconButton size="small"><Download size={18} /></IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Box>

                    {/* Right Sidebar - Course Content */}
                    <Box sx={{ width: 400 }}>
                        <Paper sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Contenido del Curso</Typography>
                            </Box>
                            {courseModules.map((module) => (
                                <Accordion key={module.id} expanded={expandedModule === module.id} onChange={() => setExpandedModule(expandedModule === module.id ? null : module.id)} sx={{ boxShadow: 'none', '&:before': { display: 'none' }, borderBottom: '1px solid #e0e0e0' }}>
                                    <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>{module.title}</Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                                {module.lessons.length} lecciones • {module.lessons.filter(l => l.completed).length} completadas
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 0 }}>
                                        <List sx={{ py: 0 }}>
                                            {module.lessons.map((lesson) => (
                                                <ListItem key={lesson.id} button sx={{ py: 1.5, px: 3, bgcolor: lesson.current ? '#ff57220a' : 'transparent', borderLeft: lesson.current ? '3px solid #ff5722' : '3px solid transparent', '&:hover': { bgcolor: lesson.current ? '#ff57220a' : '#f5f5f5' } }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: lesson.current ? '#ff5722' : lesson.completed ? '#4caf50' : '#f5f5f5', color: lesson.current || lesson.completed ? 'white' : 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            {lesson.completed ? <Check size={16} /> : <PlayCircle size={16} />}
                                                        </Box>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography sx={{ fontSize: '0.875rem', fontWeight: lesson.current ? 600 : 400, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {lesson.title}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                                                <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{lesson.duration}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CoursePlayer;