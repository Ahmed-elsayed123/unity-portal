import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  BookOpen,
  DollarSign,
  Filter,
  Search,
  Eye,
  FileText,
  Database,
  Clock
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState('student-enrollment');
  const [selectedPeriod, setSelectedPeriod] = useState('this-year');
  const [searchTerm, setSearchTerm] = useState('');

  const reportTypes = [
    {
      id: 'student-enrollment',
      name: 'Student Enrollment',
      description: 'Track student enrollment trends and statistics',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'academic-performance',
      name: 'Academic Performance',
      description: 'Analyze student grades and academic progress',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'financial-reports',
      name: 'Financial Reports',
      description: 'Revenue, fees, and financial analytics',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 'attendance-reports',
      name: 'Attendance Reports',
      description: 'Student attendance patterns and statistics',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const reportData = {
    'student-enrollment': {
      title: 'Student Enrollment Report',
      period: '2024',
      summary: {
        totalStudents: 15247,
        newEnrollments: 3245,
        graduations: 2890,
        retentionRate: 94.2
      },
      charts: [
        {
          type: 'bar',
          title: 'Enrollment by Department',
          data: [
            { name: 'Computer Science', value: 3250, color: '#3B82F6' },
            { name: 'Mathematics', value: 2890, color: '#10B981' },
            { name: 'Physics', value: 2150, color: '#F59E0B' },
            { name: 'English', value: 1890, color: '#8B5CF6' },
            { name: 'Business', value: 1650, color: '#EF4444' }
          ]
        },
        {
          type: 'line',
          title: 'Enrollment Trends',
          data: [
            { month: 'Jan', value: 1200 },
            { month: 'Feb', value: 1350 },
            { month: 'Mar', value: 1500 },
            { month: 'Apr', value: 1400 },
            { month: 'May', value: 1600 },
            { month: 'Jun', value: 1800 }
          ]
        }
      ]
    },
    'academic-performance': {
      title: 'Academic Performance Report',
      period: 'Spring 2024',
      summary: {
        averageGPA: 3.45,
        passRate: 89.2,
        honorStudents: 1250,
        atRiskStudents: 89
      },
      charts: [
        {
          type: 'pie',
          title: 'Grade Distribution',
          data: [
            { name: 'A Grades', value: 35, color: '#10B981' },
            { name: 'B Grades', value: 40, color: '#3B82F6' },
            { name: 'C Grades', value: 20, color: '#F59E0B' },
            { name: 'D/F Grades', value: 5, color: '#EF4444' }
          ]
        }
      ]
    },
    'financial-reports': {
      title: 'Financial Reports',
      period: '2024',
      summary: {
        totalRevenue: 2450000,
        tuitionFees: 1890000,
        otherIncome: 560000,
        outstandingFees: 125000
      },
      charts: [
        {
          type: 'bar',
          title: 'Revenue by Source',
          data: [
            { name: 'Tuition Fees', value: 1890000, color: '#3B82F6' },
            { name: 'Registration Fees', value: 250000, color: '#10B981' },
            { name: 'Library Fees', value: 187500, color: '#F59E0B' },
            { name: 'Lab Fees', value: 240000, color: '#8B5CF6' }
          ]
        }
      ]
    },
    'attendance-reports': {
      title: 'Attendance Reports',
      period: 'Spring 2024',
      summary: {
        averageAttendance: 87.5,
        totalClasses: 1250,
        presentStudents: 1094,
        absentStudents: 156
      },
      charts: [
        {
          type: 'line',
          title: 'Attendance Trends',
          data: [
            { week: 'Week 1', value: 92 },
            { week: 'Week 2', value: 89 },
            { week: 'Week 3', value: 85 },
            { week: 'Week 4', value: 88 },
            { week: 'Week 5', value: 87 },
            { week: 'Week 6', value: 86 }
          ]
        }
      ]
    }
  };

  const currentReport = reportData[selectedReport];

  const getReportIcon = (reportId) => {
    const report = reportTypes.find(r => r.id === reportId);
    return report ? report.icon : FileText;
  };

  const getReportColor = (reportId) => {
    const report = reportTypes.find(r => r.id === reportId);
    return report ? report.color : 'text-gray-600';
  };

  const getReportBgColor = (reportId) => {
    const report = reportTypes.find(r => r.id === reportId);
    return report ? report.bgColor : 'bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/admin/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Generate and analyze system reports</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </button>
          <button className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-lg text-left transition-colors ${
                selectedReport === report.id
                  ? 'bg-primary-50 border-2 border-primary-200'
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${report.bgColor}`}>
                <Icon className={`h-6 w-6 ${report.color}`} />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{report.name}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
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
              <option value="this-year">This Year</option>
              <option value="last-year">Last Year</option>
              <option value="this-semester">This Semester</option>
              <option value="last-semester">Last Semester</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="btn-primary">
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{currentReport.title}</h2>
            <p className="text-gray-600">Period: {currentReport.period}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button className="btn-primary">
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(currentReport.summary).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {typeof value === 'number' && value > 1000 
                  ? value.toLocaleString() 
                  : typeof value === 'number' 
                    ? value.toFixed(1) 
                    : value}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {currentReport.charts.map((chart, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{chart.title}</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Chart visualization would go here</p>
                  <p className="text-sm text-gray-500">Data: {JSON.stringify(chart.data.slice(0, 2))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
            <BarChart3 className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">Generate Report</h4>
            <p className="text-sm text-gray-600">Create custom report</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <Calendar className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Schedule Report</h4>
            <p className="text-sm text-gray-600">Set up automated reports</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
            <Database className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Data Export</h4>
            <p className="text-sm text-gray-600">Export raw data</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <FileText className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Report Templates</h4>
            <p className="text-sm text-gray-600">Manage report templates</p>
          </button>
        </div>
      </div>

      {/* Report History */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            { name: 'Student Enrollment Report - 2024', date: '2024-03-10', type: 'PDF', size: '2.4 MB' },
            { name: 'Financial Summary - Q1 2024', date: '2024-03-08', type: 'Excel', size: '1.8 MB' },
            { name: 'Attendance Report - Spring 2024', date: '2024-03-05', type: 'PDF', size: '3.2 MB' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-600">{report.date} • {report.type} • {report.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-primary-600 hover:text-primary-700">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-700">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
