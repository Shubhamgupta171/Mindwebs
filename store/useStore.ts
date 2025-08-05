import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Polygon, DataSource, ColorRule, TimelineState } from "@/types";

interface AppState {
 
  timeline: TimelineState;
  setTimeline: (timeline: Partial<TimelineState>) => void;


  polygons: Polygon[];
  addPolygon: (polygon: Polygon) => void;
  removePolygon: (id: string) => void;
  updatePolygon: (id: string, updates: Partial<Polygon>) => void;

  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;

 
  dataSources: DataSource[];
  setDataSources: (sources: DataSource[]) => void;
  updateDataSource: (id: string, updates: Partial<DataSource>) => void;


  selectedDataSourceId: string;
  setSelectedDataSource: (id: string) => void;


  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;


  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const defaultDataSources: DataSource[] = [
  {
    id: "openmeteo-temp",
    name: "Temperature",
    field: "temperature_2m",
    apiUrl: "https://archive-api.open-meteo.com/v1/archive",
    colorRules: [
      {
        id: "1",
        operator: "<",
        value: 0,
        color: "#3B82F6",
        label: "Very Cold",
      },
      { id: "2", operator: ">=", value: 0, color: "#10B981", label: "Cold" },
      { id: "3", operator: ">=", value: 15, color: "#F59E0B", label: "Mild" },
      { id: "4", operator: ">=", value: 25, color: "#EF4444", label: "Hot" },
    ],
  },
 
];

const now = new Date();
const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({

      timeline: {
        startTime: fifteenDaysAgo,
        endTime: now,
        currentTime: now,
        isRange: false,
      },
      setTimeline: (timeline) =>
        set((state) => ({
          timeline: { ...state.timeline, ...timeline },
        })),


      polygons: [],
      addPolygon: (polygon) =>
        set((state) => ({
          polygons: [...state.polygons, polygon],
        })),
      removePolygon: (id) =>
        set((state) => ({
          polygons: state.polygons.filter((p) => p.id !== id),
        })),
      updatePolygon: (id, updates) =>
        set((state) => ({
          polygons: state.polygons.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

 
      isDrawing: false,
      setIsDrawing: (drawing) => set({ isDrawing: drawing }),

    
      dataSources: defaultDataSources,
      setDataSources: (sources) => set({ dataSources: sources }),
      updateDataSource: (id, updates) =>
        set((state) => ({
          dataSources: state.dataSources.map((ds) =>
            ds.id === id ? { ...ds, ...updates } : ds
          ),
        })),

     
      selectedDataSourceId: defaultDataSources[0].id,
      setSelectedDataSource: (id) => set({ selectedDataSourceId: id }),

     
      mapCenter: [28.6139, 77.209],
      setMapCenter: (center) => set({ mapCenter: center }),

  
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "weather-dashboard-storage",
      partialize: (state) => ({
        polygons: state.polygons,
        dataSources: state.dataSources,
        mapCenter: state.mapCenter,
        selectedDataSourceId: state.selectedDataSourceId,
      }),
    }
  )
);
