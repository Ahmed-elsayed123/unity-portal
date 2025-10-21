import React from 'react';
import { 
  BookOpen, 
  Users, 
  Award, 
  Calendar, 
  AlertCircle,
  FileText,
  MessageSquare,
  Clock,
  BarChart3
} from 'lucide-react';
import DataManagement from '../../components/DataManagement';

const LecturerDashboard = () => {
  const handleDataImport = (data, type) => {
    console.log('Imported data:', data, 'Type:', type);
    // Handle data import logic here
  };

  const handleDataExport = async (type) => {
    // Mock data for export
    const mockData = {
      students: [
        { 'Student ID': 'STU001', 'Name': 'John Doe', 'Email': 'john@example.com', 'Course': 'Data Structures' },
        { 'Student ID': 'STU002', 'Name': 'Jane Smith', 'Email': 'jane@example.com', 'Course': 'Data Structures' }
      ],
      grades: [
        { 'Student ID': 'STU001', 'Course': 'Data Structures', 'Grade': 'A', 'Points': '95' },
        { 'Student ID': 'STU002', 'Course': 'Data Structures', 'Grade': 'B+', 'Points': '87' }
      ],
      attendance: [
        { 'Date': '2024-01-15', 'Student': 'John Doe', 'Status': 'Present' },
        { 'Date': '2024-01-15', 'Student': 'Jane Smith', 'Status': 'Present' }
      ]
    };
    return mockData[type] || [];
  };

  const stats = [
    { title: 'Active Courses', value: '4', icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Total Students', value: '120', icon: Users, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Pending Grades', value: '15', icon: Award, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { title: 'Upcoming Classes', value: '6', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100' }
  ];

  const courses = [
    {
      id: 1,
      name: 'Data Structures and Algorithms',
      code: 'CS-201',
      students: 30,
      nextClass: 'Mon, 9:00 AM',
      pendingAssignments: 3,
      averageGrade: 85
    },
    {
      id: 2,
      name: 'Calculus II',
      code: 'MATH-205',
      students: 25,
      nextClass: 'Wed, 11:00 AM',
      pendingAssignments: 2,
      averageGrade: 78
    },
    {
      id: 3,
      name: 'Physics Laboratory',
      code: 'PHY-301',
      students: 20,
      nextClass: 'Fri, 2:00 PM',
      pendingAssignments: 1,
      averageGrade: 92
    },
    {
      id: 4,
      name: 'Technical Writing',
      code: 'ENG-101',
      students: 35,
      nextClass: 'Tue, 1:00 PM',
      pendingAssignments: 4,
      averageGrade: 88
    }
  ];

  const recentActivities = [
    { action: 'Graded Assignment 3', course: 'CS-201', time: '2 hours ago', type: 'grading' },
    { action: 'Posted new material', course: 'MATH-205', time: '4 hours ago', type: 'material' },
    { action: 'Marked attendance', course: 'PHY-301', time: '1 day ago', type: 'attendance' },
    { action: 'Sent announcement', course: 'ENG-101', time: '2 days ago', type: 'announcement' }
  ];

  const upcomingTasks = [
    { task: 'Grade Calculus Quiz 2', course: 'MATH-205', due: 'Today', priority: 'high' },
    { task: 'Prepare Physics Lab Materials', course: 'PHY-301', due: 'Tomorrow', priority: 'medium' },
    { task: 'Review Technical Writing Essays', course: 'ENG-101', due: 'March 15', priority: 'high' },
    { task: 'Update Course Syllabus', course: 'CS-201', due: 'March 20', priority: 'low' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'grading': return <Award className="h-4 w-4 text-green-600" />;
      case 'material': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'attendance': return <Users className="h-4 w-4 text-purple-600" />;
      case 'announcement': return <MessageSquare className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your teaching overview.</p>
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
        {/* My Courses */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600">{course.code} • {course.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{course.averageGrade}%</p>
                    <p className="text-xs text-gray-600">Avg Grade</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Next: {course.nextClass}</span>
                  <span>{course.pendingAssignments} pending</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.course} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.task}</p>
                    <p className="text-xs text-gray-600">{task.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <p className="text-xs text-gray-600 mt-1">{task.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
              <BookOpen className="h-6 w-6 text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Courses</p>
              <p className="text-sm text-gray-600">View and edit courses</p>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <Award className="h-6 w-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Grade Assignments</p>
              <p className="text-sm text-gray-600">Review student work</p>
            </button>
            <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
              <Users className="h-6 w-6 text-yellow-600 mb-2" />
              <p className="font-medium text-gray-900">Mark Attendance</p>
              <p className="text-sm text-gray-600">Record student presence</p>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <MessageSquare className="h-6 w-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Send Messages</p>
              <p className="text-sm text-gray-600">Communicate with students</p>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
            <div className="text-sm text-gray-600">Average Student Satisfaction</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
            <div className="text-sm text-gray-600">Average Class Attendance</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">78%</div>
            <div className="text-sm text-gray-600">Assignment Completion Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notices */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Important Notices</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Midterm exam grading deadline: March 25th, 2024</li>
              <li>• Course evaluation surveys are now open for students</li>
              <li>• Faculty meeting scheduled for March 20th at 2:00 PM</li>
              <li>• New grading rubric templates are available in the resources section</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <DataManagement 
        userRole="lecturer"
        onDataImport={handleDataImport}
        onDataExport={handleDataExport}
      />
    </div>
  );
};

export default LecturerDashboard;
