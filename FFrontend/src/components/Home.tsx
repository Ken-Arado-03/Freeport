import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { 
  Users, 
  Building2, 
  Search, 
  Briefcase,
  Star,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'freelancers' | 'employers'>('freelancers');
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAuthenticated = !!localStorage.getItem('authToken');
  
  const stats = [
    { label: 'Active Freelancers', value: '10,000+', icon: Users },
    { label: 'Companies Hiring', value: '5,000+', icon: Building2 },
    { label: 'Projects Completed', value: '50,000+', icon: Briefcase },
    { label: 'Success Rate', value: '95%', icon: Star },
  ];

  const features = [
    {
      icon: Search,
      title: 'Find Top Talent',
      description: 'Browse thousands of verified freelancers with proven expertise in their fields.'
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'All profiles are verified and backed by our secure payment system.'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Career',
      description: 'Freelancers can showcase their skills and connect with top companies.'
    },
    {
      icon: Zap,
      title: 'Quick Hiring',
      description: 'Find and hire the perfect freelancer in minutes, not weeks.'
    }
  ];

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    const targetPath = searchType === 'freelancers' ? '/freelancers' : '/employers';
    const query = searchTerm.trim();
    if (query) {
      navigate(`${targetPath}?q=${encodeURIComponent(query)}`);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bS0yNCAwYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bTAgMjRjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnptMjQgMGMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="container mx-auto px-6 max-w-5xl relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
              Connect with Top Freelance Talent
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-10 leading-relaxed">
              The premier marketplace for finding skilled freelancers and exciting opportunities. 
              Build your dream team or launch your freelance career today.
            </p>
            
            <form onSubmit={handleSearchSubmit} className="mt-10">
              <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-2 flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500/80" />
                  <Input
                    type="search"
                    placeholder="Search freelancers or companies by skill, role, or industry..."
                    className="pl-12 h-12 md:h-14 bg-white text-gray-900 border-0 shadow-lg shadow-blue-900/20 rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex md:flex-col lg:flex-row gap-2">
                  <Button
                    type="button"
                    variant={searchType === 'freelancers' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setSearchType('freelancers')}
                  >
                    Freelancers
                  </Button>
                  <Button
                    type="button"
                    variant={searchType === 'employers' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setSearchType('employers')}
                  >
                    Companies
                  </Button>
                </div>
                <Button type="submit" size="lg" className="w-full md:w-auto px-8">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Freeport?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to connect talented professionals with amazing opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of freelancers and companies already using Freeport
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl h-14 px-8 text-lg">
                  Sign Up as Freelancer
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 h-14 px-8 text-lg"
                >
                  Sign Up as Employer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/freeport-logo.png"
                  alt="Freeport logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-semibold text-white">Freeport</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting talent with opportunity since 2025
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">For Freelancers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/freelancers" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/freelancers" className="hover:text-white transition-colors">Find Talent</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Post a Job</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Freeport. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
