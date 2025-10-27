import React, { useState } from 'react';
import { 
  Search, 
  Mail, 
  User,
  Award,
  Calendar,
  Eye,
  Download,
  Grid,
  List,
  X
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const LecturerStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 'CS-201', name: 'Data Structures' },
    { id: 'MATH-205', name: 'Calculus II' },
    { id: 'PHY-301', name: 'Physics Lab' }
  ];

  const students = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@unity.edu',
      studentId: 'STU2024001',
      course: 'CS-201',
      courseName: 'Data Structures',
      attendance: 95,
      averageGrade: 87,
      assignments: 8,
      completedAssignments: 7,
      lastActivity: '2 days ago',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@unity.edu',
      studentId: 'STU2024002',
      course: 'CS-201',
      courseName: 'Data Structures',
      attendance: 88,
      averageGrade: 92,
      assignments: 8,
      completedAssignments: 8,
      lastActivity: '1 day ago',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@unity.edu',
      studentId: 'STU2024003',
      course: 'MATH-205',
      courseName: 'Calculus II',
      attendance: 92,
      averageGrade: 78,
      assignments: 6,
      completedAssignments: 5,
      lastActivity: '3 days ago',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@unity.edu',
      studentId: 'STU2024004',
      course: 'PHY-301',
      courseName: 'Physics Lab',
      attendance: 100,
      averageGrade: 95,
      assignments: 4,
      completedAssignments: 4,
      lastActivity: '1 day ago',
      status: 'Active'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@unity.edu',
      studentId: 'STU2024005',
      course: 'CS-201',
      courseName: 'Data Structures',
      attendance: 75,
      averageGrade: 72,
      assignments: 8,
      completedAssignments: 6,
      lastActivity: '5 days ago',
      status: 'At Risk'
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleDownloadReport = (student) => {
    console.log(`Downloading report for: ${student.name}`);
    // Handle download logic here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'At Risk': return 'text-red-600 bg-red-100';
      case 'Inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/lecturer/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Student List</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">View and manage your students across all courses</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">{filteredStudents.length}</div>
          <div className="text-sm text-gray-600 dark:text-slate-300">Total Students</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredStudents.filter(s => s.status === 'Active').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-slate-300">Active Students</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredStudents.filter(s => s.status === 'At Risk').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-slate-300">At Risk</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(filteredStudents.reduce((sum, s) => sum + s.attendance, 0) / filteredStudents.length)}
          </div>
          <div className="text-sm text-gray-600 dark:text-slate-300">Avg Attendance</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="input-field"
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-slate-300">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-400'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-400'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Students Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100">{student.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300">{student.studentId}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-300">
                  <Mail className="h-4 w-4 mr-2" />
                  {student.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-300">
                  <Award className="h-4 w-4 mr-2" />
                  {student.courseName}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last activity: {student.lastActivity}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-slate-100">{student.attendance}%</div>
                  <div className="text-xs text-gray-600 dark:text-slate-300">Attendance</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getGradeColor(student.averageGrade)}`}>
                    {student.averageGrade}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-300">Avg Grade</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-slate-300">Assignments</span>
                  <span className="text-sm text-gray-600 dark:text-slate-300">{student.completedAssignments}/{student.assignments}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${(student.completedAssignments / student.assignments) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewStudent(student)}
                  className="flex-1 btn-primary text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button 
                  onClick={() => handleDownloadReport(student)}
                  className="flex-1 btn-secondary text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                    Assignments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{student.name}</div>
                          <div className="text-sm text-gray-500 dark:text-slate-400">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-slate-100">{student.courseName}</div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">{student.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-slate-100">{student.attendance}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getGradeColor(student.averageGrade)}`}>
                        {student.averageGrade}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-slate-100">{student.completedAssignments}/{student.assignments}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewStudent(student)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadReport(student)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedStudent.name}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">{selectedStudent.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedStudent.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedStudent.studentId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Course</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedStudent.courseName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStudent.status)}`}>
                    {selectedStudent.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Attendance</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedStudent.attendance}%</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Average Grade</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedStudent.averageGrade}%</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Assignments</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedStudent.completedAssignments}/{selectedStudent.assignments}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Last Activity</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedStudent.lastActivity}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Assignment Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary-600 h-3 rounded-full" 
                    style={{ width: `${(selectedStudent.completedAssignments / selectedStudent.assignments) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {Math.round((selectedStudent.completedAssignments / selectedStudent.assignments) * 100)}% completed
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => handleDownloadReport(selectedStudent)}
                className="flex-1 btn-primary"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* At Risk Students Alert */}
      {filteredStudents.filter(s => s.status === 'At Risk').length > 0 && (
        <div className="card p-6 bg-red-50 border-red-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-red-800 dark:text-red-300">At Risk Students</h3>
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                {filteredStudents.filter(s => s.status === 'At Risk').length} student(s) are at risk of failing. 
                Consider reaching out to provide additional support.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerStudents;
