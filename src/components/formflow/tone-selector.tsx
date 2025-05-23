import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ToneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  const tones = [
    { value: 'professional', label: 'Professional', description: 'Corporate, formal language' },
    { value: 'friendly', label: 'Friendly', description: 'Warm, approachable tone' },
    { value: 'empathetic', label: 'Empathetic', description: 'Understanding, supportive' },
    { value: 'cheeky', label: 'Cheeky', description: 'Playful, humorous' },
    { value: 'sincere', label: 'Sincere', description: 'Genuine, heartfelt' },
    { value: 'urgent', label: 'Urgent', description: 'Time-sensitive, action-oriented' },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tone of Voice</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select tone" />
        </SelectTrigger>
        <SelectContent>
          {tones.map((tone) => (
            <SelectItem key={tone.value} value={tone.value}>
              <div className="flex flex-col">
                <span>{tone.label}</span>
                <span className="text-xs text-muted-foreground">{tone.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
