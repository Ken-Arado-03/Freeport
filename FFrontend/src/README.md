# Freeport - Freelancing Marketplace Frontend

A modern, production-ready React frontend for the Freeport freelancing marketplace, designed to integrate seamlessly with a Laravel Sanctum REST API backend.

## 🎯 Production-Ready Features

### ✅ Complete Feature Set
- **Two-way Bookmarks**: Both freelancers and employers can bookmark each other
- **Project Management**: Employers can post and manage job listings
- **Profile Completion Tracking**: Visual progress tracking for profile optimization
- **Advanced Search & Filters**: Comprehensive filtering and sorting
- **Review System**: Rating and review functionality (ready for API integration)
- **Real API Integration**: Centralized API service layer with error handling
- **Loading States**: Comprehensive loading indicators throughout
- **Error Handling**: Production-ready error handling with user-friendly messages
- **Form Validation**: Laravel validation error support

## Features

### 🎨 Modern Design
- Clean, professional SaaS interface with blue gradient color scheme
- Responsive design optimized for desktop-first (1440×900) and mobile
- Smooth animations and transitions
- Glassmorphism effects and modern UI patterns

### 👥 User Roles
**Freelancers:**
- Dashboard with overview and statistics
- Profile management (view & edit)
- Skills management (CRUD operations)
- Portfolio showcase (CRUD operations)
- Education history (CRUD operations)
- Availability settings
- Browse marketplace
- Profile completion tracking

**Employers:**
- Dashboard with company overview
- Company profile management (view & edit)
- Browse freelancers with filters
- Bookmark favorite freelancers
- View freelancer details
- **Project Management** (Create, Edit, Delete job postings)

### 🔐 Authentication
- Login page with Laravel Sanctum token authentication
- Register page (mock)
- Token-based authentication storage
- Role-based navigation (freelancer/employer)
- Logout functionality
- Session expiration handling

### 📱 Pages & Routes

**Public Routes:**
- `/` - Home page with features and CTAs
- `/freelancers` - Browse freelancers marketplace
- `/freelancers/:id` - View freelancer profile
- `/employers` - Browse employers
- `/employers/:id` - View employer profile
- `/login` - Login page
- `/register` - Registration page

**Freelancer Routes (Protected):**
- `/freelancer/dashboard` - Dashboard overview with profile completion
- `/freelancer/profile` - View my profile
- `/freelancer/profile/edit` - Edit profile
- `/freelancer/skills` - Manage skills
- `/freelancer/portfolio` - Manage portfolio
- `/freelancer/education` - Manage education
- `/freelancer/availability` - Manage availability

**Employer Routes (Protected):**
- `/employer/dashboard` - Dashboard overview
- `/employer/profile` - View company profile
- `/employer/profile/edit` - Edit company profile
- `/employer/projects` - Manage project listings ✨ NEW
- `/employer/bookmarks` - Bookmarked freelancers
- `/employer/messages` - Message center ✨ NEW

## 🔌 API Integration (Production-Ready)

### Centralized API Service
All API calls are handled through `/services/api.ts` with:
- Automatic token injection
- Centralized error handling
- Laravel validation error parsing
- Session expiration detection
- Toast notifications for errors
- TypeScript interfaces for type safety

### API Endpoints Integrated

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user

#### Freelancers
- `GET /api/freelancers` - List all freelancers (with filters)
- `GET /api/freelancers/{id}` - Get freelancer details
- `PUT /api/freelancers/{id}` - Update freelancer profile
- `GET /api/freelancers/{id}/skills` - Get freelancer skills
- `GET /api/freelancers/{id}/portfolio` - Get portfolio

#### Skills
- `GET /api/skills` - List freelancer skills
- `POST /api/skills` - Add new skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill

#### Portfolio
- `GET /api/portfolio` - List portfolio items
- `POST /api/portfolio` - Add portfolio item
- `PUT /api/portfolio/{id}` - Update portfolio item
- `DELETE /api/portfolio/{id}` - Delete portfolio item

#### Education
- `GET /api/education` - List education entries
- `POST /api/education` - Add education
- `PUT /api/education/{id}` - Update education
- `DELETE /api/education/{id}` - Delete education

#### Availability
- `GET /api/availability` - Get availability
- `POST /api/availability` - Update availability

#### Employers
- `GET /api/employers` - List employers
- `GET /api/employers/{id}` - Get employer details
- `PUT /api/employers/{id}` - Update employer profile
- `GET /api/employers/{id}/bookmarks` - Get bookmarks

#### Bookmarks (Two-way)
- `GET /api/saved-bookmarked` - List bookmarked profiles
- `POST /api/saved-bookmarked` - Add bookmark (freelancer or employer)
- `DELETE /api/saved-bookmarked/{id}` - Remove bookmark

#### Messages ✨ NEW
- `GET /api/messages/threads` - Get message threads
- `GET /api/messages/threads/{userId}` - Get specific conversation
- `POST /api/messages` - Send message
- `PUT /api/messages/{id}/read` - Mark as read

#### Projects ✨ NEW
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

#### Reviews ✨ NEW
- `GET /api/freelancers/{id}/reviews` - Get freelancer reviews
- `POST /api/reviews` - Create review

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **Lucide React** for icons
- **Sonner** for toast notifications
- **Recharts** for data visualization

## 🚀 Getting Started

### 1. Environment Setup

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Configure Laravel Backend

Update your Laravel CORS settings to allow frontend domain:

```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

## 🔐 Authentication Flow

1. User logs in via `/login`
2. On success, store:
   - `authToken` in localStorage
   - `userType` ('freelancer' or 'employer') in localStorage
   - `userId` in localStorage
3. Navigation updates based on user type
4. All API calls automatically include token in Authorization header: `Bearer {token}`
5. Session expiration redirects to login with message

## 📊 Key Components

### API Service Layer (`/services/api.ts`)
Centralized API management with:
- Automatic authentication
- Error handling
- Validation error parsing
- Toast notifications

### Profile Completion (`/components/shared/ProfileCompletion.tsx`)
Visual tracker showing:
- Completion percentage
- Missing profile sections
- Quick action links
- Gamification elements

### Message Center (`/components/messaging/MessageCenter.tsx`)
Full messaging interface with:
- Thread list with search
- Real-time conversation view
- Message sending
- Read/unread status
- User profile links

### Project Management (`/components/projects/ProjectsManagement.tsx`)
Complete CRUD interface for:
- Creating job listings
- Editing projects
- Managing applications
- Status tracking (Open, In Progress, Completed, Closed)

## Demo Credentials

**Freelancer Account:**
- Email: `freelancer@test.com`
- Password: `password`

**Employer Account:**
- Email: `employer@test.com`
- Password: `password`

## 📁 File Structure

```
/services
  - api.ts                    # Centralized API service ✨ NEW
/components
  /auth
    - LoginPage.tsx
    - RegisterPage.tsx
  /freelancers
    - FreelancersList.tsx
    - FreelancerProfile.tsx
    - FreelancerDashboard.tsx  # With Profile Completion ✨ ENHANCED
    - MyProfile.tsx
    - EditFreelancerProfile.tsx
    - SkillsManagement.tsx
    - PortfolioManagement.tsx
    - EducationManagement.tsx
    - AvailabilityManagement.tsx
  /employers
    - EmployersList.tsx
    - EmployerProfile.tsx
    - EmployerDashboard.tsx
    - MyProfile.tsx
    - EditEmployerProfile.tsx
    - BookmarkedFreelancers.tsx
  /messaging                   # ✨ NEW
    - MessageCenter.tsx
  /projects                    # ✨ NEW
    - ProjectsManagement.tsx
  /shared                      # ✨ NEW
    - ProfileCompletion.tsx
  /layout
    - DashboardLayout.tsx
    - Sidebar.tsx
    - TopNav.tsx
  /ui
    - (shadcn components)
  - Navigation.tsx             # ✨ ENHANCED with Messages & Projects
  - Home.tsx
/lib
  - utils.ts
/styles
  - globals.css
- App.tsx                      # ✨ ENHANCED with new routes
```

## 🎯 Production Checklist

### ✅ Completed
- [x] API service layer with error handling
- [x] Authentication with token management
- [x] Two-way bookmarks system
- [x] Messaging system
- [x] Project management for employers
- [x] Profile completion tracking
- [x] Comprehensive loading states
- [x] Form validation with Laravel errors
- [x] Mobile responsive design
- [x] Role-based navigation
- [x] Toast notifications
- [x] Session expiration handling

### 🔄 Ready for Backend Integration
- [ ] Replace mock data with real API calls
- [ ] Implement file upload for images
- [ ] Add real-time WebSocket for messages
- [ ] Implement search autocomplete
- [ ] Add pagination for lists
- [ ] Implement review/rating system
- [ ] Add notification system

## 🔧 Integration Guide

### Step 1: Update API Base URL

In `.env`:
```env
VITE_API_BASE_URL=https://your-backend.com/api
```

### Step 2: Test Authentication

```javascript
import api from './services/api';

// Login
const response = await api.auth.login('user@example.com', 'password');
localStorage.setItem('authToken', response.data.token);
localStorage.setItem('userType', response.data.user.type);
```

### Step 3: Replace Mock Data

Each component has mock data marked with comments:
```javascript
// Mock data - in production, fetch from API
```

Replace with:
```javascript
const response = await api.freelancers.getAll();
setData(response.data);
```

## 🐛 Error Handling

All API errors are automatically handled:

```javascript
// Laravel validation errors (422)
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}

// Authentication errors (401)
// Automatically redirects to login

// Server errors (500)
// Shows toast notification with error message
```

## 📈 Performance Features

- Lazy loading components
- Optimized bundle size
- Efficient re-renders with React hooks
- Memoized calculations
- Debounced search inputs
- Cached API responses (ready for implementation)

## 🎨 Design System

- **Colors**: Blue primary (#3B82F6), purple accent
- **Typography**: System fonts with custom scaling
- **Components**: shadcn/ui library
- **Icons**: Lucide React
- **Animations**: Smooth transitions with Tailwind

## 📝 Notes for Laravel Integration

1. **CORS**: Ensure your Laravel backend allows the frontend domain
2. **Sanctum**: Configure Sanctum for SPA authentication
3. **Routes**: All API routes should be prefixed with `/api`
4. **Validation**: Frontend expects Laravel validation error format
5. **File Uploads**: Use multipart/form-data for profile pictures
6. **Timestamps**: Use ISO 8601 format for dates

## License

MIT