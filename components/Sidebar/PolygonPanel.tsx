'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hexagon as PolygonIcon, Trash2, Edit3 } from 'lucide-react';

export function PolygonPanel() {
  const { 
    polygons, 
    removePolygon, 
    updatePolygon, 
    dataSources,
    setMapCenter 
  } = useStore();

  const handlePolygonNameChange = (id: string, name: string) => {
    updatePolygon(id, { name });
  };

  const handleDataSourceChange = (id: string, dataSource: string) => {
    updatePolygon(id, { dataSource });
  };

  const focusOnPolygon = (polygon: any) => {
    setMapCenter(polygon.centroid);
  };

  if (polygons.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          <PolygonIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No polygons created yet</p>
          <p className="text-sm">Click "Start Drawing" to create your first polygon</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {polygons.map((polygon) => (
        <Card key={polygon.id} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PolygonIcon className="w-4 h-4" />
                <span className="font-medium text-sm">Polygon</span>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => focusOnPolygon(polygon)}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removePolygon(polygon.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor={`name-${polygon.id}`} className="text-xs">Name</Label>
              <Input
                id={`name-${polygon.id}`}
                value={polygon.name}
                onChange={(e) => handlePolygonNameChange(polygon.id, e.target.value)}
                className="h-8 text-sm"
                placeholder="Polygon name"
              />
            </div>

            <div>
              <Label htmlFor={`datasource-${polygon.id}`} className="text-xs">Data Source</Label>
              <Select
                value={polygon.dataSource}
                onValueChange={(value) => handleDataSourceChange(polygon.id, value)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map((ds) => (
                    <SelectItem key={ds.id} value={ds.id}>
                      {ds.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Points: {polygon.coordinates.length}</div>
              <div>
                Center: {polygon.centroid[0].toFixed(4)}, {polygon.centroid[1].toFixed(4)}
              </div>
              <div className="flex items-center gap-2">
                <span>Color:</span>
                <div 
                  className="w-4 h-4 border rounded"
                  style={{ backgroundColor: polygon.color }}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}