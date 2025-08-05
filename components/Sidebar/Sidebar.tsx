'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DataSourcePanel } from './DataSourcePanel';
import { PolygonPanel } from './PolygonPanel';
import { Pencil, Square, Database, Info, X } from 'lucide-react';

export function Sidebar() {
  const { isDrawing, setIsDrawing, polygons, dataSources } = useStore();

  const startDrawing = () => setIsDrawing(true);
  const cancelDrawing = () => setIsDrawing(false);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-l dark:border-gray-700">
      {/* Header with Drawing Controls */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Controls</h2>
        
        {!isDrawing ? (
          <Button onClick={startDrawing} className="w-full">
            <Pencil className="w-4 h-4 mr-2" />
            Start Drawing Polygon
          </Button>
        ) : (
          <div className="space-y-3">
            <Alert className="border-blue-500/50 text-blue-700 dark:border-blue-400/50 dark:text-blue-300">
              <Info className="h-4 w-4 !text-blue-700 dark:!text-blue-300" />
              <AlertTitle className="font-semibold">Drawing Mode Active</AlertTitle>
              <AlertDescription className="text-xs">
                Click on the map to add points (3-12). Right-click to finish.
              </AlertDescription>
            </Alert>
            <Button onClick={cancelDrawing} variant="outline" className="w-full">
              <X className="w-4 h-4 mr-2" />
              Cancel Drawing
            </Button>
          </div>
        )}
      </div>

      {/* Accordion for Panels */}
      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={['polygons', 'data_sources']} className="w-full p-4">
          
          <AccordionItem value="polygons">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                <span className="font-medium">Polygons ({polygons.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <PolygonPanel />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="data_sources">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="font-medium">Data Sources ({dataSources.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <DataSourcePanel />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </ScrollArea>
    </div>
  );
}