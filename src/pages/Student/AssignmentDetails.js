import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Download, 
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Eye,
  MessageCircle,
  Star,
  User,
  BookOpen
} from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const AssignmentDetails = () => {
  const { assignmentId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { showNotification } = useNotification();

  // Mock assignment data - in a real app, this would come from API based on assignmentId
  const assignment = {
    id: parseInt(assignmentId),
    title: 'Data Structures Implementation',
    course: 'CS-201',
    courseName: 'Data Structures',
    instructor: 'Dr. Sarah Johnson',
    dueDate: '2024-01-15',
    dueTime: '23:59',
    status: 'upcoming',
    points: 100,
    description: `Implement a binary search tree (BST) with the following operations:
    
1. Insert a new node with a given value
2. Delete a node with a given value
3. Search for a node with a given value
4. In-order, pre-order, and post-order traversals
5. Find the minimum and maximum values in the tree

Requirements:
- Use object-oriented programming principles
- Include proper error handling
- Write comprehensive unit tests
- Follow Java coding conventions
- Include detailed comments explaining your implementation

The implementation should be efficient and handle edge cases properly.`,
    materials: [
      { name: 'Assignment_1_Requirements.pdf', type: 'pdf', size: '2.1 MB', url: '#' },
      { name: 'BST_Example_Code.java', type: 'java', size: '1.8 MB', url: '#' },
      { name: 'Unit_Test_Template.java', type: 'java', size: '0.9 MB', url: '#' },
      { name: 'Coding_Standards.pdf', type: 'pdf', size: '1.2 MB', url: '#' }
    ],
    rubric: [
      { criterion: 'Correctness of Implementation', points: 40, description: 'All operations work correctly for various test cases' },
      { criterion: 'Code Quality', points: 25, description: 'Clean, readable code with proper documentation' },
      { criterion: 'Efficiency', points: 20, description: 'Optimal time complexity for all operations' },
      { criterion: 'Testing', points: 15, description: 'Comprehensive unit tests with good coverage' }
    ],
    submitted: false,
    grade: null,
    submissionHistory: [],
    comments: [
      {
        id: 1,
        author: 'Dr. Sarah Johnson',
        content: 'Please make sure to include edge case handling for empty trees.',
        date: '2024-01-10',
        type: 'instructor'
      },
      {
        id: 2,
        author: 'You',
        content: 'Should I implement a recursive or iterative approach for the traversals?',
        date: '2024-01-11',
        type: 'student'
      }
    ]
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
    showNotification(`${files.length} file(s) selected`, 'info');
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAssignment = () => {
    if (!submissionText.trim() && uploadedFiles.length === 0) {
      showNotification('Please provide a submission (text or files)', 'error');
      return;
    }

    setIsSubmitting(true);
    showNotification('Submitting assignment...', 'info');
    
    setTimeout(() => {
      showNotification('Assignment submitted successfully!', 'success');
      setIsSubmitting(false);
      setSubmissionText('');
      setUploadedFiles([]);
    }, 2000);
  };

  const handleDownloadMaterial = (materialName) => {
    setIsDownloading(true);
    showNotification(`Downloading ${materialName}...`, 'info');
    setTimeout(() => {
      showNotification('Download completed', 'success');
      setIsDownloading(false);
    }, 1500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate, dueTime) => {
    const now = new Date();
    const due = new Date(`${dueDate}T${dueTime}`);
    return now > due;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'submitted': return 'text-green-600 bg-green-100';
      case 'graded': return 'text-purple-600 bg-purple-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-4 w-4" />;
      case 'submitted': return <CheckCircle className="h-4 w-4" />;
      case 'graded': return <Star className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/student/assignments"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
            <p className="text-gray-600 mt-1">{assignment.course} - {assignment.courseName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
            <span className="flex items-center">
              {getStatusIcon(assignment.status)}
              <span className="ml-1 capitalize">{assignment.status}</span>
            </span>
          </span>
          <span className="text-sm text-gray-500">{assignment.points} points</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assignment Details */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignment Details</h2>
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Due: {formatDate(assignment.dueDate)} at {assignment.dueTime}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>Instructor: {assignment.instructor}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Course: {assignment.course} - {assignment.courseName}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {assignment.description}
                </pre>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignment Materials</h2>
            <div className="space-y-3">
              {assignment.materials.map((material, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{material.name}</p>
                      <p className="text-sm text-gray-500">{material.type.toUpperCase()} • {material.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadMaterial(material.name)}
                    disabled={isDownloading}
                    className="btn-primary text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submission */}
          {!assignment.submitted && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Assignment</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Submission
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Enter your submission text here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Upload
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload your files here</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="btn-secondary cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <AlertCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmitAssignment}
                  disabled={isSubmitting}
                  className="w-full btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments & Discussion</h2>
            <div className="space-y-4">
              {assignment.comments.map((comment) => (
                <div key={comment.id} className={`p-4 rounded-lg ${
                  comment.type === 'instructor' ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button className="btn-primary">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rubric */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grading Rubric</h3>
            <div className="space-y-3">
              {assignment.rubric.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900">{item.criterion}</span>
                    <span className="text-sm font-semibold text-primary-600">{item.points} pts</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary text-sm">
                <Download className="h-4 w-4 mr-2" />
                Download All Materials
              </button>
              <button className="w-full btn-secondary text-sm">
                <Eye className="h-4 w-4 mr-2" />
                View Submission History
              </button>
              <Link 
                to={`/student/course/${assignment.course}`}
                className="w-full btn-outline text-sm text-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Back to Course
              </Link>
            </div>
          </div>

          {/* Due Date Warning */}
          {isOverdue(assignment.dueDate, assignment.dueTime) && (
            <div className="card p-4 bg-red-50 border border-red-200">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm font-medium text-red-700">Assignment is overdue</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
