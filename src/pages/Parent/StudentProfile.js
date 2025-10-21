import React from 'react';
import { 
  User, 
  BookOpen, 
  Award, 
  Calendar, 
  Phone, 
  Mail,
  MapPin,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const ParentStudentProfile = () => {
  const studentInfo = {
    name: 'John Smith',
    studentId: 'STU2024001',
    email: 'john.smith@unity.edu',
    phone: '+1 (555) 123-4567',
    address: '123 University Ave, Education City',
    dateOfBirth: '2000-05-15',
    program: 'Computer Science',
    year: 'Junior',
    gpa: 3.75,
    credits: 90,
    advisor: 'Dr. Sarah Johnson',
    emergencyContact: 'Jane Smith',
    emergencyPhone: '+1 (555) 987-6543',
    status: 'Active',
    joinDate: '2022-09-01'
  };

  const academicProgress = [
    { semester: 'Fall 2023', gpa: 3.65, credits: 15, status: 'Completed' },
    { semester: 'Spring 2023', gpa: 3.70, credits: 15, status: 'Completed' },
    { semester: 'Fall 2022', gpa: 3.80, credits: 15, status: 'Completed' },
    { semester: 'Spring 2022', gpa: 3.60, credits: 15, status: 'Completed' }
  ];

  const currentCourses = [
    { code: 'CS-201', name: 'Data Structures', credits: 3, grade: 'A-', instructor: 'Dr. Sarah Johnson' },
    { code: 'MATH-205', name: 'Calculus II', credits: 4, grade: 'B+', instructor: 'Prof. Michael Chen' },
    { code: 'PHY-301', name: 'Physics Lab', credits: 2, grade: 'A', instructor: 'Dr. Emily Rodriguez' },
    { code: 'ENG-101', name: 'Technical Writing', credits: 3, grade: 'A-', instructor: 'Prof. David Wilson' }
  ];

  const achievements = [
    { title: 'Dean\'s List', semester: 'Fall 2023', description: 'GPA above 3.5' },
    { title: 'Academic Excellence', semester: 'Spring 2023', description: 'Top 10% of class' },
    { title: 'Perfect Attendance', semester: 'Fall 2022', description: '100% attendance rate' }
  ];

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600 mt-2">View your child's academic information and progress</p>
      </div>

      {/* Student Basic Info */}
      <div className="card p-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-primary-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{studentInfo.name}</h2>
                <p className="text-gray-600">{studentInfo.studentId} • {studentInfo.program}</p>
                <p className="text-sm text-gray-500">{studentInfo.year} • {studentInfo.credits} credits</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{studentInfo.gpa}</div>
                <div className="text-sm text-gray-600">Current GPA</div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(studentInfo.status)}`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {studentInfo.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{studentInfo.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{studentInfo.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{studentInfo.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">DOB: {studentInfo.dateOfBirth}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">Program: {studentInfo.program}</span>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">Year: {studentInfo.year}</span>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">Advisor: {studentInfo.advisor}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">Joined: {studentInfo.joinDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <p className="text-gray-900">{studentInfo.emergencyContact}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <p className="text-gray-900">{studentInfo.emergencyPhone}</p>
          </div>
        </div>
      </div>

      {/* Academic Progress */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Progress</h3>
        <div className="space-y-4">
          {academicProgress.map((semester, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{semester.semester}</h4>
                <p className="text-sm text-gray-600">{semester.credits} credits</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{semester.gpa}</div>
                <div className="text-sm text-gray-600">GPA</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Courses */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Courses</h3>
        <div className="space-y-4">
          {currentCourses.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{course.name}</h4>
                <p className="text-sm text-gray-600">{course.code} • {course.instructor}</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getGradeColor(course.grade)}`}>
                  {course.grade}
                </div>
                <div className="text-sm text-gray-600">{course.credits} credits</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
              <Award className="h-8 w-8 text-yellow-600" />
              <div>
                <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500">{achievement.semester}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{studentInfo.gpa}</div>
          <div className="text-sm text-gray-600">Current GPA</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{studentInfo.credits}</div>
          <div className="text-sm text-gray-600">Credits Earned</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
          <div className="text-sm text-gray-600">Current Courses</div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">GPA Trend</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">GPA trend chart would be displayed here</p>
            <p className="text-sm text-gray-500">Showing improvement over time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentStudentProfile;
