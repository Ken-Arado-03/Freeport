import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Home, User, Settings, Search, Bell, Calendar } from 'lucide-react';

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/freeport-logo.png"
                alt="Freeport logo"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl">Freeport Design System</h1>
            </div>
            <Link to="/">
              <Button variant="outline">Back to App</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-4xl mb-3">Design System</h2>
          <p className="text-xl text-gray-600">
            A comprehensive component library and style guide for the Freeport freelancing marketplace
          </p>
        </div>
        
        {/* Colors */}
        <section className="mb-12">
          <h3 className="text-2xl mb-6">Colors</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Primary Blue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-16 bg-blue-600 rounded-lg"></div>
                  <p className="text-sm text-gray-600">Blue 600 - Primary actions</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Status Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-12 bg-green-600 rounded-lg"></div>
                  <div className="h-12 bg-yellow-600 rounded-lg"></div>
                  <div className="h-12 bg-red-600 rounded-lg"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Neutral Grays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-12 bg-gray-900 rounded-lg"></div>
                  <div className="h-12 bg-gray-600 rounded-lg"></div>
                  <div className="h-12 bg-gray-300 rounded-lg"></div>
                  <div className="h-12 bg-gray-50 rounded-lg border border-gray-200"></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Background</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-sm">White</div>
                  <div className="h-12 bg-gray-50 rounded-lg flex items-center justify-center text-sm">Gray 50</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Typography */}
        <section className="mb-12">
          <h3 className="text-2xl mb-6">Typography</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Heading 1</p>
                  <h1>The quick brown fox jumps over the lazy dog</h1>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 mb-2">Heading 2</p>
                  <h2>The quick brown fox jumps over the lazy dog</h2>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 mb-2">Heading 3</p>
                  <h3>The quick brown fox jumps over the lazy dog</h3>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 mb-2">Body Text</p>
                  <p>The quick brown fox jumps over the lazy dog. This is regular body text used throughout the application for descriptions, content, and general text.</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 mb-2">Small Text</p>
                  <p className="text-sm">The quick brown fox jumps over the lazy dog</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Buttons */}
        <section className="mb-12">
          <h3 className="text-2xl mb-6">Buttons</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-3">Primary Buttons</p>
                  <div className="flex flex-wrap gap-3">
                    <Button>Default</Button>
                    <Button size="sm">Small</Button>
                    <Button size="lg">Large</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 mb-3">Secondary & Outline Buttons</p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 mb-3">Destructive Button</p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="destructive">Delete</Button>
                    <Button variant="destructive" variant="outline">Remove</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 mb-3">Buttons with Icons</p>
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Button>
                    <Button variant="outline">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Bell className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Form Inputs */}
        <section className="mb-12">
          <h3 className="text-2xl mb-6">Form Inputs</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="demo-input">Text Input</Label>
                  <Input id="demo-input" placeholder="Enter text..." />
                  <p className="text-xs text-gray-500">Helper text for additional context</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="demo-email">Email Input</Label>
                  <Input id="demo-email" type="email" placeholder="you@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="demo-search">Search Input</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="demo-search" placeholder="Search..." className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="demo-textarea">Textarea</Label>
                  <Textarea id="demo-textarea" placeholder="Enter a longer description..." rows={4} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="demo-select">Select</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="demo-date">Date Input</Label>
                  <Input id="demo-date" type="date" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox id="demo-checkbox" />
                  <Label htmlFor="demo-checkbox" className="cursor-pointer">
                    Checkbox option
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Badges & Tags */}
        <section className="mb-12">
          <h3 className="text-2xl mb-6">Badges & Tags</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-3">Default Badges</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 mb-3">Status Badges</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Busy</Badge>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unavailable</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 mb-3">Skill Tags</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">Figma</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Avatars */}
        <section className="mb-12">
          <h3 className="text-2xl mb-6">Avatars</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-3">Sizes</p>
                  <div className="flex items-end gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-16 h-16">
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-20 h-20">
                      <AvatarFallback>LG</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-24 h-24">
                      <AvatarFallback>XL</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 mb-3">With Icons</p>
                  <div className="flex gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback>
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Cards */}
        <section className="mb-12">
          <h3 className="text-2xl mb-6">Cards</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description text goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content with body text. Cards are used throughout the application to contain related information and actions.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4>Card with Avatar</h4>
                    <p className="text-sm text-gray-600">Supporting text information</p>
                  </div>
                  <Button variant="outline" size="sm">Action</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Progress & Other Components */}
        <section className="mb-12">
          <h3 className="text-2xl mb-6">Other Components</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6 max-w-xl">
                <div>
                  <p className="text-sm text-gray-500 mb-3">Progress Bar</p>
                  <Progress value={65} />
                  <p className="text-xs text-gray-500 mt-2">65% complete</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 mb-3">Tabs</p>
                  <Tabs defaultValue="tab1">
                    <TabsList>
                      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                      <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                      <p className="py-4">Content for tab 1</p>
                    </TabsContent>
                    <TabsContent value="tab2">
                      <p className="py-4">Content for tab 2</p>
                    </TabsContent>
                    <TabsContent value="tab3">
                      <p className="py-4">Content for tab 3</p>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 mb-3">Icons (Lucide React)</p>
                  <div className="flex gap-4">
                    <Home className="w-6 h-6" />
                    <User className="w-6 h-6" />
                    <Settings className="w-6 h-6" />
                    <Search className="w-6 h-6" />
                    <Bell className="w-6 h-6" />
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Layout Examples */}
        <section className="mb-12">
          <h3 className="text-2xl mb-6">Layout Principles</h3>
          <Card>
            <CardHeader>
              <CardTitle>Spacing & Layout</CardTitle>
              <CardDescription>
                The design system uses consistent spacing and layout principles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Container max-width: 1280px (max-w-7xl) for main content</li>
                <li>• Responsive grid: 1, 2, 3, or 4 columns based on breakpoints</li>
                <li>• Consistent spacing: 4px increments (gap-2, gap-4, gap-6, etc.)</li>
                <li>• Card padding: p-6 or p-8 for larger cards</li>
                <li>• Border radius: rounded-lg (8px) for cards, rounded-xl (12px) for larger elements</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
