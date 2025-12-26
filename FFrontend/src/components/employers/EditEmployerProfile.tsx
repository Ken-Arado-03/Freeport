import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Building2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { authApi, employersApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';
import ImageCropDialog from '../shared/ImageCropDialog';

export default function EditEmployerProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employerId, setEmployerId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  
  // Mock data - in production: GET /api/auth/user
  const [formData, setFormData] = useState({
    CompanyName: '',
    ContactPersonName: '',
    Email: '',
    PhoneNumber: '',
    CompanyLogo: null as string | null,
    CompanyWebsite: '',
    Address: '',
    IndustryType: '',
    CompanyDescription: '',
    CompanySize: '',
    Founded: '',
    TalentHeadline: '',
    TalentAreas: '',
    TalentWhyUs: '',
  });

  useEffect(() => {
    const loadEmployer = async () => {
      try {
        setLoading(true);

        const userRes = await authApi.getCurrentUser();
        const apiUser =
          (userRes as any).user ||
          (userRes as any).data?.user ||
          (userRes as any).user_info;
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

        const id = employer.EmployerID || employer.id;
        setEmployerId(id);

        setFormData({
          CompanyName: employer.CompanyName || '',
          ContactPersonName: employer.ContactPersonName || name || '',
          Email: employer.Email || email,
          PhoneNumber: employer.PhoneNumber || '',
          CompanyLogo: employer.CompanyLogo || null,
          CompanyWebsite: employer.CompanyWebsite || '',
          Address: employer.Address || '',
          IndustryType: employer.IndustryType || '',
          CompanyDescription: employer.CompanyDescription || '',
          CompanySize: employer.CompanySize || '',
          Founded: employer.Founded || '',
          TalentHeadline: employer.TalentHeadline || '',
          TalentAreas: employer.TalentAreas || '',
          TalentWhyUs: employer.TalentWhyUs || '',
        });
      } catch (err) {
        console.error('Failed to load employer profile', err);
        toast.error('Failed to load employer profile.');
      } finally {
        setLoading(false);
      }
    };

    loadEmployer();
  }, []);
  
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!employerId) {
      toast.error('Employer profile is not loaded yet. Please refresh and try again.');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 5MB.');
      e.target.value = '';
      return;
    }

    setPendingImageFile(file);
    setCropDialogOpen(true);
    e.target.value = '';
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setPendingImageFile(null);
  };

  const handleCropConfirm = async (file: File) => {
    if (!employerId) {
      toast.error('Employer profile is not loaded yet. Please refresh and try again.');
      return;
    }

    setLoading(true);
    try {
      const response = await (employersApi as any).uploadCompanyLogo(employerId, file);
      const updated = (response as any).data || (response as any).employer || response;
      const logoUrl = updated.CompanyLogo || updated.company_logo || formData.CompanyLogo;

      setFormData((prev) => ({
        ...prev,
        CompanyLogo: logoUrl,
      }));

      toast.success('Company logo updated successfully!');
    } catch (err) {
      console.error('Failed to upload company logo', err);
      toast.error('Failed to upload company logo. Please try again.');
    } finally {
      setLoading(false);
      setCropDialogOpen(false);
      setPendingImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In production: PUT /api/employers/{id}
      if (!employerId) {
        throw new Error('Employer profile not found.');
      }

      await employersApi.update(employerId, {
        CompanyName: formData.CompanyName,
        ContactPersonName: formData.ContactPersonName,
        Email: formData.Email,
        PhoneNumber: formData.PhoneNumber,
        CompanyLogo: formData.CompanyLogo,
        CompanyWebsite: formData.CompanyWebsite,
        Address: formData.Address,
        IndustryType: formData.IndustryType,
        CompanyDescription: formData.CompanyDescription,
        CompanySize: formData.CompanySize,
        Founded: formData.Founded,
        TalentHeadline: formData.TalentHeadline,
        TalentAreas: formData.TalentAreas,
        TalentWhyUs: formData.TalentWhyUs,
      } as any);

      toast.success('Company profile updated successfully!');
      navigate('/employer/dashboard');
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/employer/dashboard');
  };
  
  return (
    <DashboardLayout userType="employer">
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Edit Company Profile</h1>
          <p className="text-gray-600">Update your company information</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              This information will be visible to freelancers browsing the marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Logo */}
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={resolveMediaUrl(formData.CompanyLogo)} />
                    <AvatarFallback>
                      <Building2 className="w-10 h-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG or SVG. Max 5MB.</p>
                  </div>
                </div>
              </div>
              
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.CompanyName}
                  onChange={(e) => setFormData({ ...formData, CompanyName: e.target.value })}
                  required
                />
              </div>
              
              {/* Contact Person */}
              <div className="space-y-2">
                <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                <Input
                  id="contactPersonName"
                  value={formData.ContactPersonName}
                  onChange={(e) => setFormData({ ...formData, ContactPersonName: e.target.value })}
                  required
                />
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500">Your company contact email</p>
              </div>
              
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.PhoneNumber}
                  onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              {/* Company Website */}
              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={formData.CompanyWebsite}
                  onChange={(e) => setFormData({ ...formData, CompanyWebsite: e.target.value })}
                  placeholder="https://yourcompany.com"
                />
              </div>
              
              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.Address}
                  onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                  placeholder="Street, City, State, ZIP"
                />
              </div>
              
              {/* Industry Type */}
              <div className="space-y-2">
                <Label htmlFor="industryType">Industry Type</Label>
                <Input
                  id="industryType"
                  value={formData.IndustryType}
                  onChange={(e) => setFormData({ ...formData, IndustryType: e.target.value })}
                  placeholder="e.g. Technology, Finance, Marketing"
                />
              </div>

              {/* Company Details */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Input
                    id="companySize"
                    value={formData.CompanySize}
                    onChange={(e) => setFormData({ ...formData, CompanySize: e.target.value })}
                    placeholder="e.g. 1-10, 11-50, 51-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded">Founded</Label>
                  <Input
                    id="founded"
                    value={formData.Founded}
                    onChange={(e) => setFormData({ ...formData, Founded: e.target.value })}
                    placeholder="e.g. 2015"
                  />
                </div>
              </div>

              {/* About Company */}
              <div className="space-y-2">
                <Label htmlFor="companyDescription">About Company</Label>
                <textarea
                  id="companyDescription"
                  className="w-full border rounded-md px-3 py-2 text-sm min-h-[120px]"
                  value={formData.CompanyDescription}
                  onChange={(e) => setFormData({ ...formData, CompanyDescription: e.target.value })}
                  placeholder="Describe your company, mission, and what you do."
                />
              </div>

              {/* Talent We're Looking For */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="talentHeadline">Talent Headline</Label>
                  <Input
                    id="talentHeadline"
                    value={formData.TalentHeadline}
                    onChange={(e) => setFormData({ ...formData, TalentHeadline: e.target.value })}
                    placeholder="e.g. We're actively seeking talented professionals in the following areas:"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="talentAreas">Talent Areas</Label>
                  <textarea
                    id="talentAreas"
                    className="w-full border rounded-md px-3 py-2 text-sm min-h-[120px]"
                    value={formData.TalentAreas}
                    onChange={(e) => setFormData({ ...formData, TalentAreas: e.target.value })}
                    placeholder={"List the roles/skills you're looking for. One per line, e.g.\nFull-Stack Developers — React, Node.js\nUI/UX Designers — Figma, User Research"}
                  />
                  <p className="text-xs text-gray-500">Each line will appear as a separate card on your public profile.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="talentWhyUs">Why work with us?</Label>
                  <textarea
                    id="talentWhyUs"
                    className="w-full border rounded-md px-3 py-2 text-sm min-h-[100px]"
                    value={formData.TalentWhyUs}
                    onChange={(e) => setFormData({ ...formData, TalentWhyUs: e.target.value })}
                    placeholder="Explain why freelancers should work with your company."
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageFile={pendingImageFile}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
          aspect={1}
        />
      </div>
    </DashboardLayout>
  );
}
