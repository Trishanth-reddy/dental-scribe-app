import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, ImagePlus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadSubmission } from '@/lib/apiService';

export const ImageUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: uploadSubmission,
    onSuccess: () => {
      toast.success('Image uploaded successfully! Our team will review it shortly.');
      queryClient.invalidateQueries({ queryKey: ['patientSubmissions'] });
      navigate('/patient/dashboard');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Upload failed. Please try again.');
    },
  });

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('File size must be less than 10MB.');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('notes', notes);

    mutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Upload Dental Image</h1>
        <p className="text-muted-foreground">Share your dental images for professional review</p>
      </div>
      <Card className="shadow-medical">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="w-5 h-5" />
            New Image Submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input id="patientName" value={user?.name || ''} readOnly disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input id="patientId" value={user?.patientId || ''} readOnly disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dental-image-upload">Dental Image *</Label>
              {!selectedFile ? (
                <div 
                  id="dental-image-upload"
                  onClick={() => fileInputRef.current?.click()} 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Click to upload image</h3>
                  <p className="text-sm text-muted-foreground">Supports: JPG, PNG, WebP (Max 10MB)</p>
                </div>
              ) : (
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img src={previewUrl || ''} alt="Preview" className="w-48 h-48 object-cover rounded-lg border border-border" />
                    <div className="space-y-2 flex-1">
                      <h4 className="font-medium text-foreground">Selected File:</h4>
                      <p className="text-sm text-muted-foreground break-all">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button type="button" variant="outline" size="sm" onClick={handleRemoveFile} className="flex items-center gap-2"><X className="w-4 h-4" />Remove</Button>
                    </div>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific concerns or areas to look at..." rows={3} />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/patient/dashboard')} disabled={mutation.isPending}>Cancel</Button>
              <Button type="submit" className="bg-gradient-medical hover:opacity-90 flex items-center gap-2" disabled={!selectedFile || mutation.isPending}>
                {mutation.isPending ? (<><Loader2 className="w-4 h-4 animate-spin" />Uploading...</>) : (<><Upload className="w-4 h-4" />Submit for Review</>)}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};