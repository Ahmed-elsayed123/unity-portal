import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Reply,
  Archive,
  Trash2,
  Paperclip,
  Smile,
  Image,
  FileText
} from 'lucide-react';

const ParentCommunication = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const messages = [
    {
      id: 1,
      from: 'Dr. Sarah Johnson',
      to: 'Parent',
      subject: 'Student Progress Update',
      content: 'I wanted to update you on your child\'s progress in Data Structures. They are performing well and showing good understanding of the concepts.',
      timestamp: '2024-01-15 10:30 AM',
      isRead: true,
      priority: 'normal',
      type: 'academic'
    },
    {
      id: 2,
      from: 'Academic Advisor',
      to: 'Parent',
      subject: 'Course Registration Reminder',
      content: 'This is a reminder that course registration for next semester begins next week. Please ensure your child reviews the available courses.',
      timestamp: '2024-01-14 2:15 PM',
      isRead: false,
      priority: 'high',
      type: 'administrative'
    },
    {
      id: 3,
      from: 'Student Affairs',
      to: 'Parent',
      subject: 'Campus Event Invitation',
      content: 'You are invited to attend the Parent-Teacher Conference scheduled for next month. Please RSVP if you plan to attend.',
      timestamp: '2024-01-13 4:45 PM',
      isRead: true,
      priority: 'normal',
      type: 'event'
    },
    {
      id: 4,
      from: 'Financial Aid Office',
      to: 'Parent',
      subject: 'Financial Aid Update',
      content: 'Your financial aid application has been processed. Please check the student portal for details about your aid package.',
      timestamp: '2024-01-12 11:20 AM',
      isRead: true,
      priority: 'high',
      type: 'financial'
    }
  ];

  const contacts = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Academic Advisor',
      email: 'sarah.johnson@unity.edu',
      phone: '+1 (555) 123-4567',
      department: 'Computer Science',
      lastContact: '2024-01-15',
      status: 'online'
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      role: 'Course Instructor',
      email: 'michael.chen@unity.edu',
      phone: '+1 (555) 234-5678',
      department: 'Mathematics',
      lastContact: '2024-01-10',
      status: 'offline'
    },
    {
      id: 3,
      name: 'Student Affairs Office',
      role: 'Administrative',
      email: 'student.affairs@unity.edu',
      phone: '+1 (555) 345-6789',
      department: 'Student Services',
      lastContact: '2024-01-13',
      status: 'online'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Parent-Teacher Conference',
      content: 'The annual Parent-Teacher Conference will be held on February 15th. Please register to attend.',
      date: '2024-01-15',
      priority: 'high',
      category: 'Academic'
    },
    {
      id: 2,
      title: 'Campus Safety Update',
      content: 'Important safety protocols have been updated. Please review the new guidelines.',
      date: '2024-01-14',
      priority: 'normal',
      category: 'Safety'
    },
    {
      id: 3,
      title: 'Financial Aid Deadline',
      content: 'The deadline for financial aid applications is approaching. Please submit required documents.',
      date: '2024-01-13',
      priority: 'high',
      category: 'Financial'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'academic': return 'text-green-600 bg-green-100';
      case 'administrative': return 'text-blue-600 bg-blue-100';
      case 'financial': return 'text-yellow-600 bg-yellow-100';
      case 'event': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
        <p className="text-gray-600 mt-2">Stay connected with your child's academic journey</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'messages', name: 'Messages', count: messages.filter(m => !m.isRead).length },
            { id: 'contacts', name: 'Contacts', count: contacts.length },
            { id: 'announcements', name: 'Announcements', count: announcements.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-2 bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!message.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{message.subject}</h4>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{message.from}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{message.content}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                        <div className="flex space-x-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(message.type)}`}>
                            {message.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Reply className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Archive className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <p className="text-gray-900">{selectedMessage.from}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <p className="text-gray-900">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <p className="text-gray-900">{selectedMessage.timestamp}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <p className="text-gray-900">{selectedMessage.content}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                    <Reply className="h-4 w-4 inline mr-2" />
                    Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="card p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="card p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.role}</p>
                  <p className="text-sm text-gray-500">{contact.department}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{contact.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{contact.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Last contact: {contact.lastContact}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Call
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(announcement.category.toLowerCase())}`}>
                      {announcement.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{announcement.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{announcement.date}</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Star className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Archive className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            <Send className="h-6 w-6 text-primary-600" />
            <span className="font-medium text-primary-900">Send Message</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Phone className="h-6 w-6 text-green-600" />
            <span className="font-medium text-green-900">Schedule Call</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span className="font-medium text-blue-900">Book Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentCommunication;
