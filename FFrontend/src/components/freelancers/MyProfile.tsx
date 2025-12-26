import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  User, 
  MapPin, 
  Mail, 
  Calendar,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Edit,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { authApi, freelancersApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

export default function MyProfile() {
  const [freelancerData, setFreelancerData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const userRes = await authApi.getCurrentUser();
        const apiUser = (userRes as any).user || (userRes as any).data?.user || (userRes as any).user_info;
        const email: string | undefined = apiUser?.email;
        const name: string = apiUser?.name || '';

        if (!email) {
          throw new Error('Unable to determine current user email.');
        }

        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ');

        const listRes = await freelancersApi.getAll({ search: email });
        const listData = (listRes as any).data || [];
        let freelancer = Array.isArray(listData)
          ? listData.find(
              (f: any) => (f.Email || f.email)?.toLowerCase() === email.toLowerCase()
            )
          : null;

        if (!freelancer) {
          const createRes = await freelancersApi.create({
            FirstName: firstName || name || 'Freelancer',
            LastName: lastName || '',
            Email: email,
          } as any);
          freelancer = (createRes as any).data?.data || (createRes as any).data;
        }

        const skills = Array.isArray(freelancer.skills) ? freelancer.skills : [];
        const portfolioSource = freelancer.portfolio_work || freelancer.portfolioWork || [];
        const portfolio = Array.isArray(portfolioSource) ? portfolioSource : [];
        const education = Array.isArray(freelancer.education) ? freelancer.education : [];
        const availability = freelancer.availability || null;

        const viewModel = {
          FreelancerID: freelancer.FreelancerID || freelancer.id,
          FirstName: freelancer.FirstName || firstName || name,
          LastName: freelancer.LastName || lastName,
          Email: freelancer.Email || email,
          ProfilePicture: freelancer.ProfilePicture || freelancer.profile_picture || null,
          Bio: freelancer.Bio || freelancer.bio || '',
          Location: freelancer.Location || freelancer.location || '',
          Skills: skills.map((s: any) => ({
            SkillID: s.SkillID || s.id,
            SkillName: s.SkillName || s.skill_name,
            ProficiencyLevel: s.ProficiencyLevel || s.proficiency_level || 'Beginner',
            YearsOfExperience:
              s.YearsOfExperience ?? s.years_of_experience ?? 0,
          })),
          Portfolio: portfolio.map((p: any) => ({
            PortfolioID: p.PortfolioID || p.id,
            ProjectTitle: p.ProjectTitle || p.project_title,
            Description: p.ProjectDescription || p.project_description || '',
            ProjectURL: p.ProjectURL || p.project_url || '',
            ImageURL: null,
          })),
          Education: education.map((e: any) => ({
            EducationID: e.EducationID || e.id,
            InstitutionName: e.InstitutionName || e.institution_name || '',
            Degree: e.Degree || e.degree || '',
            FieldOfStudy: e.FieldOfStudy || e.Major || e.major || '',
            StartDate: e.StartDate || null,
            EndDate: e.EndDate || null,
            GraduationYear: e.GraduationYear || e.graduation_year || null,
            Description: e.Description || '',
          })),
          Availability: {
            ActivityStatus:
              availability?.ActivityStatus || availability?.activity_status || 'Not set',
            NextAvailabilityDate:
              availability?.NextAvailabilityDate || availability?.next_availability_date || '',
            HoursPerWeek:
              availability?.WeeklyHoursAvailable || availability?.weekly_hours_available || 0,
          },
        };

        setFreelancerData(viewModel);
        setError(null);
      } catch (err) {
        console.error('Failed to load freelancer profile', err);
        setError('Failed to load your profile. Please try again later.');
        toast.error('Failed to load your profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <DashboardLayout userType="freelancer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!freelancerData) {
    return (
      <DashboardLayout userType="freelancer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">
            {error || 'No freelancer profile found.'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Beginner': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <DashboardLayout userType="freelancer">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">View and manage your professional profile</p>
          </div>
          <Link to="/freelancer/profile/edit">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-32 h-32 mb-4 ring-4 ring-blue-50">
                    <AvatarImage src={resolveMediaUrl(freelancerData.ProfilePicture)} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl">
                      {freelancerData.FirstName[0]}{freelancerData.LastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {freelancerData.FirstName} {freelancerData.LastName}
                  </h2>
                  
                  <Badge className={`mb-4 ${
                    freelancerData.Availability.ActivityStatus === 'Active' 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}>
                    {freelancerData.Availability.ActivityStatus}
                  </Badge>

                  <div className="space-y-2 text-sm text-gray-600 w-full">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{freelancerData.Email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{freelancerData.Location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Available: {freelancerData.Availability.NextAvailabilityDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Availability
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {freelancerData.Availability.ActivityStatus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hours/Week</span>
                  <span className="font-medium">{freelancerData.Availability.HoursPerWeek} hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next Available</span>
                  <span className="font-medium">{freelancerData.Availability.NextAvailabilityDate}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  About Me
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{freelancerData.Bio}</p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    Skills
                  </h3>
                  <Link to="/freelancer/skills">
                    <Button variant="outline" size="sm">
                      Manage Skills
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {freelancerData.Skills.map((skill: any) => (
                    <div key={skill.SkillID} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50/50">
                      <div>
                        <div className="font-medium text-gray-900">{skill.SkillName}</div>
                        <div className="text-sm text-gray-500">{skill.YearsOfExperience} years experience</div>
                      </div>
                      <Badge variant="outline" className={getProficiencyColor(skill.ProficiencyLevel)}>
                        {skill.ProficiencyLevel}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Portfolio
                  </h3>
                  <Link to="/freelancer/portfolio">
                    <Button variant="outline" size="sm">
                      Manage Portfolio
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {freelancerData.Portfolio.map((project: any) => (
                    <div key={project.PortfolioID} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{project.ProjectTitle}</h4>
                        {project.ProjectURL && (
                          <a href={project.ProjectURL} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{project.Description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Education
                  </h3>
                  <Link to="/freelancer/education">
                    <Button variant="outline" size="sm">
                      Manage Education
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {freelancerData.Education.map((edu: any) => (
                    <div
                      key={edu.EducationID}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {edu.Degree} in {edu.FieldOfStudy}
                      </h4>
                      <p className="text-blue-600 mt-1">{edu.InstitutionName}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {edu.StartDate && edu.EndDate
                          ? `${new Date(edu.StartDate).getFullYear()} - ${new Date(
                              edu.EndDate,
                            ).getFullYear()}`
                          : edu.GraduationYear
                          ? `Graduated ${edu.GraduationYear}`
                          : null}
                      </p>
                      {edu.Description && (
                        <p className="text-sm text-gray-600 mt-2">{edu.Description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
