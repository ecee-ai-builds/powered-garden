import { Wifi, WifiOff, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastPing, setLastPing] = useState<number>(0);

  // Simulate connection checking
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection issues
      const connected = Math.random() > 0.1;
      setIsConnected(connected);
      if (connected) {
        setLastPing(Math.floor(Math.random() * 50) + 10);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8 scanline">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary cyber-glow mb-2 tracking-wider">
          &gt; SYSTEM_SETTINGS
        </h1>
        <p className="text-muted-foreground tracking-wide">
          Hardware connection management
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Connection Status Card */}
        <Card className="cyber-card">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center gap-3 text-primary">
              {isConnected ? (
                <Wifi className="h-6 w-6 cyber-glow" />
              ) : (
                <WifiOff className="h-6 w-6 text-destructive cyber-glow" />
              )}
              <span className="tracking-wider">RASPBERRY_PI_CONNECTION</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Connection Status */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-sm border border-primary/20">
              <div>
                <div className="text-sm text-muted-foreground mb-1 tracking-wide">
                  CONNECTION_STATUS
                </div>
                <div className="font-bold text-lg">
                  {isConnected ? (
                    <Badge className="bg-success/20 text-success border-success cyber-glow">
                      ● CONNECTED
                    </Badge>
                  ) : (
                    <Badge className="bg-destructive/20 text-destructive border-destructive cyber-glow">
                      ● DISCONNECTED
                    </Badge>
                  )}
                </div>
              </div>
              <Activity
                className={`h-8 w-8 ${
                  isConnected
                    ? "text-success animate-pulse"
                    : "text-destructive/50"
                }`}
              />
            </div>

            {/* Connection Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-card border border-primary/20 rounded-sm">
                <div className="text-xs text-muted-foreground mb-2 tracking-wide">
                  DEVICE_IP
                </div>
                <div className="font-mono text-primary cyber-glow">
                  192.168.1.100
                </div>
              </div>

              <div className="p-4 bg-card border border-primary/20 rounded-sm">
                <div className="text-xs text-muted-foreground mb-2 tracking-wide">
                  LATENCY
                </div>
                <div className="font-mono text-primary">
                  {isConnected ? `${lastPing}ms` : "N/A"}
                </div>
              </div>

              <div className="p-4 bg-card border border-secondary/20 rounded-sm">
                <div className="text-xs text-muted-foreground mb-2 tracking-wide">
                  PROTOCOL
                </div>
                <div className="font-mono text-secondary">
                  MQTT/TCP
                </div>
              </div>

              <div className="p-4 bg-card border border-secondary/20 rounded-sm">
                <div className="text-xs text-muted-foreground mb-2 tracking-wide">
                  UPTIME
                </div>
                <div className="font-mono text-secondary">
                  {isConnected ? "24h 32m" : "0h 0m"}
                </div>
              </div>
            </div>

            {/* System Log */}
            <div className="p-4 bg-background/50 border-2 border-primary/30 rounded-sm">
              <div className="text-xs text-primary/70 space-y-1 font-mono">
                <div className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>[{new Date().toLocaleTimeString()}] Connection established</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>[{new Date().toLocaleTimeString()}] Sensor data stream active</span>
                </div>
                {!isConnected && (
                  <div className="flex items-start gap-2">
                    <span className="text-destructive">✗</span>
                    <span className="text-destructive">
                      [{new Date().toLocaleTimeString()}] Connection lost - attempting reconnect...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
