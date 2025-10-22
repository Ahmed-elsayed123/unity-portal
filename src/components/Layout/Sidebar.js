import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getStudentMenuItems = () => [
    { path: '/student/dashboard', label: 'Dashboard', icon: Home },
    { path: '/student/courses', label: 'Courses', icon: BookOpen },
    { path: '/student/assignments', label: 'Assignments', icon: FileText },
    { path: '/student/grades', label: 'Grades & Transcript', icon: Award },
    { path: '/student/fees', label: 'Fee Management', icon: DollarSign },
    { path: '/student/timetable', label: 'Timetable', icon: Calendar },
    { path: '/student/attendance', label: 'Attendance', icon: Users },
    { path: '/student/exams', label: 'Exams & Tests', icon: ClipboardList },
    { path: '/student/profile', label: 'Profile', icon: User }
  ];

  const getLecturerMenuItems = () => [
    { path: '/lecturer/dashboard', label: 'Dashboard', icon: Home },
    { path: '/lecturer/courses', label: 'Course Management', icon: BookOpen },
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
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { path: '/admin/communication', label: 'Communication', icon: Bell },
    { path: '/admin/settings', label: 'System Settings', icon: Settings }
  ];

  const getParentMenuItems = () => [
    { path: '/parent/dashboard', label: 'Dashboard', icon: Home },
    { path: '/parent/student-profile', label: 'Student Profile', icon: User },
    { path: '/parent/communication', label: 'Communication', icon: MessageSquare },
    { path: '/parent/events', label: 'Events & Activities', icon: Calendar },
    { path: '/parent/resources', label: 'Resources', icon: FileText },
    { path: '/parent/support', label: 'Support & Help', icon: Shield }
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'student':
        return getStudentMenuItems();
      case 'lecturer':
        return getLecturerMenuItems();
      case 'admin':
        return getAdminMenuItems();
      case 'parent':
        return getParentMenuItems();
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
        fixed lg:static inset-y-0 left-0 z-50 glass-sidebar min-h-screen transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.role === 'student' && 'Student Portal'}
                    {user.role === 'lecturer' && 'Lecturer Portal'}
                    {user.role === 'admin' && 'Admin Portal'}
                    {user.role === 'parent' && 'Parent Portal'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {user.name}</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleCollapse}
                className="hidden lg:block p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700/50"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          <div className="px-4 space-y-1">
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
                  <Icon className={`h-5 w-5 ${isCollapsed ? 'text-gray-800 dark:text-gray-200' : ''}`} />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
