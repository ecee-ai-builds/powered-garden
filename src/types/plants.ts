export type PlantCabinetFit = "compact" | "medium" | "tall";
export type PlantCategory = "herb" | "leafy" | "fruiting";

export interface PlantSetpoints {
  air_temp_c: { min: number; ideal: [number, number]; max: number };
  rel_humidity_pct: { ideal: [number, number] };
  soil_or_solution_ph: { ideal: [number, number] };
  soil_moisture: { target_pct: [number, number]; hint: string };
}

export interface PlantLocalizedCopy {
  ms: string; // Bahasa Malaysia
  zh: string; // Simplified Chinese
}

export interface PlantCard {
  id: string;
  common_name: string;
  latin_name?: string;
  localized: PlantLocalizedCopy;
  type: PlantCategory;
  cabinet_fit: PlantCabinetFit;
  cycle_days: string;
  setpoints: PlantSetpoints;
  notes: string;
}

export interface AssistantScenario {
  id: string;
  description: string;
  trigger: string;
  response: string;
}
