import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, User, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { authApi, employersApi, bookmarksApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

interface BookmarkedFreelancer {
  SavedID: number;
  FreelancerID: number;
  FirstName: string;
  LastName: string;
  Location: string;
  ProfilePicture: string | null;
  Bio: string;
  Skills: string[];
  SavedDate: string;
  ActivityStatus: string;
}

export default function BookmarkedFreelancers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [bookmarks, setBookmarks] = useState<BookmarkedFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);

        const userRes = await authApi.getCurrentUser();
        const apiUser = (userRes as any).user || (userRes as any).data?.user || (userRes as any).user_info;
        const email: string | undefined = apiUser?.email;
        const name: string = apiUser?.name || '';

        if (!email) {
          throw new Error('Unable to determine current user email.');
        }

        const listRes = await employersApi.getAll({ search: email });
        const listData = (listRes as any).data || [];
        let employer = Array.isArray(listData)
          ? listData.find(
              (e: any) => (e.Email || e.email)?.toLowerCase() === email.toLowerCase(),
            )
          : null;

        if (!employer) {
          const createRes = await employersApi.create({
            CompanyName: name || 'Company',
            ContactPersonName: name || 'Contact',
            Email: email,
          } as any);
          employer = (createRes as any).data?.data || (createRes as any).data;
        }

        const employerId = employer.EmployerID || employer.id;

        const bookmarksRes = await employersApi.getBookmarks(employerId);
        const records = (bookmarksRes as any).data || [];

        const mapped: BookmarkedFreelancer[] = Array.isArray(records)
          ? records.map((rec: any) => {
              const f = rec.freelancer || rec.Freelancer || {};
              const availability = (f as any).availability || (f as any).Availability;
              const skillsArr = Array.isArray((f as any).skills)
                ? (f as any).skills.map(
                    (s: any) => s.SkillName || s.skill_name || s.name || '',
                  )
                : [];

              return {
                SavedID: rec.SavedID || rec.id || rec.SavedBookmarkedID,
                FreelancerID: f.FreelancerID || f.id,
                FirstName: f.FirstName || f.first_name || '',
                LastName: f.LastName || f.last_name || '',
                Location: f.Location || f.location || '',
                ProfilePicture: f.ProfilePicture || f.profile_picture || null,
                Bio: f.Bio || f.bio || '',
                Skills: skillsArr,
                SavedDate:
                  rec.SavedDate || rec.saved_date || rec.created_at || new Date().toISOString(),
                ActivityStatus:
                  availability?.ActivityStatus ||
                  availability?.activity_status ||
                  'Not specified',
              };
            })
          : [];

        setBookmarks(mapped);
        setError(null);
      } catch (err) {
        console.error('Failed to load bookmarked freelancers', err);
        setError('Failed to load bookmarked freelancers.');
        toast.error('Failed to load bookmarked freelancers.');
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);
  
  const handleRemoveBookmark = async (savedId: number, name: string) => {
    if (!confirm(`Remove ${name} from bookmarks?`)) return;
    
    try {
      await bookmarksApi.delete(savedId);
      setBookmarks((prev) => prev.filter((b) => b.SavedID !== savedId));
      toast.success('Freelancer removed from bookmarks');
    } catch (err) {
      console.error('Failed to remove bookmark', err);
      toast.error('Failed to remove bookmark. Please try again.');
    }
  };
  
  return (
    <DashboardLayout userType="employer">
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Bookmarked</h1>
          <p className="text-gray-600">Manage your saved freelancers</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Bookmarks ({bookmarks.length})</CardTitle>
            <CardDescription>
              Keep track of talented freelancers you're interested in working with
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters and Search */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search by name or skill..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Saved</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Bookmarked Freelancers List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Loading bookmarks...</p>
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">
                  {error || 'No bookmarked freelancers yet'}
                </p>
                <Link to="/freelancers">
                  <Button>Browse Freelancers</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarks.map((freelancer) => (
                  <div 
                    key={freelancer.SavedID} 
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={resolveMediaUrl(freelancer.ProfilePicture)} />
                        <AvatarFallback>
                          <User className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg mb-1">
                              {freelancer.FirstName} {freelancer.LastName}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{freelancer.Location}</span>
                            </div>
                          </div>
                          
                          <Badge 
                            variant={freelancer.ActivityStatus === 'Active' ? 'default' : 'secondary'}
                            className={freelancer.ActivityStatus === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                          >
                            {freelancer.ActivityStatus}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {freelancer.Bio}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {freelancer.Skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Saved on {new Date(freelancer.SavedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          
                          <div className="flex gap-2">
                            <Link to={`/freelancers/${freelancer.FreelancerID}`}>
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveBookmark(freelancer.SavedID, `${freelancer.FirstName} ${freelancer.LastName}`)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
