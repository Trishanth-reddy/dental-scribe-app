import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Filter, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for all submissions
const mockSubmissions = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    patientId: 'P0001',
    fileName: 'teeth_scan_2024_01.jpg',
    uploadDate: '2024-01-15T10:30:00Z',
    status: 'pending',
    email: 'sarah@example.com',
    notes: 'Routine checkup scan'
  },
  {
    id: '2',
    patientName: 'Mike Chen',
    patientId: 'P0002', 
    fileName: 'teeth_scan_2024_02.jpg',
    uploadDate: '2024-01-14T14:15:00Z',
    status: 'reviewed',
    email: 'mike@example.com',
    notes: 'Follow-up after cleaning'
  },
  {
    id: '3',
    patientName: 'Emma Davis',
    patientId: 'P0003',
    fileName: 'dental_xray_jan.jpg', 
    uploadDate: '2024-01-13T09:45:00Z',
    status: 'pending',
    email: 'emma@example.com',
    notes: 'Pain in upper left molar'
  },
  {
    id: '4',
    patientName: 'John Smith',
    patientId: 'P0004',
    fileName: 'bitewing_xray.jpg',
    uploadDate: '2024-01-12T16:20:00Z', 
    status: 'reviewed',
    email: 'john@example.com',
    notes: 'Annual examination'
  },
  {
    id: '5',
    patientName: 'Lisa Wilson',
    patientId: 'P0005',
    fileName: 'teeth_cleaning_before.jpg',
    uploadDate: '2024-01-11T11:10:00Z',
    status: 'pending',
    email: 'lisa@example.com', 
    notes: 'Pre-cleaning documentation'
  }
];

export const AdminSubmissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

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

  // Filter and sort submissions
  const filteredSubmissions = mockSubmissions
    .filter(submission => {
      const matchesSearch = 
        submission.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'oldest':
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        case 'name':
          return a.patientName.localeCompare(b.patientName);
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Patient Submissions</h1>
          <p className="text-muted-foreground">Review and manage all patient image submissions</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredSubmissions.length} of {mockSubmissions.length} submissions
        </div>
      </div>

      {/* Filters */}
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
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search patients, IDs, or files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Patient Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            All Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No submissions found matching your criteria.</p>
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <div key={submission.id} className="border border-border rounded-lg p-4 hover:shadow-soft transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-foreground text-lg">{submission.patientName}</h3>
                        <Badge variant="outline">ID: {submission.patientId}</Badge>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground mb-2">
                        <p><span className="font-medium">Email:</span> {submission.email}</p>
                        <p><span className="font-medium">File:</span> {submission.fileName}</p>
                        <p><span className="font-medium">Uploaded:</span> {formatDate(submission.uploadDate)}</p>
                      </div>
                      
                      {submission.notes && (
                        <p className="text-sm text-foreground">
                          <span className="font-medium">Patient notes:</span> {submission.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link to={`/admin/review/${submission.id}`}>
                        <Button 
                          className={`flex items-center gap-2 ${
                            submission.status === 'pending' 
                              ? 'bg-medical-orange hover:bg-medical-orange/90' 
                              : 'bg-medical-blue hover:bg-medical-blue/90'
                          }`}
                        >
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