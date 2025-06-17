"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlayCircle, Users } from 'lucide-react';
import FutsalBallIcon from '@/components/icons/futsal-ball-icon';

export default function LandingPageContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FutsalBallIcon className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline text-primary">Futsal Focus</h1>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center text-center space-y-12 flex-grow mt-16">
        <section className="w-full max-w-3xl aspect-video bg-muted/50 rounded-xl shadow-2xl overflow-hidden flex items-center justify-center">
          {/* Placeholder for interactive instructional video */}
          <div className="text-center p-8">
            <PlayCircle className="w-24 h-24 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-headline text-primary-foreground bg-primary/90 px-4 py-2 rounded">Vidéo d'Instruction Interactive</h2>
            <p className="text-muted-foreground mt-2">
              Apprenez comment utiliser Futsal Focus en quelques minutes. (Lecteur vidéo à intégrer ici)
            </p>
            <video 
              className="w-full h-full object-cover hidden" // Hidden until a real video src is available
              src="https://placehold.co/1280x720.mp4/EBF2FA/19376D?text=Instructional+Video" // Placeholder video
              controls 
              autoPlay={false} // Set to true if autoplay is desired
              muted // Autoplay often requires muted
              loop
              playsInline
              aria-label="Vidéo d'instruction Futsal Focus"
            >
              Votre navigateur ne supporte pas la balise vidéo.
            </video>
          </div>
        </section>

        <section className="mt-12">
          <Link href="/survey" passHref>
            <Button
              size="lg"
              className="font-headline text-2xl px-12 py-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
              aria-label="Commencer le sondage pour la saison prochaine"
            >
              <Users className="mr-3 h-8 w-8" />
              Commencer le Sondage
            </Button>
          </Link>
        </section>
      </main>

      <footer className="w-full text-center p-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Futsal Focus. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
