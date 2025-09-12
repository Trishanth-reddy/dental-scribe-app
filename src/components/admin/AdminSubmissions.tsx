import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Filter, Calendar, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminSubmissions } from '@/lib/apiService';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Submission } from '@/types';

export const AdminSubmissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: submissions, isLoading, isError } = useQuery<Submission[]>({
    queryKey: ['adminSubmissions'],
    queryFn: fetchAdminSubmissions,
  });

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    
    return submissions
      .filter(submission => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = 
          submission.patient.name.toLowerCase().includes(lowerSearchTerm) ||
          submission.patient.patientId.toLowerCase().includes(lowerSearchTerm) ||
          submission.patient.email.toLowerCase().includes(lowerSearchTerm);
        
        const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'name':
            return a.patient.name.localeCompare(b.patient.name);
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [submissions, searchTerm, statusFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Patient Submissions</h1>
          <p className="text-muted-foreground">Review and manage all patient image submissions</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredSubmissions.length} of {submissions?.length || 0} submissions
        </div>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Patient Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            All Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : isError ? (
              <div className="text-center py-8 text-red-500">Failed to load submissions.</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No submissions found matching your criteria.</p>
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <div key={submission._id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="font-semibold text-foreground text-lg">{submission.patient.name}</h3>
                        <Badge variant="outline">ID: {submission.patient.patientId}</Badge>
                        <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground mb-2">
                        <p><span className="font-medium">Email:</span> {submission.patient.email}</p>
                        <p><span className="font-medium">File:</span> {submission.originalImageUrl.split('/').pop()}</p>
                        <p><span className="font-medium">Uploaded:</span> {formatDate(submission.createdAt)}</p>
                      </div>
                      {submission.patientNotes && (
                        <p className="text-sm text-foreground mt-2">
                          <span className="font-medium">Patient notes:</span> {submission.patientNotes}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <Link to={`/admin/review/${submission._id}`}>
                        <Button className={`flex items-center gap-2 ${submission.status === 'pending' ? 'bg-medical-orange hover:bg-medical-orange/90' : 'bg-medical-blue hover:bg-medical-blue/90'}`}>
                          <Eye className="w-4 h-4" />
                          {submission.status === 'pending' ? 'Review Now' : 'View Review'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};