import React from 'react';
import {
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    Check,
    Clock,
    PlayCircle,
    ChevronDown,
} from 'lucide-react';

const CourseSidebar = ({
    modules,
    completedLessons,
    totalLessons,
    expandedModule,
    setExpandedModule,
    isLessonCompleted,
    currentLesson,
    handleLessonClick,
    formatDuration
}) => {
    return (
        <Box sx={{ width: 400 }}>
            <Paper sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto'
            }}>
                {/* Header */}
                <Box sx={{
                    p: 2,
                    borderBottom: '1px solid #e0e0e0',
                    bgcolor: '#f8f9fa',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1
                }}>
                    <Typography sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'text.secondary',
                        textTransform: 'uppercase'
                    }}>
                        Contenido del Curso
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', mt: 0.5 }}>
                        {completedLessons} de {totalLessons} lecciones completadas
                    </Typography>
                </Box>

                {/* Modules List */}
                {modules.map((module) => (
                    <Accordion
                        key={module._id}
                        expanded={expandedModule === module._id}
                        onChange={() => setExpandedModule(expandedModule === module._id ? null : module._id)}
                        sx={{
                            boxShadow: 'none',
                            '&:before': { display: 'none' },
                            borderBottom: '1px solid #e0e0e0'
                        }}
                    >
                        <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                                    {module.title}
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                    {module.lessons.length} lecciones • {module.lessons.filter(l => isLessonCompleted(l._id)).length} completadas
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            <List sx={{ py: 0 }}>
                                {module.lessons.map((lesson) => {
                                    const isCompleted = isLessonCompleted(lesson._id);
                                    const isCurrent = currentLesson?._id === lesson._id;

                                    return (
                                        <ListItem
                                            key={lesson._id}
                                            button
                                            onClick={() => handleLessonClick(lesson)}
                                            sx={{
                                                py: 1.5,
                                                px: 3,
                                                bgcolor: isCurrent ? '#ff57220a' : 'transparent',
                                                borderLeft: isCurrent ? '3px solid #ff5722' : '3px solid transparent',
                                                '&:hover': { bgcolor: isCurrent ? '#ff57220a' : '#f5f5f5' }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                                <Box sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    bgcolor: isCurrent ? '#ff5722' : isCompleted ? '#4caf50' : '#f5f5f5',
                                                    color: isCurrent || isCompleted ? 'white' : 'text.secondary',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    {isCompleted ? <Check size={16} /> : <PlayCircle size={16} />}
                                                </Box>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: isCurrent ? 600 : 400,
                                                        mb: 0.5,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {lesson.title}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                                        <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                                        {formatDuration(lesson.duration)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Paper>
        </Box>
    );
};

export default CourseSidebar;