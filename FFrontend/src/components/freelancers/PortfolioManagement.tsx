import { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { authApi, freelancersApi, portfolioApi } from '../../services/api';

interface PortfolioItem {
  PortfolioID: number;
  ProjectTitle: string;
  ProjectDescription: string;
  TechnologiesUsed: string;
  CompletionDate: string;
  ProjectURL: string;
  ProjectFile: string | null;
}

export default function PortfolioManagement() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [freelancerId, setFreelancerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    ProjectTitle: '',
    ProjectDescription: '',
    TechnologiesUsed: '',
    CompletionDate: '',
    ProjectURL: '',
    ProjectFile: null as string | null,
  });
  
  useEffect(() => {
    const loadPortfolio = async () => {
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

        const portfolioData =
          (freelancer as any).portfolio_work ||
          (freelancer as any).portfolioWork ||
          [];
        const normalized: PortfolioItem[] = Array.isArray(portfolioData)
          ? portfolioData.map((p: any) => ({
              PortfolioID: p.PortfolioID || p.id,
              ProjectTitle: p.ProjectTitle || p.project_title || '',
              ProjectDescription:
                p.ProjectDescription || p.project_description || '',
              TechnologiesUsed:
                p.TechnologiesUsed || p.technologies_used || '',
              CompletionDate:
                p.CompletionDate || p.completion_date || '',
              ProjectURL: p.ProjectURL || p.project_url || '',
              ProjectFile: p.ProjectFile || p.project_file || null,
            }))
          : [];

        setItems(normalized);
        setError(null);
      } catch (err) {
        console.error('Failed to load portfolio', err);
        setError('Failed to load your portfolio. Please try again later.');
        toast.error('Failed to load your portfolio.');
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    loadPortfolio();
  }, []);
  
  const resetForm = () => {
    setFormData({
      ProjectTitle: '',
      ProjectDescription: '',
      TechnologiesUsed: '',
      CompletionDate: '',
      ProjectURL: '',
      ProjectFile: null,
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

      const response = await portfolioApi.create({
        FreelancerID: freelancerId,
        ProjectTitle: formData.ProjectTitle,
        ProjectDescription: formData.ProjectDescription || undefined,
        TechnologiesUsed: formData.TechnologiesUsed || undefined,
        CompletionDate: formData.CompletionDate || undefined,
        ProjectURL: formData.ProjectURL || undefined,
        ProjectFile: formData.ProjectFile,
      });

      const created = (response as any).data || response;
      const newItem: PortfolioItem = {
        PortfolioID: created.PortfolioID || created.id || Date.now(),
        ProjectTitle: created.ProjectTitle || formData.ProjectTitle,
        ProjectDescription:
          created.ProjectDescription || formData.ProjectDescription,
        TechnologiesUsed:
          created.TechnologiesUsed || formData.TechnologiesUsed,
        CompletionDate:
          created.CompletionDate || formData.CompletionDate,
        ProjectURL: created.ProjectURL || formData.ProjectURL,
        ProjectFile: created.ProjectFile || formData.ProjectFile,
      };

      setItems((prev) => [...prev, newItem]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Portfolio item added successfully!');
    } catch (err) {
      console.error('Failed to add portfolio item', err);
      toast.error('Failed to add portfolio item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      ProjectTitle: item.ProjectTitle,
      ProjectDescription: item.ProjectDescription,
      TechnologiesUsed: item.TechnologiesUsed,
      CompletionDate: item.CompletionDate,
      ProjectURL: item.ProjectURL,
      ProjectFile: item.ProjectFile,
    });
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingItem) return;

    try {
      setLoading(true);

      await portfolioApi.update(editingItem.PortfolioID, {
        ProjectTitle: formData.ProjectTitle,
        ProjectDescription: formData.ProjectDescription,
        TechnologiesUsed: formData.TechnologiesUsed,
        CompletionDate: formData.CompletionDate || undefined,
        ProjectURL: formData.ProjectURL,
        ProjectFile: formData.ProjectFile,
      });

      setItems((prev) =>
        prev.map((item) =>
          item.PortfolioID === editingItem.PortfolioID
            ? { ...item, ...formData }
            : item,
        ),
      );

      setEditingItem(null);
      resetForm();
      toast.success('Portfolio item updated successfully!');
    } catch (err) {
      console.error('Failed to update portfolio item', err);
      toast.error('Failed to update portfolio item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      setLoading(true);
      await portfolioApi.delete(itemId);
      setItems((prev) => prev.filter((item) => item.PortfolioID !== itemId));
      toast.success('Portfolio item deleted successfully!');
    } catch (err) {
      console.error('Failed to delete portfolio item', err);
      toast.error('Failed to delete portfolio item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout userType="freelancer">
      {initialLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading your portfolio...</div>
        </div>
      ) : (
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">Portfolio Management</h1>
            <p className="text-gray-600">Showcase your best work to potential clients</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Portfolio Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleAdd}>
                <DialogHeader>
                  <DialogTitle>Add Portfolio Item</DialogTitle>
                  <DialogDescription>
                    Add a new project to your portfolio
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title *</Label>
                    <Input
                      id="projectTitle"
                      value={formData.ProjectTitle}
                      onChange={(e) => setFormData({ ...formData, ProjectTitle: e.target.value })}
                      placeholder="e.g. E-commerce Platform"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectDescription">Project Description</Label>
                    <Textarea
                      id="projectDescription"
                      value={formData.ProjectDescription}
                      onChange={(e) => setFormData({ ...formData, ProjectDescription: e.target.value })}
                      placeholder="Describe the project, your role, and key achievements..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="technologiesUsed">Technologies Used</Label>
                    <Input
                      id="technologiesUsed"
                      value={formData.TechnologiesUsed}
                      onChange={(e) => setFormData({ ...formData, TechnologiesUsed: e.target.value })}
                      placeholder="React, Node.js, PostgreSQL"
                    />
                    <p className="text-xs text-gray-500">Separate technologies with commas</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="completionDate">Completion Date</Label>
                      <Input
                        id="completionDate"
                        type="date"
                        value={formData.CompletionDate}
                        onChange={(e) => setFormData({ ...formData, CompletionDate: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="projectURL">Project URL</Label>
                      <Input
                        id="projectURL"
                        type="url"
                        value={formData.ProjectURL}
                        onChange={(e) => setFormData({ ...formData, ProjectURL: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Portfolio Item</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Portfolio Grid */}
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-gray-500 mb-4">No portfolio items yet</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Project
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {items.map((item) => (
              <Card key={item.PortfolioID}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{item.ProjectTitle}</CardTitle>
                      <CardDescription>
                        Completed:{' '}
                        {item.CompletionDate
                          ? new Date(item.CompletionDate).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Not specified'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog
                        open={editingItem?.PortfolioID === item.PortfolioID}
                        onOpenChange={(open: boolean) => {
                          if (!open) setEditingItem(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <form onSubmit={handleUpdate}>
                            <DialogHeader>
                              <DialogTitle>Edit Portfolio Item</DialogTitle>
                              <DialogDescription>
                                Update your project information
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="editProjectTitle">Project Title *</Label>
                                <Input
                                  id="editProjectTitle"
                                  value={formData.ProjectTitle}
                                  onChange={(e) => setFormData({ ...formData, ProjectTitle: e.target.value })}
                                  required
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="editProjectDescription">Project Description</Label>
                                <Textarea
                                  id="editProjectDescription"
                                  value={formData.ProjectDescription}
                                  onChange={(e) => setFormData({ ...formData, ProjectDescription: e.target.value })}
                                  rows={4}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="editTechnologiesUsed">Technologies Used</Label>
                                <Input
                                  id="editTechnologiesUsed"
                                  value={formData.TechnologiesUsed}
                                  onChange={(e) => setFormData({ ...formData, TechnologiesUsed: e.target.value })}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editCompletionDate">Completion Date</Label>
                                  <Input
                                    id="editCompletionDate"
                                    type="date"
                                    value={formData.CompletionDate}
                                    onChange={(e) => setFormData({ ...formData, CompletionDate: e.target.value })}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="editProjectURL">Project URL</Label>
                                  <Input
                                    id="editProjectURL"
                                    type="url"
                                    value={formData.ProjectURL}
                                    onChange={(e) => setFormData({ ...formData, ProjectURL: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                                Cancel
                              </Button>
                              <Button type="submit">Update Portfolio Item</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(item.PortfolioID)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{item.ProjectDescription}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.TechnologiesUsed.split(',').map((tech, i) => (
                      <Badge key={i} variant="secondary">
                        {tech.trim()}
                      </Badge>
                    ))}
                  </div>
                  
                  {item.ProjectURL && (
                    <a 
                      href={item.ProjectURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      )}
    </DashboardLayout>
  );
}
