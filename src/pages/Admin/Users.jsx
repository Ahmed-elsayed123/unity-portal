import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'student',
    status: 'active',
    studentId: '',
    phone: '',
    department: '',
    program: ''
  });

  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'student', name: 'Student' },
    { id: 'lecturer', name: 'Lecturer' },
    { id: 'admin', name: 'Admin' },
  ];

  const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
    { id: 'pending', name: 'Pending' }
  ];

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@unity.edu',
      role: 'student',
      status: 'active',
      studentId: 'STU2024001',
      department: 'Computer Science',
      joinDate: '2024-01-15',
      lastLogin: '2024-03-10',
      phone: '+1 (555) 123-4567',
      avatar: null
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@unity.edu',
      role: 'lecturer',
      status: 'active',
      employeeId: 'EMP2024001',
      department: 'Computer Science',
      joinDate: '2020-08-20',
      lastLogin: '2024-03-10',
      phone: '+1 (555) 234-5678',
      avatar: null
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@unity.edu',
      role: 'student',
      status: 'inactive',
      studentId: 'STU2024003',
      department: 'Mathematics',
      joinDate: '2024-01-15',
      lastLogin: '2024-02-28',
      phone: '+1 (555) 345-6789',
      avatar: null
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@unity.edu',
      role: 'student',
      status: 'active',
      studentId: 'STU2024004',
      department: 'Physics',
      joinDate: '2024-01-15',
      lastLogin: '2024-03-09',
      phone: '+1 (555) 456-7890',
      avatar: null
    },
    {
      id: 5,
      name: 'Prof. David Wilson',
      email: 'david.wilson@unity.edu',
      role: 'lecturer',
      status: 'active',
      employeeId: 'EMP2024002',
      department: 'English',
      joinDate: '2019-09-01',
      lastLogin: '2024-03-10',
      phone: '+1 (555) 567-8901',
      avatar: null
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      studentId: user.studentId || '',
      phone: user.phone || '',
      department: user.department || '',
      program: user.program || ''
    });
    setShowEditModal(true);
  };

  const handleAddUser = () => {
    setUserForm({
      name: '',
      email: '',
      role: 'student',
      status: 'active',
      studentId: '',
      phone: '',
      department: '',
      program: ''
    });
    setShowAddModal(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    
    // In a real app, this would save to the database
    console.log('Saving user:', editingUser ? 'edit' : 'add', userForm);
    
    // Simulate success
    const action = editingUser ? 'updated' : 'created';
    alert(`User ${action} successfully!`);
    
    if (editingUser) {
      setShowEditModal(false);
      setEditingUser(null);
    } else {
      setShowAddModal(false);
    }
    
    setUserForm({
      name: '',
      email: '',
      role: 'student',
      status: 'active',
      studentId: '',
      phone: '',
      department: '',
      program: ''
    });
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      // In a real app, this would delete from the database
      console.log('Deleting user:', user.id);
      alert(`${user.name} has been deleted successfully!`);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return 'text-blue-600 bg-blue-100';
      case 'lecturer': return 'text-green-600 bg-green-100';
      case 'admin': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/admin/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">User Management</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Manage all system users and their permissions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import Users
          </button>
          <button 
            onClick={handleAddUser}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{userStats.total}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{userStats.inactive}</div>
          <div className="text-sm text-gray-600">Inactive</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{userStats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input-field"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              {statuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Users Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)}
                    <span className="ml-1">{user.status}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2" />
                  {user.studentId || user.employeeId || user.parentId}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined: {user.joinDate}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {user.phone}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Last login: {user.lastLogin}
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="flex-1 btn-secondary text-sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.lastLogin}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewUser(user)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                        title="View User"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
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

      {/* Role Distribution */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution by Role</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'student').length}
            </div>
            <div className="text-sm text-gray-600">Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.role === 'lecturer').length}
            </div>
            <div className="text-sm text-gray-600">Lecturers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={handleAddUser}
            className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left"
          >
            <Plus className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add New User</h4>
            <p className="text-sm text-gray-600">Create a new user account</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <Upload className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Bulk Import</h4>
            <p className="text-sm text-gray-600">Import users from CSV</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
            <Shield className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Permissions</h4>
            <p className="text-sm text-gray-600">Set user access levels</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <Download className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export Users</h4>
            <p className="text-sm text-gray-600">Download user data</p>
          </button>
        </div>
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Details - {selectedUser.name}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white">{selectedUser.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedUser.email}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Student ID</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedUser.studentId || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Phone</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Department</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedUser.department || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Program</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedUser.program || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Last Login</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedUser.lastLogin}</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditUser(selectedUser);
                }}
                className="flex-1 btn-primary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit User
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

      {/* Edit/Add User Modal */}
      {(showEditModal || showAddModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {showAddModal ? 'Add New User' : 'Edit User'}
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
            
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              {userForm.role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={userForm.studentId}
                      onChange={(e) => setUserForm(prev => ({ ...prev, studentId: e.target.value }))}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Program
                    </label>
                    <input
                      type="text"
                      value={userForm.program}
                      onChange={(e) => setUserForm(prev => ({ ...prev, program: e.target.value }))}
                      className="input-field w-full"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={userForm.department}
                  onChange={(e) => setUserForm(prev => ({ ...prev, department: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
              
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
                  {showAddModal ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
