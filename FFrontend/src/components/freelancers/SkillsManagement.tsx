import { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Pencil, Trash2, Award } from 'lucide-react';
import { toast } from 'sonner';
import { authApi, freelancersApi, skillsApi } from '../../services/api';

interface Skill {
  SkillID: number;
  SkillName: string;
  ProficiencyLevel: string;
  YearsOfExperience: number;
  Certification: 'Yes' | 'No';
}

export default function SkillsManagement() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [freelancerId, setFreelancerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    SkillName: '',
    ProficiencyLevel: 'Beginner',
    YearsOfExperience: 0,
    Certification: 'No' as 'Yes' | 'No',
  });
  
  useEffect(() => {
    const loadSkills = async () => {
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

        const skillsData = Array.isArray((freelancer as any).skills)
          ? (freelancer as any).skills
          : [];
        const normalized: Skill[] = skillsData.map((s: any) => ({
          SkillID: s.SkillID || s.id,
          SkillName: s.SkillName || s.skill_name || '',
          ProficiencyLevel: s.ProficiencyLevel || s.proficiency_level || 'Beginner',
          YearsOfExperience:
            s.YearsOfExperience ?? s.years_of_experience ?? 0,
          Certification:
            (s.Certification || s.certification) === 'Yes' ? 'Yes' : 'No',
        }));

        setSkills(normalized);
        setError(null);
      } catch (err) {
        console.error('Failed to load skills', err);
        setError('Failed to load your skills. Please try again later.');
        toast.error('Failed to load your skills.');
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    loadSkills();
  }, []);
  
  const resetForm = () => {
    setFormData({
      SkillName: '',
      ProficiencyLevel: 'Beginner',
      YearsOfExperience: 0,
      Certification: 'No',
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

      const response = await skillsApi.create({
        FreelancerID: freelancerId,
        SkillName: formData.SkillName,
        ProficiencyLevel: formData.ProficiencyLevel,
        YearsOfExperience: formData.YearsOfExperience,
        Certification: formData.Certification,
      });

      const created = (response as any).data || response;
      const newSkill: Skill = {
        SkillID: created.SkillID || created.id || Date.now(),
        SkillName: created.SkillName || formData.SkillName,
        ProficiencyLevel:
          created.ProficiencyLevel || formData.ProficiencyLevel,
        YearsOfExperience:
          created.YearsOfExperience ?? formData.YearsOfExperience,
        Certification:
          (created.Certification || formData.Certification) === 'Yes'
            ? 'Yes'
            : 'No',
      };

      setSkills((prev) => [...prev, newSkill]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Skill added successfully!');
    } catch (err) {
      console.error('Failed to add skill', err);
      toast.error('Failed to add skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      SkillName: skill.SkillName,
      ProficiencyLevel: skill.ProficiencyLevel,
      YearsOfExperience: skill.YearsOfExperience,
      Certification: skill.Certification,
    });
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSkill) return;

    try {
      setLoading(true);

      await skillsApi.update(editingSkill.SkillID, {
        SkillName: formData.SkillName,
        ProficiencyLevel: formData.ProficiencyLevel,
        YearsOfExperience: formData.YearsOfExperience,
        Certification: formData.Certification,
      });

      setSkills((prev) =>
        prev.map((s) =>
          s.SkillID === editingSkill.SkillID
            ? { ...s, ...formData }
            : s,
        ),
      );

      setEditingSkill(null);
      resetForm();
      toast.success('Skill updated successfully!');
    } catch (err) {
      console.error('Failed to update skill', err);
      toast.error('Failed to update skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (skillId: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      setLoading(true);
      await skillsApi.delete(skillId);
      setSkills((prev) => prev.filter((s) => s.SkillID !== skillId));
      toast.success('Skill deleted successfully!');
    } catch (err) {
      console.error('Failed to delete skill', err);
      toast.error('Failed to delete skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Beginner': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <DashboardLayout userType="freelancer">
      {initialLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading your skills...</div>
        </div>
      ) : (
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">Skills Management</h1>
            <p className="text-gray-600">Manage your skills and proficiency levels</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAdd}>
                <DialogHeader>
                  <DialogTitle>Add New Skill</DialogTitle>
                  <DialogDescription>
                    Add a new skill to your profile
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="skillName">Skill Name *</Label>
                    <Input
                      id="skillName"
                      value={formData.SkillName}
                      onChange={(e) => setFormData({ ...formData, SkillName: e.target.value })}
                      placeholder="e.g. React, Python, Figma"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="proficiencyLevel">Proficiency Level *</Label>
                    <Select 
                      value={formData.ProficiencyLevel} 
                      onValueChange={(value: string) =>
                        setFormData({ ...formData, ProficiencyLevel: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      value={formData.YearsOfExperience}
                      onChange={(e) => setFormData({ ...formData, YearsOfExperience: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certification">Certification</Label>
                    <Select 
                      value={formData.Certification} 
                      onValueChange={(value: 'Yes' | 'No') =>
                        setFormData({ ...formData, Certification: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Skill</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Skills Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Skills ({skills.length})</CardTitle>
            <CardDescription>
              Showcase your expertise to potential employers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {skills.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No skills added yet</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Skill
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill Name</TableHead>
                    <TableHead>Proficiency</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Certification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills.map((skill) => (
                    <TableRow key={skill.SkillID}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{skill.SkillName}</span>
                          {skill.Certification === 'Yes' && (
                            <Award className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getProficiencyColor(skill.ProficiencyLevel)}>
                          {skill.ProficiencyLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>{skill.YearsOfExperience} years</TableCell>
                      <TableCell>
                        <Badge variant={skill.Certification === 'Yes' ? 'default' : 'outline'}>
                          {skill.Certification}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={editingSkill?.SkillID === skill.SkillID}
                            onOpenChange={(open: boolean) => {
                              if (!open) setEditingSkill(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <form onSubmit={handleUpdate}>
                                <DialogHeader>
                                  <DialogTitle>Edit Skill</DialogTitle>
                                  <DialogDescription>
                                    Update your skill information
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="editSkillName">Skill Name *</Label>
                                    <Input
                                      id="editSkillName"
                                      value={formData.SkillName}
                                      onChange={(e) => setFormData({ ...formData, SkillName: e.target.value })}
                                      required
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="editProficiencyLevel">Proficiency Level *</Label>
                                    <Select 
                                      value={formData.ProficiencyLevel} 
                                      onValueChange={(value: string) =>
                                        setFormData({
                                          ...formData,
                                          ProficiencyLevel: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Expert">Expert</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="editYearsOfExperience">Years of Experience</Label>
                                    <Input
                                      id="editYearsOfExperience"
                                      type="number"
                                      min="0"
                                      value={formData.YearsOfExperience}
                                      onChange={(e) => setFormData({ ...formData, YearsOfExperience: parseInt(e.target.value) || 0 })}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="editCertification">Certification</Label>
                                    <Select 
                                      value={formData.Certification} 
                                      onValueChange={(value: 'Yes' | 'No') =>
                                        setFormData({
                                          ...formData,
                                          Certification: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="No">No</SelectItem>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <Button type="button" variant="outline" onClick={() => setEditingSkill(null)}>
                                    Cancel
                                  </Button>
                                  <Button type="submit">Update Skill</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(skill.SkillID)}
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
