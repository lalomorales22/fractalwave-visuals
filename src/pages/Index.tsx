import React, { useState } from 'react';
import CombinedVisualizer from '@/components/CombinedVisualizer';
import Controls from '@/components/Controls';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [amplitude, setAmplitude] = useState(50);
  const [frequency, setFrequency] = useState(50);
  const [visualizationType, setVisualizationType] = useState('combined');
  const [zoom, setZoom] = useState(1);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8 glow inline-block">
          Visual Soundscape
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-[800px] floating">
              <CombinedVisualizer 
                amplitude={amplitude}
                frequency={frequency}
                visualizationType={visualizationType}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Controls
              onAmplitudeChange={setAmplitude}
              onFrequencyChange={setFrequency}
              onVisualizationChange={setVisualizationType}
              onZoomChange={setZoom}
              zoom={zoom}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;