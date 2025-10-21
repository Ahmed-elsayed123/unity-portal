import React from 'react';
import { 
  User, 
  BookOpen, 
  Award, 
  Calendar, 
  DollarSign,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Bell,
  MessageSquare
} from 'lucide-react';
import DataManagement from '../../components/DataManagement';

const ParentDashboard = () => {
  const handleDataImport = (data, type) => {
    console.log('Imported data:', data, 'Type:', type);
    // Handle data import logic here
  };

  const handleDataExport = async (type) => {
    // Mock data for export
    const mockData = {
      progress: [
        { 'Student ID': 'STU001', 'Course': 'Data Structures', 'Grade': 'A', 'Attendance': '95%' },
        { 'Student ID': 'STU001', 'Course': 'Calculus II', 'Grade': 'B+', 'Attendance': '90%' }
      ],
      attendance: [
        { 'Date': '2024-01-15', 'Course': 'Data Structures', 'Status': 'Present' },
        { 'Date': '2024-01-16', 'Course': 'Calculus II', 'Status': 'Present' }
      ]
    };
    return mockData[type] || [];
  };

  const studentInfo = {
    name: 'John Smith',
    studentId: 'STU2024001',
    program: 'Computer Science',
    year: 'Junior',
    gpa: 3.75,
    credits: 90,
    status: 'Active'
  };

  const stats = [
    { title: 'Current GPA', value: '3.75', icon: Award, color: 'text-green-600', bgColor: 'bg-green-100', change: '+0.15', trend: 'up' },
    { title: 'Credits Earned', value: '90', icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-100', change: '+12', trend: 'up' },
    { title: 'Attendance Rate', value: '94%', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100', change: '+2%', trend: 'up' },
    { title: 'Outstanding Fees', value: '$1,200', icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-100', change: '-$300', trend: 'down' }
  ];

  const recentGrades = [
    { course: 'Data Structures', grade: 'A-', points: '92/100', date: '2024-03-10' },
    { course: 'Calculus II', grade: 'B+', points: '87/100', date: '2024-03-08' },
    { course: 'Physics Lab', grade: 'A', points: '95/100', date: '2024-03-05' }
  ];

  const upcomingEvents = [
    { title: 'Midterm Exams', date: '2024-03-15', type: 'Exam', priority: 'high' },
    { title: 'Parent-Teacher Meeting', date: '2024-03-20', type: 'Meeting', priority: 'medium' },
    { title: 'Spring Break', date: '2024-03-25', type: 'Holiday', priority: 'low' }
  ];

  const announcements = [
    { title: 'Midterm Exam Schedule', content: 'Midterm exams will be held from March 15-20. Please ensure your child is prepared.', date: '2024-03-10', priority: 'high' },
    { title: 'Library Hours Extended', content: 'Library will be open until 11 PM during exam period.', date: '2024-03-08', priority: 'medium' },
    { title: 'Parent Portal Update', content: 'New features added to the parent portal for better communication.', date: '2024-03-05', priority: 'low' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your child's academic progress and stay informed</p>
      </div>

      {/* Student Info */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{studentInfo.name}</h2>
            <p className="text-gray-600">{studentInfo.studentId} • {studentInfo.program}</p>
            <p className="text-sm text-gray-500">{studentInfo.year} • {studentInfo.credits} credits</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-bold text-green-600">{studentInfo.gpa}</div>
            <div className="text-sm text-gray-600">Current GPA</div>
          </div>
        </div>
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
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
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
                  <h3 className="font-medium text-gray-900">{grade.course}</h3>
                  <p className="text-sm text-gray-600">{grade.points} • {grade.date}</p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getGradeColor(grade.grade)}`}>
                    {grade.grade}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.type} • {event.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                  {event.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Announcements</h2>
          <Bell className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
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
              <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
            <User className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">View Profile</h4>
            <p className="text-sm text-gray-600">Check student profile</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <Award className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">View Grades</h4>
            <p className="text-sm text-gray-600">Check academic progress</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
            <Calendar className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">View Schedule</h4>
            <p className="text-sm text-gray-600">Check class schedule</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <MessageSquare className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Send Message</h4>
            <p className="text-sm text-gray-600">Contact teachers</p>
          </button>
        </div>
      </div>

      {/* Important Notice */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Important Notice</h3>
            <p className="text-blue-700 text-sm">
              Midterm examinations are approaching. Please ensure your child is well-prepared and has all necessary materials.
              Contact the school if you have any concerns about your child's academic performance.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <DataManagement 
        userRole="parent"
        onDataImport={handleDataImport}
        onDataExport={handleDataExport}
      />
    </div>
  );
};

export default ParentDashboard;
