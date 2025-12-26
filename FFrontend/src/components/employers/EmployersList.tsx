import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Building2, ExternalLink, Loader } from 'lucide-react';
import { employersApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

export default function EmployersList() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();
  const userType = (typeof window !== 'undefined'
    ? (localStorage.getItem('userType') as 'freelancer' | 'employer' | null)
    : null);

  const handleBackToDashboard = () => {
    if (userType === 'freelancer') {
      navigate('/freelancer/dashboard');
    } else if (userType === 'employer') {
      navigate('/employer/dashboard');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
  }, [location.search]);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setLoading(true);

        const params: Record<string, any> = {};
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (industryFilter !== 'all') {
          params.industry = industryFilter;
        }

        const response = await employersApi.getAll(Object.keys(params).length ? params : undefined);
        setEmployers(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching employers:', err);
        setError('Failed to load employers');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, [searchQuery, industryFilter]);

  return (
    <div className="min-h-screen bg-background">
      {userType && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="container mx-auto px-6 py-3 max-w-5xl flex items-center justify-between">
            <p className="text-sm text-blue-800">
              You are browsing companies in the marketplace.
            </p>
            <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
              Back to dashboard
            </Button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bS0yNCAwYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bTAgMjRjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnptMjQgMGMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto px-6 max-w-5xl relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl mb-4 font-bold tracking-tight">Browse companies</h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl">
              Discover companies hiring talented freelancers around the world.
            </p>
            {/* Search Bar */}
            <div className="max-w-3xl">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  type="search"
                  placeholder="Search companies by name or industry..."
                  className="pl-16 h-16 text-lg bg-white/95 backdrop-blur border-0 shadow-2xl shadow-blue-900/20 text-gray-900 rounded-2xl focus:ring-4 focus:ring-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="design">Design & Creative</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <p className="text-gray-600">
              Showing {employers.length} companies
            </p>
          )}
        </div>
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading employers...</p>
            </div>
          </div>
        ) : (
          /* Employers Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {employers.length > 0 ? (
              employers.map((employer) => (
                <Card key={employer.id || employer.EmployerID} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="w-20 h-20 mb-4">
                        <AvatarImage src={resolveMediaUrl(employer.company_logo || employer.CompanyLogo)} />
                        <AvatarFallback>
                          <Building2 className="w-10 h-10" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="text-xl mb-2">{employer.company_name || employer.CompanyName}</h3>
                      
                      {(employer.industry_type || employer.IndustryType) && (
                        <Badge variant="outline" className="mb-3">
                          {employer.industry_type || employer.IndustryType}
                        </Badge>
                      )}
                      
                      <p className="text-gray-600 text-sm mb-4">{employer.address || employer.Address}</p>
                      
                      {(employer.company_website || employer.CompanyWebsite) && (
                        <a 
                          href={employer.company_website || employer.CompanyWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mb-4 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Visit Website
                        </a>
                      )}
                      
                      <Link to={`/employers/${employer.id || employer.EmployerID}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No employers found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
