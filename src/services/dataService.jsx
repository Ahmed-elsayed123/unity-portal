// Production-ready data service for managing application data
// Updated to work with Unity Portal backend API
class DataService {
  constructor() {
    // Use import.meta.env for Vite or fallback to mock mode
    this.baseUrl = import.meta.env?.VITE_API_URL || 'mock';
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
    // If in mock mode, return mock data
    if (this.baseUrl === 'mock') {
      return this.getMockData(endpoint, options);
    }

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

  // Mock data method
  getMockData(endpoint, options = {}) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return appropriate mock data based on endpoint
        if (endpoint.includes('/auth/login')) {
          resolve({
            token: 'mock_token_' + Date.now(),
            user: {
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'student@unity.edu',
              role: 'student'
            }
          });
        } else if (endpoint.includes('/auth/register')) {
          resolve({
            token: 'mock_token_' + Date.now(),
            user: {
              id: 2,
              firstName: options.body ? JSON.parse(options.body).firstName : 'New',
              lastName: options.body ? JSON.parse(options.body).lastName : 'User',
              email: options.body ? JSON.parse(options.body).email : 'new@unity.edu',
              role: options.body ? JSON.parse(options.body).role : 'student'
            }
          });
        } else {
          resolve({ message: 'Mock data response' });
        }
      }, 500);
    });
  }

  // Authentication methods - Updated for database schema
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
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
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'student',
        studentId: userData.studentId,
        lecturerId: userData.lecturerId,
        department: userData.department
      }),
    });
  }

  // Student methods - Updated for backend API
  async getStudentDashboard(userId) {
    return await this.request(`/students/dashboard/${userId}`);
  }

  async getStudentCourses(userId) {
    return await this.request(`/students/courses/${userId}`);
  }

  async getStudentAssignments(userId) {
    return await this.request(`/students/assignments/${userId}`);
  }

  async submitAssignment(assignmentId, content, attachments) {
    return await this.request('/assignments/submit', {
      method: 'POST',
      body: JSON.stringify({
        assignmentId,
        content,
        attachments
      }),
    });
  }

  async getStudentGrades(userId) {
    return await this.request(`/students/grades/${userId}`);
  }

  async getStudentAttendance(userId) {
    return await this.request(`/students/attendance/${userId}`);
  }

  async getStudentFees(userId) {
    return await this.request(`/students/fees/${userId}`);
  }

  async getStudentExams(userId) {
    return await this.request(`/exams/student/${userId}/upcoming`);
  }

  async updateStudentProfile(userId, profileData) {
    return await this.request(`/students/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getStudentProfile(userId) {
    return await this.request(`/students/profile/${userId}`);
  }

  // Get student data with user info
  async getStudentData(studentId) {
    return await this.request(`/students/${studentId}`);
  }

  // Get student's program information
  async getStudentProgram(studentId) {
    return await this.request(`/students/${studentId}/program`);
  }

  // Get student's current semester and GPA
  async getStudentAcademicInfo(studentId) {
    return await this.request(`/students/${studentId}/academic`);
  }

  // Lecturer methods - Updated for backend API
  async getLecturerDashboard(userId) {
    return await this.request(`/lecturers/dashboard/${userId}`);
  }

  async getLecturerCourses(userId) {
    return await this.request(`/lecturers/courses/${userId}`);
  }

  async getLecturerStudents(userId) {
    return await this.request(`/lecturers/students/${userId}`);
  }

  async createAssignment(assignmentData) {
    return await this.request('/lecturers/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async gradeAssignment(submissionId, grade, feedback) {
    return await this.request('/lecturers/assignments/grade', {
      method: 'POST',
      body: JSON.stringify({
        submissionId,
        grade,
        feedback
      }),
    });
  }

  async getSubmissions(userId) {
    return await this.request(`/lecturers/submissions/${userId}`);
  }

  async markAttendance(attendanceData) {
    return await this.request('/lecturers/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  async updateLecturerProfile(userId, profileData) {
    return await this.request(`/lecturers/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getLecturerProfile(userId) {
    return await this.request(`/lecturers/profile/${userId}`);
  }

  // Get faculty information
  async getFacultyInfo(facultyId) {
    return await this.request(`/faculties/${facultyId}`);
  }

  // Admin methods - Updated for backend API
  async getAdminDashboard() {
    return await this.request('/admin/dashboard');
  }

  async getUsers() {
    return await this.request('/users');
  }

  async createUser(userData) {
    return await this.request('/users', {
      method: 'POST',
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        studentId: userData.studentId,
        lecturerId: userData.lecturerId,
        departmentId: userData.departmentId
      }),
    });
  }

  async updateUser(userId, userData) {
    return await this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive
      }),
    });
  }

  async deleteUser(userId) {
    return await this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getUserStats() {
    return await this.request('/users/stats/overview');
  }

  async getAcademicPrograms() {
    return await this.request('/academics/programs');
  }

  async getFaculties() {
    return await this.request('/academics/faculties');
  }

  async createFaculty(facultyData) {
    return await this.request('/academics/faculties', {
      method: 'POST',
      body: JSON.stringify(facultyData),
    });
  }

  async createProgram(programData) {
    return await this.request('/academics/programs', {
      method: 'POST',
      body: JSON.stringify(programData),
    });
  }

  async getCourses() {
    return await this.request('/courses');
  }

  async createCourse(courseData) {
    return await this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async getFinancialReports() {
    return await this.request('/reports/financial');
  }

  async getSystemReports() {
    return await this.request('/reports');
  }

  // Announcements and Notifications
  async getAnnouncements() {
    return await this.request('/announcements');
  }

  async createAnnouncement(announcementData) {
    return await this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify({
        title: announcementData.title,
        content: announcementData.content,
        targetGroup: announcementData.targetGroup,
        priority: announcementData.priority,
        attachments: announcementData.attachments
      }),
    });
  }

  async getNotifications(userId) {
    return await this.request(`/notifications/user/${userId}`);
  }

  async markNotificationAsRead(notificationId) {
    return await this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async getNotificationCount(userId) {
    return await this.request(`/notifications/user/${userId}/count`);
  }

  // Chatbot
  async getChatbotQA() {
    return await this.request('/chatbot');
  }

  async searchChatbot(query) {
    return await this.request('/chatbot/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async createChatbotQA(qaData) {
    return await this.request('/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        question: qaData.question,
        answer: qaData.answer,
        category: qaData.category,
        keywords: qaData.keywords,
        tags: qaData.tags
      }),
    });
  }

  // Communication
  async sendMessage(messageData) {
    return await this.request('/communication/send', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getInbox(userId) {
    return await this.request(`/communication/inbox/${userId}`);
  }

  async getSentMessages(userId) {
    return await this.request(`/communication/sent/${userId}`);
  }

  async markMessageAsRead(messageId) {
    return await this.request(`/communication/${messageId}/read`, {
      method: 'PUT',
    });
  }

  // Settings
  async getSettings() {
    return await this.request('/settings');
  }

  async updateSettings(settings) {
    return await this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  }

  // Reports
  async generateStudentReport(reportData) {
    return await this.request('/reports/students', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async generateAcademicReport(reportData) {
    return await this.request('/reports/academic', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async generateFinancialReport(reportData) {
    return await this.request('/reports/financial', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
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
