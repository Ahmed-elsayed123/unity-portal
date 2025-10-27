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
  Eye,
  Save
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const LecturerGrades = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS-201');
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [exportFormat, setExportFormat] = useState('excel');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [editingGrade, setEditingGrade] = useState(null);
  const [editForm, setEditForm] = useState({
    points: '',
    grade: '',
    feedback: ''
  });

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

  const handleImportGrades = () => {
    setShowImportModal(true);
  };

  const handleExportGrades = () => {
    setShowExportModal(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
    }
  };

  const processImportFile = (e) => {
    e.preventDefault();
    if (importFile) {
      // Simulate file processing
      console.log('Processing import file:', importFile.name);
      
      // In a real app, you would parse the CSV/Excel file here
      // For now, we'll just show a success message
      alert(`Successfully imported grades from ${importFile.name}`);
      
      setShowImportModal(false);
      setImportFile(null);
    }
  };

  const processExportGrades = (e) => {
    e.preventDefault();
    
    // Create CSV data
    const csvData = filteredGrades.map(grade => ({
      'Student Name': grade.studentName,
      'Student ID': grade.studentId,
      'Assignment': grade.assignment,
      'Course': grade.course,
      'Points': grade.points,
      'Max Points': grade.maxPoints,
      'Grade': grade.grade,
      'Status': grade.status,
      'Submitted Date': grade.submittedDate,
      'Graded Date': grade.gradedDate,
      'Feedback': grade.feedback
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `grades_${selectedCourse}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportModal(false);
  };

  const handleViewGrade = (grade) => {
    setSelectedGrade(grade);
    setShowViewModal(true);
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setEditForm({
      points: grade.points || '',
      grade: grade.grade || '',
      feedback: grade.feedback || ''
    });
    setShowEditModal(true);
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    
    // In a real app, this would update the grade in the database
    console.log('Saving grade:', editingGrade.id, editForm);
    
    // Simulate success
    alert(`Grade updated successfully for ${editingGrade.studentName}`);
    
    setShowEditModal(false);
    setEditingGrade(null);
    setEditForm({ points: '', grade: '', feedback: '' });
  };

  const calculateGrade = (points, maxPoints) => {
    if (!points || !maxPoints) return '';
    const percentage = (points / maxPoints) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const handlePointsChange = (points) => {
    const maxPoints = editingGrade?.maxPoints || 100;
    const calculatedGrade = calculateGrade(points, maxPoints);
    setEditForm(prev => ({
      ...prev,
      points: points,
      grade: calculatedGrade
    }));
  };

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
      {/* Back Button */}
      <BackButton to="/lecturer/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Grades Management</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Record and manage student grades and feedback</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={handleImportGrades}
            className="btn-secondary"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Grades
          </button>
          <button 
            onClick={handleExportGrades}
            className="btn-primary"
          >
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
                      <button 
                        onClick={() => handleEditGrade(grade)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                        title="Edit Grade"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleEditGrade(grade)}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Grade Assignment"
                      >
                        <Award className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewGrade(grade)}
                      className="text-gray-600 hover:text-gray-900"
                      title="View Details"
                    >
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

      {/* View Grade Modal */}
      {showViewModal && selectedGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Grade Details - {selectedGrade.studentName}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Student Information</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedGrade.studentName}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{selectedGrade.studentId}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Assignment</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedGrade.assignment}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{selectedGrade.course}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Score</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedGrade.points !== null ? `${selectedGrade.points}/${selectedGrade.maxPoints}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Grade</h4>
                  <span className={`text-lg font-medium ${getGradeColor(selectedGrade.grade)}`}>
                    {selectedGrade.grade || 'N/A'}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedGrade.status)}`}>
                    {getStatusIcon(selectedGrade.status)}
                    <span className="ml-1">{selectedGrade.status}</span>
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Submitted Date</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedGrade.submittedDate || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Graded Date</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedGrade.gradedDate || 'N/A'}</p>
                </div>
              </div>
              
              {selectedGrade.feedback && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Feedback</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border">
                    <p className="text-gray-700 dark:text-gray-300">{selectedGrade.feedback}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditGrade(selectedGrade);
                }}
                className="flex-1 btn-primary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Grade
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

      {/* Edit Grade Modal */}
      {showEditModal && editingGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingGrade.status === 'Graded' ? 'Edit Grade' : 'Grade Assignment'}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Student
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{editingGrade.studentName}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{editingGrade.studentId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignment
                </label>
                <p className="text-gray-900 dark:text-white">{editingGrade.assignment}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Points (out of {editingGrade.maxPoints})
                </label>
                <input
                  type="number"
                  min="0"
                  max={editingGrade.maxPoints}
                  value={editForm.points}
                  onChange={(e) => handlePointsChange(e.target.value)}
                  className="input-field w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  value={editForm.grade}
                  onChange={(e) => setEditForm(prev => ({ ...prev, grade: e.target.value }))}
                  className="input-field w-full"
                  placeholder="A, B+, C, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Feedback
                </label>
                <textarea
                  value={editForm.feedback}
                  onChange={(e) => setEditForm(prev => ({ ...prev, feedback: e.target.value }))}
                  className="input-field w-full h-24 resize-none"
                  placeholder="Provide constructive feedback..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Grades Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Import Grades</h3>
            <form onSubmit={processImportFile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select File
                </label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="input-field w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="input-field w-full"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">File Format Requirements:</h4>
                <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                  <li>• First row should contain column headers</li>
                  <li>• Required columns: Student ID, Assignment, Points</li>
                  <li>• Optional columns: Feedback, Grade</li>
                </ul>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={!importFile}
                >
                  Import Grades
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Grades Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Grades</h3>
            <form onSubmit={processExportGrades} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="csv">CSV (Comma Separated Values)</option>
                  <option value="excel">Excel (.xlsx)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="input-field w-full"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignment Filter
                </label>
                <select
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  className="input-field w-full"
                >
                  {assignments.map(assignment => (
                    <option key={assignment.id} value={assignment.id}>{assignment.name}</option>
                  ))}
                </select>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">Export Information:</h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Will export {filteredGrades.length} grade records for {courses.find(c => c.id === selectedCourse)?.name}
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Export Grades
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
