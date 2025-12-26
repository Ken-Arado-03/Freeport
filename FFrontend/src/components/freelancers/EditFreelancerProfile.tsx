import { useEffect, useState, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { authApi, freelancersApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';
import ImageCropDialog from '../shared/ImageCropDialog';

export default function EditFreelancerProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // saving state
  const [initialLoading, setInitialLoading] = useState(true);
  const [freelancerId, setFreelancerId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: '',
    Location: '',
    Bio: '',
    ProfilePicture: null as string | null,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setInitialLoading(true);

        const userRes = await authApi.getCurrentUser();
        const apiUser = (userRes as any).user || (userRes as any).data?.user;
        const email: string = apiUser?.email;
        const name: string = apiUser?.name || '';
        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ');

        if (!email) {
          throw new Error('Unable to determine current user email.');
        }

        // Find existing freelancer profile by email
        const listRes = await freelancersApi.getAll({ search: email });
        const rawList = (listRes as any).data?.data || (listRes as any).data || [];
        let freelancer = Array.isArray(rawList)
          ? rawList.find(
              (f: any) => (f.Email || f.email)?.toLowerCase() === email.toLowerCase()
            )
          : null;

        // If no profile exists yet, create a basic one
        if (!freelancer) {
          const createRes = await freelancersApi.create({
            FirstName: firstName || name || 'Freelancer',
            LastName: lastName || '',
            Email: email,
          } as any);
          freelancer = (createRes as any).data?.data || (createRes as any).data;
        }

        const freelancerIdValue = freelancer.FreelancerID || freelancer.id;
        setFreelancerId(freelancerIdValue ?? null);

        setFormData({
          FirstName: freelancer.FirstName || firstName || '',
          LastName: freelancer.LastName || lastName || '',
          Email: freelancer.Email || email || '',
          PhoneNumber: freelancer.PhoneNumber || '',
          Location: freelancer.Location || '',
          Bio: freelancer.Bio || '',
          ProfilePicture: freelancer.ProfilePicture || null,
        });

        setError(null);
      } catch (err) {
        console.error('Failed to load freelancer profile', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!freelancerId) {
      toast.error('Profile is not loaded yet. Please refresh and try again.');
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
    if (!freelancerId) {
      toast.error('Profile is not loaded yet. Please refresh and try again.');
      return;
    }

    setLoading(true);
    try {
      const response = await (freelancersApi as any).uploadProfilePicture(freelancerId, file);
      const updated = (response as any).data || (response as any).freelancer || response;
      const pictureUrl = updated.ProfilePicture || updated.profile_picture || formData.ProfilePicture;

      setFormData((prev) => ({
        ...prev,
        ProfilePicture: pictureUrl,
      }));

      toast.success('Profile picture updated successfully!');
    } catch (err) {
      console.error('Failed to upload profile picture', err);
      toast.error('Failed to upload profile picture. Please try again.');
    } finally {
      setLoading(false);
      setCropDialogOpen(false);
      setPendingImageFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!freelancerId) {
      toast.error('Profile is not loaded yet. Please refresh and try again.');
      return;
    }

    setLoading(true);
    
    try {
      await freelancersApi.update(freelancerId, {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        PhoneNumber: formData.PhoneNumber || null,
        Location: formData.Location || null,
        Bio: formData.Bio || null,
        ProfilePicture: formData.ProfilePicture || null,
      } as any);
      
      toast.success('Profile updated successfully!');
      navigate('/freelancer/dashboard');
    } catch (err) {
      console.error('Failed to update freelancer profile', err);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/freelancer/dashboard');
  };

  if (initialLoading) {
    return (
      <DashboardLayout userType="freelancer">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout userType="freelancer">
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update your personal information and profile details</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              This information will be visible to employers browsing the marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              {/* Profile Picture */}
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={resolveMediaUrl(formData.ProfilePicture)} />
                    <AvatarFallback>
                      <User className="w-10 h-10" />
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
                      Upload New Photo
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 5MB.</p>
                  </div>
                </div>
              </div>
              
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.FirstName}
                    onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.LastName}
                    onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              {/* Email (read-only or disabled in many cases) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500">Your email address for communication</p>
              </div>
              
              {/* Contact Fields */}
              <div className="grid grid-cols-2 gap-4">
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
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.Location}
                    onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
              </div>
              
              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.Bio}
                  onChange={(e) => setFormData({ ...formData, Bio: e.target.value })}
                  rows={6}
                  placeholder="Tell employers about yourself, your experience, and what you're passionate about..."
                />
                <p className="text-xs text-gray-500">
                  {formData.Bio.length} / 500 characters
                </p>
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
