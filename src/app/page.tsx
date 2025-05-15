
import FormFlowFields from '@/components/formflow/formflow-fields';
import IntroTour from '@/components/tour/IntroTour';
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from '@/components/ui/text-reveal-card';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <IntroTour />
      <div className="w-full max-w-4xl">
        <div className="mb-6 text-center flex flex-col items-center">
          <TextRevealCard
            text="Hey, big sale this weekend! Shoes 50% off. Store open 9-9. Use code SAVEBIG."
            revealText="✨ *Weekend Shoe Blowout!* 👟✨\n\nGet an amazing *50% OFF* all shoes!\n\n🗓️ This Weekend Only\n📍 [Your Store Name/Link]\n⏰ Open 9 AM - 9 PM\n\nDon't miss out! Use code: `SAVEBIG` 🛍️"
            className="mx-auto w-full"
          >
            <TextRevealCardTitle className="text-center text-4xl font-bold text-primary sm:text-5xl">
              WhatsAppify Your Text
            </TextRevealCardTitle>
            <TextRevealCardDescription className="text-center">
              See how plain text transforms into an engaging WhatsApp message!
            </TextRevealCardDescription>
          </TextRevealCard>
        </div>
        <FormFlowFields />
      </div>
    </main>
  );
}
