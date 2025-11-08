import { Thermometer, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

const Command = () => {
  const [temperature, setTemperature] = useState<number>(22.5);
  const [humidity, setHumidity] = useState<number>(65.3);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) => +(prev + (Math.random() - 0.5) * 0.5).toFixed(1));
      setHumidity((prev) => +(prev + (Math.random() - 0.5) * 2).toFixed(1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8 scanline">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary cyber-glow mb-2 tracking-wider">
          &gt; COMMAND_CENTER
        </h1>
        <p className="text-muted-foreground tracking-wide">
          Real-time environmental monitoring
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
                  {temperature}°C
                </div>
                <div className="text-sm text-muted-foreground mt-2 tracking-wide">
                  CURRENT_READING
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground border-t border-primary/20 pt-4">
                <span>STATUS: NORMAL</span>
                <span className="text-success cyber-glow">● LIVE</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card className="cyber-card">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center gap-3 text-foreground">
              <Droplets className="h-6 w-6 cyber-glow" />
              <span className="tracking-wider">HUMIDITY</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-foreground cyber-glow">
                  {humidity}%
                </div>
                <div className="text-sm text-muted-foreground mt-2 tracking-wide">
                  CURRENT_READING
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground border-t border-primary/20 pt-4">
                <span>STATUS: NORMAL</span>
                <span className="text-success cyber-glow">● LIVE</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terminal-style status bar */}
      <div className="mt-8 max-w-4xl">
        <div className="bg-card/50 border-2 border-primary/30 rounded-sm p-4">
          <div className="flex items-center gap-2 text-xs text-primary/70">
            <span className="animate-pulse">▶</span>
            <span className="tracking-wide">SYSTEM_LOG: Monitoring active... Data refresh interval: 3s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Command;
