import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import Header from './components/Layout/Header.jsx';
import Footer from './components/Layout/Footer.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Loading from './components/Loading.jsx';
import Chatbot from './components/Chatbot.jsx';
import { Menu } from 'lucide-react';

// Public Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard.jsx';
import StudentCourses from './pages/Student/Courses.jsx';
import StudentAssignments from './pages/Student/Assignments.jsx';
import StudentAssignmentDetails from './pages/Student/AssignmentDetails.jsx';
import StudentCourseDetails from './pages/Student/CourseDetails.jsx';
import StudentGrades from './pages/Student/Grades.jsx';
import StudentFees from './pages/Student/Fees.jsx';
import StudentTimetable from './pages/Student/Timetable.jsx';
import StudentAttendance from './pages/Student/Attendance.jsx';
import StudentExams from './pages/Student/Exams.jsx';
import StudentProfile from './pages/Student/Profile.jsx';
import StudentNotifications from './pages/Student/Notifications.jsx';
import StudentAnnouncements from './pages/Student/Announcements.jsx';
import StudentLostItems from './pages/Student/LostItems.jsx';
import QueueLanding from './pages/Student/SmartQueue/Landing.jsx';
import QueueJoinStatus from './pages/Student/SmartQueue/JoinStatus.jsx';
import QueueCreate from './pages/Student/SmartQueue/CreateQueue.jsx';
import QueueManage from './pages/Student/SmartQueue/ManageQueue.jsx';

// Lecturer Pages
import LecturerDashboard from './pages/Lecturer/Dashboard.jsx';
import LecturerCourses from './pages/Lecturer/Courses.jsx';
import LecturerMaterials from './pages/Lecturer/Materials.jsx';
import LecturerAssignments from './pages/Lecturer/Assignments.jsx';
import LecturerSubmissions from './pages/Lecturer/Submissions.jsx';
import LecturerStudents from './pages/Lecturer/Students.jsx';
import LecturerGrades from './pages/Lecturer/Grades.jsx';
import LecturerAttendance from './pages/Lecturer/Attendance.jsx';
import LecturerProfile from './pages/Lecturer/Profile.jsx';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard.jsx';
import AdminUsers from './pages/Admin/Users.jsx';
import AdminAcademics from './pages/Admin/Academics.jsx';
import AdminExaminations from './pages/Admin/Examinations.jsx';
import AdminFinance from './pages/Admin/Finance.jsx';
import AdminReports from './pages/Admin/Reports.jsx';
import AdminCommunication from './pages/Admin/Communication.jsx';
import AdminSettings from './pages/Admin/Settings.jsx';
import AdminAnnouncements from './pages/Admin/Announcements.jsx';
import AdminLostItems from './pages/Admin/LostItems.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return <Loading fullScreen text="Checking authentication..." />;
  }
  
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-rose-100 dark:from-gray-900 dark:via-pink-900 dark:to-gray-800">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top controls */}
        <div className="fixed top-4 right-4 z-30 flex items-center space-x-2">
          <ThemeToggle />
          <div className="lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
              className="p-2 glass-card rounded-md shadow-md text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <Menu className="h-6 w-6" />
          </button>
          </div>
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

// App Content Component to handle authentication loading
const AppContent = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <Loading fullScreen text="Initializing application..." />;
  }
  
  return (
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
            <Route path="/student/notifications" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentNotifications />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/announcements" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentAnnouncements />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/lost-items" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <StudentLostItems />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/queue" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <QueueLanding />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/queue/status" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProtectedLayout>
                  <QueueJoinStatus />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/queue/create" element={
              <ProtectedRoute allowedRoles={['student','admin']}>
                <ProtectedLayout>
                  <QueueCreate />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/queue/manage" element={
              <ProtectedRoute allowedRoles={['student','admin']}>
                <ProtectedLayout>
                  <QueueManage />
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
            <Route path="/lecturer/materials" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <ProtectedLayout>
                  <LecturerMaterials />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/lecturer/assignments" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <ProtectedLayout>
                  <LecturerAssignments />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/lecturer/submissions" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <ProtectedLayout>
                  <LecturerSubmissions />
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
            <Route path="/admin/announcements" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProtectedLayout>
                  <AdminAnnouncements />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/lost-items" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProtectedLayout>
                  <AdminLostItems />
                </ProtectedLayout>
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
        <Chatbot />
      </Router>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
