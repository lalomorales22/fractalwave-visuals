import { create } from 'zustand';
import { VisualizationParams, VisualizationType } from '@/types/visualization';

interface VisualizationState {
  params: VisualizationParams;
  activeType: VisualizationType;
  presets: Record<string, VisualizationParams>;
  history: VisualizationParams[];
  isMicrophoneEnabled: boolean;
  isPlaying: boolean;
  isFullscreen: boolean;
  fps: number;
  setParam: (key: keyof VisualizationParams, value: number | string) => void;
  setType: (type: VisualizationType) => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => void;
  toggleMicrophone: () => void;
  togglePlayback: () => void;
  toggleFullscreen: () => void;
  undo: () => void;
  redo: () => void;
}

export const useVisualizationState = create<VisualizationState>((set, get) => ({
  // Implementation here
}));
