import React, { useState } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
} from '@mui/material';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  ClipboardList,
  Settings,
  Bell,
  LogOut,
  Menu as MenuIcon,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/Authcontext';

const drawerWidth = 280;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Verificar si el usuario es administrador
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { text: 'Cursos', icon: <BookOpen size={20} />, path: '/admin/courses' },
    { text: 'Tutores', icon: <GraduationCap size={20} />, path: '/admin/tutors' },
    { text: 'Estudiantes', icon: <Users size={20} />, path: '/admin/students' },
    { text: 'Exámenes', icon: <FileText size={20} />, path: '/admin/exams' },
    { text: 'Simulacros', icon: <ClipboardList size={20} />, path: '/admin/simulations' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const handleProfile = () => {
    handleMenuClose();
    navigate('/admin/profile');
  };

  // Obtener iniciales del usuario
  const getInitials = () => {
    if (!user) return 'AD';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'AD';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: '#ff5722',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.2rem',
          }}
        >
          P
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
            PREDU.com
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Panel Admin
          </Typography>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                cursor: 'pointer',
                bgcolor: isActive ? '#ff57220a' : 'transparent',
                color: isActive ? '#ff5722' : 'text.primary',
                '&:hover': {
                  bgcolor: isActive ? '#ff57221a' : 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Settings */}
      <List sx={{ px: 2, py: 2 }}>
        <ListItem
          onClick={() => navigate('/admin/settings')}
          sx={{
            borderRadius: 2,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Settings size={20} />
          </ListItemIcon>
          <ListItemText primary="Configuración" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          <IconButton sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>

          <IconButton onClick={handleMenuClick}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#ff5722',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {getInitials()}
            </Avatar>
          </IconButton>

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
                {user?.fullName || `${user?.firstName} ${user?.lastName}`}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user?.email}
              </Typography>
            </Box>

            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <User size={18} />
              </ListItemIcon>
              Mi Perfil
            </MenuItem>

            <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/settings'); }}>
              <ListItemIcon>
                <Settings size={18} />
              </ListItemIcon>
              Configuración
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogOut size={18} />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;