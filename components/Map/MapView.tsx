"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLng } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useStore } from "@/store/useStore";
import { PolygonDrawer } from "./PolygonDrawer";
import { PolygonRenderer } from "./PolygonRenderer";
import { Card } from "@/components/ui/card";

// ✅ Setup default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapEventsProps {
  onMapMove: (center: LatLng) => void;
}

const MapEvents = ({ onMapMove }: MapEventsProps) => {
  const map = useMap();

  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onMapMove(center);
    },
  });

  return null;
};

const MapController = () => {
  const { mapCenter, setMapCenter } = useStore();
  const map = useMap();

  useEffect(() => {
    if (map && mapCenter) {
      map.setView(mapCenter, map.getZoom());
    }
  }, [map, mapCenter]);

  const handleMapMove = (center: LatLng) => {
    const newCenter: [number, number] = [center.lat, center.lng];

    if (
      newCenter[0] !== mapCenter[0] ||
      newCenter[1] !== mapCenter[1]
    ) {
      setMapCenter(newCenter);
    }
  };

  return <MapEvents onMapMove={handleMapMove} />;
};

export const MapView = () => {
  const { mapCenter } = useStore();

  if (!mapCenter) return null;

  return (
    <Card className="p-0 overflow-hidden h-[400px] sm:h-[500px] md:h-[600px] w-full rounded-xl shadow-md">
      <MapContainer
        center={mapCenter}
        zoom={10}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full rounded-b-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapController />
        <PolygonDrawer />
        <PolygonRenderer />
      </MapContainer>
    </Card>
  );
};
