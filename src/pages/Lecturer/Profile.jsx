import React, { useState } from 'react';
import { 
  User, 
  Edit,
  Save,
  X,
  Camera,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const LecturerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@unity.edu',
    phone: '+1 (555) 123-4567',
    address: '456 Faculty Ave, Education City',
    dateOfBirth: '1985-03-20',
    employeeId: 'EMP2024001',
    department: 'Computer Science',
    position: 'Associate Professor',
    qualification: 'Ph.D. in Computer Science',
    specialization: 'Data Structures, Algorithms',
    experience: '8 years',
    office: 'CS-205',
    officeHours: 'Mon, Wed, Fri 2:00 PM - 4:00 PM',
    emergencyContact: 'John Johnson',
    emergencyPhone: '+1 (555) 987-6543'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Simulate API call
    setIsEditing(false);
  };

  const handlePasswordSave = () => {
    // Simulate password change
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/lecturer/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Profile</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Manage your personal information and account settings</p>
        </div>
        <div className="mt-4 sm:mt-0">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button onClick={handleSave} className="btn-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-secondary">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <User className="h-16 w-16 text-primary-600" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-gray-600 dark:text-slate-300">{formData.employeeId}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{formData.position}</p>
            
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center justify-center text-green-800 dark:text-green-300">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Active Faculty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-slate-100">{formData.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-slate-100">{formData.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-slate-100">{formData.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-slate-100">{formData.phone}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-slate-100">{formData.address}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-slate-100">{formData.dateOfBirth}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Employee ID</label>
            <p className="text-gray-900 dark:text-slate-100">{formData.employeeId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Department</label>
            <p className="text-gray-900 dark:text-slate-100">{formData.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Position</label>
            <p className="text-gray-900 dark:text-slate-100">{formData.position}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Qualification</label>
            <p className="text-gray-900 dark:text-slate-100">{formData.qualification}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Specialization</label>
            <p className="text-gray-900 dark:text-slate-100">{formData.specialization}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Experience</label>
            <p className="text-gray-900 dark:text-slate-100">{formData.experience}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Office</label>
            <p className="text-gray-900 dark:text-slate-100">{formData.office}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Office Hours</label>
            <p className="text-gray-900 dark:text-slate-100">{formData.officeHours}</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Contact Name</label>
            {isEditing ? (
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900 dark:text-slate-100">{formData.emergencyContact}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Contact Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                className="input-field"
              />
            ) : (
              <p className="text-gray-900 dark:text-slate-100">{formData.emergencyPhone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={handlePasswordSave} className="btn-primary">
            <Lock className="h-4 w-4 mr-2" />
            Change Password
          </button>
        </div>
      </div>

      {/* Teaching Statistics */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Teaching Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">4</div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Active Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">120</div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Total Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">8</div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.8</div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="card p-6 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Account Security</h3>
            <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
              <li>• Use a strong password with at least 8 characters</li>
              <li>• Include numbers, letters, and special characters</li>
              <li>• Don't share your password with anyone</li>
              <li>• Log out from shared computers</li>
              <li>• Report any suspicious activity immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerProfile;
