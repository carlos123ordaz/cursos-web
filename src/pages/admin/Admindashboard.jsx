import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Cursos',
      value: '48',
      change: '+12%',
      icon: <BookOpen size={24} />,
      color: '#ff5722',
      bgColor: '#ff57220a',
    },
    {
      title: 'Total Estudiantes',
      value: '1,243',
      change: '+23%',
      icon: <Users size={24} />,
      color: '#00acc1',
      bgColor: '#00acc10a',
    },
    {
      title: 'Tutores Activos',
      value: '32',
      change: '+5%',
      icon: <GraduationCap size={24} />,
      color: '#fbc02d',
      bgColor: '#fbc02d0a',
    },
    {
      title: 'Tasa Completación',
      value: '78%',
      change: '+8%',
      icon: <TrendingUp size={24} />,
      color: '#4caf50',
      bgColor: '#4caf500a',
    },
  ];

  const recentCourses = [
    {
      id: 1,
      name: 'Introducción a After Effects',
      tutor: 'Carlos Albarrán',
      students: 234,
      completion: 85,
      status: 'Activo',
    },
    {
      id: 2,
      name: 'Figma de principio a fin',
      tutor: 'Samuel Hermoso',
      students: 189,
      completion: 72,
      status: 'Activo',
    },
    {
      id: 3,
      name: 'Ilustración digital con Procreate',
      tutor: 'Ana García',
      students: 156,
      completion: 68,
      status: 'Activo',
    },
    {
      id: 4,
      name: 'Animación 2D con Adobe Animate',
      tutor: 'Pedro Martínez',
      students: 92,
      completion: 45,
      status: 'Borrador',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Nuevo estudiante registrado',
      user: 'María López',
      time: 'Hace 5 minutos',
      type: 'student',
    },
    {
      id: 2,
      action: 'Curso publicado',
      user: 'Diseño UX/UI Avanzado',
      time: 'Hace 1 hora',
      type: 'course',
    },
    {
      id: 3,
      action: 'Examen completado',
      user: 'Juan Pérez',
      time: 'Hace 2 horas',
      type: 'exam',
    },
    {
      id: 4,
      action: 'Nuevo tutor agregado',
      user: 'Laura Fernández',
      time: 'Hace 3 horas',
      type: 'tutor',
    },
  ];

  return (
    <Box>
      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Resumen general de la plataforma
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'visible',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      bgcolor: '#4caf500a',
                      color: '#4caf50',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>


    </Box>
  );
};

export default AdminDashboard;

