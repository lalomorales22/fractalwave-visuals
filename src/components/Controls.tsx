import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AudioLines, Waves, CircleWaveform } from "lucide-react";

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
        <div className="flex space-x-2">
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
            onClick={() => onVisualizationChange('audio')}
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
            <CircleWaveform className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Controls;