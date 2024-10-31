import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { setupAudioAnalyser, getAudioData } from '@/utils/audioUtils';
import { drawMandelbrot, drawJulia } from '@/utils/visualizationAlgorithms';

interface CombinedVisualizerProps {
  amplitude: number;
  frequency: number;
  speed: number;
  intensity: number;
  complexity: number;
  colorShift: number;
  visualizationType: string;
  isMicrophoneEnabled: boolean;
}

const CombinedVisualizer = ({ 
  amplitude, 
  frequency, 
  speed,
  intensity,
  complexity,
  colorShift,
  visualizationType,
  isMicrophoneEnabled 
}: CombinedVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [audioAnalyser, setAudioAnalyser] = useState<AnalyserNode | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

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
    let animationFrameId: number;
    
    const setupMicrophone = async () => {
      try {
        const { analyser, stream } = await setupAudioAnalyser();
        setAudioAnalyser(analyser);
        setAudioStream(stream);
      } catch (error) {
        console.error('Error setting up microphone:', error);
      }
    };

    if (isMicrophoneEnabled && !audioAnalyser) {
      setupMicrophone();
    } else if (!isMicrophoneEnabled && audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioAnalyser(null);
      setAudioStream(null);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let hue = 0;
    const hueShiftSpeed = colorShift / 25; // Increased color shift impact
    const baseSpeed = speed / 35; // Better speed control
    const particleCount = Math.floor(50 + (complexity)); // More particles
    const particleSize = 2 + (intensity / 20); // Larger particles

    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];

    const initParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2 * baseSpeed,
        vy: (Math.random() - 0.5) * 2 * baseSpeed,
        size: Math.random() * particleSize + 1
      }));
    };

    const drawWaves = (time: number) => {
      const points = 100;
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.lineWidth = 2;

      const waveAmplitude = (amplitude / 50) * 100; // Increased wave height
      const waveFrequency = (frequency / 50) * 2; // Better frequency control

      for (let i = 0; i < points; i++) {
        const x = (i / points) * canvas.width;
        const y = canvas.height / 2 + 
                 Math.sin(i * 0.05 + time) * waveAmplitude * Math.sin(time * 0.5) +
                 Math.sin(i * 0.1 - time * waveFrequency) * (waveAmplitude * 0.6);
        
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
        particle.vx *= (1 + (speed / 100));
        particle.vy *= (1 + (speed / 100));
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

      const branches = Math.floor(4 + (amplitude / 25)); // More dramatic branching
      const newSize = size * (0.6 + (frequency / 150)); // Better size scaling

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

    const drawSpectrum = (ctx: CanvasRenderingContext2D, audioData: Uint8Array) => {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const barWidth = width / audioData.length;
      
      ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      audioData.forEach((value, index) => {
        const percent = value / 255;
        const barHeight = height * percent;
        const hue = (index / audioData.length) * 360;
        
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.fillRect(
          index * barWidth,
          height - barHeight,
          barWidth,
          barHeight
        );
      });
    };

    const drawWaveform = (ctx: CanvasRenderingContext2D, audioData: Uint8Array) => {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      
      ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${Date.now() * 0.05 % 360}, 70%, 60%)`;
      ctx.lineWidth = 2;
      
      audioData.forEach((value, index) => {
        const x = (index / audioData.length) * width;
        const y = (value / 255) * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001 * baseSpeed;

      if (isMicrophoneEnabled && audioAnalyser) {
        const audioData = getAudioData(audioAnalyser);
        
        switch (visualizationType) {
          case 'spectrum':
            drawSpectrum(ctx, audioData);
            break;
          case 'waveform':
            drawWaveform(ctx, audioData);
            break;
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
      } else {
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
      }

      hue = (hue + hueShiftSpeed) % 360;
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
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };

  }, [amplitude, frequency, speed, intensity, complexity, colorShift, visualizationType, isMicrophoneEnabled]);

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
