export interface Polygon {
  id: string;
  name: string;
  coordinates: [number, number][];
  dataSource: string;
  color: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  centroid: [number, number];
}

export interface DataSource {
  id: string;
  name: string;
  field: string;
  apiUrl: string;
  colorRules: ColorRule[];
}

export interface ColorRule {
  id: string;
  operator: '<' | '>' | '=' | '<=' | '>=';
  value: number;
  color: string;
  label: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m?: number[];
    precipitation?: number[];
    wind_speed_10m?: number[];
  };
}

export interface TimelineState {
  startTime: Date;
  endTime: Date;
  currentTime: Date;
  isRange: boolean;
}