import React, { useEffect, useRef } from 'react';

const FractalPattern = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const drawFractal = (x: number, y: number, size: number, depth: number) => {
      if (depth <= 0) return;

      const time = Date.now() * 0.001;
      const hue = (time * 20) % 360;
      
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.lineWidth = depth * 0.5;

      const branches = 5;
      const newSize = size * 0.7;

      for (let i = 0; i < branches; i++) {
        const branchAngle = (i * Math.PI * 2) / branches + angle;
        const endX = x + Math.cos(branchAngle) * size;
        const endY = y + Math.sin(branchAngle) * size;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        drawFractal(endX, endY, newSize, depth - 1);
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawFractal(
        canvas.width / 2,
        canvas.height / 2,
        50,
        4
      );

      angle += 0.002;
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
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full rounded-lg glass"
    />
  );
};

export default FractalPattern;