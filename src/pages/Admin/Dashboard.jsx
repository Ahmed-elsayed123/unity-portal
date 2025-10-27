import React from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  DollarSign, 
  AlertCircle,
  BarChart3,
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle
} from 'lucide-react';
import DataManagement from '../../components/DataManagement.jsx';

const AdminDashboard = () => {
  const handleDataImport = (data, type) => {
    console.log('Imported data:', data, 'Type:', type);
    // Handle data import logic here
  };

  const handleDataExport = async (type) => {
    // Mock data for export
    const mockData = {
      students: [
        { 'Student ID': 'STU001', 'Name': 'John Doe', 'Email': 'john@example.com', 'Program': 'Computer Science' },
        { 'Student ID': 'STU002', 'Name': 'Jane Smith', 'Email': 'jane@example.com', 'Program': 'Mathematics' }
      ],
      courses: [
        { 'Course Code': 'CS-201', 'Course Name': 'Data Structures', 'Credits': '3', 'Instructor': 'Dr. Smith' },
        { 'Course Code': 'MATH-205', 'Course Name': 'Calculus II', 'Credits': '4', 'Instructor': 'Prof. Johnson' }
      ],
      grades: [
        { 'Student ID': 'STU001', 'Course': 'Data Structures', 'Grade': 'A', 'Points': '95' },
        { 'Student ID': 'STU002', 'Course': 'Calculus II', 'Grade': 'B+', 'Points': '87' }
      ],
      reports: [
        { 'Report Type': 'Enrollment', 'Period': 'Spring 2024', 'Total Students': '15247' },
        { 'Report Type': 'Financial', 'Period': 'Spring 2024', 'Total Revenue': '$2.5M' }
      ]
    };
    return mockData[type] || [];
  };

  const stats = [
    { title: 'Total Students', value: '15,247', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100', change: '+5.2%', trend: 'up' },
    { title: 'Active Faculty', value: '487', icon: GraduationCap, color: 'text-green-600', bgColor: 'bg-green-100', change: '+2.1%', trend: 'up' },
    { title: 'Total Courses', value: '1,234', icon: BookOpen, color: 'text-purple-600', bgColor: 'bg-purple-100', change: '+8.3%', trend: 'up' },
    { title: 'Revenue', value: '$2.4M', icon: DollarSign, color: 'text-yellow-600', bgColor: 'bg-yellow-100', change: '+12.5%', trend: 'up' }
  ];

  const recentActivities = [
    { action: 'New student registration', user: 'John Smith', time: '2 hours ago', type: 'student' },
    { action: 'Course enrollment completed', user: 'Sarah Johnson', time: '4 hours ago', type: 'enrollment' },
    { action: 'Faculty member added', user: 'Dr. Michael Chen', time: '6 hours ago', type: 'faculty' },
    { action: 'Payment processed', user: 'Emily Rodriguez', time: '8 hours ago', type: 'payment' },
    { action: 'Grade submission', user: 'Prof. David Wilson', time: '1 day ago', type: 'academic' }
  ];

  const systemAlerts = [
    { message: 'Server maintenance scheduled for tonight', priority: 'high', time: '2 hours ago' },
    { message: 'Backup completed successfully', priority: 'low', time: '4 hours ago' },
    { message: 'New course registration period starting', priority: 'medium', time: '1 day ago' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'student': return <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'enrollment': return <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'faculty': return <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'academic': return <BarChart3 className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return <Activity className="h-4 w-4 text-gray-600 dark:text-slate-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-slate-300 dark:bg-slate-700/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-slate-300 mt-2">Welcome back! Here's your system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-300">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-50 mt-1">{stat.value}</p>
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
        {/* Recent Activities */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Recent Activities</h2>
            <Activity className="h-5 w-5 text-gray-400 dark:text-slate-400" />
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{activity.action}</p>
                  <p className="text-xs text-gray-600 dark:text-slate-300">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">System Alerts</h2>
            <AlertCircle className="h-5 w-5 text-gray-400 dark:text-slate-400" />
          </div>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border-l-4 border-primary-200 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/30">
                <AlertCircle className="h-4 w-4 text-primary-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{alert.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                      {alert.priority}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4">Student Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-300">Undergraduate</span>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">12,456</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-300">Graduate</span>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">2,791</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-300">PhD</span>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">1,234</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4">Faculty Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-300">Professors</span>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-300">Associate Professors</span>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-300">Assistant Professors</span>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">97</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-300">Server Status</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-300">Database</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-300">Backup Status</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Up to Date
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 dark:action-users rounded-lg hover:bg-primary-100 dark:hover:bg-blue-800/60 transition-all duration-200 text-left w-full border border-transparent dark:border-blue-600/60 shadow-lg hover:shadow-xl">
            <Users className="h-6 w-6 text-primary-600 dark:text-blue-100 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-blue-100">Manage Users</h4>
            <p className="text-sm text-gray-600 dark:text-blue-200">Add, edit, or remove users</p>
          </button>
          <button className="p-4 bg-green-50 dark:action-courses rounded-lg hover:bg-green-100 dark:hover:bg-green-800/60 transition-all duration-200 text-left w-full border border-transparent dark:border-green-600/60 shadow-lg hover:shadow-xl">
            <BookOpen className="h-6 w-6 text-green-600 dark:text-green-100 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-green-100">Course Management</h4>
            <p className="text-sm text-gray-600 dark:text-green-200">Manage courses and programs</p>
          </button>
          <button className="p-4 bg-yellow-50 dark:action-finance rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800/60 transition-all duration-200 text-left w-full border border-transparent dark:border-yellow-600/60 shadow-lg hover:shadow-xl">
            <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-100 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-yellow-100">Financial Reports</h4>
            <p className="text-sm text-gray-600 dark:text-yellow-200">View financial analytics</p>
          </button>
          <button className="p-4 bg-purple-50 dark:action-reports rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/60 transition-all duration-200 text-left w-full border border-transparent dark:border-purple-600/60 shadow-lg hover:shadow-xl">
            <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-100 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-purple-100">Generate Reports</h4>
            <p className="text-sm text-gray-600 dark:text-purple-200">Create system reports</p>
          </button>
        </div>
      </div>

      {/* System Notifications */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">System Notifications</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• System maintenance scheduled for March 20th, 2024 at 2:00 AM</li>
              <li>• New student registration period opens on April 1st</li>
              <li>• Faculty evaluation surveys are now available</li>
              <li>• Backup system has been updated to the latest version</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <DataManagement 
        userRole="admin"
        onDataImport={handleDataImport}
        onDataExport={handleDataExport}
      />
    </div>
  );
};

export default AdminDashboard;
