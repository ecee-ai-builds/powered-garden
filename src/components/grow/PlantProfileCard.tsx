import type { PlantCard } from "@/types/plants";
import { Droplets, FlameKindling, Gauge, Thermometer } from "lucide-react";

interface PlantProfileCardProps {
  plant: PlantCard;
}

export const PlantProfileCard = ({ plant }: PlantProfileCardProps) => {
  const { setpoints, localized } = plant;
  const [tempMin, tempMax] = setpoints.air_temp_c.ideal;
  const [humidityMin, humidityMax] = setpoints.rel_humidity_pct.ideal;
  const [phMin, phMax] = setpoints.soil_or_solution_ph.ideal;
  const [moistureMin, moistureMax] = setpoints.soil_moisture.target_pct;

  return (
    <aside className="cyber-card border border-primary/30 bg-card/80 p-6 text-sm space-y-4">
      <div className="space-y-1">
        <span className="uppercase text-xs tracking-widest text-primary/60">
          {plant.type.toUpperCase()} • {plant.cabinet_fit.toUpperCase()}
        </span>
        <h2 className="text-2xl font-bold text-primary cyber-glow">
          {plant.common_name}
        </h2>
        <p className="text-muted-foreground text-sm">
          {localized.ms} • {localized.zh}
        </p>
        {plant.latin_name && (
          <p className="text-xs text-muted-foreground/70 italic">
            {plant.latin_name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded border border-primary/20 bg-background/40 p-3 space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Thermometer className="h-4 w-4" />
            <span className="font-semibold tracking-wide">Temp</span>
          </div>
          <p>{tempMin}–{tempMax} °C</p>
        </div>
        <div className="rounded border border-primary/20 bg-background/40 p-3 space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Droplets className="h-4 w-4" />
            <span className="font-semibold tracking-wide">Humidity</span>
          </div>
          <p>{humidityMin}–{humidityMax} %</p>
        </div>
        <div className="rounded border border-primary/20 bg-background/40 p-3 space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Gauge className="h-4 w-4" />
            <span className="font-semibold tracking-wide">pH</span>
          </div>
          <p>{phMin}–{phMax}</p>
        </div>
        <div className="rounded border border-primary/20 bg-background/40 p-3 space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <FlameKindling className="h-4 w-4" />
            <span className="font-semibold tracking-wide">Moisture</span>
          </div>
          <p>{moistureMin}–{moistureMax} %</p>
        </div>
      </div>

      <div className="rounded border border-primary/20 bg-background/30 p-4 text-xs space-y-2">
        <p className="uppercase tracking-widest text-primary/70 text-[10px]">
          Care Notes
        </p>
        <p className="text-muted-foreground leading-relaxed">{plant.notes}</p>
        <p className="text-muted-foreground/80 text-[11px]">
          {setpoints.soil_moisture.hint}
        </p>
      </div>
    </aside>
  );
};
