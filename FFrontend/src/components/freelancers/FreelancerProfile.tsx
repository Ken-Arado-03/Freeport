import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { MapPin, Mail, Phone, Calendar, Bookmark, ExternalLink, Award, User, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { freelancersApi, authApi, employersApi, bookmarksApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

export default function FreelancerProfile() {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [employerId, setEmployerId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [freelancer, setFreelancer] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        setLoading(true);
        
        const numericId = Number(id);
        if (!numericId || Number.isNaN(numericId)) {
          setError('Invalid freelancer id');
          setLoading(false);
          return;
        }

        const freelancerRes = await freelancersApi.getById(numericId);
        const data = freelancerRes.data;

        setFreelancer(data);
        setSkills(Array.isArray(data?.skills) ? data.skills : []);

        const portfolioData = data?.portfolio_work || data?.portfolioWork || [];
        setPortfolio(Array.isArray(portfolioData) ? portfolioData : []);

        setEducation(Array.isArray(data?.education) ? data.education : []);
        setAvailability(data?.availability || null);

        setError(null);
      } catch (err) {
        console.error('Error fetching freelancer data:', err);
        setError('Failed to load freelancer profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFreelancerData();
    }
  }, [id]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuthenticated(!!localStorage.getItem('authToken'));
    }
  }, []);

  useEffect(() => {
    const initializeBookmarkState = async () => {
      const userType = localStorage.getItem('userType');
      const token = localStorage.getItem('authToken');

      if (!id || !token || userType !== 'employer') {
        return;
      }

      const numericId = Number(id);
      if (!numericId || Number.isNaN(numericId)) {
        return;
      }

      try {
        const userRes = await authApi.getCurrentUser();
        const apiUser = (userRes as any).user || (userRes as any).data?.user || (userRes as any).user_info;
        const email: string | undefined = apiUser?.email;
        const name: string = apiUser?.name || '';

        if (!email) {
          return;
        }

        const listRes = await employersApi.getAll({ search: email });
        const listData = (listRes as any).data || [];
        let employer = Array.isArray(listData)
          ? listData.find((e: any) => (e.Email || e.email)?.toLowerCase() === email.toLowerCase())
          : null;

        if (!employer) {
          const createRes = await employersApi.create({
            CompanyName: name || 'Company',
            ContactPersonName: name || 'Contact',
            Email: email,
          } as any);
          employer = (createRes as any).data?.data || (createRes as any).data;
        }

        const resolvedEmployerId: number | undefined = employer.EmployerID || employer.id;
        if (!resolvedEmployerId) {
          return;
        }
        setEmployerId(resolvedEmployerId);

        const bookmarksRes = await employersApi.getBookmarks(resolvedEmployerId);
        const records = (bookmarksRes as any).data || [];
        if (!Array.isArray(records)) {
          return;
        }

        const existing = records.find((rec: any) => {
          const f = rec.freelancer || rec.Freelancer || {};
          const fId = f.FreelancerID || f.id;
          return fId === numericId;
        });

        if (existing) {
          setIsBookmarked(true);
          setBookmarkId(existing.SavedID || existing.id || existing.SavedBookmarkedID || null);
        } else {
          setIsBookmarked(false);
          setBookmarkId(null);
        }
      } catch (err) {
        console.error('Failed to initialize bookmark state', err);
      }
    };

    initializeBookmarkState();
  }, [id]);
  
  const handleBookmark = async () => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'employer') {
      toast.error('Please log in as an employer to bookmark freelancers');
      return;
    }

    const numericId = Number(id);
    if (!numericId || Number.isNaN(numericId)) {
      toast.error('Invalid freelancer id');
      return;
    }

    try {
      setBookmarkLoading(true);

      let currentEmployerId = employerId;
      if (!currentEmployerId) {
        const userRes = await authApi.getCurrentUser();
        const apiUser = (userRes as any).user || (userRes as any).data?.user || (userRes as any).user_info;
        const email: string | undefined = apiUser?.email;
        const name: string = apiUser?.name || '';

        if (!email) {
          throw new Error('Unable to determine current employer account.');
        }

        const listRes = await employersApi.getAll({ search: email });
        const listData = (listRes as any).data || [];
        let employer = Array.isArray(listData)
          ? listData.find((e: any) => (e.Email || e.email)?.toLowerCase() === email.toLowerCase())
          : null;

        if (!employer) {
          const createRes = await employersApi.create({
            CompanyName: name || 'Company',
            ContactPersonName: name || 'Contact',
            Email: email,
          } as any);
          employer = (createRes as any).data?.data || (createRes as any).data;
        }

        const resolvedId = (employer.EmployerID || employer.id) as number | undefined;
        if (!resolvedId) {
          throw new Error('Unable to resolve employer profile.');
        }
        currentEmployerId = resolvedId;
        setEmployerId(resolvedId ?? null);
      }

      if (!isBookmarked) {
        const res = await bookmarksApi.create({
          FreelancerID: numericId,
          EmployerID: currentEmployerId as number,
        });
        const saved = (res as any).data || res;
        const savedId = saved.SavedID || saved.id || saved.SavedBookmarkedID || null;
        setBookmarkId(savedId);
        setIsBookmarked(true);
        toast.success('Added to bookmarks');
      } else if (bookmarkId) {
        await bookmarksApi.delete(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId(null);
        toast.success('Removed from bookmarks');
      }
    } catch (err) {
      console.error('Failed to update bookmark', err);
      toast.error('Failed to update bookmark. Please try again.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/freelancers">
                <Button variant="ghost">Back to Freelancers</Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading freelancer profile...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {!loading && !error && freelancer && (
          <>
            {/* Profile Header */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={resolveMediaUrl(freelancer.profile_picture || freelancer.ProfilePicture)} />
                    <AvatarFallback className="text-2xl">
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl mb-2">
                          {freelancer.first_name || freelancer.FirstName} {freelancer.last_name || freelancer.LastName}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{freelancer.location || freelancer.Location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{freelancer.email || freelancer.Email}</span>
                          </div>
                          {(freelancer.phone_number || freelancer.PhoneNumber) && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{freelancer.phone_number || freelancer.PhoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          onClick={handleBookmark}
                          variant={isBookmarked ? 'default' : 'outline'}
                          disabled={bookmarkLoading}
                        >
                          <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                        </Button>
                      </div>
                    </div>
                    
                    {availability && (
                      <div className="flex flex-wrap gap-3">
                        <Badge 
                          variant="default"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          {availability.activity_status || availability.ActivityStatus}
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          Available: {availability.next_availability_date || availability.NextAvailabilityDate}
                        </Badge>
                        <Badge variant="outline">
                          {availability.weekly_hours_available || availability.WeeklyHoursAvailable}h/week
                        </Badge>
                        <Badge variant="outline">
                          {availability.current_projects_count || availability.CurrentProjectsCount} active projects
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* About Me */}
            {(freelancer.bio || freelancer.Bio) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{freelancer.bio || freelancer.Bio}</p>
                </CardContent>
              </Card>
            )}
            
            {/* Skills */}
            {skills && skills.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Skills ({skills.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {skills.map((skill, idx) => (
                      <div key={skill.id || skill.SkillID || idx} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{skill.skill_name || skill.SkillName}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {skill.proficiency_level || skill.ProficiencyLevel} • {skill.years_of_experience || skill.YearsOfExperience} years
                          </div>
                        </div>
                        <Badge variant="outline">{skill.proficiency_level || skill.ProficiencyLevel}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Portfolio */}
            {portfolio && portfolio.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Portfolio ({portfolio.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {portfolio.map((project, idx) => (
                      <div key={project.id || project.PortfolioID || idx}>
                        {idx > 0 && <Separator className="mb-6" />}
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl">{project.project_title || project.ProjectTitle}</h3>
                            {(project.project_url || project.ProjectURL) && (
                              <a href={project.project_url || project.ProjectURL} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Project
                                </Button>
                              </a>
                            )}
                          </div>
                          <p className="text-gray-700 mb-3">{project.project_description || project.ProjectDescription}</p>
                          {(project.technologies_used || project.TechnologiesUsed) && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {(project.technologies_used || project.TechnologiesUsed)
                                .split(', ')
                                .map((tech: string, i: number) => (
                                  <Badge key={i} variant="secondary">
                                    {tech.trim()}
                                  </Badge>
                                ))}
                            </div>
                          )}
                          <p className="text-sm text-gray-500">
                            Completed: {new Date(project.completion_date || project.CompletionDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Education */}
            {education && education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Education ({education.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {education.map((edu, idx) => (
                      <div key={edu.id || edu.EducationID || idx} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium mb-1">{edu.degree || edu.Degree} in {edu.major || edu.Major}</h3>
                          <p className="text-gray-700">{edu.institution_name || edu.InstitutionName}</p>
                          <p className="text-sm text-gray-500">Graduated {edu.graduation_year || edu.GraduationYear}</p>
                        </div>
                        {(edu.gpa || edu.GPA) && (
                          <Badge variant="outline">GPA: {edu.gpa || edu.GPA}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
