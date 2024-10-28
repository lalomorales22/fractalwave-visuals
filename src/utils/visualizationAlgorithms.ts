export const drawMandelbrot = (ctx: CanvasRenderingContext2D, width: number, height: number, zoom: number, offsetX: number, offsetY: number) => {
  const maxIterations = 100;
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = (x - width/2) / (width/4) / zoom + offsetX;
      let b = (y - height/2) / (height/4) / zoom + offsetY;
      
      const ca = a;
      const cb = b;
      let n = 0;
      
      while (n < maxIterations) {
        const aa = a * a - b * b;
        const bb = 2 * a * b;
        a = aa + ca;
        b = bb + cb;
        if (a * a + b * b > 16) break;
        n++;
      }
      
      const hue = (n / maxIterations) * 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
};

export const drawJulia = (ctx: CanvasRenderingContext2D, width: number, height: number, zoom: number, offsetX: number, offsetY: number) => {
  const maxIterations = 100;
  const cx = -0.4;
  const cy = 0.6;
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = (x - width/2) / (width/4) / zoom + offsetX;
      let b = (y - height/2) / (height/4) / zoom + offsetY;
      let n = 0;
      
      while (n < maxIterations) {
        const aa = a * a - b * b;
        const bb = 2 * a * b;
        a = aa + cx;
        b = bb + cy;
        if (a * a + b * b > 4) break;
        n++;
      }
      
      const hue = (n / maxIterations) * 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
};