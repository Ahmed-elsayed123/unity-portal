import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Search,
  Grid,
  List
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const LecturerCourses = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Spring 2024');
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      name: 'Data Structures and Algorithms',
      code: 'CS-201',
      semester: 'Spring 2024',
      students: 30,
      credits: 3,
      schedule: 'Mon, Wed, Fri 9:00 AM - 10:30 AM',
      room: 'CS-101',
      status: 'Active',
      description: 'Comprehensive study of fundamental data structures and algorithmic techniques.',
      materials: 15,
      assignments: 8,
      averageGrade: 85
    },
    {
      id: 2,
      name: 'Calculus II',
      code: 'MATH-205',
      semester: 'Spring 2024',
      students: 25,
      credits: 4,
      schedule: 'Mon, Wed 11:00 AM - 12:30 PM',
      room: 'MATH-205',
      status: 'Active',
      description: 'Advanced calculus topics including integration techniques and series.',
      materials: 12,
      assignments: 6,
      averageGrade: 78
    },
    {
      id: 3,
      name: 'Physics Laboratory',
      code: 'PHY-301',
      semester: 'Spring 2024',
      students: 20,
      credits: 2,
      schedule: 'Fri 2:00 PM - 4:00 PM',
      room: 'PHY-301',
      status: 'Active',
      description: 'Hands-on laboratory experiments in classical and modern physics.',
      materials: 8,
      assignments: 4,
      averageGrade: 92
    },
    {
      id: 4,
      name: 'Technical Writing',
      code: 'ENG-101',
      semester: 'Spring 2024',
      students: 35,
      credits: 3,
      schedule: 'Tue, Thu 1:00 PM - 2:30 PM',
      room: 'ENG-102',
      status: 'Active',
      description: 'Professional writing skills for technical and scientific communication.',
      materials: 10,
      assignments: 5,
      averageGrade: 88
    }
  ];

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-gray-600 bg-gray-100';
      case 'Draft': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/lecturer/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Course Management</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Manage your courses, materials, and assignments</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => navigate('/lecturer/courses/create')}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="input-field"
            >
              <option value="Spring 2024">Spring 2024</option>
              <option value="Fall 2023">Fall 2023</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-600">{course.code} • {course.credits} credits</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {course.students} students
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {course.schedule}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {course.room}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{course.materials}</div>
                  <div className="text-xs text-gray-600">Materials</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{course.assignments}</div>
                  <div className="text-xs text-gray-600">Assignments</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{course.averageGrade}%</div>
                  <div className="text-xs text-gray-600">Avg Grade</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate(`/lecturer/courses/${course.id}`)}
                  className="flex-1 btn-primary text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button 
                  onClick={() => navigate(`/lecturer/courses/${course.id}/edit`)}
                  className="flex-1 btn-secondary text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Materials
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.name}</div>
                        <div className="text-sm text-gray-500">{course.code} • {course.credits} credits</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.students}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.schedule}</div>
                      <div className="text-sm text-gray-500">{course.room}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.materials} materials</div>
                      <div className="text-sm text-gray-500">{course.assignments} assignments</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.averageGrade}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => navigate(`/lecturer/courses/${course.id}`)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/lecturer/courses/${course.id}/edit`)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{filteredCourses.length}</div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredCourses.reduce((sum, course) => sum + course.students, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredCourses.reduce((sum, course) => sum + course.materials, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Materials</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(filteredCourses.reduce((sum, course) => sum + course.averageGrade, 0) / filteredCourses.length)}
          </div>
          <div className="text-sm text-gray-600">Avg Grade</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/lecturer/courses/create')}
            className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left"
          >
            <Plus className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Course</h4>
            <p className="text-sm text-gray-600">Add a new course to your schedule</p>
          </button>
          <button 
            onClick={() => navigate('/lecturer/materials')}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <Upload className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Upload Materials</h4>
            <p className="text-sm text-gray-600">Add course materials and resources</p>
          </button>
          <button 
            onClick={() => navigate('/lecturer/assignments')}
            className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left"
          >
            <FileText className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Assignment</h4>
            <p className="text-sm text-gray-600">Set up new assignments for students</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <Download className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export Data</h4>
            <p className="text-sm text-gray-600">Download course reports and data</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LecturerCourses;
