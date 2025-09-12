import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileImage, Clock, CheckCircle, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminSubmissions } from '@/lib/apiService';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Submission } from '@/types';

export const AdminDashboard = () => {
  const { data: submissions, isLoading, isError } = useQuery<Submission[]>({
    queryKey: ['adminSubmissions'],
    queryFn: fetchAdminSubmissions,
  });

  const stats = useMemo(() => {
    if (!submissions) {
      return { totalPatients: 0, pendingReviews: 0, completedReviews: 0, todaySubmissions: 0 };
    }
    const patientIds = new Set(submissions.map(s => s.patient._id));
    const today = new Date().toDateString();

    return {
      totalPatients: patientIds.size,
      pendingReviews: submissions.filter(s => s.status === 'pending').length,
      completedReviews: submissions.filter(s => s.status === 'reviewed').length,
      todaySubmissions: submissions.filter(s => new Date(s.createdAt).toDateString() === today).length,
    };
  }, [submissions]);

  const recentSubmissions = useMemo(() => {
    if (!submissions) return [];
    return [...submissions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [submissions]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 mt-10">Failed to load dashboard data.</div>;
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
              <p className="text-2xl font-bold text-primary">{stats.totalPatients}</p>
            </div>
            <Users className="w-8 h-8 text-medical-blue" />
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
              <p className="text-2xl font-bold text-medical-orange">{stats.pendingReviews}</p>
            </div>
            <Clock className="w-8 h-8 text-medical-orange" />
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Reviews</p>
              <p className="text-2xl font-bold text-medical-green">{stats.completedReviews}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-medical-green" />
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Submissions</p>
              <p className="text-2xl font-bold text-primary">{stats.todaySubmissions}</p>
            </div>
            <FileImage className="w-8 h-8 text-primary" />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((submission) => (
                <div key={submission._id} className="border border-border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{submission.patient.name}</h3>
                        <Badge variant="outline">ID: {submission.patient.patientId}</Badge>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <p>Email: {submission.patient.email}</p>
                        <p>File: {submission.originalImageUrl.split('/').pop()}</p>
                        <p>Uploaded: {formatDate(submission.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Link to={`/admin/review/${submission._id}`}>
                        <Button size="sm" className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          {submission.status === 'pending' ? 'Review' : 'View Details'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent submissions found.</p>
            )}
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