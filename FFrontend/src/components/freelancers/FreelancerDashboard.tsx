import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import ProfileCompletion from '../shared/ProfileCompletion';
import { User, Lightbulb, Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { authApi, freelancersApi } from '../../services/api';

interface ProfileFlags {
  hasBasicInfo: boolean;
  hasSkills: boolean;
  hasPortfolio: boolean;
  hasEducation: boolean;
  hasAvailability: boolean;
  hasBio: boolean;
  hasLocation: boolean;
}

export default function FreelancerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [freelancer, setFreelancer] = useState<any | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const userRes = await authApi.getCurrentUser();
        const apiUser = (userRes as any).user || (userRes as any).data?.user;
        const email: string | undefined = apiUser?.email;
        const name: string = apiUser?.name || '';

        if (!email) {
          throw new Error('Unable to determine current user email.');
        }

        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ');

        // Find freelancer profile by email
        const listRes = await freelancersApi.getAll({ search: email });
        const listData = (listRes as any).data || [];
        let currentFreelancer = Array.isArray(listData)
          ? listData.find(
              (f: any) => (f.Email || f.email)?.toLowerCase() === email.toLowerCase()
            )
          : null;

        // If no profile exists yet, create one with minimal info
        if (!currentFreelancer) {
          const createRes = await freelancersApi.create({
            FirstName: firstName || name || 'Freelancer',
            LastName: lastName || '',
            Email: email,
          } as any);
          currentFreelancer = (createRes as any).data?.data || (createRes as any).data;
        }

        setFreelancer(currentFreelancer);
        setSkills(Array.isArray(currentFreelancer.skills) ? currentFreelancer.skills : []);
        const portfolioData =
          currentFreelancer.portfolio_work || currentFreelancer.portfolioWork || [];
        setPortfolio(Array.isArray(portfolioData) ? portfolioData : []);
        setEducation(
          Array.isArray(currentFreelancer.education) ? currentFreelancer.education : []
        );
        setAvailability(currentFreelancer.availability || null);

        setError(null);
      } catch (err) {
        console.error('Failed to load freelancer dashboard', err);
        setError('Failed to load your dashboard. Please try again later.');
        toast.error('Failed to load your dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const quickActions = [
    { label: 'Edit Profile', href: '/freelancer/profile/edit', icon: User },
    { label: 'Update Availability', href: '/freelancer/availability', icon: Calendar },
    { label: 'Add Skill', href: '/freelancer/skills', icon: Lightbulb },
    { label: 'Add Portfolio Item', href: '/freelancer/portfolio', icon: Briefcase },
  ];

  if (loading) {
    return (
      <DashboardLayout userType="freelancer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading your dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!freelancer) {
    return (
      <DashboardLayout userType="freelancer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">
            {error || 'No freelancer profile found. Please create your profile first.'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const profileFlags: ProfileFlags = {
    hasBasicInfo: !!(freelancer.FirstName || freelancer.LastName || freelancer.Email),
    hasBio: !!freelancer.Bio,
    hasLocation: !!freelancer.Location,
    hasSkills: skills.length >= 3,
    hasPortfolio: portfolio.length > 0,
    hasEducation: education.length > 0,
    hasAvailability: !!availability,
  };

  const totalSteps = 7;
  const completedSteps = Object.values(profileFlags).filter(Boolean).length;
  const profileCompleteness = Math.round((completedSteps / totalSteps) * 100);

  const stats = {
    profileCompleteness,
    skillsCount: skills.length,
    portfolioCount: portfolio.length,
    educationCount: education.length,
    activityStatus: availability?.ActivityStatus || 'Not set',
    nextAvailability: availability?.NextAvailabilityDate || 'Not set',
  };

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl mb-2">
            Welcome back{freelancer.FirstName ? `, ${freelancer.FirstName}` : ''}! 👋
          </h1>
          <p className="text-gray-600">
            Here's an overview of your profile and activity
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Profile</span>
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl mb-2">{stats.profileCompleteness}%</div>
              <Progress value={stats.profileCompleteness} className="mb-2" />
              <p className="text-xs text-gray-500">Profile completeness</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Skills</span>
                <Lightbulb className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-2xl mb-1">{stats.skillsCount}</div>
              <p className="text-xs text-gray-500">Skills added</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Portfolio</span>
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl mb-1">{stats.portfolioCount}</div>
              <p className="text-xs text-gray-500">Portfolio items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Education</span>
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl mb-1">{stats.educationCount}</div>
              <p className="text-xs text-gray-500">Education records</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Current Status */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Completion Widget */}
          <ProfileCompletion userType="freelancer" profileData={profileFlags} />
          
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Activity Status</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {stats.activityStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Next Availability</span>
                  <span>{stats.nextAvailability}</span>
                </div>
                <Link to="/freelancer/availability">
                  <Button variant="outline" className="w-full mt-2">
                    Update Availability
                  </Button>
                </Link>
              </div>
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
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} to={action.href}>
                    <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                      <Icon className="w-6 h-6" />
                      <span>{action.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Activity tracking will appear here as you update your profile, skills, and portfolio.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}