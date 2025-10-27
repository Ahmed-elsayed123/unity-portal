import React, { useState } from 'react';
import { 
  Megaphone, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Eye,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  Bell,
  Users,
  Target,
  Bookmark,
  BookmarkPlus
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';

const StudentAnnouncements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [bookmarkedAnnouncements, setBookmarkedAnnouncements] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  // Mock announcements data
  const announcements = [
    {
      id: 1,
      title: "Midterm Examination Schedule",
      content: "The midterm examinations for all courses will be conducted from March 15-20, 2024. Please check your individual schedules and prepare accordingly. Students are required to bring their student ID and writing materials. Electronic devices are not allowed in the examination hall.",
      priority: "high",
      status: "published",
      author: "Dr. Sarah Johnson",
      authorRole: "admin",
      createdAt: "2024-03-01T10:00:00Z",
      publishedAt: "2024-03-01T10:30:00Z",
      expiresAt: "2024-03-25T23:59:59Z",
      attachments: ["exam_schedule.pdf"],
      readCount: 1250,
      isRead: true,
      targetGroups: ["students", "lecturers"]
    },
    {
      id: 2,
      title: "Library System Maintenance",
      content: "The library management system will undergo maintenance on March 10, 2024, from 2:00 AM to 6:00 AM. During this time, online services will be unavailable. Please plan your research activities accordingly.",
      priority: "medium",
      status: "published",
      author: "IT Support Team",
      authorRole: "admin",
      createdAt: "2024-03-05T14:00:00Z",
      publishedAt: "2024-03-05T14:15:00Z",
      expiresAt: "2024-03-12T23:59:59Z",
      attachments: [],
      readCount: 890,
      isRead: true,
      targetGroups: ["students", "lecturers", "staff"]
    },
    {
      id: 3,
      title: "New Course Registration Opens",
      content: "Registration for summer semester courses will open on March 15, 2024. Students can register through the student portal. Early registration is recommended as some courses have limited seats.",
      priority: "high",
      status: "published",
      author: "Registrar Office",
      authorRole: "admin",
      createdAt: "2024-03-08T09:00:00Z",
      publishedAt: "2024-03-08T09:30:00Z",
      expiresAt: "2024-04-15T23:59:59Z",
      attachments: ["course_catalog.pdf"],
      readCount: 2100,
      isRead: false,
      targetGroups: ["students"]
    },
    {
      id: 4,
      title: "Campus WiFi Upgrade",
      content: "The campus WiFi network has been upgraded to provide faster and more reliable internet access. Please reconnect to the 'Unity-University' network using your student credentials.",
      priority: "low",
      status: "published",
      author: "IT Support Team",
      authorRole: "admin",
      createdAt: "2024-03-07T11:00:00Z",
      publishedAt: "2024-03-07T11:30:00Z",
      expiresAt: "2024-03-14T23:59:59Z",
      attachments: [],
      readCount: 2100,
      isRead: true,
      targetGroups: ["students", "lecturers", "staff"]
    },
    {
      id: 5,
      title: "Student Council Elections",
      content: "Student Council elections will be held on March 20, 2024. All students are encouraged to participate in the democratic process. Candidate nominations are now open.",
      priority: "medium",
      status: "published",
      author: "Student Affairs Office",
      authorRole: "admin",
      createdAt: "2024-03-09T16:00:00Z",
      publishedAt: "2024-03-09T16:30:00Z",
      expiresAt: "2024-03-22T23:59:59Z",
      attachments: ["election_guidelines.pdf"],
      readCount: 1500,
      isRead: false,
      targetGroups: ["students"]
    }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'bookmarked', label: 'Bookmarked' }
  ];

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    
    let matchesStatus = true;
    if (selectedStatus === 'unread') {
      matchesStatus = !announcement.isRead;
    } else if (selectedStatus === 'read') {
      matchesStatus = announcement.isRead;
    } else if (selectedStatus === 'bookmarked') {
      matchesStatus = bookmarkedAnnouncements.has(announcement.id);
    }
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Get priority color
  const getPriorityColor = (priority) => {
    const priorityOption = priorityOptions.find(option => option.value === priority);
    return priorityOption ? priorityOption.color : 'text-gray-600 bg-gray-100';
  };

  // Handle bookmark toggle
  const handleBookmark = (id) => {
    const newBookmarks = new Set(bookmarkedAnnouncements);
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
      showNotification('Removed from bookmarks', 'info');
    } else {
      newBookmarks.add(id);
      showNotification('Added to bookmarks', 'success');
    }
    setBookmarkedAnnouncements(newBookmarks);
  };

  // Handle download attachment
  const handleDownload = (filename) => {
    showNotification(`Downloading ${filename}...`, 'info');
    // Simulate download
    setTimeout(() => {
      showNotification(`${filename} downloaded successfully`, 'success');
    }, 1000);
  };

  // Get priority label
  const getPriorityLabel = (priority) => {
    const option = priorityOptions.find(opt => opt.value === priority);
    return option ? option.label : priority;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/student/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Announcements</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Stay updated with university news and important information</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <div className="text-sm text-gray-500 dark:text-slate-400">
            {announcements.filter(a => !a.isRead).length} unread
          </div>
          <Bell className="h-5 w-5 text-gray-400 dark:text-slate-400" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Unread</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">
                {announcements.filter(a => !a.isRead).length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Bookmarked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">
                {bookmarkedAnnouncements.size}
              </p>
            </div>
            <Bookmark className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">High Priority</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">
                {announcements.filter(a => a.priority === 'high').length}
              </p>
            </div>
            <Target className="h-8 w-8 text-red-600 dark:text-red-400" />
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className={`card p-6 ${!announcement.isRead ? 'border-l-4 border-primary-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className={`text-lg font-semibold ${!announcement.isRead ? 'text-gray-900 dark:text-slate-50' : 'text-gray-700 dark:text-slate-300'}`}>
                    {announcement.title}
                    {!announcement.isRead && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                        New
                      </span>
                    )}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                    {getPriorityLabel(announcement.priority)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-slate-300 mb-4">
                  {announcement.content}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{announcement.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(announcement.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{getTimeAgo(announcement.publishedAt)}</span>
                  </div>
                  {announcement.attachments.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{announcement.attachments.length} attachment(s)</span>
                    </div>
                  )}
                </div>
                
                {/* Attachments */}
                {announcement.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {announcement.attachments.map((attachment, index) => (
                      <button
                        key={index}
                        onClick={() => handleDownload(attachment)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <FileText className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                        <span className="text-sm text-gray-700 dark:text-slate-300">{attachment}</span>
                        <Download className="h-3 w-3 text-gray-500 dark:text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleBookmark(announcement.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    bookmarkedAnnouncements.has(announcement.id)
                      ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'text-gray-500 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  }`}
                  title={bookmarkedAnnouncements.has(announcement.id) ? 'Remove bookmark' : 'Add bookmark'}
                >
                  {bookmarkedAnnouncements.has(announcement.id) ? (
                    <BookmarkPlus className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredAnnouncements.length === 0 && (
          <div className="card p-12 text-center">
            <Megaphone className="h-12 w-12 text-gray-400 dark:text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-50 mb-2">No announcements found</h3>
            <p className="text-gray-600 dark:text-slate-300">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
