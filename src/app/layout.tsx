import type {Metadata} from 'next';
// Removed Geist and Geist_Mono imports
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Removed geistSans and geistMono font objects

export const metadata: Metadata = {
  title: 'WhatsApp Message Assistant',
  description: 'AI-powered WhatsApp message generation and formatting',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Removed font variables from body className */}
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
