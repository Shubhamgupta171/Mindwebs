"use client";

import React from "react";
import dynamic from "next/dynamic";
import { TimelineSlider } from "./Timeline/TimelineSlider";
import { Sidebar } from "./Sidebar/Sidebar";
import { useStore } from "@/store/useStore";
import { Loader2 } from "lucide-react";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(
  () => import("./Map/MapView").then((mod) => ({ default: mod.MapView })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    ),
  }
);

export function Dashboard() {
  const { isLoading } = useStore();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Weather Data Dashboard
            </h1>
            <p className="text-gray-600">
              Interactive polygon-based weather analysis
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading data...</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 p-6 overflow-auto">
          <TimelineSlider />
          <MapView />
        </div>

        {/* Right Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}
