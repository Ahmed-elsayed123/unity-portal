import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Download, 
  MessageCircle,
  Star,
  Award,
  BarChart3,
  Eye,
  Play
} from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import BackButton from '../../components/BackButton.jsx';

const CourseDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  // Mock course data - in a real app, this would come from props or API
  const course = {
    id: 'CS-201',
    name: 'Data Structures',
    code: 'CS-201',
    instructor: 'Dr. Sarah Johnson',
    instructorEmail: 'sarah.johnson@university.edu',
    credits: 3,
    semester: 'Fall 2024',
    description: 'This course covers fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Students will learn to implement and analyze these structures using various algorithms.',
    schedule: {
      days: 'Monday, Wednesday, Friday',
      time: '10:00 AM - 11:00 AM',
      room: 'CS Building, Room 201'
    },
    currentGrade: 'A-',
    attendance: 95,
    materials: [
      { name: 'Course Syllabus', type: 'pdf', size: '2.1 MB' },
      { name: 'Textbook Chapter 1', type: 'pdf', size: '5.3 MB' },
      { name: 'Lecture Notes - Week 1', type: 'pdf', size: '1.8 MB' },
      { name: 'Assignment 1 Guidelines', type: 'pdf', size: '1.2 MB' },
      { name: 'Sample Code Examples', type: 'zip', size: '3.4 MB' }
    ],
    assignments: [
      { id: 1, title: 'Array Implementation', dueDate: '2024-01-15', status: 'upcoming', points: 100 },
      { id: 2, title: 'Linked List Operations', dueDate: '2024-01-22', status: 'upcoming', points: 100 },
      { id: 3, title: 'Stack and Queue Implementation', dueDate: '2024-01-29', status: 'upcoming', points: 100 },
      { id: 4, title: 'Binary Tree Traversal', dueDate: '2024-02-05', status: 'upcoming', points: 100 }
    ],
    grades: [
      { assignment: 'Quiz 1', score: 95, maxScore: 100, date: '2024-01-08' },
      { assignment: 'Lab Exercise 1', score: 88, maxScore: 100, date: '2024-01-10' },
      { assignment: 'Homework 1', score: 92, maxScore: 100, date: '2024-01-12' }
    ],
    announcements: [
      {
        id: 1,
        title: 'Assignment 1 Extension',
        content: 'Due to technical issues with the submission system, Assignment 1 deadline has been extended to January 20th.',
        date: '2024-01-14',
        author: 'Dr. Sarah Johnson'
      },
      {
        id: 2,
        title: 'Office Hours Update',
        content: 'My office hours for this week will be Tuesday 2-4 PM instead of the usual Wednesday time.',
        date: '2024-01-12',
        author: 'Dr. Sarah Johnson'
      }
    ]
  };

  const handleDownload = (materialName) => {
    setIsLoading(true);
    showNotification(`Downloading ${materialName}...`, 'info');
    setTimeout(() => {
      showNotification('Download completed', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const handleViewAssignment = (assignmentId) => {
    showNotification(`Viewing assignment ${assignmentId}`, 'info');
  };

  const getGradeColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BookOpen },
    { id: 'materials', name: 'Materials', icon: FileText },
    { id: 'assignments', name: 'Assignments', icon: Calendar },
    { id: 'grades', name: 'Grades', icon: Award },
    { id: 'announcements', name: 'Announcements', icon: MessageCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/student/courses" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">{course.name}</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">{course.code} • {course.instructor} • {course.credits} credits</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{course.currentGrade}</div>
              <div className="text-sm text-gray-600">Current Grade</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{course.attendance}%</div>
              <div className="text-sm text-gray-600">Attendance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Info Card */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                <span>{course.semester}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-400 mr-2" />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span>{course.schedule.days}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span>{course.schedule.time}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Schedule</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span>{course.schedule.days}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span>{course.schedule.time}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                <span>{course.schedule.room}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Current Grade:</span>
                <span className="font-semibold text-green-600">{course.currentGrade}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Attendance:</span>
                <span className="font-semibold text-blue-600">{course.attendance}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="card p-6">
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Description</h3>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor Contact</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {course.instructorEmail}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Office Hours:</strong> Tuesday 2-4 PM, Wednesday 10-12 PM
              </p>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Materials</h3>
            <div className="space-y-3">
              {course.materials.map((material, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{material.name}</p>
                      <p className="text-sm text-gray-500">{material.type.toUpperCase()} • {material.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(material.name)}
                    disabled={isLoading}
                    className="btn-primary text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h3>
            <div className="space-y-3">
              {course.assignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-500">Due: {formatDate(assignment.dueDate)} • {assignment.points} points</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'upcoming' ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'
                    }`}>
                      {assignment.status}
                    </span>
                    <button
                      onClick={() => handleViewAssignment(assignment.id)}
                      className="btn-secondary text-sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
            <div className="space-y-3">
              {course.grades.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                    <p className="text-sm text-gray-500">Submitted: {formatDate(grade.date)}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getGradeColor(grade.score, grade.maxScore)}`}>
                      {grade.score}/{grade.maxScore}
                    </div>
                    <div className="text-sm text-gray-500">
                      {((grade.score / grade.maxScore) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Announcements</h3>
            <div className="space-y-4">
              {course.announcements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-primary-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                    <span className="text-sm text-gray-500">{formatDate(announcement.date)}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{announcement.content}</p>
                  <p className="text-sm text-gray-500">By: {announcement.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
