
import FormFlowFields from '@/components/formflow/formflow-fields';
import { WhatsAppTutorial } from '@/components/tutorial';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-white">
      <WhatsAppTutorial />
      <div className="w-full max-w-4xl">
        <FormFlowFields />
      </div>
    </main>
  );
}
