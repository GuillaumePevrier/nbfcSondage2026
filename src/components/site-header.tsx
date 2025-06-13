
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MobileNav } from './mobile-nav'; // Import the mobile navigation
import { AddPlayerDialog } from './add-player-dialog'; // Import the dialog

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo NBFC Futsal Club" width={60} height={60} className="rounded-sm" />
        </Link>
        
        <nav className="hidden md:flex items-center justify-end space-x-1 sm:space-x-2 ml-auto"> {/* Added ml-auto to push nav to the right */}
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
          {/* ml-auto can be added here if MobileNav trigger needs to be on the far right and there's other content */}
          <MobileNav /> 
        </div>
      </div>
    </header>
  );
}
