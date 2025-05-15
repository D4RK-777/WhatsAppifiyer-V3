
import FormFlowFields from '@/components/formflow/formflow-fields';
import { Compare } from "@/components/ui/compare";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl">
        <div className="mb-6 text-center flex flex-col items-center">
          {/* Replace TextRevealCard with Compare component */}
          <div className="p-4 border rounded-3xl bg-card border-border px-4 mx-auto w-full max-w-xl md:max-w-2xl">
            <Compare
              firstImage="https://placehold.co/600x400.png"
              secondImage="https://placehold.co/600x400.png"
              firstImageProps={{ 'data-ai-hint': 'plain sms message' } as any}
              secondImageProps={{ 'data-ai-hint': 'formatted whatsapp message' } as any}
              firstImageClassName="object-contain" 
              secondImageClassname="object-contain"
              className="h-[200px] w-full md:h-[300px]"
              slideMode="hover"
              autoplay={true}
              autoplayDuration={3000}
            />
          </div>
        </div>
        <FormFlowFields />
      </div>
    </main>
  );
}
