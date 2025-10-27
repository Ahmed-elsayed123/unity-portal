import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle,
  Download,
  FileText
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';

const StudentAttendance = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('March 2024');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleExportAttendance = () => {
    setIsLoading(true);
    showNotification('Exporting attendance data...', 'info');
    setTimeout(() => {
      showNotification('Attendance data exported successfully', 'success');
      setIsLoading(false);
    }, 1500);
  };


  const handleDownloadReport = () => {
    setIsLoading(true);
    showNotification('Downloading attendance report...', 'info');
    setTimeout(() => {
      showNotification('Attendance report downloaded successfully', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 'CS-201', name: 'Data Structures' },
    { id: 'MATH-205', name: 'Calculus II' },
    { id: 'PHY-301', name: 'Physics Lab' }
  ];

  const attendanceData = [
    {
      course: 'Data Structures',
      code: 'CS-201',
      instructor: 'Dr. Sarah Johnson',
      totalClasses: 20,
      attended: 18,
      absent: 2,
      percentage: 90,
      status: 'Good'
    },
    {
      course: 'Calculus II',
      code: 'MATH-205',
      instructor: 'Prof. Michael Chen',
      totalClasses: 18,
      attended: 16,
      absent: 2,
      percentage: 89,
      status: 'Good'
    },
    {
      course: 'Physics Lab',
      code: 'PHY-301',
      instructor: 'Dr. Emily Rodriguez',
      totalClasses: 12,
      attended: 12,
      absent: 0,
      percentage: 100,
      status: 'Excellent'
    }
  ];

  const detailedAttendance = [
    {
      date: '2024-03-15',
      course: 'Data Structures',
      time: '09:00 AM - 10:30 AM',
      status: 'Present',
      instructor: 'Dr. Sarah Johnson'
    },
    {
      date: '2024-03-13',
      course: 'Calculus II',
      time: '11:00 AM - 12:30 PM',
      status: 'Absent',
      instructor: 'Prof. Michael Chen'
    },
    {
      date: '2024-03-12',
      course: 'Physics Lab',
      time: '02:00 PM - 04:00 PM',
      status: 'Present',
      instructor: 'Dr. Emily Rodriguez'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'text-green-600 bg-green-100';
      case 'Absent': return 'text-red-600 bg-red-100';
      case 'Late': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 90) return { status: 'Excellent', color: 'text-green-600 bg-green-100' };
    if (percentage >= 80) return { status: 'Good', color: 'text-blue-600 bg-blue-100' };
    if (percentage >= 70) return { status: 'Fair', color: 'text-yellow-600 bg-yellow-100' };
    return { status: 'Poor', color: 'text-red-600 bg-red-100' };
  };

  const filteredData = selectedCourse === 'all' 
    ? attendanceData 
    : attendanceData.filter(course => course.code === selectedCourse);

  const overallStats = {
    totalClasses: filteredData.reduce((sum, course) => sum + course.totalClasses, 0),
    totalAttended: filteredData.reduce((sum, course) => sum + course.attended, 0),
    totalAbsent: filteredData.reduce((sum, course) => sum + course.absent, 0),
    overallPercentage: filteredData.length > 0 
      ? Math.round(filteredData.reduce((sum, course) => sum + course.percentage, 0) / filteredData.length)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/student/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Attendance</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Track your class attendance and performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={handleDownloadReport}
            disabled={isLoading}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </button>
          <button 
            onClick={handleExportAttendance}
            disabled={isLoading}
            className="btn-primary"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{overallStats.totalClasses}</div>
          <div className="text-sm text-gray-600 dark:text-slate-300">Total Classes</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{overallStats.totalAttended}</div>
          <div className="text-sm text-gray-600 dark:text-slate-300">Attended</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">{overallStats.totalAbsent}</div>
          <div className="text-sm text-gray-600 dark:text-slate-300">Absent</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{overallStats.overallPercentage}%</div>
          <div className="text-sm text-gray-600 dark:text-slate-300">Overall Attendance</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input-field"
            >
              <option value="March 2024">March 2024</option>
              <option value="February 2024">February 2024</option>
              <option value="January 2024">January 2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course-wise Attendance */}
      <div className="space-y-6">
        {filteredData.map((course, index) => {
          const attendanceStatus = getAttendanceStatus(course.percentage);
          return (
            <div key={index} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{course.course}</h3>
                  <p className="text-gray-600 dark:text-slate-300">{course.code} • {course.instructor}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${attendanceStatus.color}`}>
                  {attendanceStatus.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">{course.attended}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-300">Attended</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">{course.absent}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-300">Absent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">{course.percentage}%</div>
                  <div className="text-sm text-gray-600 dark:text-slate-300">Attendance Rate</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Attendance Progress</span>
                  <span className="text-sm text-gray-600 dark:text-slate-300">{course.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      course.percentage >= 90 ? 'bg-green-500' :
                      course.percentage >= 80 ? 'bg-blue-500' :
                      course.percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${course.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Attendance History */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Recent Attendance History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                  Instructor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
              {detailedAttendance.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-slate-100">{record.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{record.course}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-slate-100">{record.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status === 'Present' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-slate-100">{record.instructor}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Policy */}
      <div className="card p-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Attendance Policy</h3>
        <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
          <li>• Minimum 75% attendance is required to be eligible for final exams</li>
          <li>• Absence due to medical reasons must be supported by medical certificate</li>
          <li>• Late arrivals (after 15 minutes) are marked as absent</li>
          <li>• Attendance below 60% may result in course failure</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentAttendance;
