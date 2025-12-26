import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Navigation from './components/Navigation';
import Home from './components/Home';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import FreelancersList from './components/freelancers/FreelancersList';
import FreelancerProfile from './components/freelancers/FreelancerProfile';
import FreelancerDashboard from './components/freelancers/FreelancerDashboard';
import MyFreelancerProfile from './components/freelancers/MyProfile';
import EditFreelancerProfile from './components/freelancers/EditFreelancerProfile';
import SkillsManagement from './components/freelancers/SkillsManagement';
import PortfolioManagement from './components/freelancers/PortfolioManagement';
import EducationManagement from './components/freelancers/EducationManagement';
import AvailabilityManagement from './components/freelancers/AvailabilityManagement';
import EmployersList from './components/employers/EmployersList';
import EmployerProfile from './components/employers/EmployerProfile';
import EmployerDashboard from './components/employers/EmployerDashboard';
import MyEmployerProfile from './components/employers/MyProfile';
import EditEmployerProfile from './components/employers/EditEmployerProfile';
import BookmarkedFreelancers from './components/employers/BookmarkedFreelancers';
import ProjectsManagement from './components/projects/ProjectsManagement';
import FreelancerSettings from './components/settings/FreelancerSettings';
import EmployerSettings from './components/settings/EmployerSettings';

// Mock auth context - in production, this would use Laravel Sanctum tokens
const useAuth = () => {
  // This is a mock. In production, check localStorage for auth token and user type
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  const userType = localStorage.getItem('userType'); // 'freelancer' or 'employer'
  return { isAuthenticated, userType };
};

function AppShell() {
  const location = useLocation();
  // Hide global navbar only on authenticated dashboard areas, not on public browse pages
  const hideNavigation =
    location.pathname.startsWith('/freelancer/') ||
    location.pathname.startsWith('/employer/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {!hideNavigation && <Navigation />}
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Public Marketplace */}
        <Route path="/" element={<Home />} />
        <Route path="/freelancers" element={<FreelancersList />} />
        <Route path="/freelancers/:id" element={<FreelancerProfile />} />
        <Route path="/employers" element={<EmployersList />} />
        <Route path="/employers/:id" element={<EmployerProfile />} />
        
        {/* Freelancer Dashboard (Protected) */}
        <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
        <Route path="/freelancer/profile" element={<MyFreelancerProfile />} />
        <Route path="/freelancer/profile/edit" element={<EditFreelancerProfile />} />
        <Route path="/freelancer/skills" element={<SkillsManagement />} />
        <Route path="/freelancer/portfolio" element={<PortfolioManagement />} />
        <Route path="/freelancer/education" element={<EducationManagement />} />
        <Route path="/freelancer/availability" element={<AvailabilityManagement />} />
        <Route path="/freelancer/settings" element={<FreelancerSettings />} />
        
        {/* Employer Dashboard (Protected) */}
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/profile" element={<MyEmployerProfile />} />
        <Route path="/employer/profile/edit" element={<EditEmployerProfile />} />
        <Route path="/employer/bookmarks" element={<BookmarkedFreelancers />} />
        <Route path="/employer/projects" element={<ProjectsManagement />} />
        <Route path="/employer/settings" element={<EmployerSettings />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;