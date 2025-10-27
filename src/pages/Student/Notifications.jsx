import React, { useState } from 'react';
import { 
  Bell, 
  Filter, 
  Search, 
  CheckCheck, 
  Trash2, 
  Archive,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  X
} from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext.jsx';

const StudentNotifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const { showNotification } = useNotification();

  const notifications = [
    {
      id: 1,
      title: 'Assignment Due Tomorrow',
      message: 'Your Data Structures assignment is due tomorrow at 11:59 PM. Don\'t forget to submit!',
      type: 'urgent',
      timestamp: '2 hours ago',
      isRead: false,
      course: 'CS-201'
    },
    {
      id: 2,
      title: 'Grade Posted',
      message: 'Your grade for Calculus II Quiz 3 has been posted. Check your grades page.',
      type: 'info',
      timestamp: '1 day ago',
      isRead: true,
      course: 'MATH-202'
    },
    {
      id: 3,
      title: 'Class Cancelled',
      message: 'Physics Lab scheduled for tomorrow has been cancelled. New date will be announced.',
      type: 'warning',
      timestamp: '2 days ago',
      isRead: false,
      course: 'PHYS-101'
    },
    {
      id: 4,
      title: 'Library Book Due',
      message: 'Your borrowed book "Introduction to Algorithms" is due in 3 days.',
      type: 'info',
      timestamp: '3 days ago',
      isRead: true,
      course: 'Library'
    },
    {
      id: 5,
      title: 'Exam Schedule Updated',
      message: 'The final exam schedule has been updated. Please check the new dates.',
      type: 'info',
      timestamp: '1 week ago',
      isRead: true,
      course: 'General'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type, isRead) => {
    const baseClasses = 'p-4 rounded-lg border-l-4 transition-all duration-200';
    const readClasses = isRead ? 'bg-gray-50 dark:bg-slate-700/50' : 'bg-white dark:bg-slate-800';
    
    switch (type) {
      case 'urgent':
        return `${baseClasses} ${readClasses} border-red-500`;
      case 'warning':
        return `${baseClasses} ${readClasses} border-yellow-500`;
      case 'info':
        return `${baseClasses} ${readClasses} border-blue-500`;
      default:
        return `${baseClasses} ${readClasses} border-gray-300 dark:border-slate-600`;
    }
  };

  const handleMarkAsRead = (notificationId) => {
    showNotification('Notification marked as read', 'success');
  };

  const handleMarkAllAsRead = () => {
    showNotification('All notifications marked as read', 'success');
  };

  const handleDelete = (notificationId) => {
    showNotification('Notification deleted', 'success');
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'unread' && !notification.isRead) ||
                         (filterStatus === 'read' && notification.isRead);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Notifications</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">
            Stay updated with your academic activities and important announcements
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={handleMarkAllAsRead}
            className="btn-secondary"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </button>
          <button 
            onClick={() => showNotification('Notifications archived', 'success')}
            className="btn-primary"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{notifications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Unread</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{unreadCount}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Read</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{notifications.length - unreadCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-full sm:w-48"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-slate-300">
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="card p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 dark:text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-50 mb-2">No notifications found</h3>
            <p className="text-gray-600 dark:text-slate-300">
              {searchTerm ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`${getNotificationBg(notification.type, notification.isRead)} ${
                selectedNotifications.includes(notification.id) ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-medium ${
                          notification.isRead 
                            ? 'text-gray-600 dark:text-slate-300' 
                            : 'text-gray-900 dark:text-slate-50'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                        {notification.message}
                      </p>
                      
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-slate-400">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.timestamp}
                        </span>
                        <span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                          {notification.course}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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

export default StudentNotifications;
