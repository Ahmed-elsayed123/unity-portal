import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import * as XLSX from 'xlsx';

const ExcelImport = ({ 
  onDataImport, 
  templateUrl, 
  acceptedTypes = ['.xlsx', '.xls', '.csv'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  requiredColumns = [],
  title = "Import Data from Excel"
}) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.some(type => type.includes(fileExtension))) {
      setError(`Please select a valid file type: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (selectedFile.size > maxFileSize) {
      setError(`File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return;
    }

    setFile(selectedFile);
    setError('');
    setSuccess('');
    processFile(selectedFile);
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    setError('');

    try {
      const data = await readExcelFile(file);
      const validation = validateData(data, requiredColumns);
      
      if (validation.isValid) {
        setPreviewData(data);
        setSuccess(`File processed successfully. Found ${data.length} records.`);
        setValidationErrors([]);
      } else {
        setValidationErrors(validation.errors);
        setError('Data validation failed. Please check the errors below.');
      }
    } catch (err) {
      setError(`Error processing file: ${err.message}`);
    } finally {
      setIsProcessing(false);
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
          
          // Convert to array of objects
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
            obj._rowIndex = index + 2; // Excel row number (accounting for header)
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

  const validateData = (data, requiredColumns) => {
    const errors = [];
    
    if (data.length === 0) {
      errors.push('No data found in the file');
      return { isValid: false, errors };
    }

    // Check for required columns
    if (requiredColumns.length > 0) {
      const headers = Object.keys(data[0]);
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      }
    }

    // Check for empty rows
    data.forEach((row, index) => {
      const hasData = Object.values(row).some(value => value !== '' && value !== null && value !== undefined);
      if (!hasData) {
        errors.push(`Row ${row._rowIndex} appears to be empty`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleImport = () => {
    if (previewData && validationErrors.length === 0) {
      onDataImport(previewData);
      setSuccess('Data imported successfully!');
      setFile(null);
      setPreviewData(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewData(null);
    setError('');
    setSuccess('');
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    if (templateUrl) {
      const link = document.createElement('a');
      link.href = templateUrl;
      link.download = 'template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {templateUrl && (
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <Download className="h-4 w-4" />
            <span>Download Template</span>
          </button>
        )}
      </div>

      {/* File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          id="excel-import"
        />
        <label
          htmlFor="excel-import"
          className="cursor-pointer flex flex-col items-center space-y-4"
        >
          <FileSpreadsheet className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {file ? file.name : 'Click to select Excel file'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supported formats: {acceptedTypes.join(', ')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Max file size: {Math.round(maxFileSize / 1024 / 1024)}MB
            </p>
          </div>
        </label>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          <span>Processing file...</span>
        </div>
      )}

      {/* Error Messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Success Messages */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-800 dark:text-green-200">{success}</span>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">Validation Errors:</p>
              <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Data Preview */}
      {previewData && validationErrors.length === 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            Data Preview ({previewData.length} records)
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {Object.keys(previewData[0] || {}).filter(key => key !== '_rowIndex').map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {previewData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {Object.entries(row)
                      .filter(([key]) => key !== '_rowIndex')
                      .map(([key, value], cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
                        >
                          {value}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 5 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                Showing first 5 rows of {previewData.length} total records
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {file && (
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleImport}
            disabled={validationErrors.length > 0 || isProcessing}
            className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import Data</span>
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExcelImport;
