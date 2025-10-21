import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Banknote,
  Calculator,
  Download,
  Upload,
  Plus,
  Edit,
  Eye,
  Search,
  Filter,
  Calendar,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AdminFinance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  const financialStats = [
    { title: 'Total Revenue', value: '$2,450,000', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-green-600' },
    { title: 'Tuition Fees', value: '$1,890,000', change: '+8.3%', trend: 'up', icon: CreditCard, color: 'text-blue-600' },
    { title: 'Other Income', value: '$560,000', change: '+15.2%', trend: 'up', icon: Banknote, color: 'text-purple-600' },
    { title: 'Outstanding', value: '$125,000', change: '-5.1%', trend: 'down', icon: AlertCircle, color: 'text-red-600' }
  ];

  const recentTransactions = [
    {
      id: 1,
      student: 'John Smith',
      studentId: 'STU2024001',
      amount: 5000,
      type: 'Tuition Fee',
      status: 'Paid',
      date: '2024-03-10',
      method: 'Credit Card'
    },
    {
      id: 2,
      student: 'Sarah Johnson',
      studentId: 'STU2024002',
      amount: 200,
      type: 'Registration Fee',
      status: 'Paid',
      date: '2024-03-09',
      method: 'Bank Transfer'
    },
    {
      id: 3,
      student: 'Michael Chen',
      studentId: 'STU2024003',
      amount: 5000,
      type: 'Tuition Fee',
      status: 'Pending',
      date: '2024-03-08',
      method: 'Credit Card'
    },
    {
      id: 4,
      student: 'Emily Rodriguez',
      studentId: 'STU2024004',
      amount: 150,
      type: 'Library Fee',
      status: 'Paid',
      date: '2024-03-07',
      method: 'Credit Card'
    }
  ];

  const feeStructure = [
    {
      id: 1,
      name: 'Tuition Fee',
      amount: 5000,
      semester: 'Spring 2024',
      students: 1250,
      total: 6250000,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Registration Fee',
      amount: 200,
      semester: 'Spring 2024',
      students: 1250,
      total: 250000,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Library Fee',
      amount: 150,
      semester: 'Spring 2024',
      students: 1250,
      total: 187500,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Lab Fee',
      amount: 300,
      semester: 'Spring 2024',
      students: 800,
      total: 240000,
      status: 'Active'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <AlertCircle className="h-4 w-4" />;
      case 'Overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
          <p className="text-gray-600 mt-2">Manage financial operations and fee collection</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Fee
          </button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(stat.trend)}
                    <span className={`text-sm ml-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="card p-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: DollarSign },
              { id: 'transactions', name: 'Transactions', icon: CreditCard },
              { id: 'fees', name: 'Fee Structure', icon: Calculator },
              { id: 'reports', name: 'Reports', icon: Download }
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

      {/* Search and Filters */}
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
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field"
            >
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
              <option value="last-year">Last Year</option>
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

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tuition Fees</span>
                <span className="text-sm font-medium text-gray-900">$1,890,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Registration Fees</span>
                <span className="text-sm font-medium text-gray-900">$250,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Library Fees</span>
                <span className="text-sm font-medium text-gray-900">$187,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lab Fees</span>
                <span className="text-sm font-medium text-gray-900">$240,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Other Income</span>
                <span className="text-sm font-medium text-gray-900">$560,000</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Credit Card</span>
                <span className="text-sm font-medium text-gray-900">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bank Transfer</span>
                <span className="text-sm font-medium text-gray-900">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cash</span>
                <span className="text-sm font-medium text-gray-900">10%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.student}</div>
                        <div className="text-sm text-gray-500">{transaction.studentId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${transaction.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{transaction.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="space-y-4">
          {feeStructure.map((fee) => (
            <div key={fee.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{fee.name}</h3>
                  <p className="text-gray-600">{fee.semester} • {fee.students} students</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}>
                  {fee.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">${fee.amount}</div>
                  <div className="text-sm text-gray-600">Per Student</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{fee.students}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">${fee.total.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </button>
                <button className="flex-1 btn-secondary text-sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
              <DollarSign className="h-6 w-6 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900">Revenue Report</h4>
              <p className="text-sm text-gray-600">Generate revenue analysis</p>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <Users className="h-6 w-6 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-900">Student Payments</h4>
              <p className="text-sm text-gray-600">View student payment history</p>
            </button>
            <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
              <AlertCircle className="h-6 w-6 text-yellow-600 mb-2" />
              <h4 className="font-medium text-gray-900">Outstanding Fees</h4>
              <p className="text-sm text-gray-600">Track unpaid fees</p>
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
            <Plus className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add Fee Structure</h4>
            <p className="text-sm text-gray-600">Create new fee categories</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <CreditCard className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Process Payment</h4>
            <p className="text-sm text-gray-600">Record manual payments</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
            <AlertCircle className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Send Reminders</h4>
            <p className="text-sm text-gray-600">Notify about overdue fees</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <Download className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export Data</h4>
            <p className="text-sm text-gray-600">Download financial reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFinance;
