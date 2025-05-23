import { cn } from "@/lib/utils";

interface CharacterCounterProps {
  current: number;
  max: number;
  label?: string;
  className?: string;
}

export function CharacterCounter({ 
  current, 
  max, 
  label = "Characters",
  className 
}: CharacterCounterProps) {
  const percentage = (current / max) * 100;
  
  const getColorClass = () => {
    if (percentage > 90) return 'text-red-500';
    if (percentage > 75) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <div className={cn("flex justify-between text-xs mt-1", className)}>
      <span className={getColorClass()}>
        {current} / {max} {label}
      </span>
      {percentage > 80 && (
        <span className="text-yellow-500">
          {percentage > 90 ? 'Approaching limit!' : 'Getting long'}
        </span>
      )}
    </div>
  );
}
