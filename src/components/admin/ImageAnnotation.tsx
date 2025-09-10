import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Line, FabricImage, Polygon, Group } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Square, 
  Circle as CircleIcon, 
  ArrowRight, 
  PenTool, 
  Save,
  Download,
  Undo,
  Redo,
  MousePointer,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';

// Mock patient data
const mockPatientData = {
  id: '1',
  patientName: 'Sarah Johnson',
  patientId: 'P0001',
  email: 'sarah@example.com',
  fileName: 'teeth_scan_2024_01.jpg',
  uploadDate: '2024-01-15T10:30:00Z',
  notes: 'Routine checkup scan',
  status: 'pending'
};

export const ImageAnnotation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'rectangle' | 'circle' | 'arrow' | 'freehand'>('select');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { submissionId } = useParams();

  // Mock image URL
  const imageUrl = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop';

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    // Load dental image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const fabricImage = new FabricImage(img, {
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
      });
      
      const scale = Math.min(800 / img.width, 600 / img.height);
      fabricImage.scale(scale);
      
      canvas.add(fabricImage);
      canvas.renderAll();
    };
    img.src = imageUrl;

    // Configure drawing
    canvas.freeDrawingBrush.color = '#ef4444';
    canvas.freeDrawingBrush.width = 3;

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = tool === 'freehand';

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: 'transparent',
        stroke: '#ef4444',
        strokeWidth: 3,
        width: 100,
        height: 80,
      });
      fabricCanvas.add(rect);
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 150,
        top: 150,
        fill: 'transparent',
        stroke: '#ef4444',
        strokeWidth: 3,
        radius: 50,
      });
      fabricCanvas.add(circle);
    } else if (tool === 'arrow') {
      const line = new Line([200, 200, 300, 250], {
        stroke: '#ef4444',
        strokeWidth: 3,
      });
      fabricCanvas.add(line);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Review saved successfully!');
      navigate('/admin/submissions');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <Card className="shadow-medical">
        <CardHeader>
          <CardTitle>Image Review - {mockPatientData.patientName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={activeTool === 'select' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('select')}
                >
                  <MousePointer className="w-4 h-4 mr-2" />
                  Select
                </Button>
                <Button
                  variant={activeTool === 'rectangle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('rectangle')}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Rectangle
                </Button>
                <Button
                  variant={activeTool === 'circle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('circle')}
                >
                  <CircleIcon className="w-4 h-4 mr-2" />
                  Circle
                </Button>
                <Button
                  variant={activeTool === 'freehand' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolClick('freehand')}
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  Draw
                </Button>
              </div>
              <canvas ref={canvasRef} className="border rounded-lg" />
            </div>
            
            <div>
              <Label>Professional Notes</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Enter your assessment..."
                rows={10}
                className="mb-4"
              />
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-medical-green"
              >
                {saving ? 'Saving...' : 'Save Review'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};