import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: '#1a1a1a', color: 'white', py: 6, mt: 8 }}>
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            PREDU.com
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                            Plataforma educativa para preparación universitaria
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                            Cursos
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                                Razonamiento Matemático
                            </Link>
                            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                                Razonamiento Verbal
                            </Link>
                            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                                Ver todos los cursos
                            </Link>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                            Soporte
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                                Centro de ayuda
                            </Link>
                            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                                Términos y condiciones
                            </Link>
                            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                                Política de privacidad
                            </Link>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                            Comunidad
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                                Blog
                            </Link>
                            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                                Foro
                            </Link>
                            <Link href="#" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                                Contacto
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 4, pt: 3, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
                        © 2024 PREDU.com - Todos los derechos reservados
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;