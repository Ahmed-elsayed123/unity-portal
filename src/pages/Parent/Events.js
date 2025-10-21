import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Filter, 
  Search,
  Plus,
  Edit,
  Trash2,
  Bell,
  BellOff,
  ExternalLink,
  Download,
  Share,
  CheckCircle,
  AlertCircle,
  Info,
  GraduationCap,
  BookOpen,
  Trophy,
  Heart,
  Coffee,
  Music,
  Camera,
  Gamepad2,
  DollarSign
} from 'lucide-react';

const ParentEvents = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const events = [
    {
      id: 1,
      title: 'Parent-Teacher Conference',
      description: 'Annual conference to discuss student progress and academic goals',
      date: '2024-02-15',
      time: '09:00 AM - 05:00 PM',
      location: 'Main Campus, Building A',
      category: 'Academic',
      type: 'Conference',
      status: 'upcoming',
      isRegistered: true,
      capacity: 200,
      registered: 150,
      organizer: 'Academic Affairs',
      contact: 'conference@unity.edu',
      requirements: 'Bring student ID and academic records',
      agenda: [
        '09:00 AM - Welcome & Introduction',
        '10:00 AM - Academic Progress Review',
        '11:00 AM - Q&A Session',
        '02:00 PM - Individual Meetings',
        '04:00 PM - Closing Remarks'
      ],
      attachments: ['Conference Guide.pdf', 'Academic Calendar.pdf']
    },
    {
      id: 2,
      title: 'Campus Open Day',
      description: 'Explore campus facilities and meet with faculty members',
      date: '2024-02-20',
      time: '10:00 AM - 03:00 PM',
      location: 'Main Campus, All Buildings',
      category: 'Campus',
      type: 'Open Day',
      status: 'upcoming',
      isRegistered: false,
      capacity: 500,
      registered: 300,
      organizer: 'Student Affairs',
      contact: 'openday@unity.edu',
      requirements: 'No registration required',
      agenda: [
        '10:00 AM - Campus Tour',
        '11:00 AM - Faculty Presentations',
        '12:00 PM - Lunch',
        '01:00 PM - Lab Demonstrations',
        '02:00 PM - Q&A Session'
      ],
      attachments: ['Campus Map.pdf', 'Event Schedule.pdf']
    },
    {
      id: 3,
      title: 'Financial Aid Workshop',
      description: 'Learn about financial aid options and application process',
      date: '2024-02-25',
      time: '06:00 PM - 08:00 PM',
      location: 'Library, Room 101',
      category: 'Financial',
      type: 'Workshop',
      status: 'upcoming',
      isRegistered: true,
      capacity: 50,
      registered: 35,
      organizer: 'Financial Aid Office',
      contact: 'finaid@unity.edu',
      requirements: 'Bring financial documents',
      agenda: [
        '06:00 PM - Welcome',
        '06:15 PM - Financial Aid Overview',
        '07:00 PM - Application Process',
        '07:30 PM - Q&A Session',
        '08:00 PM - Closing'
      ],
      attachments: ['Financial Aid Guide.pdf', 'Application Form.pdf']
    },
    {
      id: 4,
      title: 'Graduation Ceremony',
      description: 'Celebrate the achievements of graduating students',
      date: '2024-05-15',
      time: '02:00 PM - 05:00 PM',
      location: 'Main Auditorium',
      category: 'Ceremony',
      type: 'Graduation',
      status: 'upcoming',
      isRegistered: false,
      capacity: 1000,
      registered: 800,
      organizer: 'Academic Affairs',
      contact: 'graduation@unity.edu',
      requirements: 'Formal attire required',
      agenda: [
        '02:00 PM - Procession',
        '02:30 PM - Welcome Address',
        '03:00 PM - Student Speeches',
        '03:30 PM - Award Ceremony',
        '04:00 PM - Graduation Ceremony',
        '05:00 PM - Reception'
      ],
      attachments: ['Graduation Program.pdf', 'Seating Chart.pdf']
    },
    {
      id: 5,
      title: 'Sports Day',
      description: 'Annual sports competition and family fun day',
      date: '2024-03-10',
      time: '08:00 AM - 06:00 PM',
      location: 'Sports Complex',
      category: 'Sports',
      type: 'Competition',
      status: 'upcoming',
      isRegistered: true,
      capacity: 300,
      registered: 250,
      organizer: 'Sports Department',
      contact: 'sports@unity.edu',
      requirements: 'Comfortable clothing and sports shoes',
      agenda: [
        '08:00 AM - Registration',
        '09:00 AM - Opening Ceremony',
        '10:00 AM - Track Events',
        '12:00 PM - Lunch Break',
        '02:00 PM - Team Sports',
        '04:00 PM - Awards Ceremony',
        '05:00 PM - Closing'
      ],
      attachments: ['Sports Schedule.pdf', 'Rules and Regulations.pdf']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Events', icon: Calendar, count: events.length },
    { id: 'Academic', name: 'Academic', icon: BookOpen, count: events.filter(e => e.category === 'Academic').length },
    { id: 'Campus', name: 'Campus', icon: MapPin, count: events.filter(e => e.category === 'Campus').length },
    { id: 'Financial', name: 'Financial', icon: DollarSign, count: events.filter(e => e.category === 'Financial').length },
    { id: 'Ceremony', name: 'Ceremony', icon: GraduationCap, count: events.filter(e => e.category === 'Ceremony').length },
    { id: 'Sports', name: 'Sports', icon: Trophy, count: events.filter(e => e.category === 'Sports').length }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Academic': return BookOpen;
      case 'Campus': return MapPin;
      case 'Financial': return DollarSign;
      case 'Ceremony': return GraduationCap;
      case 'Sports': return Trophy;
      default: return Calendar;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'ongoing': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Conference': return 'text-purple-600 bg-purple-100';
      case 'Workshop': return 'text-blue-600 bg-blue-100';
      case 'Open Day': return 'text-green-600 bg-green-100';
      case 'Graduation': return 'text-yellow-600 bg-yellow-100';
      case 'Competition': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const upcomingEvents = filteredEvents.filter(event => event.status === 'upcoming');
  const pastEvents = filteredEvents.filter(event => event.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Events & Activities</h1>
        <p className="text-gray-600 mt-2">Stay informed about campus events and activities</p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
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
              {categories.map(category => (
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'upcoming', name: 'Upcoming Events', count: upcomingEvents.length },
            { id: 'past', name: 'Past Events', count: pastEvents.length }
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

      {/* Events List */}
      <div className="space-y-6">
        {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map((event) => {
          const CategoryIcon = getCategoryIcon(event.category);
          return (
            <div key={event.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <CategoryIcon className="h-5 w-5 text-primary-600" />
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{event.registered}/{event.capacity} registered</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Organizer: {event.organizer}</span>
                    <span>Contact: {event.contact}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Bell className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Share className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {event.isRegistered ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Registered
                    </span>
                  ) : (
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                      Register
                    </button>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Agenda</h4>
                    <ul className="space-y-1">
                      {event.agenda.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                    <p className="text-sm text-gray-600 mb-3">{event.requirements}</p>
                    
                    <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                    <div className="space-y-1">
                      {event.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                          <span>{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <Calendar className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</div>
          <div className="text-sm text-gray-600">Upcoming Events</div>
        </div>
        <div className="card p-6 text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {events.filter(e => e.isRegistered).length}
          </div>
          <div className="text-sm text-gray-600">Registered Events</div>
        </div>
        <div className="card p-6 text-center">
          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {events.reduce((sum, event) => sum + event.registered, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Registrations</div>
        </div>
        <div className="card p-6 text-center">
          <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">4.8</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
      </div>
    </div>
  );
};

export default ParentEvents;
