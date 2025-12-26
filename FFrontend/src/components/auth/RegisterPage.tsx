import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { authApi } from '../../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'freelancer' | 'employer'>('freelancer');
  const [loading, setLoading] = useState(false);
  
  const [freelancerData, setFreelancerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    location: '',
  });
  
  const [employerData, setEmployerData] = useState({
    companyName: '',
    contactPersonName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    industryType: '',
  });
  
  const handleFreelancerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (freelancerData.password !== freelancerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const name = `${freelancerData.firstName} ${freelancerData.lastName}`.trim();
      await authApi.register({
        name,
        email: freelancerData.email,
        password: freelancerData.password,
        password_confirmation: freelancerData.confirmPassword,
        user_type: 'freelancer',
      } as any);
      toast.success('Account created successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error('Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmployerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (employerData.password !== employerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const name = employerData.companyName || employerData.contactPersonName;
      await authApi.register({
        name,
        email: employerData.email,
        password: employerData.password,
        password_confirmation: employerData.confirmPassword,
        user_type: 'employer',
      } as any);
      toast.success('Account created successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error('Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <img
              src="/Logo.png"
              alt="Freeport logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl mb-2">Join Freeport</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>
        
        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <Tabs value={accountType} onValueChange={(v: string) => setAccountType(v as 'freelancer' | 'employer')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="freelancer">I'm a Freelancer</TabsTrigger>
              <TabsTrigger value="employer">I'm an Employer</TabsTrigger>
            </TabsList>
            
            {/* Freelancer Form */}
            <TabsContent value="freelancer">
              <form onSubmit={handleFreelancerSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={freelancerData.firstName}
                      onChange={(e) => setFreelancerData({ ...freelancerData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={freelancerData.lastName}
                      onChange={(e) => setFreelancerData({ ...freelancerData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={freelancerData.email}
                    onChange={(e) => setFreelancerData({ ...freelancerData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={freelancerData.password}
                      onChange={(e) => setFreelancerData({ ...freelancerData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={freelancerData.confirmPassword}
                      onChange={(e) => setFreelancerData({ ...freelancerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={freelancerData.phoneNumber}
                      onChange={(e) => setFreelancerData({ ...freelancerData, phoneNumber: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={freelancerData.location}
                      onChange={(e) => setFreelancerData({ ...freelancerData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Freelancer Account'}
                </Button>
              </form>
            </TabsContent>
            
            {/* Employer Form */}
            <TabsContent value="employer">
              <form onSubmit={handleEmployerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={employerData.companyName}
                    onChange={(e) => setEmployerData({ ...employerData, companyName: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                  <Input
                    id="contactPersonName"
                    value={employerData.contactPersonName}
                    onChange={(e) => setEmployerData({ ...employerData, contactPersonName: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employerEmail">Email *</Label>
                  <Input
                    id="employerEmail"
                    type="email"
                    value={employerData.email}
                    onChange={(e) => setEmployerData({ ...employerData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employerPassword">Password *</Label>
                    <Input
                      id="employerPassword"
                      type="password"
                      value={employerData.password}
                      onChange={(e) => setEmployerData({ ...employerData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employerConfirmPassword">Confirm Password *</Label>
                    <Input
                      id="employerConfirmPassword"
                      type="password"
                      value={employerData.confirmPassword}
                      onChange={(e) => setEmployerData({ ...employerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employerPhoneNumber">Phone Number</Label>
                    <Input
                      id="employerPhoneNumber"
                      type="tel"
                      value={employerData.phoneNumber}
                      onChange={(e) => setEmployerData({ ...employerData, phoneNumber: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industryType">Industry Type</Label>
                    <Input
                      id="industryType"
                      value={employerData.industryType}
                      onChange={(e) => setEmployerData({ ...employerData, industryType: e.target.value })}
                      placeholder="e.g. Technology, Finance"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Employer Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
