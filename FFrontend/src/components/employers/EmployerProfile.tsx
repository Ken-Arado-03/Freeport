import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Loader,
  DollarSign,
  Calendar,
  Clock,
  Tag,
} from 'lucide-react';
import { employersApi, projectsApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';
import { toast } from 'sonner';

export default function EmployerProfile() {
  const { id } = useParams();
  const [employer, setEmployer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [interestSubmittingId, setInterestSubmittingId] = useState<number | null>(null);

  const loadProjects = async (employerId: number) => {
    try {
      setProjectsLoading(true);
      setProjectsError(null);

      const response = await projectsApi.getAll({ employer_id: employerId, status: 'open' });
      const data = (response as any).data || [];
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading projects for employer:', err);
      setProjects([]);
      setProjectsError('Failed to load open projects.');
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        setLoading(true);

        const numericId = Number(id);
        if (!numericId || Number.isNaN(numericId)) {
          setError('Invalid employer id');
          setLoading(false);
          return;
        }

        const response = await employersApi.getById(numericId);
        const employerData = (response as any).data || (response as any).employer || response;
        setEmployer(employerData);
        const employerId = employerData.EmployerID || employerData.id;
        if (employerId) {
          loadProjects(Number(employerId));
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching employer data:', err);
        setError('Failed to load employer profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployerData();
    }
  }, [id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const type = localStorage.getItem('userType');
      setIsAuthenticated(!!token);
      setUserType(type);
    }
  }, []);

  const handleInterestClick = async (projectId: number) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const currentUserType = localStorage.getItem('userType');

      if (!token || currentUserType !== 'freelancer') {
        toast.error('Please log in as a freelancer to express interest in projects.');
        window.location.href = '/login';
        return;
      }
    }

    setInterestSubmittingId(projectId);
    try {
      const response = await (projectsApi as any).expressInterest(projectId);
      const payload = (response as any).data || response;
      const newCount =
        (payload && (payload.interest_count ?? payload.data?.interest_count)) ?? null;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                interest_count:
                  newCount !== null ? newCount : (p.interest_count ?? 0) + 1,
              }
            : p,
        ),
      );

      toast.success("We've recorded your interest in this project.");
    } catch (err) {
      console.error('Failed to register interest in project', err);
      toast.error('Failed to register your interest. Please try again.');
    } finally {
      setInterestSubmittingId(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 max-w-5xl">
          <div className="flex items-center justify-between">   
            <div className="flex items-center gap-3">
              <Link to="/employers">
                <Button variant="ghost">Back to Companies</Button>
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
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading employer profile...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {!loading && !error && employer && (
          <>
            {/* Company Header */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={resolveMediaUrl(employer.company_logo || employer.CompanyLogo)} />
                    <AvatarFallback className="bg-blue-100">
                      <Building2 className="w-12 h-12 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl mb-3">{employer.company_name || employer.CompanyName}</h1>
                    
                    <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{employer.address || employer.Address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{employer.email || employer.Email}</span>
                      </div>
                      {(employer.phone_number || employer.PhoneNumber) && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{employer.phone_number || employer.PhoneNumber}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline">{employer.industry_type || employer.IndustryType}</Badge>
                      {(employer.company_website || employer.CompanyWebsite) && (
                        <a 
                          href={employer.company_website || employer.CompanyWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Website
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Open Projects */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Open Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {projectsLoading && (
                  <div className="flex items-center justify-center py-6 text-gray-500 text-sm">
                    Loading open projects...
                  </div>
                )}

                {!projectsLoading && projectsError && (
                  <div className="mb-2 text-sm text-red-600">{projectsError}</div>
                )}

                {!projectsLoading && !projectsError && projects.length === 0 && (
                  <div className="text-sm text-gray-600">
                    This company has no open projects at the moment.
                  </div>
                )}

                {!projectsLoading && !projectsError && projects.length > 0 && (
                  <div className="space-y-4">
                    {projects.map((project: any) => (
                      <div
                        key={project.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {project.status && (
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize bg-green-50 text-green-700 border-green-200"
                                >
                                  {String(project.status).replace('_', ' ')}
                                </Badge>
                              )}
                              {project.job_type && (
                                <span className="text-xs text-gray-500">
                                  {project.job_type}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900 leading-tight">
                              {project.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {project.description}
                        </p>

                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          {project.budget && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span>${Number(project.budget).toLocaleString()}</span>
                            </div>
                          )}
                          {project.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{project.duration}</span>
                            </div>
                          )}
                          {project.created_at && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>
                                {new Date(project.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {Array.isArray(project.skills_required) &&
                          project.skills_required.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                <Tag className="w-3 h-3" />
                                <span>Required skills</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {project.skills_required.slice(0, 4).map((skill: string, idx: number) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {project.skills_required.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{project.skills_required.length - 4}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm text-gray-600">
                            {project.interest_count ?? 0} freelancer
                            {(project.interest_count ?? 0) === 1 ? '' : 's'} interested
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleInterestClick(project.id)}
                            disabled={interestSubmittingId === project.id}
                          >
                            {interestSubmittingId === project.id
                              ? 'Submitting...'
                              : `I'm Interested (${project.interest_count ?? 0})`}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Company Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Contact Person</p>
                      <p>{employer.contact_person_name || employer.ContactPersonName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Industry</p>
                      <p>{employer.industry_type || employer.IndustryType}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Company Size</p>
                      <p>{employer.CompanySize || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Founded</p>
                      <p>{employer.Founded || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p>{employer.address || employer.Address}</p>
                  </div>
                  
                  {(employer.CompanyDescription || employer.company_description) && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">About Company</p>
                      <p className="text-gray-700 leading-relaxed">
                        {employer.CompanyDescription || employer.company_description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Talent We're Looking For */}
            {(employer.TalentHeadline || employer.TalentAreas || employer.TalentWhyUs) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Talent We're Looking For</CardTitle>
                </CardHeader>
                <CardContent>
                  {employer.TalentHeadline && (
                    <p className="text-gray-600 mb-4">
                      {employer.TalentHeadline}
                    </p>
                  )}
                  {employer.TalentAreas && (
                    <div className="grid gap-3 sm:grid-cols-2 mb-4">
                      {employer.TalentAreas.split(/\r?\n/)
                        .map((line: string) => line.trim())
                        .filter(Boolean)
                        .map((line: string, index: number) => {
                          const [title, description] = line.split('—');
                          return (
                            <div
                              key={index}
                              className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                              <div className="font-medium text-gray-900">
                                {title?.trim() || 'Role'}
                              </div>
                              {description && (
                                <div className="text-sm text-gray-600">
                                  {description.trim()}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                  {employer.TalentWhyUs && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Why work with us?</strong>{' '}
                        {employer.TalentWhyUs}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Interested in working with {employer.company_name || employer.CompanyName}? Reach out to discuss opportunities.
                </p>
                <div className="flex gap-3">
                  <a href={`mailto:${employer.email || employer.Email}`}>
                    <Button>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </a>
                  {(employer.company_website || employer.CompanyWebsite) && (
                    <a href={employer.company_website || employer.CompanyWebsite} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
