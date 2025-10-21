// Production-ready data service for managing application data
class DataService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  async register(userData) {
    return await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Student methods
  async getStudentDashboard() {
    return await this.request('/student/dashboard');
  }

  async getStudentCourses() {
    return await this.request('/student/courses');
  }

  async getStudentGrades() {
    return await this.request('/student/grades');
  }

  async getStudentAttendance() {
    return await this.request('/student/attendance');
  }

  async getStudentTimetable() {
    return await this.request('/student/timetable');
  }

  async getStudentFees() {
    return await this.request('/student/fees');
  }

  async getStudentExams() {
    return await this.request('/student/exams');
  }

  async updateStudentProfile(profileData) {
    return await this.request('/student/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Lecturer methods
  async getLecturerDashboard() {
    return await this.request('/lecturer/dashboard');
  }

  async getLecturerCourses() {
    return await this.request('/lecturer/courses');
  }

  async getLecturerStudents(courseId) {
    return await this.request(`/lecturer/courses/${courseId}/students`);
  }

  async updateStudentGrade(gradeData) {
    return await this.request('/lecturer/grades', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
  }

  async markAttendance(attendanceData) {
    return await this.request('/lecturer/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Admin methods
  async getAdminDashboard() {
    return await this.request('/admin/dashboard');
  }

  async getUsers() {
    return await this.request('/admin/users');
  }

  async createUser(userData) {
    return await this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return await this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return await this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getAcademicPrograms() {
    return await this.request('/admin/academics/programs');
  }

  async getFinancialReports() {
    return await this.request('/admin/finance/reports');
  }

  async getSystemReports() {
    return await this.request('/admin/reports');
  }

  // Parent methods
  async getParentDashboard() {
    return await this.request('/parent/dashboard');
  }

  async getStudentProgress(studentId) {
    return await this.request(`/parent/students/${studentId}/progress`);
  }

  async getParentEvents() {
    return await this.request('/parent/events');
  }

  async getParentResources() {
    return await this.request('/parent/resources');
  }

  // File upload method
  async uploadFile(file, endpoint) {
    const formData = new FormData();
    formData.append('file', file);

    return await this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }

  // Export data method
  async exportData(endpoint, format = 'csv') {
    const response = await fetch(`${this.baseUrl}${endpoint}?format=${format}`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    return response.blob();
  }
}

// Create and export singleton instance
const dataService = new DataService();
export default dataService;
