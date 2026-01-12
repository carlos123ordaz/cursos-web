import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import UserLayout from './layout/UserLayout';
import AdminLayout from './layout/AdminLayout';
import LoginPage from './pages/auth/LoginPage';
import TutorsManagement from './pages/admin/tutores/Tutorsmanagement';
import AdminDashboard from './pages/admin/Admindashboard';
import CourseDetail from './pages/admin/cursos/CourseDetail';
import CoursePlayer from './pages/user/CoursePlayer';
import CoursesPage from './pages/user/CoursesPage';
import CoursesManagement from './pages/admin/cursos/Coursesmanagement';
import StudentsManagement from './pages/admin/estudiantes/Studentsmanagement';
import ExamsManagement from './pages/admin/examenes/Examsmanagement';
import ExamEditor from './pages/admin/examenes/ExamEditor';
import ExamsPage from './pages/user/ExamsPage';
import ExamTaking from './pages/user/ExamTaking';
import ExamResults from './pages/user/ExamResults';
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

          {/* USUARIO - Rutas de exámenes (sin Layout porque tienen Navbar propio) */}
          <Route
            path="/exams"
            element={
              <ProtectedRoute requiredRole="student">
                <ExamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:id/take"
            element={
              <ProtectedRoute requiredRole="student">
                <ExamTaking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:id/results"
            element={
              <ProtectedRoute requiredRole="student">
                <ExamResults />
              </ProtectedRoute>
            }
          />

          {/* ADMIN - Rutas protegidas para administradores */}
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
            <Route path="exams/:id/edit" element={<ExamEditor />} />
          </Route>

          {/* 404 - Redirigir a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;