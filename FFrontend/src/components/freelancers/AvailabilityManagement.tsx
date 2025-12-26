import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Calendar, Clock, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { authApi, freelancersApi, availabilityApi } from '../../services/api';

export default function AvailabilityManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [freelancerId, setFreelancerId] = useState<number | null>(null);
  const [availabilityId, setAvailabilityId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    CurrentProjectsCount: 0,
    ActivityStatus: 'Active',
    NextAvailabilityDate: '',
    WeeklyHoursAvailable: 0,
  });

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setLoading(true);

        const userRes = await authApi.getCurrentUser();
        const apiUser = (userRes as any).user || (userRes as any).data?.user || (userRes as any).user_info;
        const email: string | undefined = apiUser?.email;

        if (!email) {
          throw new Error('Unable to determine current user email.');
        }

        const listRes = await freelancersApi.getAll({ search: email });
        const listData = (listRes as any).data || [];
        const freelancer = Array.isArray(listData)
          ? listData.find(
              (f: any) => (f.Email || f.email)?.toLowerCase() === email.toLowerCase(),
            )
          : null;

        if (!freelancer) {
          toast.error('Freelancer profile not found.');
          return;
        }

        const id = freelancer.FreelancerID || freelancer.id;
        setFreelancerId(id);

        const availability = freelancer.availability || freelancer.Availability || null;
        if (availability) {
          setAvailabilityId(availability.AvailabilityID || availability.id);
          setFormData({
            CurrentProjectsCount:
              availability.CurrentProjectsCount ??
              availability.current_projects_count ??
              0,
            ActivityStatus:
              availability.ActivityStatus ||
              availability.activity_status ||
              'Active',
            NextAvailabilityDate:
              availability.NextAvailabilityDate ||
              availability.next_availability_date ||
              '',
            WeeklyHoursAvailable:
              availability.WeeklyHoursAvailable ??
              availability.weekly_hours_available ??
              0,
          });
        }
      } catch (err) {
        console.error('Failed to load availability', err);
        toast.error('Failed to load availability information.');
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    loadAvailability();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freelancerId) {
      toast.error('Freelancer profile not found.');
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        CurrentProjectsCount: formData.CurrentProjectsCount,
        ActivityStatus: formData.ActivityStatus,
        NextAvailabilityDate: formData.NextAvailabilityDate || null,
        WeeklyHoursAvailable: formData.WeeklyHoursAvailable,
      };

      if (availabilityId) {
        await availabilityApi.update(availabilityId, payload);
      } else {
        await availabilityApi.create({
          FreelancerID: freelancerId,
          ...payload,
        });
      }

      toast.success('Availability updated successfully!');
      navigate('/freelancer/dashboard');
    } catch (err) {
      console.error('Failed to update availability', err);
      toast.error('Failed to update availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Busy': return 'bg-yellow-100 text-yellow-800';
      case 'Not Available': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <DashboardLayout userType="freelancer">
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Availability Management</h1>
          <p className="text-gray-600">
            Keep your availability status up to date for potential employers
          </p>
          {initialLoading && (
            <p className="text-sm text-gray-500 mt-2">
              Loading your current availability...
            </p>
          )}
        </div>
        
        {/* Current Status Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                  <div className="text-2xl">{formData.CurrentProjectsCount}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Hours/Week</div>
                  <div className="text-2xl">{formData.WeeklyHoursAvailable}h</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <Badge className={getStatusColor(formData.ActivityStatus)}>
                    {formData.ActivityStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Update Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Availability</CardTitle>
            <CardDescription>
              Let employers know when you're available for new projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Activity Status */}
              <div className="space-y-2">
                <Label htmlFor="activityStatus">Activity Status *</Label>
                <Select 
                  value={formData.ActivityStatus} 
                  onValueChange={(value: string) => setFormData({ ...formData, ActivityStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active - Available for new projects</SelectItem>
                    <SelectItem value="Busy">Busy - Limited availability</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  This status will be visible to employers viewing your profile
                </p>
              </div>
              
              {/* Current Projects Count */}
              <div className="space-y-2">
                <Label htmlFor="currentProjectsCount">Current Projects Count</Label>
                <Input
                  id="currentProjectsCount"
                  type="number"
                  min="0"
                  value={formData.CurrentProjectsCount}
                  onChange={(e) => setFormData({ ...formData, CurrentProjectsCount: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-gray-500">
                  Number of projects you're currently working on
                </p>
              </div>
              
              {/* Next Availability Date */}
              <div className="space-y-2">
                <Label htmlFor="nextAvailabilityDate">Next Availability Date</Label>
                <Input
                  id="nextAvailabilityDate"
                  type="date"
                  value={formData.NextAvailabilityDate}
                  onChange={(e) => setFormData({ ...formData, NextAvailabilityDate: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  When will you be available to start a new project?
                </p>
              </div>
              
              {/* Weekly Hours Available */}
              <div className="space-y-2">
                <Label htmlFor="weeklyHoursAvailable">Weekly Hours Available</Label>
                <Input
                  id="weeklyHoursAvailable"
                  type="number"
                  min="0"
                  max="168"
                  value={formData.WeeklyHoursAvailable}
                  onChange={(e) => setFormData({ ...formData, WeeklyHoursAvailable: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-gray-500">
                  How many hours per week can you commit to new projects?
                </p>
              </div>
              
              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>Tip:</strong> Keeping your availability up to date helps employers understand when they can work with you. Profiles with current availability information get more inquiries.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Availability'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/freelancer/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
