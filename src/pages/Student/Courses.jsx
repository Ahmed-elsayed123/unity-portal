import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Download, 
  FileText,
  Search,
  Grid,
  List,
  Eye,
  Calendar
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';

const StudentCourses = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleDownload = (courseId) => {
    setIsLoading(true);
    showNotification(`Downloading materials for course ${courseId}`, 'info');
    setTimeout(() => {
      showNotification('Download completed', 'success');
      setIsLoading(false);
    }, 2000);
  };

  const handleViewDetails = (courseId) => {
    showNotification(`Viewing details for course ${courseId}`, 'info');
  };


  const courses = [
    {
      id: 1,
      code: 'CS-201',
      name: 'Data Structures and Algorithms',
      instructor: 'Dr. Sarah Johnson',
      credits: 3,
      semester: 'Spring 2024',
      status: 'enrolled',
      grade: 'A-',
      progress: 75,
      nextClass: 'Mon, 9:00 AM',
      materials: 12,
      assignments: 3
    },
    {
      id: 2,
      code: 'MATH-205',
      name: 'Calculus II',
      instructor: 'Prof. Michael Chen',
      credits: 4,
      semester: 'Spring 2024',
      status: 'enrolled',
      grade: 'B+',
      progress: 60,
      nextClass: 'Wed, 11:00 AM',
      materials: 8,
      assignments: 2
    },
    {
      id: 3,
      code: 'PHY-301',
      name: 'Physics Laboratory',
      instructor: 'Dr. Emily Rodriguez',
      credits: 2,
      semester: 'Spring 2024',
      status: 'enrolled',
      grade: 'A',
      progress: 85,
      nextClass: 'Fri, 2:00 PM',
      materials: 15,
      assignments: 4
    },
    {
      id: 4,
      code: 'ENG-101',
      name: 'Technical Writing',
      instructor: 'Prof. David Wilson',
      credits: 3,
      semester: 'Spring 2024',
      status: 'enrolled',
      grade: 'A-',
      progress: 90,
      nextClass: 'Tue, 1:00 PM',
      materials: 6,
      assignments: 1
    },
    {
      id: 5,
      code: 'CS-301',
      name: 'Database Systems',
      instructor: 'Dr. Lisa Anderson',
      credits: 3,
      semester: 'Spring 2024',
      status: 'enrolled',
      grade: 'B',
      progress: 45,
      nextClass: 'Thu, 10:00 AM',
      materials: 10,
      assignments: 2
    },
    {
      id: 6,
      code: 'BUS-201',
      name: 'Business Communication',
      instructor: 'Prof. Robert Taylor',
      credits: 3,
      semester: 'Spring 2024',
      status: 'enrolled',
      grade: 'A',
      progress: 95,
      nextClass: 'Mon, 3:00 PM',
      materials: 7,
      assignments: 1
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || course.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enrolled': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'dropped': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/student/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">My Courses</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Manage your enrolled courses and access materials</p>
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
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="input-field"
            >
              <option value="all">All Semesters</option>
              <option value="Spring 2024">Spring 2024</option>
              <option value="Fall 2023">Fall 2023</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-slate-300">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

       {/* Courses Grid/List */}
       {viewMode === 'grid' ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredCourses.map((course) => (
             <div key={course.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
               {/* Card Header with Gradient */}
               <div className="relative h-24 bg-gradient-to-br from-primary-500 to-primary-700 p-6">
                 <div className="flex items-start justify-between">
                   <div className="text-white">
                     <h3 className="text-lg font-bold leading-tight">{course.name}</h3>
                     <p className="text-primary-100 text-sm mt-1">{course.code} • {course.credits} credits</p>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(course.status)} backdrop-blur-sm bg-white/20 text-white border border-white/30`}>
                     {course.status}
                   </span>
                 </div>
               </div>

               {/* Card Body */}
               <div className="p-6">
                 {/* Instructor & Semester Info */}
                 <div className="mb-6 space-y-2">
                   <div className="flex items-center text-sm text-gray-600">
                     <BookOpen className="h-4 w-4 mr-2 text-primary-500" />
                     <span className="font-medium">{course.instructor}</span>
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                     <span>{course.semester}</span>
                   </div>
                 </div>

                 {/* Progress Section */}
                 <div className="mb-6">
                   <div className="flex items-center justify-between mb-3">
                     <span className="text-sm font-semibold text-gray-700">Course Progress</span>
                     <span className="text-sm font-bold text-primary-600">{course.progress}%</span>
                   </div>
                   <div className="relative">
                     <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                       <div 
                         className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out" 
                         style={{ width: `${course.progress}%` }}
                       ></div>
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                   </div>
                 </div>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
                     <div className="text-2xl font-bold text-green-700 mb-1">{course.grade}</div>
                     <div className="text-xs font-medium text-green-600 uppercase tracking-wide">Current Grade</div>
                   </div>
                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
                     <div className="text-2xl font-bold text-blue-700 mb-1">{course.materials}</div>
                     <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Materials</div>
                   </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="space-y-3">
                   <Link 
                     to={`/student/course/${course.id}`}
                     className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                   >
                     <Eye className="h-4 w-4 mr-2" />
                     View Course Details
                   </Link>
                   
                   <div className="grid grid-cols-2 gap-3">
                     <button 
                       onClick={() => handleDownload(course.id)}
                       disabled={isLoading}
                       className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center text-sm border border-gray-200 hover:border-gray-300"
                     >
                       <Download className="h-4 w-4 mr-1.5" />
                       Materials
                     </button>
                     <button 
                       onClick={() => handleViewDetails(course.id)}
                       className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center text-sm border border-gray-200 hover:border-gray-300"
                     >
                       <FileText className="h-4 w-4 mr-1.5" />
                       Assignments
                     </button>
                   </div>
                 </div>
               </div>

               {/* Hover Effect Overlay */}
               <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/5 group-hover:to-primary-600/5 transition-all duration-300 pointer-events-none"></div>
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
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.name}</div>
                        <div className="text-sm text-gray-500">{course.code} • {course.credits} credits</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{course.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.nextClass}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/student/course/${course.id}`}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        View
                      </Link>
                      <button className="text-gray-600 hover:text-gray-900">
                        Materials
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{filteredCourses.length}</div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredCourses.reduce((sum, course) => sum + course.credits, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Credits</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(filteredCourses.reduce((sum, course) => sum + course.progress, 0) / filteredCourses.length)}%
          </div>
          <div className="text-sm text-gray-600">Avg Progress</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredCourses.reduce((sum, course) => sum + course.assignments, 0)}
          </div>
          <div className="text-sm text-gray-600">Pending Assignments</div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
