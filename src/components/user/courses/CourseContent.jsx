import React from 'react';
import {
    Typography,
    Box,
    Paper,
    Chip,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material';
import {
    Check,
    Clock,
    FileText,
    Download,
    PlayCircle,
} from 'lucide-react';
import BunnyVideoPlayer from './BunnyVideoPlayer';

const CourseContent = ({
    currentLesson,
    isLessonCompleted,
    handleCompleteLesson,
    formatDuration
}) => {
    if (!currentLesson) {
        return (
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <Box sx={{ p: 8, textAlign: 'center' }}>
                    <PlayCircle size={64} color="#ccc" style={{ margin: '0 auto 16px' }} />
                    <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                        Selecciona una lección para comenzar
                    </Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <>
            {/* Video Player Section */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <Box sx={{ position: 'relative', bgcolor: '#000', aspectRatio: '16/9' }}>
                    {currentLesson.videoId ? (
                        <BunnyVideoPlayer
                            videoId={currentLesson.videoId}
                            libraryId="578582"
                            title={currentLesson.title}
                            responsive={true}
                            preload={true}
                        />
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: 'white'
                        }}>
                            <Typography>No hay video disponible para esta lección</Typography>
                        </Box>
                    )}
                </Box>

                {/* Lesson Details */}
                <Box sx={{ p: 3, bgcolor: 'white' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {currentLesson.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                        <Chip
                            icon={<Clock size={14} />}
                            label={formatDuration(currentLesson.duration)}
                            size="small"
                            sx={{ bgcolor: '#f5f5f5' }}
                        />
                        {isLessonCompleted(currentLesson._id) && (
                            <Chip
                                icon={<Check size={14} />}
                                label="Completada"
                                size="small"
                                sx={{ bgcolor: '#4caf500a', color: '#4caf50' }}
                            />
                        )}
                        {currentLesson.published ? (
                            <Chip
                                label="Publicado"
                                size="small"
                                sx={{ bgcolor: '#4caf500a', color: '#4caf50' }}
                            />
                        ) : (
                            <Chip
                                label="Borrador"
                                size="small"
                                sx={{ bgcolor: '#9e9e9e0a', color: '#9e9e9e' }}
                            />
                        )}
                    </Box>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 2 }}>
                        {currentLesson.description || 'No hay descripción disponible para esta lección.'}
                    </Typography>
                    {!isLessonCompleted(currentLesson._id) && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Chip
                                icon={<Check size={16} />}
                                label="Marcar como completada"
                                onClick={handleCompleteLesson}
                                sx={{
                                    cursor: 'pointer',
                                    bgcolor: '#00acc1',
                                    color: 'white',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: '#00838f' }
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Lesson Resources */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
                <Paper sx={{ borderRadius: 2, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Materiales de la lección
                    </Typography>
                    <List sx={{ bgcolor: '#f8f9fa', borderRadius: 1 }}>
                        {currentLesson.resources.map((resource, index) => (
                            <ListItem
                                key={resource._id || index}
                                sx={{
                                    borderBottom: index < currentLesson.resources.length - 1 ? '1px solid #e0e0e0' : 'none',
                                    '&:hover': { bgcolor: '#f0f0f0' }
                                }}
                            >
                                <FileText size={20} color="#666" style={{ marginRight: 16 }} />
                                <ListItemText
                                    primary={resource.name || resource.title}
                                    secondary={resource.type || 'Archivo'}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                />
                                <IconButton
                                    size="small"
                                    component="a"
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Download size={18} />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </>
    );
};

export default CourseContent;