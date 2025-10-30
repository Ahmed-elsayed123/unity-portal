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
  XCircle,
  X,
  Save
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const AdminExaminations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('Spring 2024');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    type: '',
    semester: '',
    startDate: '',
    endDate: '',
    duration: '',
    courses: [],
    description: ''
  });

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

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name || '',
      type: item.type || '',
      semester: item.semester || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      duration: item.duration || '',
      courses: item.courses || [],
      description: item.description || ''
    });
    setShowEditModal(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      type: '',
      semester: '',
      startDate: '',
      endDate: '',
      duration: '',
      courses: [],
      description: ''
    });
    setShowAddModal(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    
    // In a real app, this would save to the database
    console.log('Saving examination:', editingItem ? 'edit' : 'add', itemForm);
    
    // Simulate success
    const action = editingItem ? 'updated' : 'created';
    alert(`Examination ${action} successfully!`);
    
    setShowEditModal(false);
    setShowAddModal(false);
    setEditingItem(null);
    setItemForm({
      name: '',
      type: '',
      semester: '',
      startDate: '',
      endDate: '',
      duration: '',
      courses: [],
      description: ''
    });
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete this examination?`)) {
      // In a real app, this would delete from the database
      console.log('Deleting examination:', item.id);
      alert('Examination deleted successfully!');
    }
  };

  const handleViewResult = (result) => {
    setSelectedItem(result);
    setShowViewModal(true);
  };

  const handleEditResult = (result) => {
    setEditingItem(result);
    setItemForm({
      name: result.exam || '',
      type: 'Result',
      semester: '',
      startDate: '',
      endDate: '',
      duration: '',
      courses: [result.course],
      description: '',
      score: result.score || '',
      totalMarks: result.totalMarks || '',
      grade: result.grade || ''
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/admin/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Examination Management</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Manage examinations, schedules, and results</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import Results
          </button>
          <button 
            onClick={handleAddItem}
            className="btn-primary"
          >
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
              <button 
                onClick={() => handleViewItem(exam)}
                className="flex-1 btn-primary text-sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </button>
              <button 
                onClick={() => handleEditItem(exam)}
                className="flex-1 btn-secondary text-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button 
                onClick={() => handleDeleteItem(exam)}
                className="flex-1 btn-danger text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
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
                    <button 
                      onClick={() => handleViewResult(result)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditResult(result)}
                      className="text-gray-600 hover:text-gray-900"
                    >
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
          <button 
            onClick={handleAddItem}
            className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left"
          >
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

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedItem.name || selectedItem.exam} Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedItem.type && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Name</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Type</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.type}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Semester</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.semester}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Duration</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.duration}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Start Date</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.startDate}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">End Date</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.endDate}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status}
                    </span>
                  </div>
                </div>
              )}

              {selectedItem.student && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Student</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.student}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedItem.studentId}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Course</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.course}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Score</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.score}/{selectedItem.totalMarks}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Grade</h4>
                    <span className={`text-lg font-medium ${getGradeColor(selectedItem.grade)}`}>
                      {selectedItem.grade}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Graded By</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.gradedBy}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Graded Date</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.gradedDate}</p>
                  </div>
                </div>
              )}

              {selectedItem.courses && selectedItem.courses.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Courses</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.courses.map((course, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.students && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="text-2xl font-bold text-blue-600">{selectedItem.students}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Students</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="text-2xl font-bold text-green-600">{selectedItem.courses?.length || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Courses</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  if (selectedItem.student) {
                    handleEditResult(selectedItem);
                  } else {
                    handleEditItem(selectedItem);
                  }
                }}
                className="flex-1 btn-primary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
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

      {/* Edit/Add Modal */}
      {(showEditModal || showAddModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Examination' : 'Create Examination'}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setShowAddModal(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Enter examination name..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={itemForm.type}
                  onChange={(e) => setItemForm(prev => ({ ...prev, type: e.target.value }))}
                  className="input-field w-full"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="Midterm">Midterm</option>
                  <option value="Final">Final</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Practical">Practical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  value={itemForm.semester}
                  onChange={(e) => setItemForm(prev => ({ ...prev, semester: e.target.value }))}
                  className="input-field w-full"
                  required
                >
                  <option value="">Select semester...</option>
                  <option value="Spring 2024">Spring 2024</option>
                  <option value="Fall 2023">Fall 2023</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={itemForm.startDate}
                    onChange={(e) => setItemForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={itemForm.endDate}
                    onChange={(e) => setItemForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemForm.duration}
                  onChange={(e) => setItemForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="input-field w-full"
                  placeholder="e.g., 120 minutes"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field w-full h-20 resize-none"
                  placeholder="Enter examination description..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setShowAddModal(false);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExaminations;
