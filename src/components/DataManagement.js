import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, Users, BookOpen, Award, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const DataManagement = ({ userRole, onDataImport, onDataExport }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importType, setImportType] = useState('students');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getImportOptions = () => {
    switch (userRole) {
      case 'student':
        return [
          { id: 'grades', label: 'Grades', icon: Award, description: 'Import grade data' }
        ];
      case 'lecturer':
        return [
          { id: 'students', label: 'Students', icon: Users, description: 'Import student data' },
          { id: 'grades', label: 'Grades', icon: Award, description: 'Import grade data' }
        ];
      case 'admin':
        return [
          { id: 'students', label: 'Students', icon: Users, description: 'Import student data' },
          { id: 'courses', label: 'Courses', icon: BookOpen, description: 'Import course data' },
          { id: 'grades', label: 'Grades', icon: Award, description: 'Import grade data' }
        ];
      case 'parent':
        return [
          { id: 'progress', label: 'Progress', icon: Award, description: 'Import progress data' }
        ];
      default:
        return [];
    }
  };

  const getExportOptions = () => {
    switch (userRole) {
      case 'student':
        return [
          { id: 'grades', label: 'Export Grades', icon: Award },
          { id: 'attendance', label: 'Export Attendance', icon: Users },
          { id: 'schedule', label: 'Export Schedule', icon: BookOpen }
        ];
      case 'lecturer':
        return [
          { id: 'students', label: 'Export Students', icon: Users },
          { id: 'grades', label: 'Export Grades', icon: Award },
          { id: 'attendance', label: 'Export Attendance', icon: Users }
        ];
      case 'admin':
        return [
          { id: 'students', label: 'Export Students', icon: Users },
          { id: 'courses', label: 'Export Courses', icon: BookOpen },
          { id: 'grades', label: 'Export Grades', icon: Award },
          { id: 'reports', label: 'Export Reports', icon: FileSpreadsheet }
        ];
      case 'parent':
        return [
          { id: 'progress', label: 'Export Progress', icon: Award },
          { id: 'attendance', label: 'Export Attendance', icon: Users }
        ];
      default:
        return [];
    }
  };

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setError('');
    setSuccess('');

    try {
      const data = await readExcelFile(file);
      if (onDataImport) {
        onDataImport(data, importType);
        setSuccess(`Successfully imported ${data.length} records`);
      }
    } catch (err) {
      setError(`Import failed: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            reject(new Error('File must contain at least a header row and one data row'));
            return;
          }
          
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          const result = rows.map((row, index) => {
            const obj = {};
            headers.forEach((header, colIndex) => {
              obj[header] = row[colIndex] || '';
            });
            return obj;
          });
          
          resolve(result);
        } catch (error) {
          reject(new Error('Invalid file format'));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsBinaryString(file);
    });
  };

  const handleExport = async (exportType) => {
    setIsExporting(true);
    setError('');
    setSuccess('');

    try {
      if (onDataExport) {
        const data = await onDataExport(exportType);
        exportToExcel(data, exportType);
        setSuccess(`Successfully exported ${exportType} data`);
      }
    } catch (err) {
      setError(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}_export.xlsx`);
  };

  const downloadTemplate = () => {
    const templates = {
      students: [
        ['Student ID', 'Name', 'Email', 'Program', 'Year'],
        ['STU001', 'John Doe', 'john@example.com', 'Computer Science', 'Junior']
      ],
      courses: [
        ['Course Code', 'Course Name', 'Credits', 'Instructor'],
        ['CS-201', 'Data Structures', '3', 'Dr. Smith']
      ],
      grades: [
        ['Student ID', 'Course Code', 'Grade', 'Points'],
        ['STU001', 'CS-201', 'A', '95']
      ]
    };

    const data = templates[importType] || templates.students;
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${importType}_template.xlsx`);
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Data Management
      </h3>

      {/* Import Section */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Import Data
        </h4>
        
        {/* Import Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {getImportOptions().map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setImportType(option.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  importType === option.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900 dark:text-white">{option.label}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* File Upload */}
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileImport}
            className="hidden"
            id="file-import"
            disabled={isImporting}
          />
          <label
            htmlFor="file-import"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer transition-colors ${
              isImporting 
                ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Upload className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isImporting ? 'Importing...' : 'Select File'}
            </span>
          </label>

          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Template</span>
          </button>
        </div>
      </div>

      {/* Export Section */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Export Data
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getExportOptions().map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => handleExport(option.id)}
                disabled={isExporting}
                className={`flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors ${
                  isExporting 
                    ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <div className="text-left">
                  <h5 className="font-medium text-gray-900 dark:text-white">{option.label}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isExporting ? 'Exporting...' : 'Download as Excel'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-800 dark:text-green-200">{success}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;
