import { PlantCard } from "@/types/plants";

const PLANT_DATA: PlantCard[] = [
  {
    id: "basil",
    common_name: "Basil",
    latin_name: "Ocimum basilicum",
    localized: { ms: "Selasih", zh: "罗勒" },
    type: "herb",
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
    latin_name: "Mentha sp.",
    localized: { ms: "Pudina", zh: "薄荷" },
    type: "herb",
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
    latin_name: "Brassica rapa var. chinensis",
    localized: { ms: "Sawi Cina", zh: "小白菜" },
    type: "leafy",
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
    latin_name: "Brassica oleracea var. alboglabra",
    localized: { ms: "Sawi Kailan", zh: "芥兰" },
    type: "leafy",
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
    latin_name: "Amaranthus tricolor",
    localized: { ms: "Bayam", zh: "苋菜" },
    type: "leafy",
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
    latin_name: "Lactuca sativa",
    localized: { ms: "Salad Mentega", zh: "奶油生菜" },
    type: "leafy",
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
    latin_name: "Coriandrum sativum",
    localized: { ms: "Daun Ketumbar", zh: "香菜" },
    type: "herb",
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
    latin_name: "Allium schoenoprasum",
    localized: { ms: "Daun Kucai", zh: "韭菜" },
    type: "herb",
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
    latin_name: "Petroselinum crispum",
    localized: { ms: "Daun Parsli", zh: "欧芹" },
    type: "herb",
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
    latin_name: "Capsicum annuum",
    localized: { ms: "Cili Padi Kerdil", zh: "矮生辣椒" },
    type: "fruiting",
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

export const plantCards = PLANT_DATA;

export const plantById = Object.fromEntries(
  PLANT_DATA.map((plant) => [plant.id, plant])
);

export const defaultPlantId = "lettuce-butterhead";

export type PlantId = typeof PLANT_DATA[number]["id"];
