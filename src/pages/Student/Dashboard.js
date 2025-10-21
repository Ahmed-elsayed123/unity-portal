import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  Calendar, 
  DollarSign, 
  Bell,
  AlertCircle,
  Clock
} from 'lucide-react';
import DataManagement from '../../components/DataManagement';
import { useNotification } from '../../contexts/NotificationContext';

const StudentDashboard = () => {
  const { showNotification } = useNotification();

  const handleDataImport = (data, type) => {
    console.log('Imported data:', data, 'Type:', type);
    showNotification(`Successfully imported ${data.length} ${type} records`, 'success');
  };

  const handleDataExport = async (type) => {
    try {
      // Mock data for export
      const mockData = {
        grades: [
          { 'Student ID': 'STU001', 'Course': 'Data Structures', 'Grade': 'A', 'Points': '95' },
          { 'Student ID': 'STU001', 'Course': 'Calculus II', 'Grade': 'B+', 'Points': '87' }
        ],
        attendance: [
          { 'Date': '2024-01-15', 'Course': 'Data Structures', 'Status': 'Present' },
          { 'Date': '2024-01-16', 'Course': 'Calculus II', 'Status': 'Present' }
        ],
        schedule: [
          { 'Time': '09:00 AM', 'Course': 'Data Structures', 'Room': 'CS-101' },
          { 'Time': '11:00 AM', 'Course': 'Calculus II', 'Room': 'MATH-205' }
        ]
      };
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showNotification(`Successfully exported ${type} data`, 'success');
      return mockData[type] || [];
    } catch (error) {
      showNotification('Export failed', 'error');
      return [];
    }
  };

  const handleQuickAction = (action) => {
    showNotification(`${action} clicked`, 'info');
  };

  const stats = [
    { title: 'Enrolled Courses', value: '6', icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Current GPA', value: '3.75', icon: Award, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Upcoming Classes', value: '3', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Outstanding Fees', value: '$1,200', icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  const upcomingClasses = [
    { time: '09:00 AM', subject: 'Data Structures', room: 'CS-101', instructor: 'Dr. Smith' },
    { time: '11:00 AM', subject: 'Calculus II', room: 'MATH-205', instructor: 'Prof. Johnson' },
    { time: '02:00 PM', subject: 'Physics Lab', room: 'PHY-301', instructor: 'Dr. Brown' }
  ];

  const recentAnnouncements = [
    { title: 'Midterm Exam Schedule', content: 'Midterm exams will be held from March 15-20. Check your timetable for details.', time: '2 hours ago', priority: 'high' },
    { title: 'Library Hours Extended', content: 'Library will be open until 11 PM during exam period.', time: '1 day ago', priority: 'medium' },
    { title: 'Course Registration', content: 'Fall 2024 course registration opens on April 1st.', time: '3 days ago', priority: 'low' }
  ];

  const recentGrades = [
    { course: 'Data Structures', assignment: 'Assignment 3', grade: 'A', points: '95/100' },
    { course: 'Calculus II', assignment: 'Quiz 2', grade: 'B+', points: '87/100' },
    { course: 'Physics', assignment: 'Lab Report 1', grade: 'A-', points: '92/100' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your academics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Classes</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((classItem, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{classItem.subject}</p>
                    <p className="text-sm text-gray-600">{classItem.instructor} • {classItem.room}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{classItem.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Announcements</h2>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentAnnouncements.map((announcement, index) => (
              <div key={index} className="border-l-4 border-primary-200 pl-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{announcement.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Grades</h2>
            <Award className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentGrades.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{grade.course}</p>
                  <p className="text-sm text-gray-600">{grade.assignment}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{grade.grade}</p>
                  <p className="text-sm text-gray-600">{grade.points}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => handleQuickAction('View Courses')}
              className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-left w-full"
            >
              <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">View Courses</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check your enrolled courses</p>
            </button>
            <button 
              onClick={() => handleQuickAction('View Grades')}
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left w-full"
            >
              <Award className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">View Grades</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check your academic progress</p>
            </button>
            <button 
              onClick={() => handleQuickAction('View Timetable')}
              className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors text-left w-full"
            >
              <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Timetable</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">View your schedule</p>
            </button>
            <button 
              onClick={() => handleQuickAction('Pay Fees')}
              className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left w-full"
            >
              <DollarSign className="h-6 w-6 text-red-600 dark:text-red-400 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Pay Fees</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your payments</p>
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="card p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Important Notice</h3>
            <p className="text-yellow-700 mt-1">
              Your semester fees are due on March 31st. Please make payment to avoid late fees.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <DataManagement 
        userRole="student"
        onDataImport={handleDataImport}
        onDataExport={handleDataExport}
      />
    </div>
  );
};

export default StudentDashboard;
