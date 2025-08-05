'use client';

import React, { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import L, { LatLng, Polygon as LeafletPolygon } from 'leaflet';
import { useStore } from '@/store/useStore';
import { Polygon } from '@/types';
import { generateId } from '@/lib/utils';

export function PolygonDrawer() {
  const {
    isDrawing,
    setIsDrawing,
    addPolygon,
    dataSources,
  } = useStore();

  const [drawingPoints, setDrawingPoints] = useState<LatLng[]>([]);
  const [tempPolygon, setTempPolygon] = useState<LeafletPolygon | null>(null);

  const map = useMapEvents({
    click: (e) => {
      if (!isDrawing) return;

      const newPoints = [...drawingPoints, e.latlng];
      setDrawingPoints(newPoints);

      // Remove previous temporary polygon
      if (tempPolygon) {
        map.removeLayer(tempPolygon);
      }

      // Create temporary polygon for preview
      if (newPoints.length >= 3) {
        const polygon = L.polygon(newPoints as L.LatLngExpression[], {
          color: '#3B82F6',
          fillOpacity: 0.3,
          dashArray: '5, 5',
        }).addTo(map);
        setTempPolygon(polygon);
      }
    },

    contextmenu: (e) => {
      if (!isDrawing || drawingPoints.length < 3) return;
      e.originalEvent.preventDefault();
      finishPolygon();
    },
  });

  const finishPolygon = () => {
    if (drawingPoints.length < 3) return;

    const coordinates: [number, number][] = drawingPoints.map((point) => [
      point.lat,
      point.lng,
    ]);

    const lats = coordinates.map((c) => c[0]);
    const lngs = coordinates.map((c) => c[1]);

    const bounds = {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };

    const centroid: [number, number] = [
      lats.reduce((a, b) => a + b, 0) / lats.length,
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
    ];

    const newPolygon: Polygon = {
      id: generateId(),
      name: `Polygon ${Date.now()}`,
      coordinates,
      dataSource: dataSources[0]?.id || '',
      color: '#3B82F6',
      bounds,
      centroid,
    };

    addPolygon(newPolygon);

    // Cleanup
    if (tempPolygon) {
      map.removeLayer(tempPolygon);
      setTempPolygon(null);
    }
    setDrawingPoints([]);
    setIsDrawing(false);
  };

  // Cleanup when drawing is cancelled
  useEffect(() => {
    if (!isDrawing && tempPolygon) {
      map.removeLayer(tempPolygon);
      setTempPolygon(null);
      setDrawingPoints([]);
    }
  }, [isDrawing]);

  // Auto-finish if max points reached
  useEffect(() => {
    if (drawingPoints.length >= 12) {
      finishPolygon();
    }
  }, [drawingPoints]);

  return null;
}
