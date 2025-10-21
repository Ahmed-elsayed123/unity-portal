import React, { useState } from 'react';
import { 
  ClipboardList, 
  Calendar, 
  Clock, 
  Users, 
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const AdminExaminations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('Spring 2024');

  const examinations = [
    {
      id: 1,
      name: 'Midterm Examination - Spring 2024',
      type: 'Midterm',
      semester: 'Spring 2024',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      duration: '120 minutes',
      courses: ['CS-201', 'MATH-205', 'PHY-301'],
      students: 1250,
      status: 'Scheduled',
      createdBy: 'Dr. Sarah Johnson',
      createdAt: '2024-02-15'
    },
    {
      id: 2,
      name: 'Final Examination - Spring 2024',
      type: 'Final',
      semester: 'Spring 2024',
      startDate: '2024-05-15',
      endDate: '2024-05-25',
      duration: '180 minutes',
      courses: ['CS-201', 'MATH-205', 'PHY-301', 'ENG-101'],
      students: 1250,
      status: 'Scheduled',
      createdBy: 'Dr. Sarah Johnson',
      createdAt: '2024-02-15'
    },
    {
      id: 3,
      name: 'Quiz 1 - Data Structures',
      type: 'Quiz',
      semester: 'Spring 2024',
      startDate: '2024-03-01',
      endDate: '2024-03-01',
      duration: '60 minutes',
      courses: ['CS-201'],
      students: 45,
      status: 'Completed',
      createdBy: 'Dr. Sarah Johnson',
      createdAt: '2024-02-20'
    },
    {
      id: 4,
      name: 'Practical Examination - Physics Lab',
      type: 'Practical',
      semester: 'Spring 2024',
      startDate: '2024-04-10',
      endDate: '2024-04-15',
      duration: '120 minutes',
      courses: ['PHY-301'],
      students: 25,
      status: 'Scheduled',
      createdBy: 'Dr. Emily Rodriguez',
      createdAt: '2024-02-25'
    }
  ];

  const results = [
    {
      id: 1,
      student: 'John Smith',
      studentId: 'STU2024001',
      course: 'CS-201',
      exam: 'Midterm Examination',
      score: 85,
      totalMarks: 100,
      grade: 'B+',
      status: 'Graded',
      gradedBy: 'Dr. Sarah Johnson',
      gradedDate: '2024-03-22'
    },
    {
      id: 2,
      student: 'Sarah Johnson',
      studentId: 'STU2024002',
      course: 'CS-201',
      exam: 'Midterm Examination',
      score: 92,
      totalMarks: 100,
      grade: 'A-',
      status: 'Graded',
      gradedBy: 'Dr. Sarah Johnson',
      gradedDate: '2024-03-22'
    },
    {
      id: 3,
      student: 'Michael Chen',
      studentId: 'STU2024003',
      course: 'MATH-205',
      exam: 'Midterm Examination',
      score: 78,
      totalMarks: 100,
      grade: 'C+',
      status: 'Graded',
      gradedBy: 'Prof. Michael Chen',
      gradedDate: '2024-03-22'
    }
  ];

  const filteredExaminations = examinations.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || exam.status === selectedStatus;
    const matchesSemester = exam.semester === selectedSemester;
    return matchesSearch && matchesStatus && matchesSemester;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled': return <Calendar className="h-4 w-4" />;
      case 'In Progress': return <Clock className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Examination Management</h1>
          <p className="text-gray-600 mt-2">Manage examinations, schedules, and results</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import Results
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Examination
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{examinations.length}</div>
          <div className="text-sm text-gray-600">Total Examinations</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {examinations.filter(e => e.status === 'Scheduled').length}
          </div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {examinations.filter(e => e.status === 'Completed').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {results.filter(r => r.status === 'Graded').length}
          </div>
          <div className="text-sm text-gray-600">Graded Results</div>
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
                placeholder="Search examinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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
            <button className="btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Examinations List */}
      <div className="space-y-4">
        {filteredExaminations.map((exam) => (
          <div key={exam.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
                <p className="text-gray-600">{exam.type} • {exam.semester}</p>
                <p className="text-sm text-gray-500">Created by: {exam.createdBy}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                {getStatusIcon(exam.status)}
                <span className="ml-1">{exam.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{exam.students}</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{exam.duration}</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{exam.courses.length}</div>
                <div className="text-sm text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{exam.startDate}</div>
                <div className="text-sm text-gray-600">Start Date</div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Courses:</h4>
              <div className="flex flex-wrap gap-2">
                {exam.courses.map((course, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 btn-primary text-sm">
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </button>
              <button className="flex-1 btn-secondary text-sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Results Section */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
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
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{result.student}</div>
                      <div className="text-sm text-gray-500">{result.studentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.course}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.exam}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.score}/{result.totalMarks}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
            <Plus className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Examination</h4>
            <p className="text-sm text-gray-600">Schedule new examination</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <ClipboardList className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Results</h4>
            <p className="text-sm text-gray-600">Process examination results</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
            <Calendar className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Exam Schedule</h4>
            <p className="text-sm text-gray-600">View examination calendar</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <Download className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export Results</h4>
            <p className="text-sm text-gray-600">Download examination data</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminExaminations;
