import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, MapPin, User, Loader } from 'lucide-react';
import { freelancersApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

export default function FreelancersList() {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const location = useLocation();
  const navigate = useNavigate();
  const userType = (typeof window !== 'undefined'
    ? (localStorage.getItem('userType') as 'freelancer' | 'employer' | null)
    : null);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
  }, [location.search]);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true);

        const params: Record<string, any> = {};
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (locationFilter !== 'all') {
          params.location = locationFilter;
        }
        if (sortBy && sortBy !== 'newest') {
          params.sort_by = sortBy;
        }

        const response = await freelancersApi.getAll(Object.keys(params).length ? params : undefined);
        setFreelancers(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching freelancers:', err);
        setError('Failed to load freelancers');
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, [searchQuery, locationFilter, sortBy]);

  const filteredFreelancers = freelancers.filter((freelancer) => {
    if (statusFilter === 'all') {
      return true;
    }

    const availability = freelancer.availability || freelancer.Availability;
    const status = (availability?.activity_status || availability?.ActivityStatus || '').toLowerCase();

    if (statusFilter === 'active') {
      return status === 'active';
    }

    if (statusFilter === 'busy') {
      return status === 'busy';
    }

    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bS0yNCAwYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bTAgMjRjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnptMjQgMGMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="container mx-auto px-6 max-w-5xl relative">
          <div className="text-center mb-12">
            <h1 className="text-6xl mb-4 font-bold tracking-tight">
              Find talented freelancers
            </h1>
            <p className="text-2xl text-blue-100 max-w-2xl mx-auto">
              Connect with skilled professionals ready to bring your projects to life
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="search"
                placeholder="Search by name, skill, or location..."
                className="pl-16 h-16 text-lg bg-white/95 backdrop-blur border-0 shadow-2xl shadow-blue-900/20 text-gray-900 rounded-2xl focus:ring-4 focus:ring-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-5xl">
      {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[200px] h-11 bg-white shadow-sm border-gray-200">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="usa">USA</SelectItem>
              <SelectItem value="uk">UK</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] h-11 bg-white shadow-sm border-gray-200">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] h-11 bg-white shadow-sm border-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="experience">Most Experienced</SelectItem>
              <SelectItem value="availability">Next Available</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="ml-auto">
            {loading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <p className="text-gray-600 font-medium">
                {filteredFreelancers.length} freelancers found
              </p>
            )}
          </div>
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
              <p className="text-gray-600">Loading freelancers...</p>
            </div>
          </div>
        ) : (
          /* Freelancers Grid */
          <div className="grid gap-6 md:grid-cols-2">
            {filteredFreelancers.length > 0 ? (
              filteredFreelancers.map((freelancer) => (
                <Card 
                  key={freelancer.id || freelancer.FreelancerID} 
                  className="hover:shadow-xl transition-all duration-300 border-gray-200 bg-white overflow-hidden group hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="w-16 h-16 ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all">
                        <AvatarImage src={resolveMediaUrl(freelancer.profile_picture || freelancer.ProfilePicture)} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl">
                          {freelancer.first_name?.[0] || freelancer.FirstName?.[0]}{freelancer.last_name?.[0] || freelancer.LastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl mb-1 font-semibold text-gray-900">
                              {freelancer.first_name || freelancer.FirstName} {freelancer.last_name || freelancer.LastName}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{freelancer.location || freelancer.Location || 'Not specified'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {freelancer.bio || freelancer.Bio || 'No bio provided'}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {freelancer.skills && freelancer.skills.slice(0, 4).map((skill: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-200 hover:bg-blue-100">
                              {skill.skill_name || skill.SkillName || skill.name}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm text-gray-500">
                            Hourly Rate: ${freelancer.hourly_rate || freelancer.HourlyRate || 'N/A'}/hr
                          </span>
                          
                          <Link to={`/freelancers/${freelancer.id || freelancer.FreelancerID}`}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500 text-lg">No freelancers found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}