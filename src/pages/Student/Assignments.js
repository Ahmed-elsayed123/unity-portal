import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Eye,
  Download,
  Upload
} from 'lucide-react';

const StudentAssignments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');


  const assignments = [
    {
      id: 1,
      title: 'Data Structures Implementation',
      course: 'CS-201',
      courseName: 'Data Structures',
      dueDate: '2024-01-15',
      dueTime: '23:59',
      status: 'upcoming',
      points: 100,
      description: 'Implement a binary search tree with insertion, deletion, and traversal operations.',
      materials: ['Assignment_1.pdf', 'Sample_Code.java'],
      submitted: false,
      grade: null
    },
    {
      id: 2,
      title: 'Calculus Problem Set 3',
      course: 'MATH-205',
      courseName: 'Calculus II',
      dueDate: '2024-01-12',
      dueTime: '17:00',
      status: 'upcoming',
      points: 50,
      description: 'Solve problems 1-15 from chapter 7. Show all work and provide detailed solutions.',
      materials: ['Problem_Set_3.pdf'],
      submitted: false,
      grade: null
    },
    {
      id: 3,
      title: 'Physics Lab Report',
      course: 'PHY-301',
      courseName: 'Physics Lab',
      dueDate: '2024-01-10',
      dueTime: '12:00',
      status: 'completed',
      points: 75,
      description: 'Write a comprehensive lab report on the pendulum experiment.',
      materials: ['Lab_Report_Template.docx'],
      submitted: true,
      grade: 'A-'
    },
    {
      id: 4,
      title: 'Database Design Project',
      course: 'CS-301',
      courseName: 'Database Systems',
      dueDate: '2024-01-08',
      dueTime: '23:59',
      status: 'completed',
      points: 150,
      description: 'Design and implement a database for a library management system.',
      materials: ['Project_Requirements.pdf', 'ER_Diagram_Template.vsd'],
      submitted: true,
      grade: 'B+'
    },
    {
      id: 5,
      title: 'Linear Algebra Quiz',
      course: 'MATH-301',
      courseName: 'Linear Algebra',
      dueDate: '2024-01-05',
      dueTime: '14:30',
      status: 'completed',
      points: 30,
      description: 'Online quiz covering matrix operations and vector spaces.',
      materials: ['Quiz_Study_Guide.pdf'],
      submitted: true,
      grade: 'A'
    }
  ];

  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 'CS-201', name: 'Data Structures' },
    { id: 'MATH-205', name: 'Calculus II' },
    { id: 'PHY-301', name: 'Physics Lab' },
    { id: 'CS-301', name: 'Database Systems' },
    { id: 'MATH-301', name: 'Linear Algebra' }
  ];

  const statusOptions = [
    { id: 'all', name: 'All Assignments' },
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'completed', name: 'Completed' }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesCourse = filterCourse === 'all' || assignment.course === filterCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
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

  const isOverdue = (dueDate, dueTime) => {
    const now = new Date();
    const due = new Date(`${dueDate}T${dueTime}`);
    return now > due;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-2">View and manage your assignments</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="card p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="card p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {assignment.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="font-medium">{assignment.course} - {assignment.courseName}</span>
                        <span>•</span>
                        <span>{assignment.points} points</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                        <span className="flex items-center">
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1 capitalize">{assignment.status}</span>
                        </span>
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{assignment.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Due: {formatDate(assignment.dueDate)} at {assignment.dueTime}</span>
                    </div>
                    {assignment.grade && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span>Grade: {assignment.grade}</span>
                      </div>
                    )}
                  </div>

                  {assignment.materials && assignment.materials.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Materials:</h4>
                      <div className="flex flex-wrap gap-2">
                        {assignment.materials.map((material, index) => (
                          <span key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6">
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to={`/student/assignment/${assignment.id}`}
                      className="btn-primary text-sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                    
                     {assignment.status === 'upcoming' && !assignment.submitted && (
                       <Link 
                         to={`/student/assignment/${assignment.id}`}
                         className="btn-secondary text-sm"
                       >
                         <Upload className="h-4 w-4 mr-2" />
                         Submit Assignment
                       </Link>
                     )}
                     
                     <Link 
                       to={`/student/assignment/${assignment.id}`}
                       className="btn-outline text-sm"
                     >
                       <Download className="h-4 w-4 mr-2" />
                       Download Materials
                     </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
