import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  Tag
} from 'lucide-react';
import { authApi, employersApi, projectsApi } from '../../services/api';
import { toast } from 'sonner';

interface Project {
  id: number;
  title: string;
  description: string;
  budget?: number;
  duration?: string;
  experience_needed?: string;
  skills_required?: string[];
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  created_at: string;
  applications_count?: number;
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '',
    experience_needed: '',
    skills_required: '',
    status: 'open' as Project['status'],
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const userRes = await authApi.getCurrentUser();
      const apiUser = (userRes as any).user || (userRes as any).data?.user || (userRes as any).user_info;
      const email: string | undefined = apiUser?.email;

      if (!email) {
        throw new Error('Unable to determine current user email.');
      }

      const employersRes = await employersApi.getAll({ search: email });
      const employersData = (employersRes as any).data || [];
      const employer = Array.isArray(employersData)
        ? employersData.find(
            (e: any) => (e.Email || e.email)?.toLowerCase() === email.toLowerCase(),
          )
        : null;

      const employerId = employer?.EmployerID || employer?.id;

      const response = await projectsApi.getAll(
        employerId ? { employer_id: employerId } : undefined,
      );
      const data = (response as any).data || [];
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      // Handle failed project loading gracefully
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        title: formData.title,
        description: formData.description,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        duration: formData.duration || undefined,
        experience_needed: formData.experience_needed || undefined,
        skills_required: formData.skills_required ? formData.skills_required.split(',').map(s => s.trim()) : undefined,
        status: formData.status,
      };

      if (editingProject) {
        await projectsApi.update(editingProject.id, data);
        toast.success('Project updated successfully');
      } else {
        await projectsApi.create(data);
        toast.success('Project created successfully');
      }

      loadProjects();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectsApi.delete(id);
      toast.success('Project deleted');
      loadProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      budget: project.budget?.toString() || '',
      duration: project.duration || '',
      experience_needed: project.experience_needed || '',
      skills_required: project.skills_required?.join(', ') || '',
      status: project.status,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      budget: '',
      duration: '',
      experience_needed: '',
      skills_required: '',
      status: 'open',
    });
    setEditingProject(null);
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <DashboardLayout userType="employer">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Listings</h1>
            <p className="text-gray-500 mt-1">Manage your job postings and project opportunities</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open: boolean) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title *
                  </label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Full-Stack Developer for E-commerce Platform"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed project description, requirements, and expectations..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget ($)
                    </label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 3 months, 6 weeks"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience needed
                  </label>
                  <Input
                    value={formData.experience_needed}
                    onChange={(e) => setFormData({ ...formData, experience_needed: e.target.value })}
                    placeholder="e.g., 3+ years React, senior-level experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Skills (comma-separated)
                  </label>
                  <Input
                    value={formData.skills_required}
                    onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Project['status']) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-4">Create your first project listing to start finding talent</p>
              <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">
                    {project.title}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="space-y-2">
                    {project.budget && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>${project.budget.toLocaleString()}</span>
                      </div>
                    )}
                    {project.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{project.duration}</span>
                      </div>
                    )}
                    {project.experience_needed && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span>{project.experience_needed}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {project.skills_required && project.skills_required.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <Tag className="w-3 h-3" />
                        <span>Required Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.skills_required.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {project.skills_required.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.skills_required.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {project.applications_count !== undefined && (
                    <div className="pt-3 border-t">
                      <span className="text-sm font-medium text-blue-600">
                        {project.applications_count} applications
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
