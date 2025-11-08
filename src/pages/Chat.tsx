import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Loader2, Thermometer, Droplets, TestTube, Sprout } from "lucide-react";
import { useSensorContext } from "@/context/SensorContext";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PlantInfo {
  common_name: string;
  cabinet_fit: string;
  cycle_days: string;
  setpoints: {
    air_temp_c: { min: number; ideal: [number, number]; max: number };
    rel_humidity_pct: { ideal: [number, number] };
    soil_or_solution_ph: { ideal: [number, number] };
    soil_moisture: { target_pct: [number, number]; hint: string };
  };
  notes: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your growing assistant 🌱 Let me help you succeed with your cabinet garden. Tell me what you'd like to grow, or ask me anything about your plants!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>({
    common_name: "Lettuce (Butterhead)",
    cabinet_fit: "compact",
    cycle_days: "35–45",
    setpoints: {
      air_temp_c: { min: 18, ideal: [18, 24], max: 29 },
      rel_humidity_pct: { ideal: [50, 70] },
      soil_or_solution_ph: { ideal: [5.5, 6.5] },
      soil_moisture: { target_pct: [45, 60], hint: "avoid over-wet roots" }
    },
    notes: "Cooler-loving; adjust airflow to avoid tip burn."
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: sensorData } = useSensorContext();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sensorData: sensorData ? {
            temperature: sensorData.temp_c,
            humidity: sensorData.humidity_percent,
            timestamp: sensorData.timestamp
          } : null
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "Please try again in a moment.",
            variant: "destructive"
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Payment required",
            description: "Please add credits to continue using the AI assistant.",
            variant: "destructive"
          });
          return;
        }
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";
      let streamDone = false;

      if (!reader) throw new Error("No response body");

      const upsertAssistant = (chunk: string) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { role: "assistant", content: assistantContent }];
        });
      };

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-6 flex gap-6">
      {/* Main Chat Area */}
      <div className="flex-[2] flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-primary tracking-wider">
            GROW ASSISTANT
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Your personal guide for cabinet growing in Malaysia
          </p>
        </div>

        <Card className="flex-1 flex flex-col border-primary/20">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-primary/20">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about plants, settings, or your sensor data..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Plant Profile Card - Pokemon-inspired */}
      <div className="flex-1 flex flex-col justify-center">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-sidebar/90 to-sidebar/50 backdrop-blur shadow-lg rounded-2xl overflow-hidden h-fit">
          {!plantInfo ? (
            // Skeleton state
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-32 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-full rounded" />
                <Skeleton className="h-8 w-full rounded" />
                <Skeleton className="h-8 w-full rounded" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
              <Skeleton className="h-12 w-full rounded" />
            </CardContent>
          ) : (
            <CardContent className="p-0">
              {/* Header - Pokemon card style */}
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-2 border-b border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-primary uppercase tracking-wide flex-1">
                    {plantInfo.common_name}
                  </span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-primary/20 px-2 py-0.5 rounded text-primary font-medium">
                    {plantInfo.cabinet_fit}
                  </span>
                  <span className="bg-primary/20 px-2 py-0.5 rounded text-primary font-medium">
                    {plantInfo.cycle_days}d
                  </span>
                </div>
              </div>

              {/* Plant illustration */}
              <div className="px-4 pt-4 pb-2">
                <div className="h-28 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center bg-sidebar/40">
                  <Sprout className="h-12 w-12 text-primary/40" />
                </div>
              </div>

              {/* Stats section - compact */}
              <div className="px-4 pb-4 space-y-2">
                {/* Temperature */}
                <div className="bg-sidebar/60 rounded-lg px-3 py-2 border border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Temp</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {plantInfo.setpoints.air_temp_c.ideal[0]}–{plantInfo.setpoints.air_temp_c.ideal[1]}°C
                    </span>
                  </div>
                </div>

                {/* Humidity */}
                <div className="bg-sidebar/60 rounded-lg px-3 py-2 border border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Humidity</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {plantInfo.setpoints.rel_humidity_pct.ideal[0]}–{plantInfo.setpoints.rel_humidity_pct.ideal[1]}%
                    </span>
                  </div>
                </div>

                {/* pH */}
                <div className="bg-sidebar/60 rounded-lg px-3 py-2 border border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TestTube className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">pH</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {plantInfo.setpoints.soil_or_solution_ph.ideal[0]}–{plantInfo.setpoints.soil_or_solution_ph.ideal[1]}
                    </span>
                  </div>
                </div>

                {/* Moisture */}
                <div className="bg-sidebar/60 rounded-lg px-3 py-2 border border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Moisture</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {plantInfo.setpoints.soil_moisture.target_pct[0]}–{plantInfo.setpoints.soil_moisture.target_pct[1]}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes - bottom section */}
              <div className="bg-primary/10 border-t-2 border-primary/20 px-4 py-3">
                <p className="text-xs text-foreground leading-relaxed">
                  <span className="font-semibold text-primary">Note: </span>
                  {plantInfo.notes}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;
