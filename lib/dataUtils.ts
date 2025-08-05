import { format, subDays, isAfter, startOfHour } from 'date-fns';
import type { Polygon, DataSource, ColorRule, TimelineState } from '@/types';

const API_URL = "https://archive-api.open-meteo.com/v1/archive";

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  startDate: Date,
  endDate: Date,
  hourly: string
) {
  const yesterday = subDays(new Date(), 1);
  const clampedEndDate = isAfter(endDate, yesterday) ? yesterday : endDate;

  if (isAfter(startDate, clampedEndDate)) {
    console.warn("Start date is after the latest available data.");
    return null;
  }

  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(clampedEndDate, 'yyyy-MM-dd');

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    start_date: formattedStartDate,
    end_date: formattedEndDate,
    hourly: hourly,
  });

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(`Weather API error: ${response.status} - ${errorData.reason}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw error;
  }
}

function getAverageValue(apiData: any, field: string, startTime: Date, endTime: Date): number | null {
  if (!apiData?.hourly?.time || !apiData.hourly[field]) return null;

  const { time, [field]: values } = apiData.hourly;

  const startIndex = time.findIndex((t: string) => !isAfter(startOfHour(new Date(t)), endTime));
  const endIndex = time.findLastIndex((t: string) => !isAfter(startOfHour(new Date(t)), endTime));

  if (startIndex === -1 || endIndex === -1) return null;

  const relevantValues = values.slice(startIndex, endIndex + 1).filter((v: any) => v !== null);
  if (relevantValues.length === 0) return null;

  const sum = relevantValues.reduce((acc: number, val: number) => acc + val, 0);
  return sum / relevantValues.length;
}

export async function getPolygonColor(
  polygon: Polygon,
  dataSource: DataSource,
  timeline: TimelineState
): Promise<string> {
  const defaultColor = '#808080';

  if (!polygon.dataSource || !dataSource.field) return defaultColor;

  try {
    const apiData = await fetchWeatherData(
      polygon.centroid[0],
      polygon.centroid[1],
      timeline.startTime,
      timeline.endTime,
      dataSource.field
    );

    if (!apiData) return defaultColor;

    const avgValue = getAverageValue(apiData, dataSource.field, timeline.startTime, timeline.endTime);
    if (avgValue === null) return defaultColor;

    for (const rule of dataSource.colorRules) {
      if (evaluateRule(avgValue, rule)) {
        return rule.color;
      }
    }

    return defaultColor;
  } catch (error) {
    console.error(`Error getting color for polygon ${polygon.id}:`, error);
    return '#FF0000'; // fallback error color
  }
}

function evaluateRule(value: number, rule: ColorRule): boolean {
  switch (rule.operator) {
    case '<': return value < rule.value;
    case '<=': return value <= rule.value;
    case '=': return value === rule.value;
    case '>=': return value >= rule.value;
    case '>': return value > rule.value;
    default: return false;
  }
}
