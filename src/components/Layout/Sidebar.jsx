import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  Home,
  BookOpen,
  GraduationCap,
  Calendar,
  Users,
  User,
  FileText,
  BarChart3,
  Settings,
  ClipboardList,
  Award,
  DollarSign,
  Bell,
  Shield,
  X,
  MessageSquare,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Megaphone,
  Package
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      onClose(); // Close sidebar after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStudentMenuItems = () => [
    { path: '/student/dashboard', label: 'Dashboard', icon: Home },
    { path: '/student/courses', label: 'Courses', icon: BookOpen },
    { path: '/student/assignments', label: 'Assignments', icon: FileText },
    { path: '/student/grades', label: 'Grades & Transcript', icon: Award },
    { path: '/student/timetable', label: 'Timetable', icon: Calendar },
    { path: '/student/attendance', label: 'Attendance', icon: Users },
    { path: '/student/exams', label: 'Exams & Tests', icon: ClipboardList },
    { path: '/student/lost-items', label: 'Lost & Found', icon: Package },
    { path: '/student/queue', label: 'Smart Queue', icon: ClipboardList },
    { path: '/student/announcements', label: 'Announcements', icon: Megaphone },
    { path: '/student/notifications', label: 'Notifications', icon: Bell },
    { path: '/student/profile', label: 'Profile', icon: User }
  ];

  const getLecturerMenuItems = () => [
    { path: '/lecturer/dashboard', label: 'Dashboard', icon: Home },
    { path: '/lecturer/courses', label: 'Course Management', icon: BookOpen },
    { path: '/lecturer/materials', label: 'Materials', icon: FileText },
    { path: '/lecturer/assignments', label: 'Assignments', icon: ClipboardList },
    { path: '/lecturer/submissions', label: 'Student Submissions', icon: Award },
    { path: '/lecturer/students', label: 'Student List', icon: Users },
    { path: '/lecturer/grades', label: 'Grades', icon: Award },
    { path: '/lecturer/attendance', label: 'Attendance', icon: Users },
    { path: '/lecturer/profile', label: 'Profile', icon: User }
  ];

  const getAdminMenuItems = () => [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/academics', label: 'Academic Management', icon: GraduationCap },
    { path: '/admin/examinations', label: 'Examinations', icon: ClipboardList },
    { path: '/admin/finance', label: 'Finance & Fees', icon: DollarSign },
    { path: '/admin/lost-items', label: 'Lost Items', icon: Package },
    { path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { path: '/admin/communication', label: 'Communication', icon: Bell },
    { path: '/admin/settings', label: 'System Settings', icon: Settings }
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'student':
        return getStudentMenuItems();
      case 'lecturer':
        return getLecturerMenuItems();
      case 'admin':
        return getAdminMenuItems();
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  if (!user) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 glass-sidebar min-h-screen transform transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-16' : 'w-64'}
          dark:bg-slate-800/95 dark:border-slate-600 dark:shadow-2xl
        `}>
        <div className={`p-6 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'flex-col space-y-3' : 'justify-between'}`}>
            <div className={`flex items-center ${isCollapsed ? 'flex-col space-y-2' : 'space-x-3'}`}>
              <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
                {!isCollapsed && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                      {user.role === 'student' && 'Student Portal'}
                      {user.role === 'lecturer' && 'Lecturer Portal'}
                      {user.role === 'admin' && 'Admin Portal'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-300">Welcome, {user.name}</p>
                  </div>
                )}
            </div>
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                  <button
                    onClick={onToggleCollapse}
                    className="hidden lg:block p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-lg hover:bg-white/10 dark:hover:bg-slate-700/50"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  >
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
              </div>
            )}
          </div>
          {isCollapsed && (
              <div className="mt-4 flex flex-col items-center space-y-2">
                <button
                  onClick={onToggleCollapse}
                  className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-lg hover:bg-white/10 dark:hover:bg-slate-700/50"
                  title="Expand sidebar"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
          )}
        </div>

        <nav className="mt-6 flex-1 pb-20">
          <div className={`px-4 space-y-1 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`${isCollapsed ? 'sidebar-link-collapsed' : 'sidebar-link'} ${isActive(item.path) ? 'active' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`h-5 w-5 ${isCollapsed ? 'text-gray-800 dark:text-slate-200' : ''}`} />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-slate-600">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 rounded-lg ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
