import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, Shield, Loader2 } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const LoginForm = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // State to keep track of the active tab for the toast message
  const [activeTab, setActiveTab] = useState<UserRole>('patient');

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // FIX: The `login` function doesn't need the `role` argument.
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success(`Welcome! Logged in as ${activeTab}`);
      }
      // Note: The specific error toast for invalid credentials is handled in the AuthContext now.
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-medical">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-medical rounded-full flex items-center justify-center mb-4">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">DentalCare System</CardTitle>
          <p className="text-muted-foreground">Secure access to your dental records</p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="patient" onValueChange={(value) => setActiveTab(value as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="patient" className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-email">Email Address</Label>
                  <Input
                    id="patient-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-password">Password</Label>
                  <Input
                    id="patient-password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-gradient-medical hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Sign In as Patient
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Demo: patient@dental.com / patient123
                </p>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@dental.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-medical-blue hover:bg-medical-blue/90"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Sign In as Admin
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Demo: admin@dental.com / admin123
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};