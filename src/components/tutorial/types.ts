export interface TutorialStep {
  target: string; // CSS selector or ref to the target element
  title: string; // Step title
  content: React.ReactNode; // Step content (can include JSX)
  position?: 'top' | 'right' | 'bottom' | 'left' | 'center'; // Default: 'bottom'
  offset?: number | { x: number, y: number }; // Pixel offset from target (default: 10)
  disableBeacon?: boolean; // For the initial step
  icon?: React.ElementType; // Optional icon to display
}

export interface TutorialProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  storageKey?: string; // Optional storage key for persisting tutorial state
  initialStep?: number; // Optional starting step index
}
