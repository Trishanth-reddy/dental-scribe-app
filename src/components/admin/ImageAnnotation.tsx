import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas, Image as FabricImage } from "fabric";
import { toast } from "sonner";
import { fetchSubmissionById, saveReview } from "@/lib/apiService";
import { pdf } from '@react-pdf/renderer';
import { DentalReportPDF } from './DentalReportPDF';
import { AnnotationToolbar } from './AnnotationToolbar';

// A simple Loader component
const SimpleLoader = () => (
  <div style={{ border: "4px solid #f3f3f3", borderTop: "4px solid #3498db", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite" }}>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

// ==================================================================
// === FIX: Add and export the parseFindings function ===
// ==================================================================
export const parseFindings = (notes) => {
    const findings = { general: [], recommendations: [] };
    if (!notes) return findings;

    const conditionsMap = {
      inflamed: { condition: 'Inflamed or Red gums', treatment: 'Scaling and professional cleaning.', color: '#5a005a' },
      malaligned: { condition: 'Malaligned Teeth', treatment: 'Braces or Clear Aligner evaluation.', color: '#ffff00' },
      receded: { condition: 'Receded gums', treatment: 'Consultation for potential Gum Surgery.', color: '#d3d3d3' },
      stains: { condition: 'Stains', treatment: 'Professional teeth cleaning and polishing.', color: '#ff0000' },
      attrition: { condition: 'Attrition (Wear)', treatment: 'Filling or Night Guard recommended.', color: '#00ffff' },
      crown: { condition: 'Crowns / Caps', treatment: 'If loose or broken, get it checked. Tooth-colored caps are best.', color: '#ff00ff' },
      cavity: { condition: 'Cavity / Decay', treatment: 'Restorative treatment (fillings) required.', color: '#8B4513' }
    };

    const detectedConditions = new Set();
    const lines = notes.split('\n').map(line => line.trim()).filter(line => line);
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      let conditionFound = false;
      for (const keyword in conditionsMap) {
        if (lowerLine.includes(keyword)) {
          if (!detectedConditions.has(keyword)) {
            findings.recommendations.push(conditionsMap[keyword]);
            detectedConditions.add(keyword);
          }
          conditionFound = true;
        }
      }
      if (!conditionFound) {
        findings.general.push(line);
      }
    });
    
    return findings;
};

const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

export const ImageAnnotation: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const reviewed = submission?.status === "reviewed";

  useEffect(() => {
    if (!submissionId) return;
    setIsLoading(true);
    fetchSubmissionById(submissionId)
      .then((data) => {
        setSubmission(data);
        setAdminNotes(data.adminNotes || "");
      })
      .catch(() => toast.error("Failed to load submission data."))
      .finally(() => setIsLoading(false));
  }, [submissionId]);

  useEffect(() => {
    if (!canvasRef.current || !submission) return;

    const initializeCanvas = async () => {
      const container = canvasContainerRef.current!;
      const fabricCanvas = new Canvas(canvasRef.current, {
        width: container.offsetWidth,
        height: container.offsetHeight,
        backgroundColor: "#f9fafb",
      });

      const scaleAndCenterImage = (img: FabricImage) => {
        const scale = Math.min(fabricCanvas.getWidth() / (img.width || 1), fabricCanvas.getHeight() / (img.height || 1));
        img.scale(scale);
        img.set({
          left: (fabricCanvas.getWidth() - img.getScaledWidth()) / 2,
          top: (fabricCanvas.getHeight() - img.getScaledHeight()) / 2,
          selectable: false, evented: false, name: "background-image",
        });
        fabricCanvas.add(img);
        fabricCanvas.sendObjectToBack(img);
        fabricCanvas.renderAll();
      };

      const imageUrl = reviewed ? submission.annotatedImageUrl : submission.originalImageUrl;
      if (imageUrl) {
        try {
          const img = await FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });
          scaleAndCenterImage(img);
        } catch (e) { toast.error("Could not load image onto canvas."); }
      }
      setCanvas(fabricCanvas);
    };
    
    initializeCanvas();
    return () => { canvas?.dispose(); };
  }, [submission, reviewed]);
  
  const handleSave = async () => {
    if (!submission || !canvas) return;
    setIsSaving(true);
    canvas.discardActiveObject();
    canvas.renderAll();

    try {
      const annotatedImageDataUrl = canvas.toDataURL({ format: "png", quality: 1.0 });
      
      const doc = <DentalReportPDF 
        submission={submission} 
        originalImageUrl={submission.originalImageUrl}
        annotatedImageDataUrl={annotatedImageDataUrl} 
        adminNotes={adminNotes} 
      />;

      const pdfBlob = await pdf(doc).toBlob();
      const pdfDataUrl = await blobToDataURL(pdfBlob) as string;

      await saveReview({
        id: submissionId!,
        data: { adminNotes, annotatedImageDataUrl, pdfDataUrl },
      });

      toast.success("Review saved successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) { return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><SimpleLoader /></div>; }
  if (!submission) { return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Submission not found.</div>; }

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '1rem' }}>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ padding: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Review Submission</h1>
          <p style={{ color: '#6b7280' }}>
            Patient: <span style={{ fontWeight: 600 }}>{submission.patient.name}</span> | Status: 
            <span style={{ fontWeight: 600, color: reviewed ? 'green' : 'orange', marginLeft: '4px' }}>
              {submission.status.toUpperCase()}
            </span>
          </p>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div>
            <AnnotationToolbar canvas={canvas} isReviewed={reviewed} />
            <div ref={canvasContainerRef} style={{ border: '2px solid #d1d5db', borderRadius: '8px', height: '600px', position: 'relative' }}>
              <canvas ref={canvasRef} />
            </div>
          </div>
          <div>
            <label htmlFor="admin-notes" style={{ fontWeight: 600 }}>Professional Notes</label>
            <textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              readOnly={reviewed}
              rows={12}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '8px' }}
              placeholder="Enter clinical findings... These notes will generate the report."
            />
            <div style={{ marginTop: '1rem' }}>
              {!reviewed ? (
                <button onClick={handleSave} disabled={isSaving} style={{ width: '100%', padding: '12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  {isSaving ? 'Saving...' : 'Save Review & Generate Report'}
                </button>
              ) : (
                <a href={submission.pdfReportUrl} target="_blank" rel="noopener noreferrer">
                  <button style={{ width: '100%', padding: '12px', background: '#3b72f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Download Report
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};