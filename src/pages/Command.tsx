import { Thermometer, Droplets, Activity, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSensorContext } from "@/context/SensorContext";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const TARGETS = {
  temperature: { min: 18, max: 28 },
  humidity: { min: 50, max: 75 },
};

const getStatus = (value: number | null, min: number, max: number) => {
  if (value === null || Number.isNaN(value)) return "offline";
  if (value >= min && value <= max) return "normal";
  const delta = Math.max(Math.abs(value - min), Math.abs(value - max));
  if (delta <= 2) return "warning";
  return "critical";
};

const formatStatusLabel = (status: string) => {
  switch (status) {
    case "normal":
      return "STATUS: OPTIMAL";
    case "warning":
      return "STATUS: ADJUSTING";
    case "critical":
      return "STATUS: OUT OF RANGE";
    default:
      return "STATUS: OFFLINE";
  }
};

const statusAccent = (status: string) => {
  switch (status) {
    case "normal":
      return "text-success";
    case "warning":
      return "text-warning";
    case "critical":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

const formatMetric = (value: number | null, suffix: string) =>
  value == null || Number.isNaN(value)
    ? `--.-${suffix}`
    : `${Number.parseFloat(value.toString()).toFixed(1)}${suffix}`;

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return "Awaiting sensor signal…";
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return "Invalid sensor timestamp";
  return parsed.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "short",
  });
};

const Command = () => {
  const { data, error, isLoading, lastSuccess, refreshMs } = useSensorContext();
  const { temp_c: temperature, humidity_percent: humidity, timestamp, ok } =
    data ?? {};

  const tempStatus = useMemo(
    () =>
      getStatus(
        temperature ?? null,
        TARGETS.temperature.min,
        TARGETS.temperature.max
      ),
    [temperature]
  );

  const humidityStatus = useMemo(
    () =>
      getStatus(
        humidity ?? null,
        TARGETS.humidity.min,
        TARGETS.humidity.max
      ),
    [humidity]
  );

  const latestTimestamp = timestamp ?? lastSuccess?.toISOString();
  const sensorFault = error || (!ok && data?.error);

  return <div className="min-h-screen p-6 md:p-8 scanline">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary cyber-glow mb-2 tracking-wider">ENVIRONMENT CONTROL</h1>
        <p className="text-muted-foreground tracking-wide">
          Real-time monitoring for conditions of your plant cabinet — feed interval{" "}
          {(refreshMs / 1000).toFixed(1)}s
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Temperature Card */}
        <Card className="cyber-card">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center gap-3 text-primary">
              <Thermometer className="h-6 w-6 cyber-glow" />
              <span className="tracking-wider">TEMPERATURE</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-primary cyber-glow">
                  {formatMetric(temperature ?? null, "°C")}
                </div>
                <div className="text-sm text-muted-foreground mt-2 tracking-wide">
                  CURRENT_READING
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground border-t border-primary/20 pt-4">
                <span className={statusAccent(tempStatus)}>
                  {formatStatusLabel(tempStatus)}
                </span>
                <span className={cn(statusAccent(tempStatus), "cyber-glow")}>
                  ● {tempStatus === "offline" ? "WAITING" : "LIVE"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card className="cyber-card">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center gap-3 text-primary">
              <Droplets className="h-6 w-6 cyber-glow" />
              <span className="tracking-wider">HUMIDITY</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-primary cyber-glow">
                  {formatMetric(humidity ?? null, "%")}
                </div>
                <div className="text-sm text-muted-foreground mt-2 tracking-wide">
                  CURRENT_READING
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground border-t border-primary/20 pt-4">
                <span className={statusAccent(humidityStatus)}>
                  {formatStatusLabel(humidityStatus)}
                </span>
                <span className={cn(statusAccent(humidityStatus), "cyber-glow")}>
                  ● {humidityStatus === "offline" ? "WAITING" : "LIVE"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terminal-style status bar */}
      <div className="mt-8 max-w-4xl">
        <div className="bg-card/50 border-2 border-primary/30 rounded-sm p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-primary/70">
            <Activity className="h-3 w-3 animate-pulse" />
            <span className="tracking-wide">
              SYSTEM_LOG: {sensorFault ? "ERROR" : "Monitoring active"} — last sync{" "}
              {formatTimestamp(latestTimestamp)}
            </span>
          </div>
          {sensorFault && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <AlertTriangle className="h-3 w-3" />
              <span className="tracking-wide">
                SENSOR_ALERT: {sensorFault}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>;
};
export default Command;