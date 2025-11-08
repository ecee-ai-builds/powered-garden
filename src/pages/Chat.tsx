import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Loader2, Thermometer, Droplets, TestTube } from "lucide-react";
import { useSensorContext } from "@/context/SensorContext";
import { toast } from "@/hooks/use-toast";
import lettuceIcon from "@/assets/plants/lettuce.svg";
interface Message {
  role: "user" | "assistant";
  content: string;
}
interface PlantInfo {
  common_name: string;
  name_malay: string;
  name_chinese: string;
  cabinet_fit: string;
  cycle_days: string;
  setpoints: {
    air_temp_c: {
      min: number;
      ideal: [number, number];
      max: number;
    };
    rel_humidity_pct: {
      ideal: [number, number];
    };
    soil_or_solution_ph: {
      ideal: [number, number];
    };
    soil_moisture: {
      target_pct: [number, number];
      hint: string;
    };
  };
  notes: string;
  whimsical_fact: string;
}
const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Let's grow something together 🌱 What will you be interested in growing today?"
  }]);
  const [showPlantOptions, setShowPlantOptions] = useState(true);
  
  const mvpPlants = [
    "Basil (Sweet basil)",
    "Mint (Pudina)",
    "Pak-choy (Sawi)",
    "Kailan (Chinese kale)",
    "Bayam (Amaranth)",
    "Lettuce (Butterhead)",
    "Coriander (Ketumbar)",
    "Chives (Daun kucai)",
    "Parsley (Daun pasli)",
    "Dwarf Chilli (Cili kecil)"
  ];
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>({
    common_name: "Lettuce (Butterhead)",
    name_malay: "Salad Mentega",
    name_chinese: "奶油生菜",
    cabinet_fit: "compact",
    cycle_days: "35–45",
    setpoints: {
      air_temp_c: {
        min: 18,
        ideal: [18, 24],
        max: 29
      },
      rel_humidity_pct: {
        ideal: [50, 70]
      },
      soil_or_solution_ph: {
        ideal: [5.5, 6.5]
      },
      soil_moisture: {
        target_pct: [45, 60],
        hint: "avoid over-wet roots"
      }
    },
    notes: "Cooler-loving; adjust airflow to avoid tip burn.",
    whimsical_fact: "Perfect crispy cups for wrapping ayam percik or sambal petai."
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    data: sensorData
  } = useSensorContext();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const handlePlantSelect = (plant: string) => {
    const plantMessage = `I want to grow ${plant}`;
    const userMessage: Message = {
      role: "user",
      content: plantMessage
    };
    setMessages(prev => [...prev, userMessage]);
    setShowPlantOptions(false);
    setIsLoading(true);
    
    // Send to API
    sendToAPI([...messages, userMessage]);
  };

  const sendToAPI = async (messageHistory: Message[]) => {
    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          messages: messageHistory,
          sensorData: sensorData ? {
            temperature: sensorData.temp_c,
            humidity: sensorData.humidity_percent,
            timestamp: sensorData.timestamp
          } : null
        })
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
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => i === prev.length - 1 ? {
              ...m,
              content: assistantContent
            } : m);
          }
          return [...prev, {
            role: "assistant",
            content: assistantContent
          }];
        });
      };
      while (!streamDone) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, {
          stream: true
        });
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
            if (content) {
              upsertAssistant(content);
            }
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setShowPlantOptions(false);
    const userMessage: Message = {
      role: "user",
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    await sendToAPI([...messages, userMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return <div className="h-[calc(100vh-4rem)] p-6 flex gap-6">
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
              {messages.map((msg, idx) => <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    <p className="text-sm whitespace-pre-wrap font-thin">{msg.content}</p>
                  </div>
                </div>)}
              
              {showPlantOptions && messages.length === 1 && <div className="flex justify-start">
                  <div className="max-w-[90%] space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {mvpPlants.map((plant) => (
                        <Button
                          key={plant}
                          variant="outline"
                          onClick={() => handlePlantSelect(plant)}
                          disabled={isLoading}
                          className="h-auto py-3 px-4 text-left justify-start hover:bg-primary/10 hover:border-primary/30"
                        >
                          <span className="text-sm font-medium">{plant}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>}
              
              {isLoading && <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-primary/20">
            <div className="flex gap-2">
              <Textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about plants, settings, or your sensor data..." className="min-h-[60px] resize-none" disabled={isLoading} />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="h-[60px] w-[60px]">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Plant Profile Card - Pokemon-inspired */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Spacer to align with chat header */}
        <div className="mb-4 flex-shrink-0">
          <div className="text-2xl opacity-0 pointer-events-none">SPACER</div>
          <p className="text-xs opacity-0 mt-1">spacer</p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="pr-4 space-y-3">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-sidebar/90 to-sidebar/50 backdrop-blur shadow-lg rounded-2xl overflow-hidden">
          {!plantInfo ?
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
            </CardContent> : <CardContent className="p-0">
              {/* Header - Pokemon card style */}
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-2 border-b border-primary/20">
                <div className="mb-2">
                  <div className="text-sm font-bold text-primary uppercase tracking-wide">
                    {plantInfo.common_name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="italic">{plantInfo.name_malay}</span>
                    <span>•</span>
                    <span>{plantInfo.name_chinese}</span>
                  </div>
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
                <div className="h-28 rounded-lg flex items-center justify-center relative">
                  <img src={lettuceIcon} alt={plantInfo.common_name} className="h-24 w-24 object-contain" style={{
                    filter: 'brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(500%) hue-rotate(10deg)'
                  }} />
                </div>
                <p className="text-muted-foreground italic mt-2 text-center text-xs">
                  {plantInfo.whimsical_fact}
                </p>
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
            </CardContent>}
        </Card>

        {/* Cooking Dishes Section */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wide">
              Cooking Dishes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <button onClick={() => {
                const recipePrompt = "Tell me more about Nasi Goreng USA and how to prepare lettuce for it";
                setInput(recipePrompt);
                setTimeout(() => handleSend(), 100);
              }} disabled={isLoading} className="w-full text-left p-3 rounded-lg bg-sidebar/60 hover:bg-sidebar/80 border border-primary/10 hover:border-primary/20 transition-all">
              <div className="font-medium text-sm text-foreground">Nasi Goreng USA</div>
              <div className="text-xs text-muted-foreground mt-1">
                Wrapped with rice & sambal
              </div>
            </button>

            <button onClick={() => {
                const recipePrompt = "Tell me more about Yong Tau Foo and how to use lettuce in it";
                setInput(recipePrompt);
                setTimeout(() => handleSend(), 100);
              }} disabled={isLoading} className="w-full text-left p-3 rounded-lg bg-sidebar/60 hover:bg-sidebar/80 border border-primary/10 hover:border-primary/20 transition-all">
              <div className="font-medium text-sm text-foreground">Yong Tau Foo</div>
              <div className="text-xs text-muted-foreground mt-1">
                Served in clear soup or dry with sauce
              </div>
            </button>

            <button onClick={() => {
                const recipePrompt = "Tell me more about using lettuce as ulam and what to eat with it";
                setInput(recipePrompt);
                setTimeout(() => handleSend(), 100);
              }} disabled={isLoading} className="w-full text-left p-3 rounded-lg bg-sidebar/60 hover:bg-sidebar/80 border border-primary/10 hover:border-primary/20 transition-all">
              <div className="font-medium text-sm text-foreground">Ulam Platter</div>
              <div className="text-xs text-muted-foreground mt-1">
                Fresh with sambal belacan & ikan bilis
              </div>
            </button>
          </CardContent>
        </Card>
          </div>
        </ScrollArea>
      </div>
    </div>;
};
export default Chat;