import { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { authApi, freelancersApi, educationApi } from '../../services/api';

interface Education {
  EducationID: number;
  Degree: string;
  Major: string;
  InstitutionName: string;
  GraduationYear: number;
  GPA: number | null;
}

export default function EducationManagement() {
  const [education, setEducation] = useState<Education[]>([]);
  const [freelancerId, setFreelancerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [formData, setFormData] = useState({
    Degree: '',
    Major: '',
    InstitutionName: '',
    GraduationYear: new Date().getFullYear(),
    GPA: null as number | null,
  });
  
  useEffect(() => {
    const loadEducation = async () => {
      try {
        setInitialLoading(true);
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

        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ');

        const listRes = await freelancersApi.getAll({ search: email });
        const rawList =
          (listRes as any).data?.data ||
          (listRes as any).data ||
          [];
        let freelancer = Array.isArray(rawList)
          ? rawList.find(
              (f: any) => (f.Email || f.email)?.toLowerCase() === email.toLowerCase(),
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

        const id = freelancer.FreelancerID || freelancer.id;
        setFreelancerId(id ?? null);

        // Fetch education data separately
        try {
          const educationRes = await educationApi.getAll();
          const educationRaw = (educationRes as any).data?.data || (educationRes as any).data || [];
          const freelancerEducation = Array.isArray(educationRaw)
            ? educationRaw.filter((e: any) => (e.FreelancerID || e.freelancer_id) === id)
            : [];
          
          const normalized: Education[] = freelancerEducation.map((e: any) => ({
            EducationID: e.EducationID || e.id,
            Degree: e.Degree || e.degree || '',
            Major: e.Major || e.major || '',
            InstitutionName: e.InstitutionName || e.institution_name || '',
            GraduationYear: e.GraduationYear || e.graduation_year || new Date().getFullYear(),
            GPA:
              e.GPA !== undefined && e.GPA !== null
                ? Number(e.GPA)
                : e.gpa !== undefined && e.gpa !== null
                  ? Number(e.gpa)
                  : null,
          }));

          setEducation(normalized);
        } catch (eduErr) {
          console.error('Failed to load education data:', eduErr);
          setEducation([]); // Set empty array if education fetch fails
        }
        setError(null);
      } catch (err) {
        console.error('Failed to load education', err);
        setError('Failed to load your education history. Please try again later.');
        toast.error('Failed to load your education history.');
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    loadEducation();
  }, []);
  
  const resetForm = () => {
    setFormData({
      Degree: '',
      Major: '',
      InstitutionName: '',
      GraduationYear: new Date().getFullYear(),
      GPA: null,
    });
  };
  
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!freelancerId) {
      toast.error('Freelancer profile is not loaded yet. Please refresh and try again.');
      return;
    }

    try {
      setLoading(true);

      const response = await educationApi.create({
        FreelancerID: freelancerId,
        Degree: formData.Degree,
        Major: formData.Major,
        InstitutionName: formData.InstitutionName,
        GraduationYear: formData.GraduationYear,
        GPA: formData.GPA ?? null,
      });

      const created = (response as any).data || response;
      const newItem: Education = {
        EducationID: created.EducationID || created.id || Date.now(),
        Degree: created.Degree || formData.Degree,
        Major: created.Major || formData.Major,
        InstitutionName:
          created.InstitutionName || formData.InstitutionName,
        GraduationYear:
          created.GraduationYear || formData.GraduationYear,
        GPA:
          created.GPA !== undefined && created.GPA !== null
            ? Number(created.GPA)
            : created.gpa !== undefined && created.gpa !== null
              ? Number(created.gpa)
              : formData.GPA ?? null,
      };

      setEducation((prev) => [...prev, newItem]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Education added successfully!');
    } catch (err) {
      console.error('Failed to add education', err);
      toast.error('Failed to add education. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (item: Education) => {
    setEditingItem(item);
    setFormData({
      Degree: item.Degree,
      Major: item.Major,
      InstitutionName: item.InstitutionName,
      GraduationYear: item.GraduationYear,
      GPA: item.GPA,
    });
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingItem) return;

    try {
      setLoading(true);

      await educationApi.update(editingItem.EducationID, {
        Degree: formData.Degree,
        Major: formData.Major,
        InstitutionName: formData.InstitutionName,
        GraduationYear: formData.GraduationYear,
        GPA: formData.GPA ?? null,
      });

      setEducation((prev) =>
        prev.map((item) =>
          item.EducationID === editingItem.EducationID
            ? { ...item, ...formData }
            : item,
        ),
      );

      setEditingItem(null);
      resetForm();
      toast.success('Education updated successfully!');
    } catch (err) {
      console.error('Failed to update education', err);
      toast.error('Failed to update education. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;

    try {
      setLoading(true);
      await educationApi.delete(itemId);
      setEducation((prev) => prev.filter((item) => item.EducationID !== itemId));
      toast.success('Education deleted successfully!');
    } catch (err) {
      console.error('Failed to delete education', err);
      toast.error('Failed to delete education. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout userType="freelancer">
      {initialLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading your education...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl mb-2">Education Management</h1>
              <p className="text-gray-600">Manage your educational background</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleAdd}>
                  <DialogHeader>
                    <DialogTitle>Add Education</DialogTitle>
                    <DialogDescription>
                      Add a new education record to your profile
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree *</Label>
                      <Input
                        id="degree"
                        value={formData.Degree}
                        onChange={(e) => setFormData({ ...formData, Degree: e.target.value })}
                        placeholder="e.g. Bachelor of Science, Master of Arts"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="major">Major *</Label>
                      <Input
                        id="major"
                        value={formData.Major}
                        onChange={(e) => setFormData({ ...formData, Major: e.target.value })}
                        placeholder="e.g. Computer Science, Business Administration"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="institutionName">Institution Name *</Label>
                      <Input
                        id="institutionName"
                        value={formData.InstitutionName}
                        onChange={(e) => setFormData({ ...formData, InstitutionName: e.target.value })}
                        placeholder="e.g. Stanford University"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year *</Label>
                        <Input
                          id="graduationYear"
                          type="number"
                          min="1950"
                          max="2030"
                          value={formData.GraduationYear}
                          onChange={(e) => setFormData({ ...formData, GraduationYear: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gpa">GPA (optional)</Label>
                        <Input
                          id="gpa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="4"
                          value={formData.GPA || ''}
                          onChange={(e) => setFormData({ ...formData, GPA: e.target.value ? parseFloat(e.target.value) : null })}
                          placeholder="e.g. 3.8"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Education</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Education Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Education ({education.length})</CardTitle>
              <CardDescription>
                Your academic qualifications and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {education.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No education records added yet</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Education
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Degree & Major</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead>Graduation Year</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {education.map((item) => (
                      <TableRow key={item.EducationID}>
                        <TableCell>
                          <div>
                            <div>{item.Degree}</div>
                            <div className="text-sm text-gray-500">{item.Major}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.InstitutionName}</TableCell>
                        <TableCell>{item.GraduationYear}</TableCell>
                        <TableCell>
                          {item.GPA ? (
                            <Badge variant="outline">{item.GPA.toFixed(2)}</Badge>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog
                              open={editingItem?.EducationID === item.EducationID}
                              onOpenChange={(open: boolean) => {
                                if (!open) setEditingItem(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <form onSubmit={handleUpdate}>
                                  <DialogHeader>
                                    <DialogTitle>Edit Education</DialogTitle>
                                    <DialogDescription>
                                      Update your education information
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="editDegree">Degree *</Label>
                                      <Input
                                        id="editDegree"
                                        value={formData.Degree}
                                        onChange={(e) => setFormData({ ...formData, Degree: e.target.value })}
                                        required
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="editMajor">Major *</Label>
                                      <Input
                                        id="editMajor"
                                        value={formData.Major}
                                        onChange={(e) => setFormData({ ...formData, Major: e.target.value })}
                                        required
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="editInstitutionName">Institution Name *</Label>
                                      <Input
                                        id="editInstitutionName"
                                        value={formData.InstitutionName}
                                        onChange={(e) => setFormData({ ...formData, InstitutionName: e.target.value })}
                                        required
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="editGraduationYear">Graduation Year *</Label>
                                        <Input
                                          id="editGraduationYear"
                                          type="number"
                                          min="1950"
                                          max="2030"
                                          value={formData.GraduationYear}
                                          onChange={(e) => setFormData({ ...formData, GraduationYear: parseInt(e.target.value) })}
                                          required
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="editGpa">GPA (optional)</Label>
                                        <Input
                                          id="editGpa"
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          max="4"
                                          value={formData.GPA || ''}
                                          onChange={(e) => setFormData({ ...formData, GPA: e.target.value ? parseFloat(e.target.value) : null })}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                                      Cancel
                                    </Button>
                                    <Button type="submit">Update Education</Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(item.EducationID)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
