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
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  GripVertical
} from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import BackButton from '../../components/BackButton.jsx';

const StudentTimetable = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [draggedClass, setDraggedClass] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [formData, setFormData] = useState({
    course: '',
    code: '',
    instructor: '',
    room: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
    type: 'Lecture',
    color: 'bg-blue-100 border-blue-300 text-blue-800'
  });
  const { showNotification } = useNotification();

  // State for classes - now editable
  const [classes, setClasses] = useState([
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
  ]);

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

  // Edit functionality
  const handleAddClass = () => {
    setEditingClass(null);
    setFormData({
      course: '',
      code: '',
      instructor: '',
      room: '',
      day: 'Monday',
      startTime: '',
      endTime: '',
      type: 'Lecture',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    });
    setShowModal(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setFormData(classItem);
    setShowModal(true);
  };

  const handleDeleteClass = (classId) => {
    setClasses(classes.filter(cls => cls.id !== classId));
    showNotification('Class deleted successfully', 'success');
  };

  const handleSaveClass = () => {
    if (!formData.course || !formData.startTime || !formData.endTime) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    if (editingClass) {
      // Update existing class
      setClasses(classes.map(cls => 
        cls.id === editingClass.id ? { ...formData, id: editingClass.id } : cls
      ));
      showNotification('Class updated successfully', 'success');
    } else {
      // Add new class
      const newClass = {
        ...formData,
        id: Math.max(...classes.map(c => c.id), 0) + 1
      };
      setClasses([...classes, newClass]);
      showNotification('Class added successfully', 'success');
    }
    
    setShowModal(false);
    setEditingClass(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Drag and Drop handlers
  const handleDragStart = (e, classItem) => {
    if (!isEditMode) return;
    setDraggedClass(classItem);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedClass(null);
    setDragOverSlot(null);
  };

  const handleDragOver = (e, day, time) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ day, time });
  };

  const handleDragLeave = (e) => {
    if (!isEditMode) return;
    setDragOverSlot(null);
  };

  const handleDrop = (e, day, time) => {
    if (!isEditMode || !draggedClass) return;
    e.preventDefault();
    
    // Calculate new time based on the time slot
    const timeIndex = timeSlots.indexOf(time);
    const newStartTime = time;
    const newEndTime = timeSlots[timeIndex + 1] || timeSlots[timeIndex];
    
    // Update the class with new day and time
    const updatedClass = {
      ...draggedClass,
      day: day,
      startTime: newStartTime,
      endTime: newEndTime
    };

    setClasses(classes.map(cls => 
      cls.id === draggedClass.id ? updatedClass : cls
    ));

    showNotification(`Moved ${draggedClass.course} to ${day} at ${newStartTime}`, 'success');
    setDraggedClass(null);
    setDragOverSlot(null);
  };

  const handleDragStartList = (e, classItem) => {
    if (!isEditMode) return;
    setDraggedClass(classItem);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropList = (e, day) => {
    if (!isEditMode || !draggedClass) return;
    e.preventDefault();
    
    // Update the class with new day
    const updatedClass = {
      ...draggedClass,
      day: day
    };

    setClasses(classes.map(cls => 
      cls.id === draggedClass.id ? updatedClass : cls
    ));

    showNotification(`Moved ${draggedClass.course} to ${day}`, 'success');
    setDraggedClass(null);
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

  // Color options for classes
  const colorOptions = [
    { value: 'bg-blue-100 border-blue-300 text-blue-800', label: 'Blue' },
    { value: 'bg-green-100 border-green-300 text-green-800', label: 'Green' },
    { value: 'bg-purple-100 border-purple-300 text-purple-800', label: 'Purple' },
    { value: 'bg-yellow-100 border-yellow-300 text-yellow-800', label: 'Yellow' },
    { value: 'bg-red-100 border-red-300 text-red-800', label: 'Red' },
    { value: 'bg-indigo-100 border-indigo-300 text-indigo-800', label: 'Indigo' },
    { value: 'bg-pink-100 border-pink-300 text-pink-800', label: 'Pink' },
    { value: 'bg-orange-100 border-orange-300 text-orange-800', label: 'Orange' }
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
      {/* Back Button */}
      <BackButton to="/student/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Timetable</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">
            {isEditMode ? (
              <>
                Edit your class schedule and important dates
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  <GripVertical className="h-3 w-3 mr-1" />
                  Drag & Drop Enabled
                </span>
              </>
            ) : (
              'View your class schedule and important dates'
            )}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`${isEditMode ? 'btn-secondary' : 'btn-primary'}`}
          >
            {isEditMode ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Exit Edit Mode
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Timetable
              </>
            )}
          </button>
          {isEditMode && (
            <button 
              onClick={handleAddClass}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </button>
          )}
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
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
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Grid className="h-4 w-4 mr-2" />
              Week View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === 'list' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
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
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider w-20">
                    Time
                  </th>
                  {days.map((day, index) => (
                    <th key={day} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider min-w-32">
                      <div>{day}</div>
                      <div className="text-gray-400 dark:text-slate-400 font-normal">
                        {weekDates[index].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                {timeSlots.map((time) => (
                  <tr key={time} className="h-16">
                    <td className="px-4 py-2 text-sm text-gray-600 dark:text-slate-300 border-r border-gray-200 dark:border-slate-600">
                      {time}
                    </td>
                    {days.map((day) => {
                      const dayClasses = getClassesForTime(day, time);
                      const isDragOver = dragOverSlot?.day === day && dragOverSlot?.time === time;
                      return (
                        <td 
                          key={day} 
                          className={`px-1 py-1 border-r border-gray-200 dark:border-slate-600 min-h-16 ${
                            isDragOver ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600' : ''
                          } ${isEditMode ? 'hover:bg-gray-50 dark:hover:bg-slate-700' : ''}`}
                          onDragOver={(e) => handleDragOver(e, day, time)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, day, time)}
                        >
                          {dayClasses.map((cls) => (
                            <div
                              key={cls.id}
                              draggable={isEditMode}
                              onDragStart={(e) => handleDragStart(e, cls)}
                              onDragEnd={handleDragEnd}
                              className={`p-2 rounded text-xs font-medium border ${cls.color} cursor-pointer hover:shadow-md transition-shadow relative group ${
                                isEditMode ? 'cursor-move' : ''
                              }`}
                            >
                              {isEditMode && (
                                <div className="absolute top-1 left-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                  <GripVertical className="h-3 w-3 text-gray-600" />
                                </div>
                              )}
                              <div className="font-semibold">{cls.course}</div>
                              <div className="text-xs opacity-75">{cls.room}</div>
                              <div className="text-xs opacity-75">{cls.startTime}-{cls.endTime}</div>
                              {isEditMode && (
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClass(cls);
                                      }}
                                      className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                                      title="Edit class"
                                    >
                                      <Edit className="h-3 w-3 text-blue-600" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClass(cls.id);
                                      }}
                                      className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                                      title="Delete class"
                                    >
                                      <Trash2 className="h-3 w-3 text-red-600" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          {isEditMode && dayClasses.length === 0 && (
                            <div className="h-16 flex items-center justify-center text-gray-400 dark:text-slate-500 text-xs">
                              Drop class here
                            </div>
                          )}
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
            return (
              <div 
                key={day} 
                className="card p-6"
                onDragOver={(e) => handleDragOver(e, day, '')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropList(e, day)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center justify-between">
                  {day}
                  {isEditMode && (
                    <span className="text-sm text-gray-500 dark:text-slate-400 font-normal">
                      Drop classes here to move to {day}
                    </span>
                  )}
                </h3>
                <div className="space-y-3">
                  {dayClasses.map((cls) => (
                    <div 
                      key={cls.id} 
                      draggable={isEditMode}
                      onDragStart={(e) => handleDragStartList(e, cls)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg transition-all ${
                        isEditMode ? 'cursor-move hover:bg-gray-100 dark:hover:bg-slate-600' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {isEditMode && (
                          <div className="opacity-50 hover:opacity-100 transition-opacity">
                            <GripVertical className="h-4 w-4 text-gray-600 dark:text-slate-300" />
                          </div>
                        )}
                        <div className={`p-2 rounded-full ${cls.color}`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-slate-100">{cls.course}</h4>
                          <p className="text-sm text-gray-600 dark:text-slate-300">{cls.code} • {cls.instructor}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-300">
                            <Clock className="h-4 w-4" />
                            <span>{cls.startTime} - {cls.endTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-300 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{cls.room}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewClass(cls.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {isEditMode && (
                            <>
                              <button 
                                onClick={() => handleEditClass(cls)}
                                className="text-green-600 hover:text-green-900"
                                title="Edit class"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteClass(cls.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete class"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isEditMode && dayClasses.length === 0 && (
                    <div className="h-20 flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg">
                      Drop classes here to move to {day}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Today's Classes */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Today's Classes</h3>
        <div className="space-y-3">
          {getClassesForDay(days[new Date().getDay() - 1] || 'Monday').map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-full">
                  <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-300" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-slate-100">{cls.course}</h4>
                  <p className="text-sm text-gray-600 dark:text-slate-300">{cls.instructor} • {cls.room}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{cls.startTime} - {cls.endTime}</div>
                <div className="text-xs text-gray-600 dark:text-slate-300">{cls.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Schedule */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Upcoming Exams</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-slate-100">Data Structures - Midterm</h4>
              <p className="text-sm text-gray-600 dark:text-slate-300">CS-201 • Dr. Sarah Johnson</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-red-600 dark:text-red-400">March 15, 2024</div>
              <div className="text-xs text-gray-600 dark:text-slate-300">09:00 AM - 11:00 AM</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-slate-100">Calculus II - Quiz</h4>
              <p className="text-sm text-gray-600 dark:text-slate-300">MATH-205 • Prof. Michael Chen</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">March 18, 2024</div>
              <div className="text-xs text-gray-600 dark:text-slate-300">11:00 AM - 12:00 PM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Class Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingClass ? 'Edit Class' : 'Add New Class'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Name *</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleFormChange}
                    className="mt-1 input-field"
                    placeholder="Enter course name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    className="mt-1 input-field"
                    placeholder="e.g., CS-201"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Instructor</label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleFormChange}
                    className="mt-1 input-field"
                    placeholder="Enter instructor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Room</label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleFormChange}
                    className="mt-1 input-field"
                    placeholder="e.g., CS-101"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Day *</label>
                    <select
                      name="day"
                      value={formData.day}
                      onChange={handleFormChange}
                      className="mt-1 input-field"
                      required
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      className="mt-1 input-field"
                    >
                      <option value="Lecture">Lecture</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Workshop">Workshop</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time *</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleFormChange}
                      className="mt-1 input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time *</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleFormChange}
                      className="mt-1 input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({...formData, color: color.value})}
                        className={`p-2 rounded border-2 ${
                          formData.color === color.value 
                            ? 'border-gray-400' 
                            : 'border-gray-200'
                        } ${color.value}`}
                        title={color.label}
                      >
                        <div className="w-4 h-4 rounded-full bg-current"></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveClass}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingClass ? 'Update Class' : 'Add Class'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
