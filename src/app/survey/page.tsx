
import { Suspense } from 'react';
import { SurveyForm } from '@/components/survey-form';
import { SiteHeader } from '@/components/site-header';
import { getAllPlayers, type Player } from '@/lib/players'; // Updated import
import CountdownTimer from '@/components/countdown-timer';

const TARGET_DATE_STRING = "2025-06-27T23:59:59";

export default async function SurveyPage() {
  const playersList: Player[] = await getAllPlayers(); // Fetch players

  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
        <div className="relative z-10 w-full max-w-2xl">
          <Suspense fallback={<div className="text-center text-lg text-primary-foreground p-8">Chargement du sondage...</div>}>
            <SurveyForm players={playersList} /> {/* Pass players as prop */}
          </Suspense>
        </div>
      </main>
       <footer className="py-6 md:px-8 md:py-0 bg-card border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Votre réponse aide à façonner l'avenir de notre équipe !
          </p>
          <CountdownTimer 
            targetDate={TARGET_DATE_STRING} 
            className="text-muted-foreground" 
            textClassName="text-sm"
            iconClassName="h-4 w-4"
          />
        </div>
      </footer>
    </>
  );
}
