import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  HelpCircle,
  BookOpen,
  Calendar,
  Award,
  Users,
  Settings,
  DollarSign,
  FileText,
  Clock
} from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Chatbot knowledge base
  const knowledgeBase = {
    // General questions
    general: {
      greeting: [
        "Hello! I'm the Unity University Assistant. How can I help you today?",
        "Hi there! I'm here to help with any questions about the university system.",
        "Welcome! I'm your virtual assistant. What would you like to know?"
      ],
      help: [
        "I can help you with information about courses, grades, assignments, timetable, fees, and general university procedures.",
        "You can ask me about academic policies, campus facilities, or how to use the portal features.",
        "I'm here to assist with student, lecturer, and admin portal questions."
      ],
      contact: [
        "For technical support, contact IT Support at support@unity.edu or call +1-555-0123",
        "For academic questions, contact your academic advisor or the registrar's office.",
        "For urgent matters, visit the main administration building or call the emergency line."
      ]
    },

    // Student-specific information
    student: {
      courses: [
        "You can view all your enrolled courses in the 'Courses' section. Each course shows materials, assignments, and grades.",
        "To access course materials, go to Courses → Select a course → View materials and resources.",
        "Course enrollment is handled by the registrar's office. Contact them for enrollment issues."
      ],
      assignments: [
        "View all assignments in the 'Assignments' section. You can see due dates, submission status, and grades.",
        "To submit an assignment, go to Assignments → Select assignment → Upload files → Submit.",
        "Late submissions may incur penalties. Check the assignment details for specific policies."
      ],
      grades: [
        "Your grades are available in the 'Grades & Transcript' section. You can view individual assignment grades and overall GPA.",
        "Grade appeals should be submitted within 7 days of grade posting. Contact your instructor first.",
        "Transcripts can be downloaded from the Grades section for official purposes."
      ],
      timetable: [
        "Your class schedule is available in the 'Timetable' section. You can view it by week or list format.",
        "The timetable is editable - you can add personal events and modify your schedule.",
        "Class changes are communicated through announcements. Check the dashboard regularly."
      ],
      attendance: [
        "Track your attendance in the 'Attendance' section. You can see attendance percentage for each course.",
        "Attendance below 75% may affect your final grade. Check with your instructor for specific requirements.",
        "If you miss a class, contact your instructor and check for make-up opportunities."
      ],
      fees: [
        "View your fee status in the 'Fee Management' section. You can see outstanding amounts and payment history.",
        "Payments can be made online through the portal or at the finance office.",
        "Late payment fees may apply. Check the fee schedule for due dates."
      ],
      exams: [
        "Exam schedules are available in the 'Exams & Tests' section. Check regularly for updates.",
        "Online exams have specific time windows. Make sure you have a stable internet connection.",
        "Exam results are typically posted within 5-7 business days after the exam date."
      ]
    },

    // Lecturer-specific information
    lecturer: {
      students: [
        "View your students in the 'Students' section. You can see their profiles, grades, and attendance.",
        "Use the search and filter options to find specific students or courses.",
        "You can export student lists and generate reports for your classes."
      ],
      attendance: [
        "Record student attendance in the 'Attendance Management' section. You can mark present/absent for each class.",
        "Attendance records are automatically saved and can be exported for reports.",
        "You can view attendance statistics and patterns for your classes."
      ],
      grades: [
        "Manage student grades in the 'Grades Management' section. You can enter grades and provide feedback.",
        "Grade entry deadlines are typically 7 days after assignment due dates.",
        "You can export grade reports and generate transcripts for students."
      ],
      courses: [
        "Manage your courses in the 'Course Management' section. You can upload materials and create assignments.",
        "Course materials should be uploaded at least 24 hours before class.",
        "You can organize course content by modules and set access permissions."
      ]
    },

    // Admin-specific information
    admin: {
      users: [
        "Manage all system users in the 'User Management' section. You can create, edit, and deactivate accounts.",
        "User roles include Student, Lecturer, and Admin. Each role has specific permissions.",
        "Bulk user operations are available for importing and managing multiple accounts."
      ],
      academics: [
        "Academic management includes departments, programs, and courses. Use the 'Academic Management' section.",
        "You can create new programs, assign faculty to departments, and manage course catalogs.",
        "Academic policies and requirements can be configured through the system settings."
      ],
      examinations: [
        "Examination management includes creating exam schedules, managing results, and generating reports.",
        "You can set up online exams, assign proctors, and configure exam parameters.",
        "Exam results can be published to students and parents automatically."
      ],
      finance: [
        "Financial management includes fee collection, payment tracking, and financial reporting.",
        "You can set up fee structures, payment plans, and automated reminders.",
        "Financial reports provide insights into revenue, outstanding payments, and trends."
      ],
      communication: [
        "Communication tools include announcements, notifications, and messaging systems.",
        "You can send targeted messages to specific user groups or individuals.",
        "Bulk communication features are available for important announcements."
      ],
      reports: [
        "Generate various reports including academic performance, attendance, and financial reports.",
        "Reports can be scheduled for automatic generation and distribution.",
        "Custom report templates can be created for specific needs."
      ]
    }
  };

  // Get initial greeting based on user role
  const getInitialGreeting = () => {
    const greetings = knowledgeBase.general.greeting;
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    return randomGreeting;
  };

  // Initialize chatbot with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'bot',
        content: getInitialGreeting(),
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  // Find relevant answer based on user input
  const findAnswer = (userInput) => {
    const input = userInput.toLowerCase();
    const role = user?.role || 'student';
    
    // Check for greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return knowledgeBase.general.greeting[Math.floor(Math.random() * knowledgeBase.general.greeting.length)];
    }

    // Check for help requests
    if (input.includes('help') || input.includes('what can you do')) {
      return knowledgeBase.general.help[Math.floor(Math.random() * knowledgeBase.general.help.length)];
    }

    // Check for contact information
    if (input.includes('contact') || input.includes('support') || input.includes('help desk')) {
      return knowledgeBase.general.contact[Math.floor(Math.random() * knowledgeBase.general.contact.length)];
    }

    // Role-specific queries
    const roleKnowledge = knowledgeBase[role] || knowledgeBase.student;
    
    // Check for specific topics
    const topics = Object.keys(roleKnowledge);
    for (const topic of topics) {
      if (input.includes(topic)) {
        const answers = roleKnowledge[topic];
        return answers[Math.floor(Math.random() * answers.length)];
      }
    }

    // Check for common keywords
    const keywordMap = {
      'course': 'courses',
      'class': 'courses',
      'subject': 'courses',
      'assignment': 'assignments',
      'homework': 'assignments',
      'grade': 'grades',
      'mark': 'grades',
      'score': 'grades',
      'schedule': 'timetable',
      'time': 'timetable',
      'attendance': 'attendance',
      'present': 'attendance',
      'absent': 'attendance',
      'fee': 'fees',
      'payment': 'fees',
      'money': 'fees',
      'exam': 'exams',
      'test': 'exams',
      'student': 'students',
      'pupil': 'students',
      'user': 'users',
      'account': 'users',
      'department': 'academics',
      'program': 'academics',
      'finance': 'finance',
      'report': 'reports',
      'analytics': 'reports'
    };

    for (const [keyword, topic] of Object.entries(keywordMap)) {
      if (input.includes(keyword) && roleKnowledge[topic]) {
        const answers = roleKnowledge[topic];
        return answers[Math.floor(Math.random() * answers.length)];
      }
    }

    // Default response
    return "I understand you're asking about that topic. Could you be more specific? I can help with courses, assignments, grades, timetable, attendance, fees, and general university information.";
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: findAnswer(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get quick suggestions based on user role
  const getQuickSuggestions = () => {
    const role = user?.role || 'student';
    
    const suggestions = {
      student: [
        "How do I view my grades?",
        "Where can I find assignments?",
        "How do I check my attendance?",
        "When are my classes scheduled?"
      ],
      lecturer: [
        "How do I record attendance?",
        "How do I enter grades?",
        "How do I manage my students?",
        "How do I create assignments?"
      ],
      admin: [
        "How do I manage users?",
        "How do I generate reports?",
        "How do I manage courses?",
        "How do I handle finances?"
      ]
    };

    return suggestions[role] || suggestions.student;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        title="Open Chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-gray-200 dark:border-slate-600 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-600">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-slate-50">Unity Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`px-3 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600 dark:text-slate-300" />
                  </div>
                  <div className="bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-gray-200 dark:border-slate-600">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {getQuickSuggestions().slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(suggestion)}
                    className="text-xs bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 px-2 py-1 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-600">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
