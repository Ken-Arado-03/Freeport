import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  GraduationCap, 
  Lightbulb, 
  Calendar,
  Settings,
  Building2,
  Bookmark
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  userType: 'freelancer' | 'employer';
}

export default function Sidebar({ userType }: SidebarProps) {
  const location = useLocation();
  
  const freelancerLinks = [
    { href: '/freelancer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/freelancer/profile/edit', label: 'My Profile', icon: User },
    { href: '/freelancer/skills', label: 'Skills', icon: Lightbulb },
    { href: '/freelancer/portfolio', label: 'Portfolio', icon: Briefcase },
    { href: '/freelancer/education', label: 'Education', icon: GraduationCap },
    { href: '/freelancer/availability', label: 'Availability', icon: Calendar },
    { href: '/freelancer/settings', label: 'Settings', icon: Settings },
  ];
  
  const employerLinks = [
    { href: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/employer/profile', label: 'Company Profile', icon: Building2 },
    { href: '/employer/bookmarks', label: 'Bookmarked', icon: Bookmark },
    { href: '/employer/projects', label: 'Projects', icon: Briefcase },
    { href: '/employer/settings', label: 'Settings', icon: Settings },
  ];
  
  const links = userType === 'freelancer' ? freelancerLinks : employerLinks;
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white shadow-md shadow-blue-500/20 flex items-center justify-center overflow-hidden">
            <img
              src="/Logo.png"
              alt="Freeport logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <span className="text-xl">Freeport</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {userType === 'freelancer' ? 'Freelancer Account' : 'Employer Account'}
        </div>
      </div>
    </aside>
  );
}
