import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileImage, Clock, CheckCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for admin stats
const mockStats = {
  totalPatients: 247,
  pendingReviews: 12,
  completedReviews: 156,
  todaySubmissions: 8
};

const recentSubmissions = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    patientId: 'P0001',
    fileName: 'teeth_scan_2024_01.jpg',
    uploadDate: '2024-01-15T10:30:00Z',
    status: 'pending',
    email: 'sarah@example.com'
  },
  {
    id: '2',
    patientName: 'Mike Chen', 
    patientId: 'P0002',
    fileName: 'teeth_scan_2024_02.jpg',
    uploadDate: '2024-01-14T14:15:00Z',
    status: 'reviewed',
    email: 'mike@example.com'
  },
  {
    id: '3',
    patientName: 'Emma Davis',
    patientId: 'P0003', 
    fileName: 'dental_xray_jan.jpg',
    uploadDate: '2024-01-13T09:45:00Z',
    status: 'pending',
    email: 'emma@example.com'
  }
];

export const AdminDashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reviewed': return 'bg-medical-green text-white';
      case 'pending': return 'bg-medical-orange text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage patient submissions and reviews</p>
        </div>
        <Link to="/admin/submissions">
          <Button className="bg-gradient-medical hover:opacity-90 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View All Submissions
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold text-primary">{mockStats.totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-medical-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold text-medical-orange">{mockStats.pendingReviews}</p>
              </div>
              <Clock className="w-8 h-8 text-medical-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Reviews</p>
                <p className="text-2xl font-bold text-medical-green">{mockStats.completedReviews}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-medical-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Submissions</p>
                <p className="text-2xl font-bold text-primary">{mockStats.todaySubmissions}</p>
              </div>
              <FileImage className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="border border-border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{submission.patientName}</h3>
                      <Badge variant="outline">ID: {submission.patientId}</Badge>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p>Email: {submission.email}</p>
                      <p>File: {submission.fileName}</p>
                      <p>Uploaded: {formatDate(submission.uploadDate)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/review/${submission.id}`}>
                      <Button size="sm" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {submission.status === 'pending' ? 'Review' : 'View Details'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Link to="/admin/submissions">
              <Button variant="outline" className="flex items-center gap-2 mx-auto">
                <Eye className="w-4 h-4" />
                View All Submissions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};