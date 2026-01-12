import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    Menu,
    MenuItem,
    Divider,
} from '@mui/material';
import {
    Search,
    Bell,
    User,
    Settings,
    LogOut,
    BookOpen,
    FileText,
} from 'lucide-react';
import { useAuth } from '../contexts/Authcontext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleMenuClose();
        await logout();
        navigate('/login');
    };

    const getInitials = () => {
        if (!user) return 'U';
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

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
                            EDUPREU.com
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button
                                onClick={() => navigate('/')}
                                startIcon={<BookOpen size={18} />}
                                sx={{
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    bgcolor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                    },
                                }}
                            >
                                Mis Cursos
                            </Button>
                            <Button
                                onClick={() => navigate('/exams')}
                                startIcon={<FileText size={18} />}
                                sx={{
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    bgcolor: isActive('/exams') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                    },
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

                        <IconButton sx={{ color: 'white' }}>
                            <Badge badgeContent={0} color="error">
                                <Bell size={20} />
                            </Badge>
                        </IconButton>

                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: '#00acc1',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                            }}
                            onClick={handleMenuClick}
                        >
                            {getInitials()}
                        </Avatar>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            PaperProps={{
                                sx: { mt: 1, minWidth: 200 }
                            }}
                        >
                            {/* User Info */}
                            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {user?.firstName} {user?.lastName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {user?.email}
                                </Typography>
                            </Box>

                            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                                <User size={18} style={{ marginRight: 8 }} />
                                Mi Perfil
                            </MenuItem>

                            <MenuItem onClick={() => { handleMenuClose(); navigate('/'); }}>
                                <Settings size={18} style={{ marginRight: 8 }} />
                                Configuración
                            </MenuItem>

                            <Divider />

                            <MenuItem onClick={handleLogout}>
                                <LogOut size={18} style={{ marginRight: 8 }} />
                                Cerrar Sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;