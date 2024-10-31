import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVisualizationState } from '@/hooks/use-visualization-state';

export const AdvancedControls = () => {
  const { params, setParams } = useVisualizationState();

  return (
    <Tabs defaultValue="params" className="w-full">
      <TabsList>
        <TabsTrigger value="params">Parameters</TabsTrigger>
        <TabsTrigger value="effects">Effects</TabsTrigger>
        <TabsTrigger value="presets">Presets</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="params" className="space-y-4">
        <div className="space-y-2">
          <label>Iterations</label>
          <Slider
            value={[params.iterations]}
            onValueChange={([value]) => setParams({ ...params, iterations: value })}
            min={1}
            max={100}
            step={1}
          />
        </div>
      </TabsContent>

      <TabsContent value="effects" className="space-y-4">
        <Select onValueChange={(value) => setParams({ ...params, effect: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select effect" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="glow">Glow</SelectItem>
            <SelectItem value="blur">Blur</SelectItem>
          </SelectContent>
        </Select>
      </TabsContent>

      <TabsContent value="presets" className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => setParams({ ...params, preset: 'default' })}>
            Default
          </Button>
          <Button onClick={() => setParams({ ...params, preset: 'psychedelic' })}>
            Psychedelic
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <div className="space-y-2">
          <label>Quality</label>
          <Slider
            value={[params.quality]}
            onValueChange={([value]) => setParams({ ...params, quality: value })}
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
