# Student Management Platform

A comprehensive full-stack web application for managing students, courses, lecturers, faculties, and departments in an educational institution. Built with Node.js/Express backend and React frontend.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication system
- Role-based access control (Student, Lecturer, Admin)
- Secure password hashing with bcrypt
- Protected routes and middleware

### User Management
- Student registration with auto-generated registration numbers
- Lecturer management with detailed profiles
- Admin dashboard with comprehensive statistics
- User profile management

### Academic Structure
- Faculty management (Science, Arts, Engineering, etc.)
- Department management linked to faculties
- Course creation and management
- Student enrollment system

### Dashboard & Analytics
- Role-specific dashboards
- Real-time statistics and metrics
- Quick action shortcuts
- Recent activity tracking

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## 📁 Project Structure

\`\`\`
student-management-platform/
├── server/                     # Backend application
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/           # Route controllers
│   │   ├── authControllers.js
│   │   ├── courseController.js
│   │   ├── departmentControllers.js
│   │   ├── facultyControllers.js
│   │   └── lecturerControllers.js
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/                # Mongoose schemas
│   │   ├── UserModel.js
│   │   ├── CourseModel.js
│   │   ├── DepartmentModel.js
│   │   ├── FacultyModel.js
│   │   └── LecturersModel.js
│   ├── Routes/                # API routes
│   │   ├── authRoute.js
│   │   ├── courseRoute.js
│   │   ├── departmentRoute.js
│   │   ├── facultyRoute.js
│   │   └── lecturerRoute.js
│   ├── utility/
│   │   └── RegNo.js           # Registration number generator
│   └── server.js              # Main server file
├── src/                       # Frontend application
│   ├── components/
│   │   └── Layout.jsx         # Main layout component
│   ├── contexts/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── pages/                 # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Courses.jsx
│   │   ├── Students.jsx
│   │   ├── Lecturers.jsx
│   │   ├── Faculties.jsx
│   │   ├── Departments.jsx
│   │   └── Setup.jsx
│   ├── services/
│   │   └── api.js             # API service configuration
│   └── App.jsx                # Main app component
└── README.md
\`\`\`

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd student-management-platform
   \`\`\`

2. **Install backend dependencies**
   \`\`\`bash
   cd server
   npm install
   \`\`\`

3. **Environment Variables**
   Create a \`.env\` file in the server directory:
   \`\`\`env
   MONGO_URI=mongodb://localhost:27017/student-management
   JWT_SIGN=your-super-secret-jwt-key
   PORT=5000
   \`\`\`

4. **Start the backend server**
   \`\`\`bash
   npm start
   # or for development with nodemon
   npm run dev
   \`\`\`

### Frontend Setup

1. **Install frontend dependencies**
   \`\`\`bash
   cd ../  # Go back to root directory
   npm install
   \`\`\`

2. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Access the application**
   Open your browser and navigate to \`http://localhost:5173\`

## 🎯 Initial Setup

### 1. Create Sample Data
1. Navigate to \`http://localhost:5173/setup\`
2. Click "Create Sample Data" to populate the database with:
   - 3 sample faculties (Science, Arts, Engineering)
   - 6 sample departments across these faculties

### 2. Create Admin User
1. Go to \`http://localhost:5173/register\`
2. Fill in the registration form:
   - **Role**: Select "Admin"
   - **Faculty**: Choose any faculty
   - **Department**: Choose any department
   - Complete other required fields
3. Click "Create account"

### 3. Login and Explore
1. Login with your admin credentials
2. Explore the dashboard and different management sections

## 📚 API Endpoints

### Authentication
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/all\` - Get all users
- \`GET /api/auth/me\` - Get current user

### Courses
- \`GET /api/course/all\` - Get all courses
- \`POST /api/course/\` - Create new course
- \`PUT /api/course/:id\` - Update course
- \`DELETE /api/course/:id\` - Delete course
- \`POST /api/course/enroll\` - Enroll student in course

### Faculties
- \`GET /api/faculty/all\` - Get all faculties
- \`POST /api/faculty/\` - Create new faculty
- \`PUT /api/faculty/:id\` - Update faculty
- \`DELETE /api/faculty/:id\` - Delete faculty

### Departments
- \`GET /api/department/all\` - Get all departments
- \`POST /api/department/\` - Create new department
- \`PUT /api/department/:id\` - Update department
- \`DELETE /api/department/:id\` - Delete department

### Lecturers
- \`GET /api/lecturer/\` - Get all lecturers
- \`POST /api/lecturer/\` - Create new lecturer
- \`PUT /api/lecturer/:id\` - Update lecturer
- \`DELETE /api/lecturer/:id\` - Delete lecturer

## 👥 User Roles & Permissions

### Student
- View and enroll in courses
- View personal dashboard
- Access course information
- View enrollment status

### Lecturer
- View assigned courses
- Access student lists
- Create new courses
- View lecturer dashboard

### Admin
- Full system access
- Manage all users (students, lecturers)
- Create and manage faculties and departments
- Create and manage courses
- View comprehensive analytics
- System administration

## 🔧 Key Features Explained

### Registration Number Generation
- Automatic generation based on faculty and department codes
- Format: \`{FACULTY_CODE}/{DEPT_CODE}/{YEAR}/{STUDENT_NUMBER}\`
- Example: \`SCI/CSC/24/001\`

### Role-Based Navigation
- Dynamic navigation menu based on user role
- Protected routes with authentication middleware
- Role-specific dashboard content

### Course Enrollment System
- Students can enroll in available courses
- Duplicate enrollment prevention
- Real-time enrollment tracking

### Soft Delete Implementation
- Records are marked as inactive instead of permanent deletion
- Data integrity preservation
- Easy recovery of deleted records

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Update \`MONGO_URI\` in environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Set environment variables in your hosting platform

### Frontend Deployment
1. Build the production version:
   \`\`\`bash
   npm run build
   \`\`\`
2. Deploy the \`dist\` folder to platforms like:
   - Vercel
   - Netlify
   - GitHub Pages
   - Your own server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Registration number generation requires existing faculty and department
- Course enrollment limited to students with registration numbers
- File upload functionality not yet implemented

## 🔮 Future Enhancements

- [ ] File upload for student documents
- [ ] Grade management system
- [ ] Attendance tracking
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] Mobile responsive improvements
- [ ] Dark mode support
- [ ] Bulk operations for admin users
- [ ] Advanced search and filtering
- [ ] Data export functionality

## 📞 Support

For support, email support@studentmanagement.com or create an issue in the repository.

## 🙏 Acknowledgments

- Built with modern web technologies
- UI components from shadcn/ui
- Icons from Lucide React
- Styling with Tailwind CSS
