import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Heart, 
  Share,
  ExternalLink,
  FileText,
  Video,
  Image,
  Music,
  Archive,
  Calendar,
  User,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  GraduationCap,
  DollarSign,
  Shield,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';

const ParentResources = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources = [
    {
      id: 1,
      title: 'Academic Calendar 2024',
      description: 'Complete academic calendar with important dates and deadlines',
      category: 'Academic',
      type: 'PDF',
      size: '2.3 MB',
      downloads: 1250,
      rating: 4.8,
      dateAdded: '2024-01-15',
      author: 'Academic Affairs',
      tags: ['calendar', 'dates', 'deadlines'],
      isFavorite: true,
      isNew: false,
      thumbnail: '📅',
      content: 'Detailed academic calendar with semester dates, holidays, and important deadlines'
    },
    {
      id: 2,
      title: 'Financial Aid Guide',
      description: 'Comprehensive guide to financial aid options and application process',
      category: 'Financial',
      type: 'PDF',
      size: '1.8 MB',
      downloads: 890,
      rating: 4.6,
      dateAdded: '2024-01-10',
      author: 'Financial Aid Office',
      tags: ['financial aid', 'scholarships', 'grants'],
      isFavorite: false,
      isNew: true,
      thumbnail: '💰',
      content: 'Step-by-step guide to understanding and applying for financial aid'
    },
    {
      id: 3,
      title: 'Campus Safety Handbook',
      description: 'Important safety information and emergency procedures',
      category: 'Safety',
      type: 'PDF',
      size: '3.1 MB',
      downloads: 2100,
      rating: 4.9,
      dateAdded: '2024-01-08',
      author: 'Campus Security',
      tags: ['safety', 'emergency', 'procedures'],
      isFavorite: true,
      isNew: false,
      thumbnail: '🛡️',
      content: 'Comprehensive safety guidelines and emergency response procedures'
    },
    {
      id: 4,
      title: 'Student Success Tips',
      description: 'Video series with tips for academic success and time management',
      category: 'Academic',
      type: 'Video',
      size: '45.2 MB',
      downloads: 650,
      rating: 4.7,
      dateAdded: '2024-01-12',
      author: 'Student Success Center',
      tags: ['success', 'tips', 'time management'],
      isFavorite: false,
      isNew: true,
      thumbnail: '🎯',
      content: 'Video series covering study strategies, time management, and academic success'
    },
    {
      id: 5,
      title: 'Parent Handbook',
      description: 'Complete guide for parents on supporting their child\'s education',
      category: 'Parent',
      type: 'PDF',
      size: '4.2 MB',
      downloads: 1800,
      rating: 4.8,
      dateAdded: '2024-01-05',
      author: 'Parent Services',
      tags: ['parent', 'support', 'education'],
      isFavorite: true,
      isNew: false,
      thumbnail: '👨‍👩‍👧‍👦',
      content: 'Comprehensive guide for parents on how to support their child\'s academic journey'
    },
    {
      id: 6,
      title: 'Career Development Resources',
      description: 'Resources for career planning and professional development',
      category: 'Career',
      type: 'PDF',
      size: '2.8 MB',
      downloads: 750,
      rating: 4.5,
      dateAdded: '2024-01-18',
      author: 'Career Services',
      tags: ['career', 'development', 'planning'],
      isFavorite: false,
      isNew: true,
      thumbnail: '💼',
      content: 'Resources and tools for career planning and professional development'
    },
    {
      id: 7,
      title: 'Mental Health Resources',
      description: 'Important information about mental health support and services',
      category: 'Health',
      type: 'PDF',
      size: '1.5 MB',
      downloads: 1200,
      rating: 4.9,
      dateAdded: '2024-01-20',
      author: 'Counseling Center',
      tags: ['mental health', 'support', 'wellness'],
      isFavorite: true,
      isNew: true,
      thumbnail: '🧠',
      content: 'Comprehensive mental health resources and support services'
    },
    {
      id: 8,
      title: 'Technology Guide',
      description: 'Guide to using campus technology and online resources',
      category: 'Technology',
      type: 'PDF',
      size: '2.1 MB',
      downloads: 950,
      rating: 4.4,
      dateAdded: '2024-01-14',
      author: 'IT Services',
      tags: ['technology', 'online', 'resources'],
      isFavorite: false,
      isNew: false,
      thumbnail: '💻',
      content: 'Complete guide to campus technology and online learning resources'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen, count: resources.length },
    { id: 'Academic', name: 'Academic', icon: GraduationCap, count: resources.filter(r => r.category === 'Academic').length },
    { id: 'Financial', name: 'Financial', icon: DollarSign, count: resources.filter(r => r.category === 'Financial').length },
    { id: 'Safety', name: 'Safety', icon: Shield, count: resources.filter(r => r.category === 'Safety').length },
    { id: 'Parent', name: 'Parent', icon: User, count: resources.filter(r => r.category === 'Parent').length },
    { id: 'Career', name: 'Career', icon: Target, count: resources.filter(r => r.category === 'Career').length },
    { id: 'Health', name: 'Health', icon: Heart, count: resources.filter(r => r.category === 'Health').length },
    { id: 'Technology', name: 'Technology', icon: Lightbulb, count: resources.filter(r => r.category === 'Technology').length }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Academic': return GraduationCap;
      case 'Financial': return DollarSign;
      case 'Safety': return Shield;
      case 'Parent': return User;
      case 'Career': return Target;
      case 'Health': return Heart;
      case 'Technology': return Lightbulb;
      default: return BookOpen;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return FileText;
      case 'Video': return Video;
      case 'Image': return Image;
      case 'Audio': return Music;
      default: return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'text-red-600 bg-red-100';
      case 'Video': return 'text-blue-600 bg-blue-100';
      case 'Image': return 'text-green-600 bg-green-100';
      case 'Audio': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTabCount = (tabId) => {
    switch (tabId) {
      case 'all': return filteredResources.length;
      case 'favorites': return resources.filter(r => r.isFavorite).length;
      case 'new': return resources.filter(r => r.isNew).length;
      case 'popular': return resources.filter(r => r.downloads > 1000).length;
      default: return 0;
    }
  };

  const getTabResources = (tabId) => {
    switch (tabId) {
      case 'all': return filteredResources;
      case 'favorites': return filteredResources.filter(r => r.isFavorite);
      case 'new': return filteredResources.filter(r => r.isNew);
      case 'popular': return filteredResources.filter(r => r.downloads > 1000);
      default: return filteredResources;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resources & Downloads</h1>
        <p className="text-gray-600 mt-2">Access important documents, guides, and resources</p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
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
            { id: 'all', name: 'All Resources' },
            { id: 'favorites', name: 'Favorites' },
            { id: 'new', name: 'New' },
            { id: 'popular', name: 'Popular' }
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
              {getTabCount(tab.id) > 0 && (
                <span className="ml-2 bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs">
                  {getTabCount(tab.id)}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getTabResources(activeTab).map((resource) => {
          const CategoryIcon = getCategoryIcon(resource.category);
          const TypeIcon = getTypeIcon(resource.type);
          return (
            <div key={resource.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{resource.thumbnail}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                    <p className="text-sm text-gray-600">{resource.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {resource.isNew && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      New
                    </span>
                  )}
                  <button className="p-1 text-gray-400 hover:text-red-500">
                    <Heart className={`h-4 w-4 ${resource.isFavorite ? 'text-red-500 fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>

              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <TypeIcon className="h-3 w-3" />
                  <span>{resource.type}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Archive className="h-3 w-3" />
                  <span>{resource.size}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-3 w-3" />
                  <span>{resource.downloads}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{resource.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{resource.dateAdded}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Share className="h-4 w-4" />
                  </button>
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <BookOpen className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{resources.length}</div>
          <div className="text-sm text-gray-600">Total Resources</div>
        </div>
        <div className="card p-6 text-center">
          <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {resources.reduce((sum, resource) => sum + resource.downloads, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Downloads</div>
        </div>
        <div className="card p-6 text-center">
          <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">4.7</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="card p-6 text-center">
          <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">+15%</div>
          <div className="text-sm text-gray-600">Growth Rate</div>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.filter(r => r.isFavorite).slice(0, 4).map((resource) => (
            <div key={resource.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">{resource.thumbnail}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
              <button className="bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 transition-colors">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentResources;
