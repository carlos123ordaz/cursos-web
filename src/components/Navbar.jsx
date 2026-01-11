import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    InputBase,
    Badge,
    Avatar,
} from '@mui/material';
import {
    Search,
    Bell,
    ChevronDown,
} from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ bgcolor: '#1a1a1a', boxShadow: 'none' }}>
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Typography
                            variant="h6"
                            onClick={() => navigate('/')}
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                fontSize: '1.25rem',
                                cursor: 'pointer',
                            }}
                        >
                            PREDU.com
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Button
                                endIcon={<ChevronDown size={16} />}
                                onClick={() => navigate('/')}
                                sx={{
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                }}
                            >
                                Cursos
                            </Button>
                            <Button
                                sx={{
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                }}
                            >
                                Simulacros
                            </Button>
                            <Button
                                sx={{
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                }}
                            >
                                Exámenes
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                borderRadius: 1,
                                px: 2,
                                py: 0.75,
                            }}
                        >
                            <Search size={18} />
                            <InputBase
                                placeholder="Buscar cursos"
                                sx={{
                                    ml: 1,
                                    color: 'white',
                                    '& ::placeholder': { color: 'rgba(255,255,255,0.7)' },
                                }}
                            />
                        </Box>
                        <Button
                            onClick={() => navigate('/')}
                            sx={{
                                color: 'white',
                                textTransform: 'none',
                                fontWeight: 500,
                            }}
                        >
                            Mis cursos
                        </Button>
                        <IconButton sx={{ color: 'white' }}>
                            <Badge badgeContent={3} color="error">
                                <Bell size={20} />
                            </Badge>
                        </IconButton>
                        <Avatar 
                            sx={{ width: 36, height: 36, bgcolor: '#00acc1', cursor: 'pointer' }}
                            onClick={() => navigate('/login')}
                        >
                            JD
                        </Avatar>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;