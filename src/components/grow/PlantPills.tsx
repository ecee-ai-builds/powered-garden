import type { PlantCard, PlantId } from "@/types/plants";
import { cn } from "@/lib/utils";

interface PlantPillsProps {
  plants: PlantCard[];
  activeId: PlantId;
  onSelect: (id: PlantId) => void;
}

export const PlantPills = ({ plants, activeId, onSelect }: PlantPillsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {plants.map((plant) => {
        const isActive = plant.id === activeId;
        return (
          <button
            key={plant.id}
            onClick={() => onSelect(plant.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs tracking-wide transition",
              "border border-primary/20 bg-background/60 hover:bg-primary/10",
              isActive && "bg-primary text-background border-primary cyber-glow"
            )}
          >
            {plant.common_name}
          </button>
        );
      })}
    </div>
  );
};
