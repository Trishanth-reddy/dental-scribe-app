import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/navigation/Navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { PatientDashboard } from "@/components/patient/PatientDashboard";
import { ImageUpload } from "@/components/patient/ImageUpload";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSubmissions } from "@/components/admin/AdminSubmissions";
import { ImageAnnotation } from "@/components/admin/ImageAnnotation";
import NotFound from "./pages/NotFound";
import { injectSpeedInsights } from '@vercel/speed-insights';


injectSpeedInsights();

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'patient' | 'admin' }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginForm />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

// App Routes Component
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {user && <Navigation />}
      <Routes>
        <Route path="/" element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} replace />
          ) : (
            <LoginForm />
          )
        } />
        
        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute requiredRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/upload" element={
          <ProtectedRoute requiredRole="patient">
            <ImageUpload />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/submissions" element={
          <ProtectedRoute requiredRole="admin">
            <AdminSubmissions />
          </ProtectedRoute>
        } />
        <Route path="/admin/review/:submissionId" element={
          <ProtectedRoute requiredRole="admin">
            <ImageAnnotation />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
