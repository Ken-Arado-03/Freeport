import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Briefcase, 
  User, 
  Building2, 
  Layout,
  Menu,
  X,
  LayoutDashboard,
  Lightbulb,
  GraduationCap,
  Calendar,
  Settings,
  Bookmark,
  LogOut,
  FolderKanban
} from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);
  }, [location]);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    setUserType(null);
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // Public navigation items (when not logged in)
  const publicNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/freelancers', label: 'Browse Freelancers', icon: Users },
    { path: '/employers', label: 'Browse Employers', icon: Building2 },
  ];
  
  // Freelancer navigation items
  const freelancerNavItems = [
    { path: '/freelancer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/freelancer/profile', label: 'My Profile', icon: User },
    { path: '/freelancer/skills', label: 'Skills', icon: Lightbulb },
    { path: '/freelancer/portfolio', label: 'Portfolio', icon: Briefcase },
    { path: '/freelancer/education', label: 'Education', icon: GraduationCap },
    { path: '/freelancer/availability', label: 'Availability', icon: Calendar },
  ];
  
  // Employer navigation items
  const employerNavItems = [
    { path: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employer/profile', label: 'My Profile', icon: Building2 },
    { path: '/employer/projects', label: 'Projects', icon: FolderKanban },
    { path: '/employer/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { path: '/freelancers', label: 'Browse Freelancers', icon: Users },
  ];
  
  // Determine which nav items to show
  let navItems = publicNavItems;
  if (userType === 'freelancer') {
    navItems = freelancerNavItems;
  } else if (userType === 'employer') {
    navItems = employerNavItems;
  }

  const isBrowsePage =
    location.pathname === '/freelancers' ||
    location.pathname === '/employers';
  
  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white shadow-md shadow-blue-500/20 flex items-center justify-center overflow-hidden group-hover:shadow-blue-500/40 transition-all">
              <img
                src="/Logo.png"
                alt="Freeport logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Freeport
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}

            
            {/* Auth Buttons */}
            {!userType ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {userType === 'freelancer' ? 'Freelancer' : 'Employer'}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
              {!userType ? (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium text-center">
                    Logged in as {userType === 'freelancer' ? 'Freelancer' : 'Employer'}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}