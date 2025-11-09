import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PlantCard = {
  id: string;
  common_name: string;
  localized: { ms: string; zh: string };
  type: string;
  cabinet_fit: string;
  cycle_days: string;
  setpoints: {
    air_temp_c: { min: number; ideal: [number, number]; max: number };
    rel_humidity_pct: { ideal: [number, number] };
    soil_or_solution_ph: { ideal: [number, number] };
    soil_moisture: { target_pct: [number, number]; hint: string };
  };
  notes: string;
};

const PLANTS: PlantCard[] = [
  {
    id: "basil",
    common_name: "Basil",
    localized: { ms: "Selasih", zh: "罗勒" },
    type: "Herb",
    cabinet_fit: "medium",
    cycle_days: "25–60",
    setpoints: {
      air_temp_c: { min: 18, ideal: [26, 32], max: 35 },
      rel_humidity_pct: { ideal: [50, 70] },
      soil_or_solution_ph: { ideal: [5.5, 6.5] },
      soil_moisture: { target_pct: [30, 45], hint: "Allow partial dry between watering" },
    },
    notes: "Heat-loving; prune tips for bushiness.",
  },
  {
    id: "mint",
    common_name: "Mint",
    localized: { ms: "Pudina", zh: "薄荷" },
    type: "Herb",
    cabinet_fit: "compact",
    cycle_days: "30+ (continuous)",
    setpoints: {
      air_temp_c: { min: 15, ideal: [20, 25], max: 32 },
      rel_humidity_pct: { ideal: [55, 75] },
      soil_or_solution_ph: { ideal: [6.0, 7.0] },
      soil_moisture: { target_pct: [40, 60], hint: "Keep consistently moist" },
    },
    notes: "Thrives in partial shade; spreads easily in trays.",
  },
  {
    id: "pak-choy",
    common_name: "Pak-choy",
    localized: { ms: "Sawi Cina", zh: "小白菜" },
    type: "Leafy",
    cabinet_fit: "compact",
    cycle_days: "30–50",
    setpoints: {
      air_temp_c: { min: 20, ideal: [22, 28], max: 33 },
      rel_humidity_pct: { ideal: [55, 70] },
      soil_or_solution_ph: { ideal: [5.8, 6.5] },
      soil_moisture: { target_pct: [45, 60], hint: "Keep moisture steady to avoid bolting" },
    },
    notes: "Very Malaysia-friendly and fast-growing.",
  },
  {
    id: "kailan",
    common_name: "Kailan",
    localized: { ms: "Sawi Kailan", zh: "芥兰" },
    type: "Leafy",
    cabinet_fit: "medium",
    cycle_days: "40–55",
    setpoints: {
      air_temp_c: { min: 20, ideal: [22, 28], max: 33 },
      rel_humidity_pct: { ideal: [55, 70] },
      soil_or_solution_ph: { ideal: [5.8, 6.5] },
      soil_moisture: { target_pct: [45, 60], hint: "Keep evenly moist" },
    },
    notes: "Tolerates Malaysian warmth better than lettuce.",
  },
  {
    id: "bayam",
    common_name: "Bayam (Amaranth)",
    localized: { ms: "Bayam", zh: "苋菜" },
    type: "Leafy",
    cabinet_fit: "compact",
    cycle_days: "25–35",
    setpoints: {
      air_temp_c: { min: 22, ideal: [24, 30], max: 34 },
      rel_humidity_pct: { ideal: [55, 75] },
      soil_or_solution_ph: { ideal: [5.8, 6.5] },
      soil_moisture: { target_pct: [45, 60], hint: "Tolerant and quick to harvest" },
    },
    notes: "Local favourite; forgiving for beginners.",
  },
  {
    id: "lettuce-butterhead",
    common_name: "Lettuce (Butterhead)",
    localized: { ms: "Salad Mentega", zh: "奶油生菜" },
    type: "Leafy",
    cabinet_fit: "compact",
    cycle_days: "35–45",
    setpoints: {
      air_temp_c: { min: 18, ideal: [18, 24], max: 29 },
      rel_humidity_pct: { ideal: [50, 70] },
      soil_or_solution_ph: { ideal: [5.5, 6.5] },
      soil_moisture: { target_pct: [45, 60], hint: "Avoid over-wet roots" },
    },
    notes: "Cooler-loving; watch for tip burn above 28 °C.",
  },
  {
    id: "coriander",
    common_name: "Coriander",
    localized: { ms: "Daun Ketumbar", zh: "香菜" },
    type: "Herb",
    cabinet_fit: "compact",
    cycle_days: "28–55",
    setpoints: {
      air_temp_c: { min: 15, ideal: [18, 24], max: 28 },
      rel_humidity_pct: { ideal: [50, 65] },
      soil_or_solution_ph: { ideal: [6.2, 6.8] },
      soil_moisture: { target_pct: [40, 55], hint: "Keep cool; bolts if too warm" },
    },
    notes: "Great for teaching temperature management.",
  },
  {
    id: "chives",
    common_name: "Chives",
    localized: { ms: "Daun Kucai", zh: "韭菜" },
    type: "Herb",
    cabinet_fit: "compact",
    cycle_days: "30–40",
    setpoints: {
      air_temp_c: { min: 18, ideal: [18, 26], max: 32 },
      rel_humidity_pct: { ideal: [50, 70] },
      soil_or_solution_ph: { ideal: [6.0, 6.5] },
      soil_moisture: { target_pct: [40, 55], hint: "Avoid waterlogging" },
    },
    notes: "Handles indoor light well; harvest by trimming 2 cm above base.",
  },
  {
    id: "parsley",
    common_name: "Parsley",
    localized: { ms: "Daun Parsli", zh: "欧芹" },
    type: "Herb",
    cabinet_fit: "compact",
    cycle_days: "60–75",
    setpoints: {
      air_temp_c: { min: 18, ideal: [18, 24], max: 30 },
      rel_humidity_pct: { ideal: [50, 70] },
      soil_or_solution_ph: { ideal: [6.0, 6.8] },
      soil_moisture: { target_pct: [40, 55], hint: "Moderate moisture" },
    },
    notes: "Slow starter but reliable once established.",
  },
  {
    id: "dwarf-chilli",
    common_name: "Dwarf Chilli",
    localized: { ms: "Cili Padi Kerdil", zh: "矮生辣椒" },
    type: "Fruiting",
    cabinet_fit: "medium",
    cycle_days: "75–100",
    setpoints: {
      air_temp_c: { min: 22, ideal: [24, 30], max: 34 },
      rel_humidity_pct: { ideal: [55, 70] },
      soil_or_solution_ph: { ideal: [5.5, 6.8] },
      soil_moisture: { target_pct: [40, 55], hint: "Needs airflow; avoid soggy media" },
    },
    notes: "Needs strong light; fun stretch goal crop.",
  },
];

const findPlant = (plantId?: string): PlantCard =>
  PLANTS.find((plant) => plant.id === plantId) ?? PLANTS[0];

const describePlant = (plant: PlantCard) => `PLANT: ${plant.common_name} (${plant.localized.ms} / ${plant.localized.zh})
TYPE: ${plant.type}
CABINET FIT: ${plant.cabinet_fit}
CYCLE: ${plant.cycle_days}
AIR TEMP (°C): min ${plant.setpoints.air_temp_c.min}, ideal ${plant.setpoints.air_temp_c.ideal[0]}-${plant.setpoints.air_temp_c.ideal[1]}, max ${plant.setpoints.air_temp_c.max}
HUMIDITY (%): ${plant.setpoints.rel_humidity_pct.ideal[0]}-${plant.setpoints.rel_humidity_pct.ideal[1]}
PH: ${plant.setpoints.soil_or_solution_ph.ideal[0]}-${plant.setpoints.soil_or_solution_ph.ideal[1]}
MOISTURE (%): ${plant.setpoints.soil_moisture.target_pct[0]}-${plant.setpoints.soil_moisture.target_pct[1]} (${plant.setpoints.soil_moisture.hint})
NOTES: ${plant.notes}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sensorData, plantId } = await req.json();
    const activePlant = findPlant(plantId);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = `You are Grow Assistant, a friendly AI coach for beginner home growers in Malaysia. You help them manage a compact smart cabinet (~50×45×45 cm) that can control temperature, humidity, airflow, and moisture.

GUIDELINES:
- Use simple, encouraging language with local context. Emojis like 🌱 are welcome.
- Only recommend plants and parameters from the dataset below. Do NOT invent new crops or ranges.
- Malaysia is hot and humid year-round; keep advice relevant to tropical indoor growing.
- Focus on actionable steps (e.g., "Raise humidity to 65%" rather than theory).
- When sensor data is provided, react to it and suggest adjustments using the plant ranges.
- Mention Malay and Chinese names when it helps recognition.

PLANT DATASET:
${PLANTS.map(describePlant).join("\n\n")}

CURRENT PLANT:
${describePlant(activePlant)}
`;

    if (sensorData) {
      systemPrompt += `\n\nCurrent sensor readings:\n- Temperature: ${sensorData.temperature}°C\n- Humidity: ${sensorData.humidity}%\n- Last updated: ${sensorData.timestamp}\nUse these to give precise adjustments.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
