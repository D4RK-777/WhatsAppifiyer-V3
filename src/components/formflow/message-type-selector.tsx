import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MessageTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MessageTypeSelector({ value, onChange }: MessageTypeSelectorProps) {
  const messageTypes = [
    { value: 'standard', label: 'Standard Text', description: 'Text only message (1,024 chars max)' },
    { value: 'image', label: 'Image + Text', description: 'Image with caption (1,024 chars + 3,000 char caption)' },
    { value: 'video', label: 'Video + Text', description: 'Video with caption (1,024 chars + 3,000 char caption)' },
    { value: 'pdf', label: 'PDF Document', description: 'PDF with description (1,024 chars + 100MB file)' },
    { value: 'carousel', label: 'Carousel', description: '2-10 cards with images and text' },
    { value: 'catalog', label: 'Catalog', description: 'Product catalog with multiple items' },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Message Type</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select message type" />
        </SelectTrigger>
        <SelectContent>
          {messageTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex flex-col">
                <span>{type.label}</span>
                <span className="text-xs text-muted-foreground">{type.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
