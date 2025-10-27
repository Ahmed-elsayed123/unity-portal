import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Send,
  Target,
  Bell,
  FileText,
  Image,
  Link,
  X
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';

const AdminAnnouncements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  // Mock announcements data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Midterm Examination Schedule",
      content: "The midterm examinations for all courses will be conducted from March 15-20, 2024. Please check your individual schedules and prepare accordingly.",
      priority: "high",
      status: "published",
      audience: "all",
      author: "Dr. Sarah Johnson",
      authorRole: "admin",
      createdAt: "2024-03-01T10:00:00Z",
      publishedAt: "2024-03-01T10:30:00Z",
      expiresAt: "2024-03-25T23:59:59Z",
      attachments: ["exam_schedule.pdf"],
      readCount: 1250,
      targetGroups: ["students", "lecturers"]
    },
    {
      id: 2,
      title: "Library System Maintenance",
      content: "The library management system will undergo maintenance on March 10, 2024, from 2:00 AM to 6:00 AM. During this time, online services will be unavailable.",
      priority: "medium",
      status: "published",
      audience: "all",
      author: "IT Support Team",
      authorRole: "admin",
      createdAt: "2024-03-05T14:00:00Z",
      publishedAt: "2024-03-05T14:15:00Z",
      expiresAt: "2024-03-12T23:59:59Z",
      attachments: [],
      readCount: 890,
      targetGroups: ["students", "lecturers", "staff"]
    },
    {
      id: 3,
      title: "New Course Registration Opens",
      content: "Registration for summer semester courses will open on March 15, 2024. Students can register through the student portal.",
      priority: "high",
      status: "scheduled",
      audience: "students",
      author: "Registrar Office",
      authorRole: "admin",
      createdAt: "2024-03-08T09:00:00Z",
      publishedAt: null,
      expiresAt: "2024-04-15T23:59:59Z",
      attachments: ["course_catalog.pdf"],
      readCount: 0,
      targetGroups: ["students"]
    },
    {
      id: 4,
      title: "Faculty Meeting Reminder",
      content: "Monthly faculty meeting scheduled for March 12, 2024, at 2:00 PM in the main conference room.",
      priority: "medium",
      status: "draft",
      audience: "lecturers",
      author: "Dr. Michael Brown",
      authorRole: "admin",
      createdAt: "2024-03-09T16:00:00Z",
      publishedAt: null,
      expiresAt: "2024-03-15T23:59:59Z",
      attachments: ["meeting_agenda.pdf"],
      readCount: 0,
      targetGroups: ["lecturers"]
    },
    {
      id: 5,
      title: "Campus WiFi Upgrade",
      content: "The campus WiFi network has been upgraded to provide faster and more reliable internet access. Please reconnect to the 'Unity-University' network.",
      priority: "low",
      status: "published",
      audience: "all",
      author: "IT Support Team",
      authorRole: "admin",
      createdAt: "2024-03-07T11:00:00Z",
      publishedAt: "2024-03-07T11:30:00Z",
      expiresAt: "2024-03-14T23:59:59Z",
      attachments: [],
      readCount: 2100,
      targetGroups: ["students", "lecturers", "staff"]
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    audience: 'all',
    expiresAt: '',
    attachments: [],
    targetGroups: []
  });

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'text-gray-600 bg-gray-100' },
    { value: 'scheduled', label: 'Scheduled', color: 'text-blue-600 bg-blue-100' },
    { value: 'published', label: 'Published', color: 'text-green-600 bg-green-100' },
    { value: 'expired', label: 'Expired', color: 'text-red-600 bg-red-100' }
  ];

  const audienceOptions = [
    { value: 'all', label: 'Everyone' },
    { value: 'students', label: 'Students' },
    { value: 'lecturers', label: 'Lecturers' },
    { value: 'staff', label: 'Staff' }
  ];

  const targetGroupOptions = [
    { value: 'students', label: 'Students' },
    { value: 'lecturers', label: 'Lecturers' },
    { value: 'staff', label: 'Staff' },
  ];

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || announcement.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    const matchesAudience = selectedAudience === 'all' || announcement.audience === selectedAudience;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAudience;
  });

  // Get status color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'text-gray-600 bg-gray-100';
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const priorityOption = priorityOptions.find(option => option.value === priority);
    return priorityOption ? priorityOption.color : 'text-gray-600 bg-gray-100';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newAnnouncement = {
        id: editingAnnouncement ? editingAnnouncement.id : Date.now(),
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        audience: formData.audience,
        author: "Admin User",
        authorRole: "admin",
        createdAt: editingAnnouncement ? editingAnnouncement.createdAt : new Date().toISOString(),
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
        expiresAt: formData.expiresAt || null,
        attachments: formData.attachments,
        readCount: 0,
        targetGroups: formData.targetGroups,
        status: formData.status || 'draft'
      };

      if (editingAnnouncement) {
        setAnnouncements(prev => prev.map(ann => 
          ann.id === editingAnnouncement.id ? newAnnouncement : ann
        ));
        showNotification('Announcement updated successfully', 'success');
      } else {
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        showNotification('Announcement created successfully', 'success');
      }

      setShowModal(false);
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        priority: 'medium',
        audience: 'all',
        expiresAt: '',
        attachments: [],
        targetGroups: []
      });
    } catch (error) {
      showNotification('Error saving announcement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      audience: announcement.audience,
      expiresAt: announcement.expiresAt ? announcement.expiresAt.split('T')[0] : '',
      attachments: announcement.attachments,
      targetGroups: announcement.targetGroups
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
        showNotification('Announcement deleted successfully', 'success');
      } catch (error) {
        showNotification('Error deleting announcement', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle publish
  const handlePublish = async (id) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAnnouncements(prev => prev.map(ann => 
        ann.id === id ? { ...ann, status: 'published', publishedAt: new Date().toISOString() } : ann
      ));
      showNotification('Announcement published successfully', 'success');
    } catch (error) {
      showNotification('Error publishing announcement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Get audience label
  const getAudienceLabel = (audience) => {
    const option = audienceOptions.find(opt => opt.value === audience);
    return option ? option.label : audience;
  };

  // Get priority label
  const getPriorityLabel = (priority) => {
    const option = priorityOptions.find(opt => opt.value === priority);
    return option ? option.label : priority;
  };

  // Get status label
  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/admin/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Announcement Management</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Create and manage university announcements</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Announcement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Total Announcements</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{announcements.length}</p>
            </div>
            <Megaphone className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Published</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">
                {announcements.filter(a => a.status === 'published').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Drafts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">
                {announcements.filter(a => a.status === 'draft').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">
                {announcements.reduce((sum, a) => sum + a.readCount, 0).toLocaleString()}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="input-field"
            >
              <option value="all">All Priority</option>
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="input-field"
            >
              <option value="all">All Audience</option>
              {audienceOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                    {announcement.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                    {getStatusLabel(announcement.status)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                    {getPriorityLabel(announcement.priority)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-slate-300 mb-3 line-clamp-2">
                  {announcement.content}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{getAudienceLabel(announcement.audience)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{announcement.readCount} views</span>
                  </div>
                  {announcement.attachments.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{announcement.attachments.length} attachment(s)</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(announcement)}
                  className="p-2 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                
                {announcement.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(announcement.id)}
                    className="p-2 text-gray-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    title="Publish"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="p-2 text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-slate-50">
                      {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="input-field"
                        placeholder="Enter announcement title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Content *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="input-field"
                        placeholder="Enter announcement content"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          Priority
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                          className="input-field"
                        >
                          {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          Audience
                        </label>
                        <select
                          value={formData.audience}
                          onChange={(e) => setFormData({...formData, audience: e.target.value})}
                          className="input-field"
                        >
                          {audienceOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Expires At
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.expiresAt}
                        onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Target Groups
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {targetGroupOptions.map(option => (
                          <label key={option.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.targetGroups.includes(option.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({...formData, targetGroups: [...formData.targetGroups, option.value]});
                                } else {
                                  setFormData({...formData, targetGroups: formData.targetGroups.filter(tg => tg !== option.value)});
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-slate-300">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : (editingAnnouncement ? 'Update' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
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

export default AdminAnnouncements;
