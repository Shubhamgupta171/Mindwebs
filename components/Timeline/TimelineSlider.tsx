"use client";

import React from "react";
import { Range } from "react-range";
import { format, addHours, differenceInHours } from "date-fns";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export function TimelineSlider() {
  const { timeline, setTimeline } = useStore();

  const now = new Date();
  const startBoundary = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const endBoundary = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

  const totalHours = differenceInHours(endBoundary, startBoundary);
  const currentHourIndex = differenceInHours(
    timeline.currentTime,
    startBoundary
  );
  const startHourIndex = differenceInHours(timeline.startTime, startBoundary);
  const endHourIndex = differenceInHours(timeline.endTime, startBoundary);

  const handleSingleValueChange = (values: number[]) => {
    const newTime = addHours(startBoundary, values[0]);
    setTimeline({
      currentTime: newTime,
      startTime: newTime,
      endTime: newTime,
    });
  };

  const handleRangeValueChange = (values: number[]) => {
    const newStartTime = addHours(startBoundary, values[0]);
    const newEndTime = addHours(startBoundary, values[1]);
    setTimeline({
      startTime: newStartTime,
      endTime: newEndTime,
      currentTime: newStartTime,
    });
  };

  const toggleMode = () => {
    setTimeline({
      isRange: !timeline.isRange,
      startTime: timeline.currentTime,
      endTime: timeline.currentTime,
    });
  };

  const resetToNow = () => {
    setTimeline({
      currentTime: now,
      startTime: now,
      endTime: now,
    });
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Timeline Control</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeline.isRange ? "outline" : "default"}
            size="sm"
            onClick={toggleMode}
          >
            {timeline.isRange ? "Range Mode" : "Single Mode"}
          </Button>
          <Button variant="outline" size="sm" onClick={resetToNow}>
            <Calendar className="w-4 h-4 mr-1" />
            Now
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="px-2">
          <Range
            step={1}
            min={0}
            max={totalHours}
            values={
              timeline.isRange
                ? [startHourIndex, endHourIndex]
                : [currentHourIndex]
            }
            onChange={
              timeline.isRange
                ? handleRangeValueChange
                : handleSingleValueChange
            }
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="h-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full relative"
              >
                {children}
              </div>
            )}
            renderThumb={({ props, index }) => (
              <div
                {...props}
                key={index}
                className="h-6 w-6 bg-blue-500 border-2 border-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-blue-600 transition-colors"
              />
            )}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>{format(startBoundary, "MMM dd, HH:mm")}</span>
          <span>{format(endBoundary, "MMM dd, HH:mm")}</span>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          {timeline.isRange ? (
            <div className="space-y-1">
              <div className="text-sm font-medium">Selected Range:</div>
              <div className="text-sm">
                From:{" "}
                <span className="font-mono">
                  {format(timeline.startTime, "MMM dd, yyyy HH:mm")}
                </span>
              </div>
              <div className="text-sm">
                To:{" "}
                <span className="font-mono">
                  {format(timeline.endTime, "MMM dd, yyyy HH:mm")}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Duration:{" "}
                {differenceInHours(timeline.endTime, timeline.startTime)} hours
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-sm font-medium">Selected Time:</div>
              <div className="text-sm font-mono">
                {format(timeline.currentTime, "MMM dd, yyyy HH:mm")}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
