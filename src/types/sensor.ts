export interface SensorData {
  timestamp: string;
  temp_c: number | null;
  humidity_percent: number | null;
  ok: boolean;
  error: string | null;
}


