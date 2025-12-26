import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Link } from 'react-router-dom';
import { 
  User, 
  Lightbulb, 
  Briefcase, 
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProfileData {
  hasBasicInfo: boolean;
  hasSkills: boolean;
  hasPortfolio: boolean;
  hasEducation: boolean;
  hasAvailability: boolean;
  hasBio: boolean;
  hasLocation: boolean;
}

interface ProfileCompletionProps {
  userType: 'freelancer' | 'employer';
  profileData: ProfileData;
}

export default function ProfileCompletion({ userType, profileData }: ProfileCompletionProps) {
  const freelancerSteps = [
    {
      key: 'hasBasicInfo',
      label: 'Basic Information',
      description: 'Add your name, email, and profile picture',
      link: '/freelancer/profile/edit',
      icon: User,
    },
    {
      key: 'hasBio',
      label: 'Professional Bio',
      description: 'Write a compelling bio to attract employers',
      link: '/freelancer/profile/edit',
      icon: User,
    },
    {
      key: 'hasLocation',
      label: 'Location',
      description: 'Add your location to improve discoverability',
      link: '/freelancer/profile/edit',
      icon: User,
    },
    {
      key: 'hasSkills',
      label: 'Skills',
      description: 'Add at least 3 professional skills',
      link: '/freelancer/skills',
      icon: Lightbulb,
    },
    {
      key: 'hasPortfolio',
      label: 'Portfolio',
      description: 'Showcase your best work',
      link: '/freelancer/portfolio',
      icon: Briefcase,
    },
    {
      key: 'hasEducation',
      label: 'Education',
      description: 'Add your educational background',
      link: '/freelancer/education',
      icon: GraduationCap,
    },
    {
      key: 'hasAvailability',
      label: 'Availability',
      description: 'Set your working hours and availability',
      link: '/freelancer/availability',
      icon: Calendar,
    },
  ];

  const employerSteps = [
    {
      key: 'hasBasicInfo',
      label: 'Company Information',
      description: 'Add company name, logo, and contact details',
      link: '/employer/profile/edit',
      icon: User,
    },
    {
      key: 'hasBio',
      label: 'Company Description',
      description: 'Describe your company and what you do',
      link: '/employer/profile/edit',
      icon: User,
    },
    {
      key: 'hasLocation',
      label: 'Location',
      description: 'Add your company location',
      link: '/employer/profile/edit',
      icon: User,
    },
  ];

  const steps = userType === 'freelancer' ? freelancerSteps : employerSteps;
  const completedSteps = steps.filter(step => profileData[step.key as keyof ProfileData]).length;
  const totalSteps = steps.length;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  const isComplete = completionPercentage === 100;

  return (
    <Card className={isComplete ? 'border-green-200 bg-green-50/50' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Profile Completion</h3>
            <p className="text-sm text-gray-500 mt-1">
              {isComplete ? 'Your profile is complete!' : 'Complete your profile to attract more opportunities'}
            </p>
          </div>
          {isComplete && (
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {completedSteps} of {totalSteps} completed
            </span>
            <span className="text-sm font-bold text-blue-600">
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Steps List */}
        {!isComplete && (
          <div className="space-y-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const completed = profileData[step.key as keyof ProfileData];

              return (
                <div
                  key={step.key}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm font-medium ${
                        completed ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {step.description}
                    </p>
                  </div>
                  {!completed && (
                    <Link to={step.link}>
                      <Button size="sm" variant="outline" className="text-xs">
                        Add
                      </Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isComplete && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-700">
              <strong>Great job!</strong> Your profile is fully optimized. Keep it updated to maximize your opportunities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
