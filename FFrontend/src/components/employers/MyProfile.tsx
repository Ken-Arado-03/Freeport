import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone,
  Globe,
  Users,
  Edit,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { authApi, employersApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

export default function MyProfile() {
  const [employerData, setEmployerData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployer = async () => {
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
              (e: any) => (e.Email || e.email)?.toLowerCase() === email.toLowerCase()
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

        const viewModel = {
          EmployerID: employer.EmployerID || employer.id,
          CompanyName: employer.CompanyName || 'Company',
          ContactEmail: employer.Email || email,
          CompanyLogo: employer.CompanyLogo || null,
          CompanyDescription:
            employer.CompanyDescription ||
            'No company description has been added yet.',
          Location: employer.Address || '',
          Website: employer.CompanyWebsite || '',
          PhoneNumber: employer.PhoneNumber || '',
          Industry: employer.IndustryType || 'Not specified',
          CompanySize: employer.CompanySize || 'Not specified',
          Founded: employer.Founded || 'Not specified',
          TalentHeadline:
            employer.TalentHeadline ||
            "We're actively seeking talented professionals in the following areas:",
          TalentAreas: employer.TalentAreas || '',
          TalentWhyUs:
            employer.TalentWhyUs ||
            'We offer competitive rates, flexible working arrangements, and the opportunity to work on cutting-edge projects with a talented team.',
        };

        setEmployerData(viewModel);
        setError(null);
      } catch (err) {
        console.error('Failed to load employer profile', err);
        setError('Failed to load your company profile.');
        toast.error('Failed to load your company profile.');
      } finally {
        setLoading(false);
      }
    };

    loadEmployer();
  }, []);

  if (loading) {
    return (
      <DashboardLayout userType="employer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!employerData) {
    return (
      <DashboardLayout userType="employer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">
            {error || 'No employer profile found.'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="employer">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
            <p className="text-gray-500 mt-1">View and manage your company information</p>
          </div>
          <Link to="/employer/profile/edit">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Company Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-32 h-32 mb-4 ring-4 ring-blue-50">
                    <AvatarImage src={resolveMediaUrl(employerData.CompanyLogo)} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl">
                      {employerData.CompanyName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {employerData.CompanyName}
                  </h2>

                  <div className="space-y-3 text-sm text-gray-600 w-full">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="break-all">{employerData.ContactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{employerData.Location}</span>
                    </div>
                    {employerData.PhoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{employerData.PhoneNumber}</span>
                      </div>
                    )}
                    {employerData.Website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a 
                          href={employerData.Website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Stats Card */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Company Details
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Industry</span>
                  <span className="font-medium">{employerData.Industry}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Company Size</span>
                  <span className="font-medium">{employerData.CompanySize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Founded</span>
                  <span className="font-medium">{employerData.Founded}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/freelancers" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Browse Freelancers
                  </Button>
                </Link>
                <Link to="/employer/bookmarks" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="w-4 h-4 mr-2" />
                    View Bookmarks
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Company Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Company */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  About Company
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {employerData.CompanyDescription}
                </p>
              </CardContent>
            </Card>

            {/* What We're Looking For */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Talent We're Looking For
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {employerData.TalentHeadline}
                </p>
                {employerData.TalentAreas ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {employerData.TalentAreas.split(/\r?\n/)
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
                ) : (
                  <p className="text-sm text-gray-500">
                    No specific roles listed yet.
                  </p>
                )}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Why work with us?</strong>{' '}
                    {employerData.TalentWhyUs}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Email</div>
                      <div className="text-gray-900">{employerData.ContactEmail}</div>
                    </div>
                  </div>
                  {employerData.PhoneNumber && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Phone</div>
                        <div className="text-gray-900">{employerData.PhoneNumber}</div>
                      </div>
                    </div>
                  )}
                  {employerData.Website && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Website</div>
                        <a 
                          href={employerData.Website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {employerData.Website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
