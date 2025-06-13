
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MobileNav } from './mobile-nav'; // Import the mobile navigation
import { AddPlayerDialog } from './add-player-dialog'; // Import the dialog
import CountdownTimer from './countdown-timer';

const TARGET_DATE_STRING = "2025-06-27T23:59:59";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo NBFC Futsal Club" width={60} height={60} className="rounded-sm" />
        </Link>
        
        {/* Desktop Countdown Timer - Centered */}
        <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="text-xs text-muted-foreground font-medium">Fin du sondage dans :</span>
          <CountdownTimer 
            targetDate={TARGET_DATE_STRING} 
            className="text-primary-foreground" 
            textClassName="text-base lg:text-lg tracking-wider"
            iconClassName="h-5 w-5" 
          />
        </div>

        <nav className="hidden md:flex items-center justify-end space-x-1 sm:space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/">Accueil</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/survey">Sondage</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/results">Résultats</Link>
          </Button>
          <AddPlayerDialog /> 
        </nav>

        <div className="md:hidden flex items-center">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
