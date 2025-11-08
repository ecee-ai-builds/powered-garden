import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SensorData } from "@/types/sensor";

const DEFAULT_REFRESH_MS = 2500;

const parseRefreshInterval = (value: string | undefined): number => {
  if (!value) return DEFAULT_REFRESH_MS;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_REFRESH_MS;
};

interface UseSensorDataResult {
  data: SensorData | null;
  error: string | null;
  isLoading: boolean;
  lastSuccess: Date | null;
  refreshMs: number;
  refetch: () => Promise<void>;
}

export const useSensorData = (): UseSensorDataResult => {
  const endpoint =
    import.meta.env.VITE_SENSOR_URL?.trim() || "/latest.json";
  const refreshMs = useMemo(
    () => parseRefreshInterval(import.meta.env.VITE_SENSOR_REFRESH_MS),
    []
  );

  const [data, setData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSuccess, setLastSuccess] = useState<Date | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchLatest = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setIsLoading(true);
      const cacheBuster = `_=${Date.now()}`;
      const separator = endpoint.includes("?") ? "&" : "?";
      const response = await fetch(`${endpoint}${separator}${cacheBuster}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Sensor endpoint returned ${response.status} ${response.statusText}`
        );
      }

      const payload = (await response.json()) as SensorData;
      setData(payload);
      setError(payload.ok ? null : payload.error ?? null);
      setLastSuccess((prev) =>
        payload.ok ? new Date(payload.timestamp) : prev
      );
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "Unknown sensor error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchLatest();
    intervalRef.current = window.setInterval(fetchLatest, refreshMs);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      controllerRef.current?.abort();
    };
  }, [fetchLatest, refreshMs]);

  return {
    data,
    error,
    isLoading,
    lastSuccess,
    refreshMs,
    refetch: fetchLatest,
  };
};


