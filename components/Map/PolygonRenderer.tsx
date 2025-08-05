'use client';

import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useStore } from '@/store/useStore';
import { getPolygonColor } from '@/lib/dataUtils';

export function PolygonRenderer() {
  const map = useMap();
  const { 
    polygons, 
    dataSources, 
    timeline,
    updatePolygon,
    isLoading 
  } = useStore();
  
  const polygonRefs = React.useRef<Map<string, L.Polygon>>(new Map());

  useEffect(() => {
    // Clear existing polygons
    polygonRefs.current.forEach(polygon => {
      map.removeLayer(polygon);
    });
    polygonRefs.current.clear();

    // Render current polygons
    polygons.forEach(async (polygon) => {
      const dataSource = dataSources.find(ds => ds.id === polygon.dataSource);
      if (!dataSource) return;

      // Get color based on current data
      const color = await getPolygonColor(polygon, dataSource, timeline);
      
      const leafletPolygon = L.polygon(polygon.coordinates, {
        color: color,
        fillOpacity: 0.6,
        weight: 2
      }).addTo(map);

      // Add popup with polygon info
      leafletPolygon.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${polygon.name}</h3>
          <p class="text-sm text-gray-600">Data Source: ${dataSource.name}</p>
          <p class="text-sm text-gray-600">Points: ${polygon.coordinates.length}</p>
        </div>
      `);

      polygonRefs.current.set(polygon.id, leafletPolygon);

      // Update polygon color in store
      if (polygon.color !== color) {
        updatePolygon(polygon.id, { color });
      }
    });

    return () => {
      polygonRefs.current.forEach(polygon => {
        map.removeLayer(polygon);
      });
      polygonRefs.current.clear();
    };
  }, [polygons, dataSources, timeline, map, updatePolygon]);

  return null;
}