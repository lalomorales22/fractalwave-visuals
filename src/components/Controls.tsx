import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  AudioLines, 
  Waves, 
  Circle, 
  CircuitBoard, 
  Combine,
  Sparkles,
  Orbit,
  Loader2,
  ZoomIn,
  ZoomOut,
  Binary,
  Sigma
} from "lucide-react";

interface ControlsProps {
  onAmplitudeChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
  onVisualizationChange: (type: string) => void;
  onZoomChange: (value: number) => void;
  zoom: number;
}

const Controls = ({ 
  onAmplitudeChange, 
  onFrequencyChange, 
  onVisualizationChange,
  onZoomChange,
  zoom 
}: ControlsProps) => {
  return (
    <div className="glass p-6 rounded-lg space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Amplitude</h3>
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          onValueChange={(value) => onAmplitudeChange(value[0])}
          className="w-full"
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Frequency</h3>
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          onValueChange={(value) => onFrequencyChange(value[0])}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Zoom</h3>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onZoomChange(zoom - 0.1)}
            className="hover:bg-primary/20"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Slider
            value={[zoom]}
            min={0.1}
            max={5}
            step={0.1}
            onValueChange={(value) => onZoomChange(value[0])}
            className="w-full"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onZoomChange(zoom + 0.1)}
            className="hover:bg-primary/20"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Visualization Type</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('waves')}
            className="hover:bg-primary/20"
          >
            <Waves className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('fractal')}
            className="hover:bg-primary/20"
          >
            <AudioLines className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('circular')}
            className="hover:bg-primary/20"
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('spiral')}
            className="hover:bg-primary/20"
          >
            <CircuitBoard className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('lissajous')}
            className="hover:bg-primary/20"
          >
            <Orbit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('particles')}
            className="hover:bg-primary/20"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('vortex')}
            className="hover:bg-primary/20"
          >
            <Loader2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('combined')}
            className="hover:bg-primary/20"
          >
            <Combine className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('mandelbrot')}
            className="hover:bg-primary/20"
          >
            <Binary className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('julia')}
            className="hover:bg-primary/20"
          >
            <Sigma className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Controls;