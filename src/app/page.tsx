
import FormFlowFields from '@/components/formflow/formflow-fields';
import { WhatsAppTutorial } from '@/components/tutorial';
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from '@/components/ui/text-reveal-card';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-white">
      <WhatsAppTutorial />
      <div className="w-full max-w-4xl">
        <div className="mb-6 text-center flex flex-col items-center">
          <TextRevealCard
            text="Hey, big sale this weekend! Shoes 50% off. Store open 9-9. Use code SAVEBIG."
            revealText="✨ *Weekend Shoe Blowout!* 👟✨\n\nGet an amazing *50% OFF* all shoes!\n\n🗓️ This Weekend Only\n📍 [Your Store Name/Link]\n⏰ Open 9 AM - 9 PM\n\nDon't miss out! Use code: `SAVEBIG` 🛍️"
            className="mx-auto w-full"
          />
        </div>
        <FormFlowFields />
      </div>
    </main>
  );
}
