import React, { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface CombinedVisualizerProps {
  amplitude: number;
  frequency: number;
  visualizationType: string;
}

const CombinedVisualizer = ({ amplitude, frequency, visualizationType }: CombinedVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let hue = 0;

    const drawWaves = (time: number) => {
      const points = 100;
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.lineWidth = 2;

      for (let i = 0; i < points; i++) {
        const x = (i / points) * canvas.width;
        const y = canvas.height / 2 + 
                 Math.sin(i * 0.05 + time) * (50 * amplitude/50) * Math.sin(time * 0.5) +
                 Math.sin(i * 0.1 - time * (frequency/25)) * 30;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const drawFractal = (x: number, y: number, size: number, depth: number, time: number) => {
      if (depth <= 0) return;

      const branchHue = (hue + depth * 30) % 360;
      ctx.strokeStyle = `hsl(${branchHue}, 70%, 60%)`;
      ctx.lineWidth = depth * 0.5;

      const branches = Math.floor(3 + (amplitude / 20));
      const newSize = size * (0.5 + (frequency / 200));

      for (let i = 0; i < branches; i++) {
        const branchAngle = (i * Math.PI * 2) / branches + time;
        const endX = x + Math.cos(branchAngle) * size;
        const endY = y + Math.sin(branchAngle) * size;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        drawFractal(endX, endY, newSize, depth - 1, time);
      }
    };

    const drawCircular = (time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
      
      for (let i = 0; i < 360; i += 5) {
        const angle = (i * Math.PI) / 180;
        const radiusOffset = Math.sin(time * (frequency/50) + i * 0.1) * (amplitude/2);
        const radius = maxRadius + radiusOffset;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${(hue + i) % 360}, 70%, 60%)`;
        ctx.fill();
      }
    };

    const drawSpiral = (time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const spiralCount = Math.floor(frequency / 10);
      
      ctx.beginPath();
      for (let i = 0; i < 360 * spiralCount; i++) {
        const angle = (i * Math.PI) / 180;
        const radius = (i / 360) * (amplitude / 50) * 50;
        const x = centerX + Math.cos(angle + time) * radius;
        const y = centerY + Math.sin(angle + time) * radius;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.stroke();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      switch (visualizationType) {
        case 'waves':
          drawWaves(time);
          break;
        case 'fractal':
          drawFractal(canvas.width / 2, canvas.height / 2, 50, 4, time);
          break;
        case 'circular':
          drawCircular(time);
          break;
        case 'spiral':
          drawSpiral(time);
          break;
        default:
          // Combined visualization
          drawWaves(time);
          drawCircular(time * 0.5);
          drawSpiral(time * 0.3);
      }

      hue = (hue + 0.5) % 360;
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [amplitude, frequency, visualizationType]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full rounded-lg glass"
      onClick={() => toast({ 
        title: "Visualization Active", 
        description: "Adjust the controls to modify the patterns!" 
      })}
    />
  );
};

export default CombinedVisualizer;