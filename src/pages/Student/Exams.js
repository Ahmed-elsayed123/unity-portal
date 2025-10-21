import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  BookOpen,
  Calendar,
  Download,
  Play,
  Eye,
  FileText
} from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const StudentExams = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleStartExam = (examId) => {
    setIsLoading(true);
    showNotification(`Starting exam ${examId}...`, 'info');
    setTimeout(() => {
      showNotification('Exam started successfully', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const handleDownloadMaterials = (examId) => {
    setIsLoading(true);
    showNotification(`Downloading materials for exam ${examId}...`, 'info');
    setTimeout(() => {
      showNotification('Materials downloaded successfully', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const handleViewResults = (examId) => {
    showNotification(`Viewing results for exam ${examId}`, 'info');
  };

  const handleExportResults = () => {
    setIsLoading(true);
    showNotification('Exporting exam results...', 'info');
    setTimeout(() => {
      showNotification('Results exported successfully', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const upcomingExams = [
    {
      id: 1,
      title: 'Data Structures - Midterm Exam',
      course: 'CS-201',
      instructor: 'Dr. Sarah Johnson',
      date: '2024-03-15',
      time: '09:00 AM - 11:00 AM',
      duration: '120 minutes',
      type: 'Midterm',
      status: 'upcoming',
      location: 'CS-101',
      instructions: 'Bring your student ID and calculator. No electronic devices allowed.',
      totalQuestions: 50,
      totalMarks: 100
    },
    {
      id: 2,
      title: 'Calculus II - Quiz 3',
      course: 'MATH-205',
      instructor: 'Prof. Michael Chen',
      date: '2024-03-18',
      time: '11:00 AM - 12:00 PM',
      duration: '60 minutes',
      type: 'Quiz',
      status: 'upcoming',
      location: 'MATH-205',
      instructions: 'Closed book exam. Calculator allowed.',
      totalQuestions: 20,
      totalMarks: 50
    }
  ];

  const completedExams = [
    {
      id: 3,
      title: 'Physics Lab - Practical Exam',
      course: 'PHY-301',
      instructor: 'Dr. Emily Rodriguez',
      date: '2024-03-05',
      time: '02:00 PM - 04:00 PM',
      duration: '120 minutes',
      type: 'Practical',
      status: 'completed',
      score: 85,
      totalMarks: 100,
      grade: 'A-',
      feedback: 'Excellent work on the experimental setup. Minor improvements needed in data analysis.'
    },
    {
      id: 4,
      title: 'Technical Writing - Assignment Review',
      course: 'ENG-101',
      instructor: 'Prof. David Wilson',
      date: '2024-02-28',
      time: '01:00 PM - 02:00 PM',
      duration: '60 minutes',
      type: 'Assignment',
      status: 'completed',
      score: 92,
      totalMarks: 100,
      grade: 'A',
      feedback: 'Well-structured essay with clear arguments. Good use of evidence.'
    }
  ];

  const onlineTests = [
    {
      id: 5,
      title: 'Database Systems - Online Quiz',
      course: 'CS-301',
      instructor: 'Dr. Lisa Anderson',
      availableFrom: '2024-03-12',
      availableUntil: '2024-03-15',
      duration: '45 minutes',
      status: 'available',
      attempts: 2,
      maxAttempts: 3,
      bestScore: 78
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'available': return 'text-purple-600 bg-purple-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'available': return <Play className="h-4 w-4" />;
      case 'expired': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams & Tests</h1>
          <p className="text-gray-600 mt-2">Manage your examinations and online assessments</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={handleExportResults}
            disabled={isLoading}
            className="btn-secondary"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Results
          </button>
          <button 
            onClick={() => showNotification('Downloading exam schedule...', 'info')}
            className="btn-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Schedule
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{upcomingExams.length}</div>
          <div className="text-sm text-gray-600">Upcoming Exams</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completedExams.length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{onlineTests.length}</div>
          <div className="text-sm text-gray-600">Online Tests</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">
            {Math.round(completedExams.reduce((sum, exam) => sum + exam.score, 0) / completedExams.length)}
          </div>
          <div className="text-sm text-gray-600">Average Score</div>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Exams</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                    <p className="text-gray-600">{exam.course} • {exam.instructor}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                    {getStatusIcon(exam.status)}
                    <span className="ml-1">{exam.status}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {exam.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {exam.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {exam.location}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Instructions:</strong> {exam.instructions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Online Tests */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Online Tests</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {onlineTests.map((test) => (
              <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                    <p className="text-gray-600">{test.course} • {test.instructor}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                    {getStatusIcon(test.status)}
                    <span className="ml-1">{test.status}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-sm text-gray-600">
                    <strong>Available:</strong> {test.availableFrom} - {test.availableUntil}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Duration:</strong> {test.duration}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Attempts:</strong> {test.attempts}/{test.maxAttempts}
                  </div>
                </div>
                {test.bestScore && (
                  <div className="bg-green-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-green-800">
                      <strong>Best Score:</strong> {test.bestScore}%
                    </p>
                  </div>
                )}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleStartExam(test.id)}
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Test
                  </button>
                  <button 
                    onClick={() => handleDownloadMaterials(test.id)}
                    disabled={isLoading}
                    className="btn-secondary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Materials
                  </button>
                  {test.bestScore && (
                    <button 
                      onClick={() => handleViewResults(test.id)}
                      className="btn-secondary"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Completed Exams */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Completed Exams</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {completedExams.map((exam) => (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                    <p className="text-gray-600">{exam.course} • {exam.instructor}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{exam.score}/{exam.totalMarks}</div>
                    <div className="text-sm text-gray-600">Grade: {exam.grade}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="text-sm text-gray-600">
                    <strong>Date:</strong> {exam.date}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Duration:</strong> {exam.duration}
                  </div>
                </div>
                {exam.feedback && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-800">
                      <strong>Feedback:</strong> {exam.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exam Guidelines */}
      <div className="card p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Exam Guidelines</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Arrive 15 minutes before the exam start time</li>
              <li>• Bring your student ID and required materials</li>
              <li>• No electronic devices (phones, smartwatches) allowed</li>
              <li>• Follow all instructions provided by the instructor</li>
              <li>• Contact the exam office if you have any questions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExams;
