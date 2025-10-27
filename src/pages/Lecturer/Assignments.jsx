import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  FileText,
  Calendar,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  X
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const LecturerAssignments = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    maxPoints: '',
    type: 'homework',
    instructions: '',
    attachments: []
  });
  const navigate = useNavigate();

  const courses = [
    { id: 1, name: 'Data Structures and Algorithms', code: 'CS-201' },
    { id: 2, name: 'Calculus II', code: 'MATH-205' },
    { id: 3, name: 'Physics Laboratory', code: 'PHY-301' },
    { id: 4, name: 'Technical Writing', code: 'ENG-101' }
  ];

  const assignments = [
    {
      id: 1,
      title: 'Binary Tree Implementation',
      description: 'Implement a complete binary tree with insertion, deletion, and traversal methods',
      course: 'Data Structures and Algorithms',
      courseCode: 'CS-201',
      dueDate: '2024-02-15',
      maxPoints: 100,
      type: 'project',
      status: 'active',
      submissions: 28,
      totalStudents: 30,
      averageScore: 85,
      createdDate: '2024-01-20',
      instructions: 'Use Java or C++ to implement the binary tree. Include proper error handling and documentation.'
    },
    {
      id: 2,
      title: 'Integration Techniques Practice',
      description: 'Solve integration problems using various techniques learned in class',
      course: 'Calculus II',
      courseCode: 'MATH-205',
      dueDate: '2024-02-10',
      maxPoints: 50,
      type: 'homework',
      status: 'active',
      submissions: 22,
      totalStudents: 25,
      averageScore: 78,
      createdDate: '2024-01-18',
      instructions: 'Show all work clearly. Use proper mathematical notation.'
    },
    {
      id: 3,
      title: 'Physics Lab Report - Pendulum',
      description: 'Write a comprehensive lab report on pendulum motion experiments',
      course: 'Physics Laboratory',
      courseCode: 'PHY-301',
      dueDate: '2024-02-20',
      maxPoints: 75,
      type: 'lab',
      status: 'active',
      submissions: 18,
      totalStudents: 20,
      averageScore: 92,
      createdDate: '2024-01-22',
      instructions: 'Include data analysis, graphs, and conclusions. Follow the lab report format.'
    },
    {
      id: 4,
      title: 'Technical Documentation',
      description: 'Create technical documentation for a software project',
      course: 'Technical Writing',
      courseCode: 'ENG-101',
      dueDate: '2024-02-25',
      maxPoints: 100,
      type: 'project',
      status: 'draft',
      submissions: 0,
      totalStudents: 35,
      averageScore: 0,
      createdDate: '2024-01-25',
      instructions: 'Follow IEEE documentation standards. Include user manual and technical specifications.'
    },
    {
      id: 5,
      title: 'Algorithm Analysis Quiz',
      description: 'Online quiz covering Big O notation and algorithm complexity',
      course: 'Data Structures and Algorithms',
      courseCode: 'CS-201',
      dueDate: '2024-02-05',
      maxPoints: 25,
      type: 'quiz',
      status: 'completed',
      submissions: 30,
      totalStudents: 30,
      averageScore: 88,
      createdDate: '2024-01-15',
      instructions: 'Complete the quiz within 30 minutes. No external resources allowed.'
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All Courses' || assignment.course === selectedCourse;
    const matchesStatus = selectedStatus === 'All Status' || assignment.status === selectedStatus;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'draft': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'completed': return <XCircle className="h-5 w-5 text-gray-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'homework': return 'bg-blue-100 text-blue-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'quiz': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    // Handle assignment creation logic here
    console.log('Creating assignment:', assignmentForm);
    setShowCreateModal(false);
    setAssignmentForm({
      title: '',
      description: '',
      course: '',
      dueDate: '',
      maxPoints: '',
      type: 'homework',
      instructions: '',
      attachments: []
    });
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const handleEditAssignment = (assignment) => {
    // Navigate to edit page or open edit modal
    console.log('Editing assignment:', assignment.title);
    // For now, we'll just show an alert
    alert(`Edit functionality for "${assignment.title}" would open here`);
  };

  const handleDeleteAssignment = (assignment) => {
    if (window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      console.log('Deleting assignment:', assignment.title);
      // Handle deletion logic here
    }
  };

  const handleDownloadSubmissions = (assignment) => {
    console.log(`Downloading submissions for: ${assignment.title}`);
    // Handle download logic here
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/lecturer/courses" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Assignments</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Create and manage assignments for your courses</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
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
                placeholder="Search assignments..."
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
              <option value="All Courses">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.name}>{course.name}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="All Status">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Assignments Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.courseCode}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(assignment.type)}`}>
                    {assignment.type}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    getDaysUntilDue(assignment.dueDate) < 0 ? 'bg-red-100 text-red-800' :
                    getDaysUntilDue(assignment.dueDate) <= 3 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getDaysUntilDue(assignment.dueDate) < 0 ? 'Overdue' :
                     getDaysUntilDue(assignment.dueDate) === 0 ? 'Due Today' :
                     `${getDaysUntilDue(assignment.dueDate)} days left`}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {assignment.submissions}/{assignment.totalStudents} submitted
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  {assignment.maxPoints} points
                </div>
                {assignment.averageScore > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Avg: {assignment.averageScore}%
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewAssignment(assignment)}
                  className="flex-1 btn-primary text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button 
                  onClick={() => handleEditAssignment(assignment)}
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
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
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
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{assignment.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          <span className={`px-2 py-1 rounded-full ${getTypeColor(assignment.type)}`}>
                            {assignment.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{assignment.courseCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(assignment.dueDate).toLocaleDateString()}</div>
                      <div className={`text-xs ${
                        getDaysUntilDue(assignment.dueDate) < 0 ? 'text-red-600' :
                        getDaysUntilDue(assignment.dueDate) <= 3 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {getDaysUntilDue(assignment.dueDate) < 0 ? 'Overdue' :
                         getDaysUntilDue(assignment.dueDate) === 0 ? 'Due Today' :
                         `${getDaysUntilDue(assignment.dueDate)} days left`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{assignment.submissions}/{assignment.totalStudents}</div>
                      <div className="text-xs text-gray-500">
                        {Math.round((assignment.submissions / assignment.totalStudents) * 100)}% submitted
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.averageScore > 0 ? `${assignment.averageScore}%` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewAssignment(assignment)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditAssignment(assignment)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadSubmissions(assignment)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAssignment(assignment)}
                        className="text-red-600 hover:text-red-900"
                      >
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

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Assignment</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course
                  </label>
                  <select
                    value={assignmentForm.course}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, course: e.target.value })}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  className="input-field w-full"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Points
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.maxPoints}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, maxPoints: e.target.value })}
                    className="input-field w-full"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={assignmentForm.type}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, type: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="homework">Homework</option>
                    <option value="project">Project</option>
                    <option value="lab">Lab</option>
                    <option value="quiz">Quiz</option>
                    <option value="exam">Exam</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instructions
                </label>
                <textarea
                  value={assignmentForm.instructions}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                  className="input-field w-full"
                  rows="4"
                  placeholder="Detailed instructions for students..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attachments
                </label>
                <input
                  type="file"
                  multiple
                  className="input-field w-full"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Assignment Modal */}
      {showViewModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedAssignment.title}
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedAssignment.type)}`}>
                  {selectedAssignment.type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAssignment.status)}`}>
                  {selectedAssignment.status}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-300">{selectedAssignment.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Instructions</h4>
                <p className="text-gray-600 dark:text-gray-300">{selectedAssignment.instructions}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Course</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedAssignment.courseCode}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Due Date</h4>
                  <p className="text-gray-600 dark:text-gray-300">{new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Max Points</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedAssignment.maxPoints}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Submissions</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedAssignment.submissions}/{selectedAssignment.totalStudents}</p>
                </div>
              </div>
              
              {selectedAssignment.averageScore && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Average Score</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedAssignment.averageScore}%</p>
                </div>
              )}
              
              {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {selectedAssignment.attachments.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-900 dark:text-white">{file.name}</span>
                        <span className="text-xs text-gray-500">({file.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => handleEditAssignment(selectedAssignment)}
                className="flex-1 btn-primary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Assignment
              </button>
              <button
                onClick={() => handleDownloadSubmissions(selectedAssignment)}
                className="flex-1 btn-secondary"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Submissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{filteredAssignments.length}</div>
          <div className="text-sm text-gray-600">Total Assignments</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredAssignments.filter(a => a.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredAssignments.reduce((sum, assignment) => sum + assignment.submissions, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Submissions</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(filteredAssignments.filter(a => a.averageScore > 0).reduce((sum, assignment) => sum + assignment.averageScore, 0) / filteredAssignments.filter(a => a.averageScore > 0).length) || 0}%
          </div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </div>
      </div>
    </div>
  );
};

export default LecturerAssignments;
