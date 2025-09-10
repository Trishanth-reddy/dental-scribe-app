import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, FileImage, Calendar, Clock, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data for patient submissions
const mockSubmissions = [
  {
    id: '1',
    fileName: 'teeth_scan_2024_01.jpg',
    uploadDate: '2024-01-15T10:30:00Z',
    status: 'reviewed',
    notes: 'Routine checkup scan',
    adminNotes: 'Good overall condition, minor plaque buildup noted',
    hasAnnotations: true
  },
  {
    id: '2', 
    fileName: 'teeth_scan_2024_02.jpg',
    uploadDate: '2024-01-20T14:15:00Z',
    status: 'pending',
    notes: 'Follow-up after cleaning',
    adminNotes: null,
    hasAnnotations: false
  }
];

export const PatientDashboard = () => {
  const { user } = useAuth();

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

  const handleDownloadReport = (submissionId: string) => {
    // Mock PDF download
    toast.success('Downloading report... (Demo only)');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Patient ID: {user?.patientId}</p>
        </div>
        <Link to="/patient/upload">
          <Button className="bg-gradient-medical hover:opacity-90 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload New Image
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold text-primary">{mockSubmissions.length}</p>
              </div>
              <FileImage className="w-8 h-8 text-medical-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-medical-orange">
                  {mockSubmissions.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-medical-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reviewed</p>
                <p className="text-2xl font-bold text-medical-green">
                  {mockSubmissions.filter(s => s.status === 'reviewed').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-medical-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            My Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSubmissions.map((submission) => (
              <div key={submission.id} className="border border-border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{submission.fileName}</h3>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Uploaded: {formatDate(submission.uploadDate)}
                    </p>
                    {submission.notes && (
                      <p className="text-sm text-foreground mb-2">
                        <span className="font-medium">Your notes:</span> {submission.notes}
                      </p>
                    )}
                    {submission.adminNotes && (
                      <p className="text-sm text-medical-blue">
                        <span className="font-medium">Doctor's notes:</span> {submission.adminNotes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {submission.hasAnnotations && (
                      <Button
                        onClick={() => handleDownloadReport(submission.id)}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Report
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};