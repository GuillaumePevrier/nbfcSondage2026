import { Suspense } from 'react';
import { SurveyForm } from '@/components/survey-form';
import { SiteHeader } from '@/components/site-header';
import Image from 'next/image';

export default function SurveyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
        {/* Removed Image component as global background is used */}
        <div className="relative z-10 w-full max-w-2xl"> {/* Ensure content is above global overlay */}
          <Suspense fallback={<div>Chargement du sondage...</div>}>
            <SurveyForm />
          </Suspense>
        </div>
      </main>
       <footer className="py-6 md:px-8 md:py-0 bg-card border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Votre réponse aide à façonner l'avenir de notre équipe !
          </p>
        </div>
      </footer>
    </>
  );
}
