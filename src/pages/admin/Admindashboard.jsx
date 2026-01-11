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
          <Grid size={{xs:12,sm:6,md:3}} key={index}>
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

      <Grid container spacing={3}>
        {/* Recent Courses */}
        <Grid size={{xs:12,lg:8}}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Cursos Recientes
                </Typography>
                <Typography
                  sx={{
                    color: '#ff5722',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  Ver todos
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Curso</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tutor</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Estudiantes</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Completación</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentCourses.map((course) => (
                      <TableRow
                        key={course.id}
                        sx={{
                          '&:hover': { bgcolor: 'action.hover' },
                          cursor: 'pointer',
                        }}
                      >
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>{course.name}</Typography>
                        </TableCell>
                        <TableCell>{course.tutor}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Users size={16} color="#666" />
                            {course.students}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={course.completion}
                              sx={{
                                flex: 1,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: '#f0f0f0',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#4caf50',
                                },
                              }}
                            />
                            <Typography
                              sx={{ fontSize: '0.875rem', fontWeight: 500, minWidth: 40 }}
                            >
                              {course.completion}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={course.status}
                            size="small"
                            sx={{
                              bgcolor:
                                course.status === 'Activo' ? '#4caf500a' : '#ff57220a',
                              color: course.status === 'Activo' ? '#4caf50' : '#ff5722',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{xs:12,lg:4}}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Actividad Reciente
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivity.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#f8f9fa',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: '#f0f0f0',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor:
                          activity.type === 'student'
                            ? '#00acc10a'
                            : activity.type === 'course'
                            ? '#ff57220a'
                            : activity.type === 'exam'
                            ? '#4caf500a'
                            : '#fbc02d0a',
                        color:
                          activity.type === 'student'
                            ? '#00acc1'
                            : activity.type === 'course'
                            ? '#ff5722'
                            : activity.type === 'exam'
                            ? '#4caf50'
                            : '#fbc02d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {activity.type === 'student' && <Users size={18} />}
                      {activity.type === 'course' && <BookOpen size={18} />}
                      {activity.type === 'exam' && <CheckCircle size={18} />}
                      {activity.type === 'tutor' && <GraduationCap size={18} />}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {activity.action}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.813rem',
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {activity.user}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <Clock size={12} />
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;