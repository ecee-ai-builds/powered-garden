import { useCallback, useMemo, useState } from "react";
import { plantById, plantCards, defaultPlantId } from "@/data/plantCards";
import type { PlantCard, PlantId } from "@/types/plants";

export type ChatRole = "assistant" | "user" | "system";

const randomId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
}

const assistantEndpoint =
  import.meta.env.VITE_GROW_CHAT_URL ??
  "http://localhost:54321/functions/v1/grow-chat";

const createAssistantGreeting = (): ChatMessage => ({
  id: randomId(),
  role: "assistant",
  content:
    "Let’s grow something together! 🌱 Tell me what you’d like to plant or pick a crop below to see its ideal Malaysian cabinet settings.",
  timestamp: Date.now(),
});

const formatSetpointSummary = (plant: PlantCard) => {
  const { setpoints } = plant;
  const tempRange = `${setpoints.air_temp_c.ideal[0]}–${setpoints.air_temp_c.ideal[1]} °C`;
  const humidityRange = `${setpoints.rel_humidity_pct.ideal[0]}–${setpoints.rel_humidity_pct.ideal[1]} %`;
  const moistureRange = `${setpoints.soil_moisture.target_pct[0]}–${setpoints.soil_moisture.target_pct[1]} %`;
  const phRange = `${setpoints.soil_or_solution_ph.ideal[0]}–${setpoints.soil_or_solution_ph.ideal[1]}`;
  return `Here’s a summary for ${plant.common_name}: keep air at ${tempRange}, humidity around ${humidityRange}, moisture ${moistureRange}, and pH ${phRange}. ${plant.notes}`;
};

const classifyIntent = (input: string) => {
  const text = input.toLowerCase();
  if (/(temperature|heat|hot|warm|sejuk|panas)/.test(text)) return "temperature";
  if (/(humidity|moist|wet|kering|water)/.test(text)) return "humidity";
  if (/(ph|acid|alkaline)/.test(text)) return "ph";
  if (/(moisture|soil)/.test(text)) return "moisture";
  if (/(note|care|tips|how)/.test(text)) return "care";
  return "general";
};

const buildAssistantReply = (plant: PlantCard, userInput: string): string => {
  const intent = classifyIntent(userInput);
  const { setpoints } = plant;
  switch (intent) {
    case "temperature":
      return `For ${plant.common_name}, keep the cabinet between ${setpoints.air_temp_c.ideal[0]}°C and ${setpoints.air_temp_c.ideal[1]}°C. If it climbs beyond ${setpoints.air_temp_c.max}°C, boost airflow or switch to a cooler crop.`;
    case "humidity":
      return `${plant.common_name} likes humidity around ${setpoints.rel_humidity_pct.ideal[0]}–${setpoints.rel_humidity_pct.ideal[1]}%. Malaysia’s ambient air is already moist, so top up mist only when you drop below ${setpoints.rel_humidity_pct.ideal[0]}%.`;
    case "moisture":
      return `Aim for media moisture ${setpoints.soil_moisture.target_pct[0]}–${setpoints.soil_moisture.target_pct[1]}%. ${setpoints.soil_moisture.hint}`;
    case "ph":
      return `${plant.common_name} prefers pH ${setpoints.soil_or_solution_ph.ideal[0]}–${setpoints.soil_or_solution_ph.ideal[1]}. Adjust with hydroponic buffers if you drift outside this range.`;
    case "care":
      return plant.notes;
    default:
      return formatSetpointSummary(plant);
  }
};

export const useGrowAssistant = () => {
  const [selectedPlantId, setSelectedPlantId] = useState<PlantId>(defaultPlantId);
  const [messages, setMessages] = useState<ChatMessage[]>([createAssistantGreeting()]);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPlant = useMemo(() => plantById[selectedPlantId], [selectedPlantId]);

  const selectPlant = useCallback((plantId: PlantId) => {
    const plant = plantById[plantId];
    if (!plant) return;
    setSelectedPlantId(plantId);
    setErrorMessage(null);
    setMessages((prev) => [
      ...prev,
      {
        id: randomId(),
        role: "assistant",
        content: formatSetpointSummary(plant),
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !selectedPlant) return;

      const userMessage: ChatMessage = {
        id: randomId(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      const history = [...messages, userMessage];
      setMessages(history);
      setErrorMessage(null);
      setIsThinking(true);

      try {
        const response = await fetch(assistantEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map(({ role, content }) => ({ role, content })),
            plantId: selectedPlant.id,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to reach grow assistant service");
        }

        const data = await response.json();
        const assistantReply: string =
          typeof data?.reply === "string"
            ? data.reply
            : buildAssistantReply(selectedPlant, content);

        setMessages((prev) => [
          ...prev,
          {
            id: randomId(),
            role: "assistant",
            content: assistantReply,
            timestamp: Date.now(),
          },
        ]);
      } catch (error) {
        const fallback = buildAssistantReply(selectedPlant, content);
        setMessages((prev) => [
          ...prev,
          {
            id: randomId(),
            role: "assistant",
            content: `${fallback}\n\n[Local tip: switching to offline guidance because the AI service isn’t reachable right now.]`,
            timestamp: Date.now(),
          },
        ]);
        setErrorMessage(
          error instanceof Error ? error.message : "Unexpected error contacting assistant"
        );
      } finally {
        setIsThinking(false);
      }
    },
    [messages, selectedPlant]
  );

  return {
    messages,
    plants: plantCards,
    selectedPlant,
    selectedPlantId,
    selectPlant,
    sendMessage,
    isThinking,
    errorMessage,
  };
};
