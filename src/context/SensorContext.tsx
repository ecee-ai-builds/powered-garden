import { createContext, useContext, type ReactNode } from "react";
import { useSensorData } from "@/hooks/useSensorData";
import type { SensorData } from "@/types/sensor";

interface SensorContextValue {
  data: SensorData | null;
  error: string | null;
  isLoading: boolean;
  lastSuccess: Date | null;
  refreshMs: number;
  refetch: () => Promise<void>;
}

const SensorContext = createContext<SensorContextValue | undefined>(undefined);

export const SensorProvider = ({ children }: { children: ReactNode }) => {
  const sensor = useSensorData();
  return (
    <SensorContext.Provider value={sensor}>{children}</SensorContext.Provider>
  );
};

export const useSensorContext = (): SensorContextValue => {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error("useSensorContext must be used within a SensorProvider");
  }
  return context;
};


