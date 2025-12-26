import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useThemeSettings } from '../../context/ThemeContext';

export default function FreelancerSettings() {
  const { theme, setTheme } = useThemeSettings();

  const handleThemeChange = (value: string) => {
    setTheme(value === 'dark' ? 'dark' : 'light');
  };

  return (
    <DashboardLayout userType="freelancer">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose your preferred color theme for the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
