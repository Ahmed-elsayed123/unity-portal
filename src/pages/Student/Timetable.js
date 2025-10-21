import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Download,
  Eye,
  FileText
} from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const StudentTimetable = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleExportTimetable = () => {
    setIsLoading(true);
    showNotification('Exporting timetable...', 'info');
    setTimeout(() => {
      showNotification('Timetable exported successfully', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const handleViewClass = (classId) => {
    showNotification(`Viewing details for class ${classId}`, 'info');
  };

  const handleDownloadSchedule = () => {
    setIsLoading(true);
    showNotification('Downloading schedule...', 'info');
    setTimeout(() => {
      showNotification('Schedule downloaded successfully', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const classes = [
    {
      id: 1,
      course: 'Data Structures',
      code: 'CS-201',
      instructor: 'Dr. Sarah Johnson',
      room: 'CS-101',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      type: 'Lecture',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 2,
      course: 'Calculus II',
      code: 'MATH-205',
      instructor: 'Prof. Michael Chen',
      room: 'MATH-205',
      day: 'Monday',
      startTime: '11:00',
      endTime: '12:30',
      type: 'Lecture',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 3,
      course: 'Physics Lab',
      code: 'PHY-301',
      instructor: 'Dr. Emily Rodriguez',
      room: 'PHY-301',
      day: 'Monday',
      startTime: '14:00',
      endTime: '16:00',
      type: 'Laboratory',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    {
      id: 4,
      course: 'Technical Writing',
      code: 'ENG-101',
      instructor: 'Prof. David Wilson',
      room: 'ENG-102',
      day: 'Tuesday',
      startTime: '13:00',
      endTime: '14:30',
      type: 'Lecture',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    },
    {
      id: 5,
      course: 'Database Systems',
      code: 'CS-301',
      instructor: 'Dr. Lisa Anderson',
      room: 'CS-201',
      day: 'Wednesday',
      startTime: '10:00',
      endTime: '11:30',
      type: 'Lecture',
      color: 'bg-red-100 border-red-300 text-red-800'
    },
    {
      id: 6,
      course: 'Business Communication',
      code: 'BUS-201',
      instructor: 'Prof. Robert Taylor',
      room: 'BUS-101',
      day: 'Thursday',
      startTime: '15:00',
      endTime: '16:30',
      type: 'Lecture',
      color: 'bg-indigo-100 border-indigo-300 text-indigo-800'
    }
  ];

  const getClassesForDay = (day) => {
    return classes.filter(cls => cls.day === day);
  };

  const getClassesForTime = (day, time) => {
    return classes.filter(cls => 
      cls.day === day && 
      cls.startTime <= time && 
      cls.endTime > time
    );
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600 mt-2">View your class schedule and important dates</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={handleDownloadSchedule}
            disabled={isLoading}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Schedule
          </button>
          <button 
            onClick={handleExportTimetable}
            disabled={isLoading}
            className="btn-secondary"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </button>
          <button 
            onClick={() => showNotification('Adding to calendar...', 'info')}
            className="btn-primary"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add to Calendar
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Week of {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
            </h2>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === 'week' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="h-4 w-4 mr-2" />
              Week View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Time
                  </th>
                  {days.map((day, index) => (
                    <th key={day} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                      <div>{day}</div>
                      <div className="text-gray-400 font-normal">
                        {weekDates[index].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((time) => (
                  <tr key={time} className="h-16">
                    <td className="px-4 py-2 text-sm text-gray-600 border-r border-gray-200">
                      {time}
                    </td>
                    {days.map((day) => {
                      const dayClasses = getClassesForTime(day, time);
                      return (
                        <td key={day} className="px-1 py-1 border-r border-gray-200">
                          {dayClasses.map((cls) => (
                            <div
                              key={cls.id}
                              className={`p-2 rounded text-xs font-medium border ${cls.color} cursor-pointer hover:shadow-md transition-shadow`}
                            >
                              <div className="font-semibold">{cls.course}</div>
                              <div className="text-xs opacity-75">{cls.room}</div>
                              <div className="text-xs opacity-75">{cls.startTime}-{cls.endTime}</div>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {days.map((day) => {
            const dayClasses = getClassesForDay(day);
            if (dayClasses.length === 0) return null;

            return (
              <div key={day} className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{day}</h3>
                <div className="space-y-3">
                  {dayClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${cls.color}`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{cls.course}</h4>
                          <p className="text-sm text-gray-600">{cls.code} • {cls.instructor}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{cls.startTime} - {cls.endTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{cls.room}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleViewClass(cls.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Today's Classes */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Classes</h3>
        <div className="space-y-3">
          {getClassesForDay(days[new Date().getDay() - 1] || 'Monday').map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary-100 rounded-full">
                  <BookOpen className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{cls.course}</h4>
                  <p className="text-sm text-gray-600">{cls.instructor} • {cls.room}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{cls.startTime} - {cls.endTime}</div>
                <div className="text-xs text-gray-600">{cls.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Schedule */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Exams</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h4 className="font-medium text-gray-900">Data Structures - Midterm</h4>
              <p className="text-sm text-gray-600">CS-201 • Dr. Sarah Johnson</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-red-600">March 15, 2024</div>
              <div className="text-xs text-gray-600">09:00 AM - 11:00 AM</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div>
              <h4 className="font-medium text-gray-900">Calculus II - Quiz</h4>
              <p className="text-sm text-gray-600">MATH-205 • Prof. Michael Chen</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-yellow-600">March 18, 2024</div>
              <div className="text-xs text-gray-600">11:00 AM - 12:00 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;
