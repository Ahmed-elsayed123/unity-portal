import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Download, 
  Upload,
  Plus,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';

const LecturerGrades = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS-201');
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    { id: 'CS-201', name: 'Data Structures' },
    { id: 'MATH-205', name: 'Calculus II' },
    { id: 'PHY-301', name: 'Physics Lab' }
  ];

  const assignments = [
    { id: 'all', name: 'All Assignments' },
    { id: 'A1', name: 'Assignment 1' },
    { id: 'A2', name: 'Assignment 2' },
    { id: 'Q1', name: 'Quiz 1' },
    { id: 'MT', name: 'Midterm Exam' }
  ];

  const grades = [
    {
      id: 1,
      studentName: 'John Smith',
      studentId: 'STU2024001',
      assignment: 'Assignment 1',
      assignmentId: 'A1',
      course: 'CS-201',
      points: 85,
      maxPoints: 100,
      grade: 'B+',
      submittedDate: '2024-03-10',
      gradedDate: '2024-03-12',
      status: 'Graded',
      feedback: 'Good work on the algorithm implementation. Consider optimizing the time complexity.'
    },
    {
      id: 2,
      studentName: 'Sarah Johnson',
      studentId: 'STU2024002',
      assignment: 'Assignment 1',
      assignmentId: 'A1',
      course: 'CS-201',
      points: 92,
      maxPoints: 100,
      grade: 'A-',
      submittedDate: '2024-03-10',
      gradedDate: '2024-03-12',
      status: 'Graded',
      feedback: 'Excellent implementation with clear comments. Well done!'
    },
    {
      id: 3,
      studentName: 'Michael Chen',
      studentId: 'STU2024003',
      assignment: 'Quiz 1',
      assignmentId: 'Q1',
      course: 'MATH-205',
      points: 78,
      maxPoints: 100,
      grade: 'C+',
      submittedDate: '2024-03-08',
      gradedDate: '2024-03-09',
      status: 'Graded',
      feedback: 'Good understanding of concepts. Practice more integration problems.'
    },
    {
      id: 4,
      studentName: 'Emily Rodriguez',
      studentId: 'STU2024004',
      assignment: 'Lab Report 1',
      assignmentId: 'LR1',
      course: 'PHY-301',
      points: 95,
      maxPoints: 100,
      grade: 'A',
      submittedDate: '2024-03-05',
      gradedDate: '2024-03-07',
      status: 'Graded',
      feedback: 'Outstanding experimental design and analysis. Very thorough work.'
    },
    {
      id: 5,
      studentName: 'David Wilson',
      studentId: 'STU2024005',
      assignment: 'Assignment 2',
      assignmentId: 'A2',
      course: 'CS-201',
      points: null,
      maxPoints: 100,
      grade: null,
      submittedDate: null,
      gradedDate: null,
      status: 'Not Submitted',
      feedback: null
    }
  ];

  const filteredGrades = grades.filter(grade => {
    const matchesCourse = grade.course === selectedCourse;
    const matchesAssignment = selectedAssignment === 'all' || grade.assignmentId === selectedAssignment;
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesAssignment && matchesSearch;
  });

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-600';
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Graded': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Not Submitted': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Graded': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <AlertCircle className="h-4 w-4" />;
      case 'Not Submitted': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const courseStats = {
    totalStudents: filteredGrades.length,
    graded: filteredGrades.filter(g => g.status === 'Graded').length,
    pending: filteredGrades.filter(g => g.status === 'Pending').length,
    notSubmitted: filteredGrades.filter(g => g.status === 'Not Submitted').length,
    averageGrade: filteredGrades.filter(g => g.points).length > 0 
      ? Math.round(filteredGrades.filter(g => g.points).reduce((sum, g) => sum + g.points, 0) / filteredGrades.filter(g => g.points).length)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades Management</h1>
          <p className="text-gray-600 mt-2">Record and manage student grades and feedback</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import Grades
          </button>
          <button className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Grades
          </button>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{courseStats.totalStudents}</div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{courseStats.graded}</div>
          <div className="text-sm text-gray-600">Graded</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{courseStats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{courseStats.notSubmitted}</div>
          <div className="text-sm text-gray-600">Not Submitted</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{courseStats.averageGrade}%</div>
          <div className="text-sm text-gray-600">Average Grade</div>
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
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="input-field"
            >
              {assignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>{assignment.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{grade.studentName}</div>
                      <div className="text-sm text-gray-500">{grade.studentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{grade.assignment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {grade.points !== null ? `${grade.points}/${grade.maxPoints}` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getGradeColor(grade.grade)}`}>
                      {grade.grade || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grade.status)}`}>
                      {getStatusIcon(grade.status)}
                      <span className="ml-1">{grade.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{grade.submittedDate || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {grade.status === 'Graded' ? (
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        <Edit className="h-4 w-4" />
                      </button>
                    ) : (
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        <Award className="h-4 w-4" />
                      </button>
                    )}
                    <button className="text-gray-600 hover:text-gray-900">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredGrades.filter(g => g.grade && g.grade.startsWith('A')).length}
            </div>
            <div className="text-sm text-gray-600">A Grades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredGrades.filter(g => g.grade && g.grade.startsWith('B')).length}
            </div>
            <div className="text-sm text-gray-600">B Grades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredGrades.filter(g => g.grade && g.grade.startsWith('C')).length}
            </div>
            <div className="text-sm text-gray-600">C Grades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {filteredGrades.filter(g => g.grade && (g.grade.startsWith('D') || g.grade.startsWith('F'))).length}
            </div>
            <div className="text-sm text-gray-600">D/F Grades</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
            <Plus className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Assignment</h4>
            <p className="text-sm text-gray-600">Add new assignment for grading</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <Upload className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Bulk Grade Upload</h4>
            <p className="text-sm text-gray-600">Upload grades from CSV file</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
            <Award className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Grade Assignment</h4>
            <p className="text-sm text-gray-600">Grade pending submissions</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <Download className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export Report</h4>
            <p className="text-sm text-gray-600">Download grade reports</p>
          </button>
        </div>
      </div>

      {/* Grading Guidelines */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Grading Guidelines</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Grade assignments within 7 days of submission deadline</li>
              <li>• Provide constructive feedback for all graded work</li>
              <li>• Use consistent grading criteria across all students</li>
              <li>• Record grades in the system within 24 hours of grading</li>
              <li>• Contact students who haven't submitted assignments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerGrades;
