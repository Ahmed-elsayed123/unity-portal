import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  FileVideo, 
  FileImage, 
  File,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Folder,
  Link,
  Calendar,
  User,
  X
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const LecturerMaterials = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedType, setSelectedType] = useState('All Types');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    course: '',
    type: 'document',
    file: null,
    url: ''
  });
  const navigate = useNavigate();

  const courses = [
    { id: 1, name: 'Data Structures and Algorithms', code: 'CS-201' },
    { id: 2, name: 'Calculus II', code: 'MATH-205' },
    { id: 3, name: 'Physics Laboratory', code: 'PHY-301' },
    { id: 4, name: 'Technical Writing', code: 'ENG-101' }
  ];

  const materials = [
    {
      id: 1,
      title: 'Introduction to Data Structures',
      description: 'Comprehensive overview of basic data structures',
      course: 'Data Structures and Algorithms',
      courseCode: 'CS-201',
      type: 'document',
      fileSize: '2.5 MB',
      uploadDate: '2024-01-15',
      downloads: 45,
      author: 'Dr. Smith',
      fileUrl: '#'
    },
    {
      id: 2,
      title: 'Algorithm Complexity Analysis',
      description: 'Understanding Big O notation and algorithm efficiency',
      course: 'Data Structures and Algorithms',
      courseCode: 'CS-201',
      type: 'video',
      fileSize: '125 MB',
      uploadDate: '2024-01-20',
      downloads: 38,
      author: 'Dr. Smith',
      fileUrl: '#'
    },
    {
      id: 3,
      title: 'Calculus Integration Techniques',
      description: 'Methods for solving integration problems',
      course: 'Calculus II',
      courseCode: 'MATH-205',
      type: 'document',
      fileSize: '1.8 MB',
      uploadDate: '2024-01-18',
      downloads: 52,
      author: 'Dr. Smith',
      fileUrl: '#'
    },
    {
      id: 4,
      title: 'Physics Lab Safety Guidelines',
      description: 'Important safety procedures for laboratory work',
      course: 'Physics Laboratory',
      courseCode: 'PHY-301',
      type: 'image',
      fileSize: '3.2 MB',
      uploadDate: '2024-01-22',
      downloads: 28,
      author: 'Dr. Smith',
      fileUrl: '#'
    },
    {
      id: 5,
      title: 'Technical Writing Style Guide',
      description: 'Guidelines for professional technical writing',
      course: 'Technical Writing',
      courseCode: 'ENG-101',
      type: 'document',
      fileSize: '1.2 MB',
      uploadDate: '2024-01-25',
      downloads: 41,
      author: 'Dr. Smith',
      fileUrl: '#'
    },
    {
      id: 6,
      title: 'External Resource: MIT OpenCourseWare',
      description: 'Additional resources from MIT for advanced topics',
      course: 'Data Structures and Algorithms',
      courseCode: 'CS-201',
      type: 'link',
      fileSize: 'N/A',
      uploadDate: '2024-01-28',
      downloads: 15,
      author: 'Dr. Smith',
      fileUrl: 'https://ocw.mit.edu'
    }
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'All Courses' || material.course === selectedCourse;
    const matchesType = selectedType === 'All Types' || material.type === selectedType;
    
    return matchesSearch && matchesCourse && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'document': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'video': return <FileVideo className="h-5 w-5 text-red-600" />;
      case 'image': return <FileImage className="h-5 w-5 text-green-600" />;
      case 'pdf': return <File className="h-5 w-5 text-red-600" />;
      case 'link': return <Link className="h-5 w-5 text-purple-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'link': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    // Handle file upload logic here
    console.log('Uploading material:', uploadForm);
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      description: '',
      course: '',
      type: 'document',
      file: null,
      url: ''
    });
  };

  const handleViewMaterial = (material) => {
    setSelectedMaterial(material);
    setShowViewModal(true);
  };

  const handleDownloadMaterial = (material) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = material.fileUrl;
    link.download = material.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Update download count (in real app, this would be sent to backend)
    console.log(`Downloading: ${material.title}`);
  };

  const handleEditMaterial = (material) => {
    // Navigate to edit page or open edit modal
    console.log('Editing material:', material.title);
    // For now, we'll just show an alert
    alert(`Edit functionality for "${material.title}" would open here`);
  };

  const handleDeleteMaterial = (material) => {
    if (window.confirm(`Are you sure you want to delete "${material.title}"?`)) {
      console.log('Deleting material:', material.title);
      // Handle deletion logic here
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/lecturer/courses" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Course Materials</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Upload and manage your course materials</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Material
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="input-field"
            >
              <option value="All Courses">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.name}>{course.name}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
            >
              <option value="All Types">All Types</option>
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="pdf">PDF</option>
              <option value="link">Link</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              <Folder className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Materials Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(material.type)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{material.title}</h3>
                    <p className="text-sm text-gray-600">{material.courseCode}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                  {material.type}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(material.uploadDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  {material.downloads} downloads
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {material.author}
                </div>
                {material.type !== 'link' && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    {material.fileSize}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewMaterial(material)}
                  className="flex-1 btn-primary text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button 
                  onClick={() => handleDownloadMaterial(material)}
                  className="flex-1 btn-secondary text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(material.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{material.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{material.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{material.courseCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                        {material.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{material.fileSize}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{material.downloads}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(material.uploadDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewMaterial(material)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadMaterial(material)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditMaterial(material)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMaterial(material)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Material</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="input-field w-full"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course
                </label>
                <select
                  value={uploadForm.course}
                  onChange={(e) => setUploadForm({ ...uploadForm, course: e.target.value })}
                  className="input-field w-full"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="pdf">PDF</option>
                  <option value="link">External Link</option>
                </select>
              </div>
              {uploadForm.type === 'link' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={uploadForm.url}
                    onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                    className="input-field w-full"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="input-field w-full"
                    required
                  />
                </div>
              )}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Material Modal */}
      {showViewModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedMaterial.title}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {getTypeIcon(selectedMaterial.type)}
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedMaterial.type)}`}>
                    {selectedMaterial.type}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-300">{selectedMaterial.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Course</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedMaterial.courseCode}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Upload Date</h4>
                  <p className="text-gray-600 dark:text-gray-300">{new Date(selectedMaterial.uploadDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Downloads</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedMaterial.downloads}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">File Size</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedMaterial.fileSize}</p>
                </div>
              </div>
              
              {selectedMaterial.type === 'link' ? (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">External Link</h4>
                  <a 
                    href={selectedMaterial.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {selectedMaterial.fileUrl}
                  </a>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Files</h4>
                  <div className="space-y-2">
                    {selectedMaterial.files?.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-900 dark:text-white">{file.name}</span>
                        <span className="text-xs text-gray-500">({file.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => handleDownloadMaterial(selectedMaterial)}
                className="flex-1 btn-primary"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button
                onClick={() => handleEditMaterial(selectedMaterial)}
                className="flex-1 btn-secondary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{filteredMaterials.length}</div>
          <div className="text-sm text-gray-600">Total Materials</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredMaterials.reduce((sum, material) => sum + material.downloads, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Downloads</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredMaterials.filter(m => m.type === 'document').length}
          </div>
          <div className="text-sm text-gray-600">Documents</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredMaterials.filter(m => m.type === 'video').length}
          </div>
          <div className="text-sm text-gray-600">Videos</div>
        </div>
      </div>
    </div>
  );
};

export default LecturerMaterials;
