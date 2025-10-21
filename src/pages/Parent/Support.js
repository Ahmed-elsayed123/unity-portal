import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Info,
  Search,
  Filter,
  Send,
  Paperclip,
  Smile,
  Image,
  FileText,
  Video,
  Music,
  Calendar,
  User,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Archive,
  Trash2,
  Edit,
  Plus,
  ExternalLink,
  Download,
  Share,
  Bell,
  BellOff,
  Settings,
  Shield,
  Lightbulb,
  Target,
  TrendingUp,
  BookOpen,
  GraduationCap,
  DollarSign,
  Heart,
  MapPin,
  Users
} from 'lucide-react';

const ParentSupport = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const faqs = [
    {
      id: 1,
      question: 'How do I access my child\'s academic records?',
      answer: 'You can access your child\'s academic records through the Parent Portal. Navigate to the "Academic Records" section where you can view grades, attendance, and course information.',
      category: 'Academic',
      helpful: 45,
      notHelpful: 2,
      dateAdded: '2024-01-15',
      tags: ['academic', 'records', 'grades']
    },
    {
      id: 2,
      question: 'What is the process for financial aid applications?',
      answer: 'Financial aid applications are processed through the Financial Aid Office. Complete the FAFSA form and submit required documents by the deadline. You can track your application status in the portal.',
      category: 'Financial',
      helpful: 38,
      notHelpful: 1,
      dateAdded: '2024-01-12',
      tags: ['financial aid', 'application', 'process']
    },
    {
      id: 3,
      question: 'How can I contact my child\'s academic advisor?',
      answer: 'You can contact the academic advisor through the Communication section in the Parent Portal. Send a message directly or schedule a meeting through the portal.',
      category: 'Communication',
      helpful: 52,
      notHelpful: 3,
      dateAdded: '2024-01-10',
      tags: ['advisor', 'contact', 'communication']
    },
    {
      id: 4,
      question: 'What are the campus safety protocols?',
      answer: 'Campus safety is our top priority. We have 24/7 security, emergency alert systems, and regular safety drills. All safety information is available in the Campus Safety section.',
      category: 'Safety',
      helpful: 41,
      notHelpful: 0,
      dateAdded: '2024-01-08',
      tags: ['safety', 'security', 'emergency']
    },
    {
      id: 5,
      question: 'How do I update my contact information?',
      answer: 'You can update your contact information in the Profile section of the Parent Portal. Changes are reflected immediately and you\'ll receive a confirmation email.',
      category: 'Profile',
      helpful: 28,
      notHelpful: 1,
      dateAdded: '2024-01-05',
      tags: ['profile', 'contact', 'update']
    }
  ];

  const supportCategories = [
    { id: 'all', name: 'All Categories', icon: HelpCircle, count: faqs.length },
    { id: 'Academic', name: 'Academic', icon: GraduationCap, count: faqs.filter(f => f.category === 'Academic').length },
    { id: 'Financial', name: 'Financial', icon: DollarSign, count: faqs.filter(f => f.category === 'Financial').length },
    { id: 'Communication', name: 'Communication', icon: MessageSquare, count: faqs.filter(f => f.category === 'Communication').length },
    { id: 'Safety', name: 'Safety', icon: Shield, count: faqs.filter(f => f.category === 'Safety').length },
    { id: 'Profile', name: 'Profile', icon: User, count: faqs.filter(f => f.category === 'Profile').length }
  ];

  const supportContacts = [
    {
      id: 1,
      name: 'Academic Support',
      email: 'academic@unity.edu',
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Fri 8:00 AM - 5:00 PM',
      description: 'Help with academic records, course information, and academic planning',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 2,
      name: 'Financial Aid Office',
      email: 'finaid@unity.edu',
      phone: '+1 (555) 234-5678',
      hours: 'Mon-Fri 9:00 AM - 4:00 PM',
      description: 'Assistance with financial aid, scholarships, and payment plans',
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      name: 'Student Affairs',
      email: 'studentaffairs@unity.edu',
      phone: '+1 (555) 345-6789',
      hours: 'Mon-Fri 8:00 AM - 6:00 PM',
      description: 'Support for student life, housing, and campus activities',
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 4,
      name: 'Technical Support',
      email: 'techsupport@unity.edu',
      phone: '+1 (555) 456-7890',
      hours: '24/7',
      description: 'Help with portal access, technical issues, and online resources',
      icon: Lightbulb,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 5,
      name: 'Emergency Support',
      email: 'emergency@unity.edu',
      phone: '+1 (555) 911-0000',
      hours: '24/7',
      description: 'Emergency assistance and urgent matters',
      icon: AlertCircle,
      color: 'text-red-600 bg-red-100'
    }
  ];

  const recentTickets = [
    {
      id: 1,
      subject: 'Academic Records Access Issue',
      category: 'Academic',
      priority: 'high',
      status: 'open',
      dateCreated: '2024-01-15',
      lastUpdate: '2024-01-15',
      description: 'Unable to access my child\'s academic records in the portal'
    },
    {
      id: 2,
      subject: 'Financial Aid Application Status',
      category: 'Financial',
      priority: 'medium',
      status: 'in_progress',
      dateCreated: '2024-01-12',
      lastUpdate: '2024-01-14',
      description: 'Need to check the status of my financial aid application'
    },
    {
      id: 3,
      subject: 'Portal Login Problems',
      category: 'Technical',
      priority: 'low',
      status: 'resolved',
      dateCreated: '2024-01-10',
      lastUpdate: '2024-01-11',
      description: 'Having trouble logging into the parent portal'
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Academic': return GraduationCap;
      case 'Financial': return DollarSign;
      case 'Communication': return MessageSquare;
      case 'Safety': return Shield;
      case 'Profile': return User;
      case 'Technical': return Lightbulb;
      default: return HelpCircle;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support & Help</h1>
        <p className="text-gray-600 mt-2">Get help and support for your questions and concerns</p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {supportContacts.map((contact) => {
          const Icon = contact.icon;
          return (
            <div key={contact.id} className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{contact.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{contact.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{contact.hours}</span>
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
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'faq', name: 'FAQ', count: faqs.length },
            { id: 'tickets', name: 'Support Tickets', count: recentTickets.length },
            { id: 'contact', name: 'Contact Us', count: 0 }
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

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search FAQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {supportCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const CategoryIcon = getCategoryIcon(faq.category);
              return (
                <div key={faq.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <CategoryIcon className="h-5 w-5 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    </div>
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                      {faq.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{faq.answer}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Added: {faq.dateAdded}</span>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span>{faq.helpful}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                        <span>{faq.notHelpful}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-green-500">
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500">
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Share className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Create New Ticket */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Support Ticket</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="Academic">Academic</option>
                  <option value="Financial">Financial</option>
                  <option value="Technical">Technical</option>
                  <option value="Communication">Communication</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Please provide detailed information about your issue"
              />
            </div>
            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              <Send className="h-4 w-4 inline mr-2" />
              Submit Ticket
            </button>
          </div>

          {/* Recent Tickets */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Support Tickets</h3>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Created: {ticket.dateCreated}</span>
                      <span>Last Update: {ticket.lastUpdate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Archive className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Us Tab */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-600">support@unity.edu</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Phone Support</p>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Support Hours</p>
                  <p className="text-sm text-gray-600">Mon-Fri 8:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Office Location</p>
                  <p className="text-sm text-gray-600">Main Campus, Building A, Room 101</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact Form</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief description of your inquiry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please provide detailed information about your inquiry"
                />
              </div>
              <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                <Send className="h-4 w-4 inline mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <HelpCircle className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{faqs.length}</div>
          <div className="text-sm text-gray-600">FAQ Articles</div>
        </div>
        <div className="card p-6 text-center">
          <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{recentTickets.length}</div>
          <div className="text-sm text-gray-600">Support Tickets</div>
        </div>
        <div className="card p-6 text-center">
          <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">98%</div>
          <div className="text-sm text-gray-600">Resolution Rate</div>
        </div>
        <div className="card p-6 text-center">
          <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">2.5h</div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
        </div>
      </div>
    </div>
  );
};

export default ParentSupport;
