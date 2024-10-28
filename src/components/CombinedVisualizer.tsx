```typescript
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { drawMandelbrot, drawJulia } from '@/utils/visualizationAlgorithms';

interface CombinedVisualizerProps {
  amplitude: number;
  frequency: number;
  visualizationType: string;
}

const CombinedVisualizer = ({ amplitude, frequency, visualizationType }: CombinedVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const dx = (e.clientX - lastPos.x) / (100 * zoom);
    const dy = (e.clientY - lastPos.y) / (100 * zoom);
    
    setPan(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let hue = 0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];

    const initParticles = () => {
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 1
      }));
    };

    const drawWaves = (time: number) => {
      const points = 100;
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.lineWidth = 2;

      for (let i = 0; i < points; i++) {
        const x = (i / points) * canvas.width;
        const y = canvas.height / 2 + 
                 Math.sin(i * 0.05 + time) * (50 * amplitude/50) * Math.sin(time * 0.5) +
                 Math.sin(i * 0.1 - time * (frequency/25)) * 30 +
                 Math.cos(i * 0.15 + time * 2) * (20 * amplitude/50);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const drawLissajous = (time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = Math.min(canvas.width, canvas.height) * 0.4;
      
      ctx.beginPath();
      for (let t = 0; t < Math.PI * 20; t += 0.1) {
        const x = centerX + Math.sin(t * frequency/25 + time) * Math.cos(t) * size/2;
        const y = centerY + Math.sin(t * amplitude/25) * Math.sin(t) * size/2;
        
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.stroke();
    };

    const drawParticleEffect = (time: number) => {
      particles.forEach((particle, i) => {
        particle.x += particle.vx * (frequency/50);
        particle.y += particle.vy * (frequency/50);
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * (amplitude/50), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(hue + i * 5) % 360}, 70%, 60%, 0.8)`;
        ctx.fill();
        
        particles.slice(i + 1).forEach(other => {
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${1 - distance/100})`;
            ctx.stroke();
          }
        });
      });
    };

    const drawVortex = (time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
      
      for (let r = 0; r < maxRadius; r += 5) {
        const angle = (r * 0.1 + time * frequency/25) % (Math.PI * 2);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        const size = (maxRadius - r) / maxRadius * 4 * (amplitude/50);
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(hue + r) % 360}, 70%, 60%, 0.8)`;
        ctx.fill();
      }
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
        case 'lissajous':
          drawLissajous(time);
          break;
        case 'particles':
          drawParticleEffect(time);
          break;
        case 'vortex':
          drawVortex(time);
          break;
        case 'mandelbrot':
          drawMandelbrot(ctx, canvas.width, canvas.height, zoom, pan.x, pan.y);
          break;
        case 'julia':
          drawJulia(ctx, canvas.width, canvas.height, zoom, pan.x, pan.y);
          break;
        default:
          drawWaves(time * 0.7);
          drawVortex(time * 0.3);
          drawParticleEffect(time);
          drawLissajous(time * 0.5);
      }

      hue = (hue + 0.5) % 360;
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [amplitude, frequency, visualizationType, zoom, pan]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full rounded-lg glass cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => toast({ 
        title: "Visualization Active", 
        description: "Drag to pan, use controls to zoom!" 
      })}
    />
  );
};

export default CombinedVisualizer;
```