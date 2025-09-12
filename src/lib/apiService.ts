import api from '@/lib/api';
import { Submission } from '@/types'; // Assuming you create a central types file

/**
 * Fetches all submissions for the admin dashboard.
 * Populates patient details.
 */
export const fetchAdminSubmissions = async (): Promise<Submission[]> => {
  const { data } = await api.get('/submissions/admin');
  return data;
};

/**
 * Fetches a single submission by its ID.
 * Populates patient details.
 */
export const fetchSubmissionById = async (id: string): Promise<Submission> => {
    const { data } = await api.get(`/submissions/${id}`);
    return data;
};

/**
 * Fetches all submissions for the currently logged-in patient.
 */
export const fetchPatientSubmissions = async (): Promise<Submission[]> => {
  const { data } = await api.get('/submissions/patient');
  return data;
};

/**
 * Saves an admin's review of a submission.
 * @param id - The ID of the submission to review.
 * @param reviewData - The data for the review.
 */
export const saveReview = async ({ id, data }: { id: string; data: { adminNotes: string; annotatedImageDataUrl: string; pdfDataUrl: string } }) => {
  const { data: saved } = await api.put(`/submissions/${id}/review`, data);
  return saved;
};

/**
 * Uploads a new image submission from a patient.
 * @param formData - The form data containing the image and notes.
 */
export const uploadSubmission = async (formData: FormData): Promise<any> => {
  const response = await api.post('/submissions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};