import React from "react";
import { GradientButtonDemo } from "@/components/ui/gradient-button-demo";

export default function GradientButtonsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gradient Button Components</h1>
      <p className="text-center mb-8">
        A collection of beautiful gradient buttons that can be easily implemented in your application.
      </p>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Button Gallery</h2>
        <GradientButtonDemo />
      </div>
      
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
        <pre className="bg-background p-4 rounded-md overflow-x-auto">
          <code>{`import { GradientButton } from "@/components/ui/gradient-button";

// In your component:
<GradientButton variant="gradient1">Gradient Button</GradientButton>

// Available variants:
// gradient1 through gradient12

// Available sizes:
// "sm" | "default" | "lg"

// Example with size:
<GradientButton variant="gradient8" size="lg">
  Large Infinity Gradient
</GradientButton>`}</code>
        </pre>
      </div>
    </div>
  );
}
