import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Command from "./pages/Command";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { SensorProvider, useSensorContext } from "@/context/SensorContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
const queryClient = new QueryClient();
const DashboardHeader = () => {
  const { data, error, isLoading, lastSuccess, refreshMs, refetch } =
    useSensorContext();

  const timestamp = data?.timestamp ?? lastSuccess?.toISOString();
  const timestampLabel = timestamp
    ? new Date(timestamp).toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "No data";

  const status = (() => {
    if (error) return { label: "Offline", variant: "destructive" as const };
    if (data?.ok === false)
      return { label: "Sensor Fault", variant: "secondary" as const };
    if (data) return { label: "Live", variant: "default" as const };
    return { label: "Pending", variant: "outline" as const };
  })();

  return (
    <header className="h-16 flex items-center border-b-2 border-primary/30 bg-sidebar/90 px-4 backdrop-blur">
      <SidebarTrigger className="text-primary hover:bg-primary/10" />
      <div className="ml-4 flex items-center gap-3">
        <div
          className={cn(
            "h-2 w-2 rounded-full animate-pulse",
            status.variant === "destructive"
              ? "bg-destructive"
              : status.variant === "secondary"
              ? "bg-warning"
              : "bg-success"
          )}
        />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-widest text-primary/60">
            System Status
          </span>
          <span className="text-xs font-semibold text-primary">
            {timestampLabel} UTC
          </span>
        </div>
        <Badge
          variant={status.variant}
          className={cn(
            "uppercase tracking-wider text-[11px]",
            status.variant === "outline" && "border-primary/40 text-primary"
          )}
        >
          {status.label}
        </Badge>
      </div>
      <button
        className={cn(
          "ml-auto text-xs uppercase tracking-widest text-primary/70 flex items-center gap-2",
          "hover:text-primary transition-colors"
        )}
        onClick={refetch}
        title="Force refresh sensor data"
      >
        <span
          className={cn(
            "inline-flex h-3 w-3 rounded-full border border-primary/40 border-r-transparent",
            isLoading && "animate-spin"
          )}
        />
        Refresh {(refreshMs / 1000).toFixed(1)}s
      </button>
    </header>
  );
};
const App = () => <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SensorProvider>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Command />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
        </SensorProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;
export default App;