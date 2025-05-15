import FormFlowFields from '@/components/formflow/formflow-fields';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl">
            WhatsAppify Your Text
          </h1>
          <p className="mt-3 text-xl text-foreground/80 sm:mt-4">
            Enter your text or an idea, select a message type, then get AI-powered WhatsApp formatted variations. Or, pick a template!
          </p>
        </header>
        <FormFlowFields />
      </div>
    </main>
  );
}
