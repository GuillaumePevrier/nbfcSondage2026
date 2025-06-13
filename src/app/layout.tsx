import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppProviders from '@/components/app-providers';

export const metadata: Metadata = {
  title: 'Sondage NBFC Futsal Club',
  description: 'Sondage pour les joueurs du NBFC Futsal Club',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Graduate&family=Oswald:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProviders>
          <div 
            className="bg-cover bg-center bg-fixed min-h-screen"
            style={{ backgroundImage: "url('/images/background-survey.jpg')" }}
            data-ai-hint="futsal game action"
          >
            <div className="bg-black/75 min-h-screen flex flex-col"> {/* Overlay */}
              <div className="flex-1 flex flex-col">
                {children}
              </div>
              <Toaster />
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
