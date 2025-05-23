import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PurposeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PurposeSelector({ value, onChange }: PurposeSelectorProps) {
  const purposes = [
    { value: 'marketing', label: 'Marketing/Promotion', description: 'Promote products or services' },
    { value: 'transactional', label: 'Transactional', description: 'Order confirmations, receipts' },
    { value: 'alert', label: 'Alert/Notification', description: 'Important updates or alerts' },
    { value: 'support', label: 'Customer Support', description: 'Help and support messages' },
    { value: 'educational', label: 'Educational', description: 'Informational or tutorial content' },
    { value: 'event', label: 'Event/Appointment', description: 'Event invites or reminders' },
    { value: 'authentication', label: 'Authentication', description: 'Verification codes, OTPs' },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Message Purpose</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select purpose" />
        </SelectTrigger>
        <SelectContent>
          {purposes.map((purpose) => (
            <SelectItem key={purpose.value} value={purpose.value}>
              <div className="flex flex-col">
                <span>{purpose.label}</span>
                <span className="text-xs text-muted-foreground">{purpose.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
