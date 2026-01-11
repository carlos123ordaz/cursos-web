import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Box,
    Container,
    Card,
    CardMedia,
    CardContent,
    Chip,
} from '@mui/material';
import {
    ChevronDown,
    ArrowRight,
} from 'lucide-react';

const CoursesPage = () => {
    const navigate = useNavigate();

    const courses = [
        {
            id: 1,
            title: 'Razonamiento Matemático',
            instructor: 'Victor Raul Castillo',
            thumbnail: 'https://paginaeducativa.com/wp-content/uploads/RAZONAMIENTO-MATEMATICO-Pagina-Educativa-ok.jpg',
            tags: ['NIVEL INTERMEDIO', '15 TEMAS'],
            category: 'Lógica',
        },
        {
            id: 2,
            title: 'Razonamiento Verbal',
            instructor: 'Carlos Ordaz',
            thumbnail: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhNXrzBTf4gNBETHOMnoStzE8vVebVYpIPmZRXUSjr0SPrSfeo4h3wb6FJQMDxt-9bIkSNMl35UnTR_rY8A5G-4xhFE1eEhba_PIt6HfnEJoHmNIqcp6Bc3r7XPtJ_prDgLh6cSnt-aifw/s1600/termino+excluido.bmp',
            tags: ['NIVEL INTERMEDIO', '25 TEMAS'],
            category: 'Lógica',
        },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
            {/* Breadcrumb / Navigation */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                borderBottom: '3px solid #1a1a1a',
                                pb: 2,
                                mb: -2,
                            }}
                        >
                            Mis cursos
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        Mis cursos
                    </Typography>
                    <Button
                        endIcon={<ChevronDown size={18} />}
                        sx={{
                            textTransform: 'none',
                            color: '#1a1a1a',
                            fontWeight: 600,
                            borderBottom: '2px solid #1a1a1a',
                            borderRadius: 0,
                            pb: 0.5,
                        }}
                    >
                        Todos mis cursos
                    </Button>
                </Box>

                {/* Course Cards */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {courses.map((course) => (
                        <Card
                            key={course.id}
                            sx={{
                                display: 'flex',
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            <Box sx={{ position: 'relative', width: 280, flexShrink: 0 }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    image={course.thumbnail}
                                    alt={course.title}
                                />
                                <Chip
                                    label={course.category}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 12,
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        height: 24,
                                    }}
                                />
                            </Box>

                            <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    {course.tags.map((tag, idx) => (
                                        <Chip
                                            key={idx}
                                            label={tag}
                                            size="small"
                                            sx={{
                                                bgcolor:
                                                    tag === 'DOMESTIKA BASICS'
                                                        ? '#d32f2f'
                                                        : tag === 'TOP VENTAS'
                                                            ? '#fbc02d'
                                                            : '#1976d2',
                                                color: 'white',
                                                fontSize: '0.65rem',
                                                fontWeight: 700,
                                                height: 22,
                                            }}
                                        />
                                    ))}
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 600, mb: 1, fontSize: '1.25rem' }}
                                >
                                    {course.title}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: '0.875rem' }}>
                                    Por {course.instructor}
                                </Typography>

                                <Box sx={{ mt: 'auto', display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Button
                                        onClick={() => navigate(`/course/${course.id}`)}
                                        variant="contained"
                                        endIcon={<ArrowRight size={18} />}
                                        sx={{
                                            bgcolor: '#00acc1',
                                            '&:hover': { bgcolor: '#00838f' },
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 1,
                                            px: 3,
                                        }}
                                    >
                                        Continuar
                                    </Button>

                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default CoursesPage;