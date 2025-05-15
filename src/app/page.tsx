import FormFlowFields from '@/components/formflow/formflow-fields';
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "@/components/ui/text-reveal-card";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl">
        <div className="mb-10 text-center flex flex-col items-center">
          <TextRevealCard
            text="Elevate Your Messages"
            revealText="With AI-Powered Formatting"
            className="mx-auto" // Ensures the card itself is centered if its parent is wider
          >
            <TextRevealCardTitle className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl !mb-3">
              WhatsAppify Your Text
            </TextRevealCardTitle>
            <TextRevealCardDescription className="text-xl text-foreground/80 sm:mt-1 !text-[#a9a9a9]">
              Enter your text or an idea, select a message type, then get AI-powered WhatsApp formatted variations. Or, pick a template!
            </TextRevealCardDescription>
          </TextRevealCard>
        </div>
        <FormFlowFields />
      </div>
    </main>
  );
}
