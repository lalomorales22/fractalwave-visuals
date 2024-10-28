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
  Vortex
} from "lucide-react";

interface ControlsProps {
  onAmplitudeChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
  onVisualizationChange: (type: string) => void;
}

const Controls = ({ onAmplitudeChange, onFrequencyChange, onVisualizationChange }: ControlsProps) => {
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
            <Vortex className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onVisualizationChange('combined')}
            className="hover:bg-primary/20"
          >
            <Combine className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Controls;