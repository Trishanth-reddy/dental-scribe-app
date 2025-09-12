// src/types.ts

export interface Submission {
  _id: string;
  patient: {
    _id: string;
    name: string;
    email: string;
    patientId: string;
  };
  originalImageUrl: string;
  annotatedImageUrl?: string;
  pdfReportUrl?: string;
  patientNotes?: string;
  adminNotes?: string;
  createdAt: string;
  status: 'pending' | 'reviewed';
}