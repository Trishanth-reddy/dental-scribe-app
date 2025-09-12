import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Download, Loader2, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPatientSubmissions } from '@/lib/apiService';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Submission } from '@/types';

export const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const { data: submissions, isLoading, isError } = useQuery<Submission[]>({
    queryKey: ['patientSubmissions'],
    queryFn: fetchPatientSubmissions,
  });

  const totalSubmissions = submissions?.length || 0;
  const reviewedSubmissions = submissions?.filter(s => s.status === 'reviewed').length || 0;

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-16 h-16 animate-spin text-primary" /></div>;
  if (isError) return <div className="text-center py-8 text-red-500">Failed to load submissions. Please try again.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your submissions.</p>
        </div>
        <Link to="/patient/upload">
          <Button className="bg-gradient-medical hover:opacity-90 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            New Submission
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed Reports</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions && submissions.length > 0 ? (
              submissions.map((submission) => (
                <div key={submission._id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="font-semibold break-all">{submission.originalImageUrl.split('/').pop()}</h3>
                       <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Uploaded: {formatDate(submission.createdAt)}</p>
                    {submission.status === 'reviewed' && submission.adminNotes && (
                      <p className="text-sm text-foreground mt-2 bg-blue-50 p-2 rounded-md">
                        <b>Doctor's notes:</b> {submission.adminNotes}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {submission.status === 'reviewed' && submission.pdfReportUrl ? (
                      <a href={submission.pdfReportUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="flex items-center gap-2">
                          <Download className="w-4 h-4" /> 
                          Download Report
                        </Button>
                      </a>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Awaiting Review
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You have no submissions yet.</p>
                <Link to="/patient/upload">
                  <Button>Make Your First Submission</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};