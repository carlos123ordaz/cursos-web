import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../contexts/Authcontext';


const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener ruta por defecto según el rol
  const getDefaultRoute = (role) => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'tutor':
        return '/tutor';
      case 'student':
      default:
        return '/';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password, rememberMe);

      if (result.success) {
        // Redirigir según el rol
        const redirectTo = getDefaultRoute(result.user.role);
        navigate(redirectTo, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    setError(`Iniciar sesión con ${provider} no está disponible aún`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fafafa',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: '#1a1a1a',
          color: 'white',
          py: 2,
          px: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.05em',
              fontSize: '1.25rem',
            }}
          >
            EDUPREU.com
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              p: 5,
            }}
          >
            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                textAlign: 'center',
              }}
            >
              Inicia sesión
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                mb: 4,
              }}
            >
              Continúa tu aprendizaje creativo
            </Typography>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} color="#666" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} color="#666" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Remember Me & Forgot Password */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                      sx={{
                        color: '#666',
                        '&.Mui-checked': {
                          color: '#ff5722',
                        },
                      }}
                    />
                  }
                  label="Recuérdame"
                  sx={{ color: 'text.secondary' }}
                />
                <Link
                  href="#"
                  underline="hover"
                  sx={{
                    color: '#ff5722',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: '#ff5722',
                  color: 'white',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: '#e64a19',
                  },
                  '&:disabled': {
                    bgcolor: '#ffccbc',
                  },
                  mb: 3,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Iniciar sesión'
                )}
              </Button>

              {/* Divider */}
              <Divider sx={{ my: 3 }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  o continúa con
                </Typography>
              </Divider>

              {/* Social Login Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: '#ddd',
                    color: '#333',
                    '&:hover': {
                      borderColor: '#bbb',
                      bgcolor: '#f5f5f5',
                    },
                  }}
                  startIcon={
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </Box>
                  }
                >
                  Continuar con Google
                </Button>
              </Box>
            </form>
          </Box>

          {/* Additional Info */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              Al continuar, aceptas los{' '}
              <Link href="#" underline="hover" sx={{ color: '#666' }}>
                Términos de servicio
              </Link>{' '}
              y la{' '}
              <Link href="#" underline="hover" sx={{ color: '#666' }}>
                Política de privacidad
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'white',
          borderTop: '1px solid #e0e0e0',
          py: 3,
          px: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              © 2026 EDUPREU.com Todos los derechos reservados.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link
                href="#"
                underline="hover"
                sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
              >
                Ayuda
              </Link>
              <Link
                href="#"
                underline="hover"
                sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
              >
                Contacto
              </Link>
              <Link
                href="#"
                underline="hover"
                sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
              >
                Blog
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;