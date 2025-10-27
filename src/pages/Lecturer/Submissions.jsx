import React, { useState } from 'react';
import { 
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  FileText,
  Star,
  MessageSquare,
  Filter,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const LecturerSubmissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('All Assignments');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('submissionDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    grade: '',
    feedback: '',
    status: 'graded'
  });

  const assignments = [
    { id: 1, title: 'Binary Tree Implementation', course: 'Data Structures and Algorithms', dueDate: '2024-02-15' },
    { id: 2, title: 'Integration Techniques Practice', course: 'Calculus II', dueDate: '2024-02-10' },
    { id: 3, title: 'Physics Lab Report - Pendulum', course: 'Physics Laboratory', dueDate: '2024-02-20' },
    { id: 4, title: 'Technical Documentation', course: 'Technical Writing', dueDate: '2024-02-25' }
  ];

  const submissions = [
    {
      id: 1,
      studentId: 'STU001',
      studentName: 'John Smith',
      studentEmail: 'john.smith@student.unity.edu',
      assignmentId: 1,
      assignmentTitle: 'Binary Tree Implementation',
      course: 'Data Structures and Algorithms',
      submissionDate: '2024-02-14T10:30:00',
      dueDate: '2024-02-15T23:59:59',
      status: 'submitted',
      grade: null,
      maxPoints: 100,
      files: [
        { name: 'BinaryTree.java', size: '2.5 KB', type: 'java' },
        { name: 'README.md', size: '1.2 KB', type: 'markdown' }
      ],
      content: 'I have implemented a complete binary tree with insertion, deletion, and traversal methods. The implementation includes proper error handling and comprehensive documentation.',
      feedback: '',
      isLate: false
    },
    {
      id: 2,
      studentId: 'STU002',
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.johnson@student.unity.edu',
      assignmentId: 1,
      assignmentTitle: 'Binary Tree Implementation',
      course: 'Data Structures and Algorithms',
      submissionDate: '2024-02-15T14:45:00',
      dueDate: '2024-02-15T23:59:59',
      status: 'graded',
      grade: 85,
      maxPoints: 100,
      files: [
        { name: 'BinaryTree.cpp', size: '3.1 KB', type: 'cpp' },
        { name: 'test_cases.txt', size: '0.8 KB', type: 'text' }
      ],
      content: 'Implemented binary tree using C++ with comprehensive test cases. All traversal methods work correctly.',
      feedback: 'Good implementation! The code is well-structured and handles edge cases properly. Consider adding more comments for better readability.',
      isLate: false
    },
    {
      id: 3,
      studentId: 'STU003',
      studentName: 'Mike Davis',
      studentEmail: 'mike.davis@student.unity.edu',
      assignmentId: 2,
      assignmentTitle: 'Integration Techniques Practice',
      course: 'Calculus II',
      submissionDate: '2024-02-12T16:20:00',
      dueDate: '2024-02-10T23:59:59',
      status: 'graded',
      grade: 72,
      maxPoints: 50,
      files: [
        { name: 'calculus_homework.pdf', size: '1.8 MB', type: 'pdf' }
      ],
      content: 'Completed all integration problems using substitution and integration by parts methods.',
      feedback: 'Good work on most problems. Please review problem 5 - the substitution method was not applied correctly.',
      isLate: true
    },
    {
      id: 4,
      studentId: 'STU004',
      studentName: 'Emily Wilson',
      studentEmail: 'emily.wilson@student.unity.edu',
      assignmentId: 3,
      assignmentTitle: 'Physics Lab Report - Pendulum',
      course: 'Physics Laboratory',
      submissionDate: '2024-02-18T09:15:00',
      dueDate: '2024-02-20T23:59:59',
      status: 'submitted',
      grade: null,
      maxPoints: 75,
      files: [
        { name: 'lab_report.pdf', size: '2.3 MB', type: 'pdf' },
        { name: 'data_analysis.xlsx', size: '156 KB', type: 'excel' }
      ],
      content: 'Comprehensive lab report with detailed analysis of pendulum motion experiments. Includes graphs and statistical analysis.',
      feedback: '',
      isLate: false
    },
    {
      id: 5,
      studentId: 'STU005',
      studentName: 'Alex Brown',
      studentEmail: 'alex.brown@student.unity.edu',
      assignmentId: 1,
      assignmentTitle: 'Binary Tree Implementation',
      course: 'Data Structures and Algorithms',
      submissionDate: '2024-02-16T11:30:00',
      dueDate: '2024-02-15T23:59:59',
      status: 'submitted',
      grade: null,
      maxPoints: 100,
      files: [
        { name: 'BinaryTree.py', size: '2.8 KB', type: 'python' },
        { name: 'requirements.txt', size: '0.1 KB', type: 'text' }
      ],
      content: 'Python implementation with object-oriented design. Includes unit tests and documentation.',
      feedback: '',
      isLate: true
    }
  ];

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAssignment = selectedAssignment === 'All Assignments' || submission.assignmentTitle === selectedAssignment;
    const matchesStatus = selectedStatus === 'All Status' || submission.status === selectedStatus;
    
    return matchesSearch && matchesAssignment && matchesStatus;
  }).sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'submissionDate':
        aValue = new Date(a.submissionDate);
        bValue = new Date(b.submissionDate);
        break;
      case 'studentName':
        aValue = a.studentName;
        bValue = b.studentName;
        break;
      case 'grade':
        aValue = a.grade || 0;
        bValue = b.grade || 0;
        break;
      default:
        aValue = a.submissionDate;
        bValue = b.submissionDate;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'graded': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'late': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'graded': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-600" />;
      case 'java': return <FileText className="h-4 w-4 text-orange-600" />;
      case 'cpp': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'python': return <FileText className="h-4 w-4 text-green-600" />;
      case 'excel': return <FileText className="h-4 w-4 text-green-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setFeedbackForm({
      grade: submission.grade || '',
      feedback: submission.feedback || '',
      status: 'graded'
    });
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    // Handle feedback submission logic here
    console.log('Grading submission:', selectedSubmission.id, feedbackForm);
    setShowFeedbackModal(false);
    setSelectedSubmission(null);
  };

  const getDaysLate = (submissionDate, dueDate) => {
    const submit = new Date(submissionDate);
    const due = new Date(dueDate);
    const diffTime = submit - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/lecturer/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Student Submissions</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">View and grade student assignment submissions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredSubmissions.length}</span> submissions
            <span className="ml-4 font-medium text-yellow-600">
              {filteredSubmissions.filter(s => s.status === 'submitted').length} pending
            </span>
          </div>
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
                placeholder="Search students or assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="input-field"
            >
              <option value="All Assignments">All Assignments</option>
              {assignments.map(assignment => (
                <option key={assignment.id} value={assignment.title}>{assignment.title}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="All Status">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="late">Late</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="submissionDate">Sort by Date</option>
              <option value="studentName">Sort by Student</option>
              <option value="grade">Sort by Grade</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{submission.studentName}</h3>
                  <p className="text-sm text-gray-600">{submission.studentEmail}</p>
                  <p className="text-sm text-gray-500">{submission.assignmentTitle}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                  {submission.status}
                </span>
                {submission.isLate && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {getDaysLate(submission.submissionDate, submission.dueDate)} days late
                  </span>
                )}
                {submission.grade && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{submission.grade}/{submission.maxPoints}</div>
                    <div className="text-sm text-gray-600">
                      {Math.round((submission.grade / submission.maxPoints) * 100)}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-3">{submission.content}</p>
              {submission.feedback && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Feedback:</strong> {submission.feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Due: {new Date(submission.dueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {submission.files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-1 text-sm text-gray-600">
                    {getFileIcon(file.type)}
                    <span>{file.name}</span>
                    <span className="text-gray-400">({file.size})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="btn-primary text-sm">
                <Eye className="h-4 w-4 mr-1" />
                View Files
              </button>
              <button className="btn-secondary text-sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
              {submission.status === 'submitted' && (
                <button 
                  onClick={() => handleGradeSubmission(submission)}
                  className="btn-primary text-sm bg-green-600 hover:bg-green-700"
                >
                  <Star className="h-4 w-4 mr-1" />
                  Grade
                </button>
              )}
              {submission.status === 'graded' && (
                <button 
                  onClick={() => handleGradeSubmission(submission)}
                  className="btn-secondary text-sm"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Edit Grade
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grade Submission Modal */}
      {showFeedbackModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Grade Submission - {selectedSubmission.studentName}
            </h3>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grade (out of {selectedSubmission.maxPoints})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedSubmission.maxPoints}
                    value={feedbackForm.grade}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, grade: e.target.value })}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={feedbackForm.status}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, status: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="graded">Graded</option>
                    <option value="needs_revision">Needs Revision</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Feedback
                </label>
                <textarea
                  value={feedbackForm.feedback}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                  className="input-field w-full"
                  rows="4"
                  placeholder="Provide detailed feedback to help the student improve..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Submit Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{filteredSubmissions.length}</div>
          <div className="text-sm text-gray-600">Total Submissions</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredSubmissions.filter(s => s.status === 'submitted').length}
          </div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredSubmissions.filter(s => s.status === 'graded').length}
          </div>
          <div className="text-sm text-gray-600">Graded</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredSubmissions.filter(s => s.isLate).length}
          </div>
          <div className="text-sm text-gray-600">Late Submissions</div>
        </div>
      </div>
    </div>
  );
};

export default LecturerSubmissions;
