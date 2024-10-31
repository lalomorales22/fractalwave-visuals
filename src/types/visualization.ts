export interface VisualizationParams {
  amplitude: number;
  frequency: number;
  speed: number;
  intensity: number;
  complexity: number;
  colorShift: number;
  zoom: number;
  rotation: number;
  symmetry: number;
  blur: number;
  blend: string;
  palette: string;
  resolution: number;
  depth: number;
}

export type VisualizationType = 
  | 'waves' 
  | 'fractal' 
  | 'circular'
  | 'spiral'
  | 'lissajous'
  | 'particles'
  | 'vortex'
  | 'combined'
  | 'mandelbrot'
  | 'julia'
  | 'spectrum'
  | 'waveform'
  | 'kaleidoscope'
  | 'nebula'
  | 'aurora'
  | 'dna'
  | 'matrix'
  | 'terrain';
