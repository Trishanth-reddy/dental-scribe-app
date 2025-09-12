import React, { useState, useEffect } from 'react';
import { Canvas, Rect, Circle, Line, Triangle, Group } from 'fabric';
import { Square, Circle as CircleIcon, Trash2, ArrowUpRight } from 'lucide-react';

interface AnnotationToolbarProps {
  canvas: Canvas | null;
  isReviewed: boolean;
}

// Define the fixed color palette
const COLOR_PALETTE = [
  { name: 'Urgent', value: '#d9534f' }, // Red
  { name: 'Caution', value: '#f0ad4e' }, // Yellow
  { name: 'Note', value: '#5bc0de' },    // Blue
];

export const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({ canvas, isReviewed }) => {
  const [activeColor, setActiveColor] = useState(COLOR_PALETTE[0].value); // Default to Red
  const [selectedObjectCount, setSelectedObjectCount] = useState(0);

  // Listen to canvas selection events to enable/disable the delete button
  useEffect(() => {
    if (!canvas) return;
    const updateSelectionCount = () => setSelectedObjectCount(canvas.getActiveObjects().length);
    
    canvas.on('selection:created', updateSelectionCount);
    canvas.on('selection:updated', updateSelectionCount);
    canvas.on('selection:cleared', updateSelectionCount);

    return () => {
      canvas.off('selection:created', updateSelectionCount);
      canvas.off('selection:updated', updateSelectionCount);
      canvas.off('selection:cleared', updateSelectionCount);
    };
  }, [canvas]);

  const addShape = (shapeType: 'rect' | 'circle' | 'arrow') => {
    if (!canvas) return;

    let shape;
    const commonProps = { left: 150, top: 150, fill: 'transparent', stroke: activeColor, strokeWidth: 4, strokeUniform: true };

    if (shapeType === 'rect') {
      shape = new Rect({ ...commonProps, width: 120, height: 80 });
    } else if (shapeType === 'circle') {
      shape = new Circle({ ...commonProps, radius: 50 });
    } else if (shapeType === 'arrow') {
      const line = new Line([50, 100, 200, 100], { ...commonProps, stroke: activeColor });
      const triangle = new Triangle({ left: 200, top: 100, width: 15, height: 15, angle: 90, fill: activeColor, originX: 'center', originY: 'center' });
      shape = new Group([line, triangle], { left: 150, top: 150 });
    }
    
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };
  
  const handleDelete = () => {
    if (!canvas) return;
    canvas.getActiveObjects().forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject().renderAll();
  };

  const handleColorChange = (newColor: string) => {
    setActiveColor(newColor);
    if (!canvas) return;

    // Update selected objects' color
    canvas.getActiveObjects().forEach(obj => {
      // Handle arrow group
      if (obj instanceof Group) {
        obj.getObjects().forEach(element => {
            element.set('stroke', newColor);
            element.set('fill', newColor);
        });
      } else { // Handle simple shapes
        obj.set('stroke', newColor);
      }
    });
    canvas.renderAll();
  };

  // A reusable button component for the toolbar
  const ToolButton = ({ children, onClick, title }) => (
    <button
      onClick={onClick}
      title={title}
      disabled={isReviewed}
      style={{
        background: 'transparent',
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '8px',
        cursor: isReviewed ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #dee2e6' }}>
      {/* Shape Tools */}
      <ToolButton onClick={() => addShape('rect')} title="Add Rectangle"><Square size={20} /></ToolButton>
      <ToolButton onClick={() => addShape('circle')} title="Add Circle"><CircleIcon size={20} /></ToolButton>
      <ToolButton onClick={() => addShape('arrow')} title="Add Arrow"><ArrowUpRight size={20} /></ToolButton>
      
      {/* Vertical Divider */}
      <div style={{ borderLeft: '1px solid #ccc', height: '24px', margin: '0 8px' }}></div>

      {/* Color Palette */}
      {COLOR_PALETTE.map(color => (
        <button
          key={color.name}
          title={color.name}
          onClick={() => handleColorChange(color.value)}
          disabled={isReviewed}
          style={{
            width: '28px',
            height: '28px',
            background: color.value,
            border: activeColor === color.value ? '3px solid #333' : '1px solid #ccc',
            borderRadius: '50%',
            cursor: isReviewed ? 'not-allowed' : 'pointer',
            padding: 0
          }}
        />
      ))}

      {/* Delete Button (at the end) */}
      <button
        onClick={handleDelete}
        disabled={isReviewed || selectedObjectCount === 0}
        title="Delete Selected"
        style={{ marginLeft: 'auto', color: (isReviewed || selectedObjectCount === 0) ? '#aaa' : '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};