import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Building2, Bookmark, Users, User, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { authApi, employersApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

interface RecentBookmark {
  SavedID: number | string;
  FreelancerID: number | string;
  FirstName: string;
  LastName: string;
  Location?: string;
  ProfilePicture?: string | null;
  Skills?: string[];
  SavedDate: string;
}

export default function EmployerDashboard() {
  const [companyName, setCompanyName] = useState<string>('Your company');
  const [stats, setStats] = useState({ bookmarkedFreelancers: 0, recentBookmarks: 0 });
  const [recentBookmarks, setRecentBookmarks] = useState<RecentBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
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

        setCompanyName(employer.CompanyName || 'Your company');

        const bookmarksRes = await employersApi.getBookmarks(
          employer.EmployerID || employer.id,
        );
        const records = (bookmarksRes as any).data || [];
        const mapped: RecentBookmark[] = Array.isArray(records)
          ? records.map((rec: any) => {
              const f = rec.freelancer || rec.Freelancer || {};
              return {
                SavedID: rec.SavedID || rec.id || rec.SavedBookmarkedID,
                FreelancerID: f.FreelancerID || f.id,
                FirstName: f.FirstName || f.first_name || '',
                LastName: f.LastName || f.last_name || '',
                Location: f.Location || f.location || '',
                ProfilePicture: f.ProfilePicture || f.profile_picture || null,
                Skills: Array.isArray((f as any).skills)
                  ? (f as any).skills.map(
                      (s: any) => s.SkillName || s.skill_name || s.name || '',
                    )
                  : [],
                SavedDate:
                  rec.SavedDate || rec.saved_date || rec.created_at || new Date().toISOString(),
              };
            })
          : [];

        const topRecent = mapped
          .slice()
          .sort(
            (a, b) =>
              new Date(b.SavedDate).getTime() - new Date(a.SavedDate).getTime(),
          )
          .slice(0, 5);

        setRecentBookmarks(topRecent);
        setStats({
          bookmarkedFreelancers: mapped.length,
          recentBookmarks: topRecent.length,
        });
      } catch (error) {
        console.error('Failed to load employer dashboard', error);
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);
  
  return (
    <DashboardLayout userType="employer">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600">
            Manage your company profile and find talented freelancers
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Company</span>
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl mb-1">{companyName}</div>
              <p className="text-xs text-gray-500">Your company profile</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Bookmarked</span>
                <Bookmark className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-2xl mb-1">{stats.bookmarkedFreelancers}</div>
              <p className="text-xs text-gray-500">Saved freelancers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Recent</span>
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl mb-1">{stats.recentBookmarks}</div>
              <p className="text-xs text-gray-500">New bookmarks</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link to="/employer/profile/edit">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Building2 className="w-6 h-6" />
                  <span>Update Company Profile</span>
                </Button>
              </Link>
              
              <Link to="/freelancers">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Users className="w-6 h-6" />
                  <span>Browse Freelancers</span>
                </Button>
              </Link>
              
              <Link to="/employer/bookmarks" className="block">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Bookmark className="w-6 h-6" />
                  <span>View Bookmarks</span>
                </Button>
              </Link>

              <Link to="/employer/projects" className="block">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Briefcase className="w-6 h-6" />
                  <span>Manage Projects</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Recently Bookmarked Freelancers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recently Bookmarked</CardTitle>
              <Link to="/employer/bookmarks">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentBookmarks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No bookmarked freelancers yet</p>
                <Link to="/freelancers">
                  <Button>Browse Freelancers</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookmarks.map((freelancer) => (
                  <div 
                    key={freelancer.FreelancerID} 
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={resolveMediaUrl(freelancer.ProfilePicture)} />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">
                        {freelancer.FirstName} {freelancer.LastName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{freelancer.Location}</p>
                      <div className="flex flex-wrap gap-2">
                        {(freelancer.Skills || []).slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-2">
                        Saved {new Date(freelancer.SavedDate).toLocaleDateString()}
                      </p>
                      <Link to={`/freelancers/${freelancer.FreelancerID}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
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
