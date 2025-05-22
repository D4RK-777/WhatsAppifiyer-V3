
import FormFlowFields from '@/components/formflow/formflow-fields';
import { TutorialButton } from '@/components/tutorial';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-white">
      <div className="fixed top-4 right-4 z-50">
        <TutorialButton 
          videoSrc="https://www.loom.com/share/db5ddd009e04452d881764b351294d27?sid=84995da7-917c-4983-98c6-2baaacd7fb3e"
          className="!rounded-full capitalize flex items-center shadow-md bg-white hover:bg-[#25D366] hover:text-white px-4 py-2 text-sm font-medium"
          aria-label="Watch tutorial video"
        >
          Watch Tutorial
        </TutorialButton>
      </div>
      <div className="w-full max-w-4xl">
        <FormFlowFields />
      </div>
    </main>
  );
}
