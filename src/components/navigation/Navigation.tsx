import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Shield, Upload, Database } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = user.role === 'admin' 
    ? [
        { path: '/admin/dashboard', label: 'Dashboard', icon: Database },
        { path: '/admin/submissions', label: 'Patient Submissions', icon: User }
      ]
    : [
        { path: '/patient/dashboard', label: 'My Dashboard', icon: User },
        { path: '/patient/upload', label: 'Upload Image', icon: Upload }
      ];

  return (
    <nav className="bg-white border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-medical rounded-lg flex items-center justify-center">
                {user.role === 'admin' ? (
                  <Shield className="w-6 h-6 text-white" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">DentalCare</h1>
                <p className="text-sm text-muted-foreground capitalize">{user.role} Portal</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button 
                  variant={location.pathname === path ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              {user.patientId && (
                <p className="text-xs text-muted-foreground">ID: {user.patientId}</p>
              )}
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-border bg-muted/50">
        <div className="flex justify-around py-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button 
                variant={location.pathname === path ? "default" : "ghost"}
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};