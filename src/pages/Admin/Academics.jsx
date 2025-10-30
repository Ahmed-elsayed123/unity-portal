import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Building,
  Award,
  Clock,
  X,
  Save
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const AdminAcademics = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    code: '',
    faculty: '',
    head: '',
    description: '',
    credits: '',
    duration: '',
    level: ''
  });

  const departments = [
    {
      id: 1,
      name: 'Computer Science',
      code: 'CS',
      faculty: 'Engineering',
      head: 'Dr. Sarah Johnson',
      students: 1250,
      facultyCount: 45,
      programs: 8,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Mathematics',
      code: 'MATH',
      faculty: 'Sciences',
      head: 'Prof. Michael Chen',
      students: 890,
      facultyCount: 32,
      programs: 6,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Physics',
      code: 'PHY',
      faculty: 'Sciences',
      head: 'Dr. Emily Rodriguez',
      students: 650,
      facultyCount: 28,
      programs: 5,
      status: 'Active'
    },
    {
      id: 4,
      name: 'English',
      code: 'ENG',
      faculty: 'Arts',
      head: 'Prof. David Wilson',
      students: 420,
      facultyCount: 18,
      programs: 4,
      status: 'Active'
    }
  ];

  const programs = [
    {
      id: 1,
      name: 'Bachelor of Computer Science',
      code: 'BCS',
      department: 'Computer Science',
      duration: '4 years',
      credits: 120,
      students: 450,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Master of Computer Science',
      code: 'MCS',
      department: 'Computer Science',
      duration: '2 years',
      credits: 60,
      students: 120,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Bachelor of Mathematics',
      code: 'BMATH',
      department: 'Mathematics',
      duration: '4 years',
      credits: 120,
      students: 320,
      status: 'Active'
    }
  ];

  const courses = [
    {
      id: 1,
      name: 'Data Structures and Algorithms',
      code: 'CS-201',
      department: 'Computer Science',
      credits: 3,
      instructor: 'Dr. Sarah Johnson',
      students: 45,
      semester: 'Spring 2024',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Calculus II',
      code: 'MATH-205',
      department: 'Mathematics',
      credits: 4,
      instructor: 'Prof. Michael Chen',
      students: 38,
      semester: 'Spring 2024',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Physics Laboratory',
      code: 'PHY-301',
      department: 'Physics',
      credits: 2,
      instructor: 'Dr. Emily Rodriguez',
      students: 25,
      semester: 'Spring 2024',
      status: 'Active'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-gray-600 bg-gray-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name || '',
      code: item.code || '',
      faculty: item.faculty || item.department || '',
      head: item.head || item.instructor || '',
      description: item.description || '',
      credits: item.credits || '',
      duration: item.duration || '',
      level: item.level || ''
    });
    setShowEditModal(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      code: '',
      faculty: '',
      head: '',
      description: '',
      credits: '',
      duration: '',
      level: ''
    });
    setShowAddModal(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    
    // In a real app, this would save to the database
    console.log('Saving item:', editingItem ? 'edit' : 'add', itemForm);
    
    // Simulate success
    const action = editingItem ? 'updated' : 'created';
    const itemType = activeTab === 'departments' ? 'Department' : 
                     activeTab === 'programs' ? 'Program' : 'Course';
    alert(`${itemType} ${action} successfully!`);
    
    setShowEditModal(false);
    setShowAddModal(false);
    setEditingItem(null);
    setItemForm({
      name: '',
      code: '',
      faculty: '',
      head: '',
      description: '',
      credits: '',
      duration: '',
      level: ''
    });
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      // In a real app, this would delete from the database
      console.log('Deleting item:', item.id);
      alert(`${activeTab.slice(0, -1)} deleted successfully!`);
    }
  };

  const getFormTitle = () => {
    if (editingItem) {
      return `Edit ${activeTab.slice(0, -1)}`;
    }
    return `Add New ${activeTab.slice(0, -1)}`;
  };

  const getFormFields = () => {
    const baseFields = [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'code', label: 'Code', type: 'text', required: true }
    ];

    if (activeTab === 'departments') {
      return [
        ...baseFields,
        { key: 'faculty', label: 'Faculty', type: 'text', required: true },
        { key: 'head', label: 'Head of Department', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: false }
      ];
    } else if (activeTab === 'programs') {
      return [
        ...baseFields,
        { key: 'faculty', label: 'Department', type: 'text', required: true },
        { key: 'duration', label: 'Duration', type: 'text', required: true },
        { key: 'credits', label: 'Credits', type: 'number', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: false }
      ];
    } else { // courses
      return [
        ...baseFields,
        { key: 'faculty', label: 'Department', type: 'text', required: true },
        { key: 'head', label: 'Instructor', type: 'text', required: true },
        { key: 'credits', label: 'Credits', type: 'number', required: true },
        { key: 'level', label: 'Level', type: 'text', required: false },
        { key: 'description', label: 'Description', type: 'textarea', required: false }
      ];
    }
  };

  const renderDepartments = () => (
    <div className="space-y-4">
      {departments.map((dept) => (
        <div key={dept.id} className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
              <p className="text-gray-600">{dept.code} • {dept.faculty}</p>
              <p className="text-sm text-gray-500">Head: {dept.head}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dept.status)}`}>
              {dept.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dept.students}</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{dept.facultyCount}</div>
              <div className="text-sm text-gray-600">Faculty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{dept.programs}</div>
              <div className="text-sm text-gray-600">Programs</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={() => handleViewItem(dept)}
              className="flex-1 btn-primary text-sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </button>
            <button 
              onClick={() => handleEditItem(dept)}
              className="flex-1 btn-secondary text-sm"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button 
              onClick={() => handleDeleteItem(dept)}
              className="flex-1 btn-danger text-sm"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPrograms = () => (
    <div className="space-y-4">
      {programs.map((program) => (
        <div key={program.id} className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
              <p className="text-gray-600">{program.code} • {program.department}</p>
              <p className="text-sm text-gray-500">{program.duration} • {program.credits} credits</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
              {program.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{program.students}</div>
              <div className="text-sm text-gray-600">Enrolled Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{program.credits}</div>
              <div className="text-sm text-gray-600">Total Credits</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={() => handleViewItem(program)}
              className="flex-1 btn-primary text-sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </button>
            <button 
              onClick={() => handleEditItem(program)}
              className="flex-1 btn-secondary text-sm"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button 
              onClick={() => handleDeleteItem(program)}
              className="flex-1 btn-danger text-sm"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-4">
      {courses.map((course) => (
        <div key={course.id} className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
              <p className="text-gray-600">{course.code} • {course.department}</p>
              <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
              {course.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{course.students}</div>
              <div className="text-sm text-gray-600">Enrolled Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{course.credits}</div>
              <div className="text-sm text-gray-600">Credits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{course.semester}</div>
              <div className="text-sm text-gray-600">Semester</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={() => handleViewItem(course)}
              className="flex-1 btn-primary text-sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </button>
            <button 
              onClick={() => handleEditItem(course)}
              className="flex-1 btn-secondary text-sm"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button 
              onClick={() => handleDeleteItem(course)}
              className="flex-1 btn-danger text-sm"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/admin/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Academic Management</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Manage departments, programs, and courses</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </button>
          <button 
            onClick={handleAddItem}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'departments', name: 'Departments', icon: Building },
              { id: 'programs', name: 'Programs', icon: GraduationCap },
              { id: 'courses', name: 'Courses', icon: BookOpen }
            ].map((tab) => {
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
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'departments' && renderDepartments()}
      {activeTab === 'programs' && renderPrograms()}
      {activeTab === 'courses' && renderCourses()}

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => {
              setActiveTab('departments');
              handleAddItem();
            }}
            className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left"
          >
            <Building className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add Department</h4>
            <p className="text-sm text-gray-600">Create new academic department</p>
          </button>
          <button 
            onClick={() => {
              setActiveTab('programs');
              handleAddItem();
            }}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <GraduationCap className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add Program</h4>
            <p className="text-sm text-gray-600">Create new academic program</p>
          </button>
          <button 
            onClick={() => {
              setActiveTab('courses');
              handleAddItem();
            }}
            className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left"
          >
            <BookOpen className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add Course</h4>
            <p className="text-sm text-gray-600">Create new course</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <Calendar className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Academic Calendar</h4>
            <p className="text-sm text-gray-600">Manage academic schedule</p>
          </button>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedItem.name} Details
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
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Name</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedItem.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Code</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedItem.code}</p>
                </div>
                {selectedItem.faculty && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Faculty</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.faculty}</p>
                  </div>
                )}
                {selectedItem.department && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Department</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.department}</p>
                  </div>
                )}
                {selectedItem.head && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Head</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.head}</p>
                  </div>
                )}
                {selectedItem.instructor && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Instructor</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.instructor}</p>
                  </div>
                )}
                {selectedItem.credits && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Credits</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.credits}</p>
                  </div>
                )}
                {selectedItem.duration && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Duration</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.duration}</p>
                  </div>
                )}
                {selectedItem.semester && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Semester</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.semester}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                    {selectedItem.status}
                  </span>
                </div>
              </div>
              
              {selectedItem.students && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="text-2xl font-bold text-blue-600">{selectedItem.students}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Students</div>
                    </div>
                    {selectedItem.facultyCount && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="text-2xl font-bold text-green-600">{selectedItem.facultyCount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Faculty</div>
                      </div>
                    )}
                    {selectedItem.programs && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="text-2xl font-bold text-purple-600">{selectedItem.programs}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Programs</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditItem(selectedItem);
                }}
                className="flex-1 btn-primary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
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

      {/* Edit/Add Modal */}
      {(showEditModal || showAddModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getFormTitle()}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setShowAddModal(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveItem} className="space-y-4">
              {getFormFields().map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={itemForm[field.key]}
                      onChange={(e) => setItemForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="input-field w-full h-20 resize-none"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={itemForm[field.key]}
                      onChange={(e) => setItemForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="input-field w-full"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setShowAddModal(false);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAcademics;
