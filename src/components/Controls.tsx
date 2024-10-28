import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  AudioLines, Waves, Circle, CircuitBoard, Combine,
  Sparkles, Orbit, Loader2, ZoomIn, ZoomOut,
  Binary, Sigma, SlidersHorizontal, Mic
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ControlsProps {
  onAmplitudeChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onIntensityChange: (value: number) => void;
  onComplexityChange: (value: number) => void;
  onColorShiftChange: (value: number) => void;
  onVisualizationChange: (type: string) => void;
  onZoomChange: (value: number) => void;
  onMicrophoneToggle: (enabled: boolean) => void;
  zoom: number;
  isMicrophoneEnabled: boolean;
}

const Controls = ({ 
  onAmplitudeChange, 
  onFrequencyChange,
  onSpeedChange,
  onIntensityChange,
  onComplexityChange,
  onColorShiftChange,
  onVisualizationChange,
  onZoomChange,
  onMicrophoneToggle,
  zoom,
  isMicrophoneEnabled
}: ControlsProps) => {
  const { toast } = useToast();

  const handleMicrophoneToggle = async (checked: boolean) => {
    try {
      onMicrophoneToggle(checked);
      toast({
        title: checked ? "Microphone Enabled" : "Microphone Disabled",
        description: checked ? "Visualizations will now react to your audio input" : "Audio input disabled"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="glass p-6 rounded-lg space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Controls</h3>
          </div>
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <Switch
              checked={isMicrophoneEnabled}
              onCheckedChange={handleMicrophoneToggle}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Amplitude</label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={(value) => onAmplitudeChange(value[0])}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Frequency</label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={(value) => onFrequencyChange(value[0])}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Speed</label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={(value) => onSpeedChange(value[0])}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Intensity</label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={(value) => onIntensityChange(value[0])}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Complexity</label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={(value) => onComplexityChange(value[0])}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Color Shift</label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={(value) => onColorShiftChange(value[0])}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Zoom</label>
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => onVisualizationChange('spectrum')}
              className="hover:bg-primary/20"
            >
              <AudioLines className="h-4 w-4" rotate={90} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onVisualizationChange('waveform')}
              className="hover:bg-primary/20"
            >
              <Waves className="h-4 w-4" rotate={90} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
