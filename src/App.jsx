import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import UserLayout from './layout/UserLayout';
import AdminLayout from './layout/AdminLayout';
import LoginPage from './pages/auth/LoginPage';
import ExamsManagement from './pages/admin/Examsmanagement';
import StudentsManagement from './pages/admin/Studentsmanagement';
import TutorsManagement from './pages/admin/tutores/Tutorsmanagement';
import AdminDashboard from './pages/admin/Admindashboard';
import CourseDetail from './pages/admin/cursos/CourseDetail';
import CoursePlayer from './pages/user/CoursePlayer';
import CoursesPage from './pages/user/CoursesPage';
import CoursesManagement from './pages/admin/cursos/Coursesmanagement';
import { AuthProvider } from './contexts/Authcontext';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* AUTH - Ruta pública protegida (redirige si ya está autenticado) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* USUARIO - Rutas protegidas para estudiantes */}
          <Route
            element={
              <ProtectedRoute requiredRole="student">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CoursePlayer />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<CoursesManagement />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="tutors" element={<TutorsManagement />} />
            <Route path="students" element={<StudentsManagement />} />
            <Route path="exams" element={<ExamsManagement />} />
            <Route path="simulations" element={<ExamsManagement />} />
          </Route>

          {/* 404 - Redirigir a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;