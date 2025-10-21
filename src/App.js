import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import { Menu } from 'lucide-react';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import StudentCourses from './pages/Student/Courses';
import StudentAssignments from './pages/Student/Assignments';
import StudentAssignmentDetails from './pages/Student/AssignmentDetails';
import StudentCourseDetails from './pages/Student/CourseDetails';
import StudentGrades from './pages/Student/Grades';
import StudentFees from './pages/Student/Fees';
import StudentTimetable from './pages/Student/Timetable';
import StudentAttendance from './pages/Student/Attendance';
import StudentExams from './pages/Student/Exams';
import StudentProfile from './pages/Student/Profile';

// Lecturer Pages
import LecturerDashboard from './pages/Lecturer/Dashboard';
import LecturerCourses from './pages/Lecturer/Courses';
import LecturerStudents from './pages/Lecturer/Students';
import LecturerGrades from './pages/Lecturer/Grades';
import LecturerAttendance from './pages/Lecturer/Attendance';
import LecturerProfile from './pages/Lecturer/Profile';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminAcademics from './pages/Admin/Academics';
import AdminExaminations from './pages/Admin/Examinations';
import AdminFinance from './pages/Admin/Finance';
import AdminReports from './pages/Admin/Reports';
import AdminCommunication from './pages/Admin/Communication';
import AdminSettings from './pages/Admin/Settings';

// Parent Pages
import ParentDashboard from './pages/Parent/Dashboard';
import ParentStudentProfile from './pages/Parent/StudentProfile';
import ParentCommunication from './pages/Parent/Communication';
import ParentEvents from './pages/Parent/Events';
import ParentResources from './pages/Parent/Resources';
import ParentSupport from './pages/Parent/Support';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Layout Component for Protected Routes
const ProtectedLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-md text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Public Layout Component
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="App">
                <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentDashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/courses" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentCourses />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/assignments" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentAssignments />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/assignment/:assignmentId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentAssignmentDetails />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/course/:courseId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentCourseDetails />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/grades" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentGrades />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/fees" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentFees />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/timetable" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentTimetable />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/attendance" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentAttendance />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/exams" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentExams />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentProfile />
                </ProtectedLayout>
              </ProtectedRoute>
            } />

            {/* Lecturer Routes */}
            <Route path="/lecturer/dashboard" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <ProtectedLayout>
                  <LecturerDashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/lecturer/courses" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <ProtectedLayout>
                  <LecturerCourses />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/lecturer/students" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <ProtectedLayout>
                  <LecturerStudents />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/lecturer/grades" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <ProtectedLayout>
                  <LecturerGrades />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/lecturer/attendance" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <ProtectedLayout>
                  <LecturerAttendance />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/lecturer/profile" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <ProtectedLayout>
                  <LecturerProfile />
                </ProtectedLayout>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProtectedLayout>
                  <AdminDashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProtectedLayout>
                  <AdminUsers />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/academics" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProtectedLayout>
                  <AdminAcademics />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/examinations" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProtectedLayout>
                  <AdminExaminations />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/finance" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProtectedLayout>
                  <AdminFinance />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProtectedLayout>
                  <AdminReports />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/communication" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProtectedLayout>
                  <AdminCommunication />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProtectedLayout>
                  <AdminSettings />
                </ProtectedLayout>
              </ProtectedRoute>
            } />

            {/* Parent Routes */}
            <Route path="/parent/dashboard" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ProtectedLayout>
                  <ParentDashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/parent/student-profile" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ProtectedLayout>
                  <ParentStudentProfile />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/parent/communication" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ProtectedLayout>
                  <ParentCommunication />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/parent/events" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ProtectedLayout>
                  <ParentEvents />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/parent/resources" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ProtectedLayout>
                  <ParentResources />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/parent/support" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ProtectedLayout>
                  <ParentSupport />
                </ProtectedLayout>
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
              </div>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
