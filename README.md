# Unity University Portal

A comprehensive university portal system built with React and Tailwind CSS, featuring role-based access control for students, lecturers, administrators, and parents.

## 🚀 Features

### 📱 **Mobile Responsive Design**
- Fully responsive layout that works on all device sizes
- Mobile-first approach with touch-friendly interfaces
- Collapsible sidebar navigation for mobile devices

### 🌙 **Light & Dark Theme Support**
- Automatic theme detection based on system preferences
- Manual theme toggle with persistent storage
- Consistent dark mode across all components

### 👥 **Role-Based Access Control**
- **Student Portal**: Course management, grades, attendance, exams
- **Lecturer Portal**: Course management, student grading, attendance tracking
- **Admin Portal**: User management, academic oversight, financial management
- **Parent Portal**: Student progress monitoring, communication, events

### 🛠️ **Production-Ready Features**
- Error boundary for graceful error handling
- Loading states and user feedback
- Notification system for user interactions
- Data service layer for API integration
- Persistent authentication state
- Form validation and error handling

## 🏗️ **Architecture**

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Sidebar, Footer
│   ├── ErrorBoundary.js
│   └── Loading.js
├── contexts/           # React Context providers
│   ├── AuthContext.js
│   ├── ThemeContext.js
│   └── NotificationContext.js
├── pages/             # Page components by user role
│   ├── Student/       # Student portal pages
│   ├── Lecturer/      # Lecturer portal pages
│   ├── Admin/         # Admin portal pages
│   └── Parent/        # Parent portal pages
├── services/          # API and data services
│   └── dataService.js
└── App.js            # Main application with routing
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 14 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unity-portal-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 **Demo Credentials**

For testing different user roles, use these demo credentials:

| Role | Email | Password |
|------|-------|----------|
| Student | student@unity.edu | password123 |
| Lecturer | lecturer@unity.edu | password123 |
| Admin | admin@unity.edu | password123 |
| Parent | parent@unity.edu | password123 |

## 📱 **Mobile Responsiveness**

The application is fully responsive with:
- **Mobile (< 768px)**: Single column layout with collapsible navigation
- **Tablet (768px - 1024px)**: Two-column grid layouts
- **Desktop (> 1024px)**: Full sidebar navigation with multi-column layouts

## 🌙 **Theme System**

### Light Theme
- Clean, professional appearance
- High contrast for accessibility
- Optimized for daytime use

### Dark Theme
- Reduced eye strain for low-light environments
- Consistent color scheme across all components
- Automatic system preference detection

## 🛠️ **Production Deployment**

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_NAME=Unity University Portal
REACT_APP_VERSION=1.0.0
```

### Build for Production
```bash
npm run build
```

### Deploy
The `build` folder contains the production-ready files that can be deployed to any static hosting service.

## 🔧 **Development**

### Available Scripts
- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App

### Code Structure
- **Components**: Reusable UI components with props validation
- **Contexts**: Global state management for auth, theme, and notifications
- **Pages**: Route-specific components organized by user role
- **Services**: API integration and data management
- **Styling**: Tailwind CSS with custom components

## 🎨 **Customization**

### Colors
The application uses a consistent color palette defined in `tailwind.config.js`:
- Primary: Blue color scheme
- Secondary: Gray color scheme
- Dark mode: Automatic color inversion

### Components
All components are built with Tailwind utility classes and can be easily customized by modifying the CSS classes.

## 📊 **Features by Role**

### Student Portal
- ✅ Dashboard with academic overview
- ✅ Course enrollment and management
- ✅ Grade tracking and transcripts
- ✅ Fee management and payment
- ✅ Class schedules and timetables
- ✅ Attendance monitoring
- ✅ Online exams and assessments
- ✅ Profile management

### Lecturer Portal
- ✅ Teaching dashboard
- ✅ Course content management
- ✅ Student roster and management
- ✅ Grade recording and submission
- ✅ Attendance marking
- ✅ Profile management

### Admin Portal
- ✅ Administrative dashboard
- ✅ User management (CRUD operations)
- ✅ Academic program management
- ✅ Financial management and reporting
- ✅ System-wide communication
- ✅ Reports and analytics
- ✅ System settings and configuration

### Parent Portal
- ✅ Student progress monitoring
- ✅ Academic performance tracking
- ✅ Communication with school
- ✅ Event participation
- ✅ Resource access
- ✅ Support system

## 🔒 **Security Features**

- Role-based route protection
- Persistent authentication state
- Secure token management
- Input validation and sanitization
- Error boundary for graceful failures

## 📈 **Performance**

- Lazy loading for route components
- Optimized bundle size
- Efficient state management
- Responsive image loading
- Minimal re-renders

## 🧪 **Testing**

The application includes:
- Error boundary testing
- Component isolation
- User interaction testing
- Responsive design testing

## 📝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies.**
