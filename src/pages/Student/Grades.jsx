import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  Calculator,
  Search,
  FileText
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';

const StudentGrades = () => {
  const [selectedSemester, setSelectedSemester] = useState('Spring 2024');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleDownloadTranscript = () => {
    setIsLoading(true);
    showNotification('Downloading transcript...', 'info');
    setTimeout(() => {
      showNotification('Transcript downloaded successfully', 'success');
      setIsLoading(false);
    }, 2000);
  };

  const handleExportGrades = () => {
    setIsLoading(true);
    showNotification('Exporting grades...', 'info');
    setTimeout(() => {
      showNotification('Grades exported successfully', 'success');
      setIsLoading(false);
    }, 1500);
  };


  const semesters = ['Spring 2024', 'Fall 2023', 'Summer 2023', 'Spring 2023'];

  const grades = [
    {
      course: 'Data Structures and Algorithms',
      code: 'CS-201',
      credits: 3,
      semester: 'Spring 2024',
      assignments: [
        { name: 'Assignment 1', points: '95/100', grade: 'A', weight: 15 },
        { name: 'Assignment 2', points: '88/100', grade: 'B+', weight: 15 },
        { name: 'Midterm Exam', points: '92/100', grade: 'A-', weight: 30 },
        { name: 'Assignment 3', points: '90/100', grade: 'A-', weight: 15 },
        { name: 'Final Exam', points: '89/100', grade: 'B+', weight: 25 }
      ],
      finalGrade: 'A-',
      gpa: 3.7,
      instructor: 'Dr. Sarah Johnson'
    },
    {
      course: 'Calculus II',
      code: 'MATH-205',
      credits: 4,
      semester: 'Spring 2024',
      assignments: [
        { name: 'Quiz 1', points: '85/100', grade: 'B', weight: 10 },
        { name: 'Quiz 2', points: '87/100', grade: 'B+', weight: 10 },
        { name: 'Midterm Exam', points: '82/100', grade: 'B-', weight: 30 },
        { name: 'Quiz 3', points: '90/100', grade: 'A-', weight: 10 },
        { name: 'Final Exam', points: '88/100', grade: 'B+', weight: 40 }
      ],
      finalGrade: 'B+',
      gpa: 3.3,
      instructor: 'Prof. Michael Chen'
    },
    {
      course: 'Physics Laboratory',
      code: 'PHY-301',
      credits: 2,
      semester: 'Spring 2024',
      assignments: [
        { name: 'Lab Report 1', points: '95/100', grade: 'A', weight: 20 },
        { name: 'Lab Report 2', points: '92/100', grade: 'A-', weight: 20 },
        { name: 'Lab Report 3', points: '98/100', grade: 'A+', weight: 20 },
        { name: 'Lab Report 4', points: '94/100', grade: 'A', weight: 20 },
        { name: 'Final Project', points: '96/100', grade: 'A', weight: 20 }
      ],
      finalGrade: 'A',
      gpa: 4.0,
      instructor: 'Dr. Emily Rodriguez'
    },
    {
      course: 'Technical Writing',
      code: 'ENG-101',
      credits: 3,
      semester: 'Spring 2024',
      assignments: [
        { name: 'Essay 1', points: '88/100', grade: 'B+', weight: 25 },
        { name: 'Research Paper', points: '92/100', grade: 'A-', weight: 35 },
        { name: 'Presentation', points: '90/100', grade: 'A-', weight: 20 },
        { name: 'Final Portfolio', points: '94/100', grade: 'A', weight: 20 }
      ],
      finalGrade: 'A-',
      gpa: 3.7,
      instructor: 'Prof. David Wilson'
    }
  ];

  const filteredGrades = grades.filter(grade => 
    grade.semester === selectedSemester &&
    (grade.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
     grade.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getGradeColor = (grade) => {
    if (grade.startsWith('A+')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B+')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('B-')) return 'text-yellow-600 bg-yellow-100';
    if (grade.startsWith('C+')) return 'text-yellow-600 bg-yellow-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const calculateSemesterGPA = () => {
    const totalPoints = filteredGrades.reduce((sum, grade) => sum + (grade.gpa * grade.credits), 0);
    const totalCredits = filteredGrades.reduce((sum, grade) => sum + grade.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const calculateOverallGPA = () => {
    // Mock overall GPA calculation
    return '3.65';
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/student/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Grades & Transcript</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">View your academic performance and download transcripts</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => showNotification('GPA Calculator opened', 'info')}
            className="btn-secondary"
          >
            <Calculator className="h-4 w-4 mr-2" />
            GPA Calculator
          </button>
          <button 
            onClick={handleDownloadTranscript}
            disabled={isLoading}
            className="btn-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Transcript
          </button>
          <button 
            onClick={handleExportGrades}
            disabled={isLoading}
            className="btn-secondary"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Grades
          </button>
        </div>
      </div>

      {/* GPA Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{calculateSemesterGPA()}</div>
          <div className="text-sm text-gray-600 dark:text-slate-300">Semester GPA</div>
          <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">{selectedSemester}</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{calculateOverallGPA()}</div>
          <div className="text-sm text-gray-600 dark:text-slate-300">Overall GPA</div>
          <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">Cumulative</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {filteredGrades.reduce((sum, grade) => sum + grade.credits, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-slate-300">Credits Earned</div>
          <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">This Semester</div>
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
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="input-field"
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grades List */}
      <div className="space-y-6">
        {filteredGrades.map((course, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{course.course}</h3>
                <p className="text-gray-600 dark:text-slate-300">{course.code} • {course.credits} credits • {course.instructor}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.finalGrade)}`}>
                  {course.finalGrade}
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">GPA: {course.gpa}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {course.assignments.map((assignment, assignmentIndex) => (
                    <tr key={assignmentIndex} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{assignment.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assignment.points}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(assignment.grade)}`}>
                          {assignment.grade}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assignment.weight}%</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Distribution */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredGrades.filter(grade => grade.finalGrade.startsWith('A')).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">A Grades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredGrades.filter(grade => grade.finalGrade.startsWith('B')).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">B Grades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredGrades.filter(grade => grade.finalGrade.startsWith('C')).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">C Grades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {filteredGrades.filter(grade => grade.finalGrade.startsWith('D') || grade.finalGrade.startsWith('F')).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">D/F Grades</div>
          </div>
        </div>
      </div>

      {/* Academic Standing */}
      <div className="card p-6 bg-green-50 border-green-200">
        <div className="flex items-center">
          <Award className="h-6 w-6 text-green-600 mr-3" />
          <div>
            <h3 className="font-semibold text-green-800">Good Academic Standing</h3>
            <p className="text-green-700 text-sm mt-1">
              You are maintaining good academic standing with a GPA above 3.0. Keep up the excellent work!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;
