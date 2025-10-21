import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Upload,
  Plus,
  Save,
  Edit
} from 'lucide-react';

const LecturerAttendance = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS-201');
  const [selectedDate, setSelectedDate] = useState('2024-03-15');
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    { id: 'CS-201', name: 'Data Structures' },
    { id: 'MATH-205', name: 'Calculus II' },
    { id: 'PHY-301', name: 'Physics Lab' }
  ];

  const attendanceRecords = [
    {
      id: 1,
      studentName: 'John Smith',
      studentId: 'STU2024001',
      course: 'CS-201',
      date: '2024-03-15',
      time: '09:00 AM',
      status: 'Present',
      remarks: ''
    },
    {
      id: 2,
      studentName: 'Sarah Johnson',
      studentId: 'STU2024002',
      course: 'CS-201',
      date: '2024-03-15',
      time: '09:00 AM',
      status: 'Present',
      remarks: ''
    },
    {
      id: 3,
      studentName: 'Michael Chen',
      studentId: 'STU2024003',
      course: 'CS-201',
      date: '2024-03-15',
      time: '09:00 AM',
      status: 'Absent',
      remarks: 'Sick leave'
    },
    {
      id: 4,
      studentName: 'Emily Rodriguez',
      studentId: 'STU2024004',
      course: 'CS-201',
      date: '2024-03-15',
      time: '09:00 AM',
      status: 'Late',
      remarks: 'Traffic delay'
    },
    {
      id: 5,
      studentName: 'David Wilson',
      studentId: 'STU2024005',
      course: 'CS-201',
      date: '2024-03-15',
      time: '09:00 AM',
      status: 'Present',
      remarks: ''
    }
  ];

  const filteredRecords = attendanceRecords.filter(record => 
    record.course === selectedCourse &&
    record.date === selectedDate &&
    (record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     record.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'text-green-600 bg-green-100';
      case 'Absent': return 'text-red-600 bg-red-100';
      case 'Late': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <CheckCircle className="h-4 w-4" />;
      case 'Absent': return <XCircle className="h-4 w-4" />;
      case 'Late': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const attendanceStats = {
    total: filteredRecords.length,
    present: filteredRecords.filter(r => r.status === 'Present').length,
    absent: filteredRecords.filter(r => r.status === 'Absent').length,
    late: filteredRecords.filter(r => r.status === 'Late').length,
    attendanceRate: filteredRecords.length > 0 
      ? Math.round((filteredRecords.filter(r => r.status === 'Present').length / filteredRecords.length) * 100)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Record and track student attendance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import Attendance
          </button>
          <button className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{attendanceStats.total}</div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
          <div className="text-sm text-gray-600">Present</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
          <div className="text-sm text-gray-600">Absent</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
          <div className="text-sm text-gray-600">Late</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{attendanceStats.attendanceRate}%</div>
          <div className="text-sm text-gray-600">Attendance Rate</div>
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
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex space-x-2">
            <button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Mark Attendance
            </button>
            <button className="btn-secondary">
              <Edit className="h-4 w-4 mr-2" />
              Edit Records
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Attendance Records - {selectedDate}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                      <div className="text-sm text-gray-500">{record.studentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1">{record.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.remarks || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Save className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Daily Attendance Rate</h4>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full" 
                style={{ width: `${attendanceStats.attendanceRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{attendanceStats.attendanceRate}% attendance rate</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Status Distribution</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Present</span>
                <span className="text-sm font-medium text-gray-900">{attendanceStats.present}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Absent</span>
                <span className="text-sm font-medium text-gray-900">{attendanceStats.absent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Late</span>
                <span className="text-sm font-medium text-gray-900">{attendanceStats.late}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
            <Plus className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">Mark Attendance</h4>
            <p className="text-sm text-gray-600">Record attendance for today</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <Download className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export Report</h4>
            <p className="text-sm text-gray-600">Download attendance reports</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
            <Calendar className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">View Calendar</h4>
            <p className="text-sm text-gray-600">Check class schedule</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <Users className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Student List</h4>
            <p className="text-sm text-gray-600">View enrolled students</p>
          </button>
        </div>
      </div>

      {/* Attendance Policy */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">i</span>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-blue-800">Attendance Policy</h3>
            <ul className="text-blue-700 text-sm mt-1 space-y-1">
              <li>• Students must attend at least 75% of classes to be eligible for final exams</li>
              <li>• Late arrivals (after 15 minutes) are marked as absent</li>
              <li>• Medical certificates are required for excused absences</li>
              <li>• Attendance is recorded automatically and manually verified</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerAttendance;
