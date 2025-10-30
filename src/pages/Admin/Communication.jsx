import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Users, 
  Send,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  X,
  Save
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const AdminCommunication = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    title: '',
    content: '',
    audience: '',
    priority: 'Medium',
    type: 'Email',
    recipient: '',
    subject: ''
  });

  const announcements = [
    {
      id: 1,
      title: 'Midterm Examination Schedule',
      content: 'Midterm examinations will be held from March 15-20, 2024. Please check your individual schedules and arrive 15 minutes early.',
      audience: 'All Students',
      priority: 'High',
      status: 'Published',
      createdBy: 'Dr. Sarah Johnson',
      createdAt: '2024-03-10',
      publishedAt: '2024-03-10',
      views: 1250
    },
    {
      id: 2,
      title: 'Library Hours Extended',
      content: 'The library will be open until 11 PM during the exam period to provide additional study space for students.',
      audience: 'All Students',
      priority: 'Medium',
      status: 'Published',
      createdBy: 'Library Staff',
      createdAt: '2024-03-08',
      publishedAt: '2024-03-08',
      views: 890
    },
    {
      id: 3,
      title: 'Faculty Meeting Reminder',
      content: 'Monthly faculty meeting scheduled for March 20th at 2:00 PM in the main conference room.',
      audience: 'Faculty',
      priority: 'Medium',
      status: 'Draft',
      createdBy: 'Admin Office',
      createdAt: '2024-03-05',
      publishedAt: null,
      views: 0
    }
  ];

  const messages = [
    {
      id: 1,
      subject: 'Welcome to Unity University',
      content: 'Welcome to the new academic year! We are excited to have you join our community.',
      recipient: 'All New Students',
      type: 'Email',
      status: 'Sent',
      sentBy: 'Admin Office',
      sentAt: '2024-01-15',
      recipients: 1250
    },
    {
      id: 2,
      subject: 'Course Registration Reminder',
      content: 'Don\'t forget to register for your courses. The deadline is approaching.',
      recipient: 'All Students',
      type: 'SMS',
      status: 'Sent',
      sentBy: 'Admin Office',
      sentAt: '2024-01-20',
      recipients: 15000
    },
    {
      id: 3,
      subject: 'Faculty Training Session',
      content: 'Mandatory training session for all faculty members on the new grading system.',
      recipient: 'All Faculty',
      type: 'Email',
      status: 'Scheduled',
      sentBy: 'Admin Office',
      sentAt: '2024-03-25',
      recipients: 500
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'text-green-600 bg-green-100';
      case 'Draft': return 'text-yellow-600 bg-yellow-100';
      case 'Sent': return 'text-green-600 bg-green-100';
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Published': return <CheckCircle className="h-4 w-4" />;
      case 'Draft': return <Clock className="h-4 w-4" />;
      case 'Sent': return <CheckCircle className="h-4 w-4" />;
      case 'Scheduled': return <Calendar className="h-4 w-4" />;
      case 'Failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      title: item.title || item.subject || '',
      content: item.content || '',
      audience: item.audience || item.recipient || '',
      priority: item.priority || 'Medium',
      type: item.type || 'Email',
      recipient: item.recipient || '',
      subject: item.subject || ''
    });
    setShowEditModal(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({
      title: '',
      content: '',
      audience: '',
      priority: 'Medium',
      type: 'Email',
      recipient: '',
      subject: ''
    });
    setShowAddModal(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    
    // In a real app, this would save to the database
    console.log('Saving item:', editingItem ? 'edit' : 'add', itemForm);
    
    // Simulate success
    const action = editingItem ? 'updated' : 'created';
    const itemType = activeTab === 'announcements' ? 'Announcement' : 'Message';
    alert(`${itemType} ${action} successfully!`);
    
    setShowEditModal(false);
    setShowAddModal(false);
    setEditingItem(null);
    setItemForm({
      title: '',
      content: '',
      audience: '',
      priority: 'Medium',
      type: 'Email',
      recipient: '',
      subject: ''
    });
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      // In a real app, this would delete from the database
      console.log('Deleting item:', item.id);
      alert(`${activeTab.slice(0, -1)} deleted successfully!`);
    }
  };

  const renderAnnouncements = () => (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div key={announcement.id} className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
              <p className="text-gray-600">{announcement.audience} • {announcement.createdBy}</p>
              <p className="text-sm text-gray-500">Created: {announcement.createdAt}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                {announcement.priority}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                {getStatusIcon(announcement.status)}
                <span className="ml-1">{announcement.status}</span>
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 line-clamp-2">{announcement.content}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Views: {announcement.views}</span>
              {announcement.publishedAt && (
                <span>Published: {announcement.publishedAt}</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleViewItem(announcement)}
                className="btn-primary text-sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </button>
              <button 
                onClick={() => handleEditItem(announcement)}
                className="btn-secondary text-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button 
                onClick={() => handleDeleteItem(announcement)}
                className="btn-danger text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{message.subject}</h3>
              <p className="text-gray-600">{message.recipient} • {message.type}</p>
              <p className="text-sm text-gray-500">Sent by: {message.sentBy}</p>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
              {getStatusIcon(message.status)}
              <span className="ml-1">{message.status}</span>
            </span>
          </div>

          <p className="text-gray-700 mb-4 line-clamp-2">{message.content}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Recipients: {message.recipients.toLocaleString()}</span>
              <span>Sent: {message.sentAt}</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleViewItem(message)}
                className="btn-primary text-sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </button>
              <button 
                onClick={() => handleEditItem(message)}
                className="btn-secondary text-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button 
                onClick={() => handleDeleteItem(message)}
                className="btn-danger text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Communication Center</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Manage announcements, messages, and notifications</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import Contacts
          </button>
          <button 
            onClick={handleAddItem}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Message
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{announcements.length}</div>
          <div className="text-sm text-gray-600">Total Announcements</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {announcements.filter(a => a.status === 'Published').length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
          <div className="text-sm text-gray-600">Messages Sent</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {announcements.reduce((sum, a) => sum + a.views, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'announcements', name: 'Announcements', icon: Bell },
              { id: 'messages', name: 'Messages', icon: Mail },
              { id: 'notifications', name: 'Notifications', icon: MessageSquare },
              { id: 'contacts', name: 'Contacts', icon: Users }
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

      {/* Filters */}
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
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="input-field"
            >
              <option value="all">All Audiences</option>
              <option value="All Students">All Students</option>
              <option value="Faculty">Faculty</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="btn-primary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'announcements' && renderAnnouncements()}
      {activeTab === 'messages' && renderMessages()}
      {activeTab === 'notifications' && (
        <div className="card p-6 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications</h3>
          <p className="text-gray-600">Notification management features coming soon</p>
        </div>
      )}
      {activeTab === 'contacts' && (
        <div className="card p-6 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Contacts</h3>
          <p className="text-gray-600">Contact management features coming soon</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => {
              setActiveTab('announcements');
              handleAddItem();
            }}
            className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left"
          >
            <Plus className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Announcement</h4>
            <p className="text-sm text-gray-600">Post new announcement</p>
          </button>
          <button 
            onClick={() => {
              setActiveTab('messages');
              handleAddItem();
            }}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <Mail className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Send Message</h4>
            <p className="text-sm text-gray-600">Send email or SMS</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
            <Users className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Contacts</h4>
            <p className="text-sm text-gray-600">Organize contact lists</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <Bell className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Schedule Notification</h4>
            <p className="text-sm text-gray-600">Set up automated alerts</p>
          </button>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedItem.title || selectedItem.subject} Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedItem.priority)}`}>
                  {selectedItem.priority}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                  {getStatusIcon(selectedItem.status)}
                  <span className="ml-1">{selectedItem.status}</span>
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Content</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded border">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedItem.content}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Audience/Recipient</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedItem.audience || selectedItem.recipient}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Type</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedItem.type || 'Announcement'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Created By</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedItem.createdBy || selectedItem.sentBy}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Date</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedItem.createdAt || selectedItem.sentAt}</p>
                </div>
                {selectedItem.views && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Views</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.views}</p>
                  </div>
                )}
                {selectedItem.recipients && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Recipients</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.recipients.toLocaleString()}</p>
                  </div>
                )}
              </div>
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
                {editingItem ? 'Edit Item' : 'Create New Item'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {activeTab === 'announcements' ? 'Title' : 'Subject'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemForm.title}
                  onChange={(e) => setItemForm(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field w-full"
                  placeholder={`Enter ${activeTab === 'announcements' ? 'title' : 'subject'}...`}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={itemForm.content}
                  onChange={(e) => setItemForm(prev => ({ ...prev, content: e.target.value }))}
                  className="input-field w-full h-24 resize-none"
                  placeholder="Enter content..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={itemForm.priority}
                    onChange={(e) => setItemForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="input-field w-full"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Audience
                  </label>
                  <select
                    value={itemForm.audience}
                    onChange={(e) => setItemForm(prev => ({ ...prev, audience: e.target.value }))}
                    className="input-field w-full"
                  >
                    <option value="All Students">All Students</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                    <option value="All">All</option>
                  </select>
                </div>
              </div>
              
              {activeTab === 'messages' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      value={itemForm.type}
                      onChange={(e) => setItemForm(prev => ({ ...prev, type: e.target.value }))}
                      className="input-field w-full"
                    >
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="Push">Push Notification</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recipient
                    </label>
                    <input
                      type="text"
                      value={itemForm.recipient}
                      onChange={(e) => setItemForm(prev => ({ ...prev, recipient: e.target.value }))}
                      className="input-field w-full"
                      placeholder="Enter recipient..."
                    />
                  </div>
                </div>
              )}
              
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

export default AdminCommunication;
