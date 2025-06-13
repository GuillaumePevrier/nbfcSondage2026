
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Home, ListChecks, BarChart3, Menu } from 'lucide-react';
import { AddPlayerDialog } from './add-player-dialog'; 
import CountdownTimer from './countdown-timer';

const TARGET_DATE_STRING = "2025-06-27T23:59:59";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-primary md:hidden" aria-label="Ouvrir le menu">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 bg-card text-card-foreground md:hidden">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <Link href="/" className="flex items-center space-x-3 mb-2" onClick={() => setIsOpen(false)}>
                <Image src="/logo.png" alt="Logo NBFC Futsal Club" width={50} height={50} />
                 <span className="font-bold text-lg font-headline">NBFC Futsal</span>
              </Link>
            </div>
            <nav className="flex-1 p-4 space-y-1.5">
              <SheetClose asChild>
                <Link href="/" className="flex items-center space-x-3 p-2.5 rounded-md hover:bg-muted text-base">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span>Accueil</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/survey" className="flex items-center space-x-3 p-2.5 rounded-md hover:bg-muted text-base">
                  <ListChecks className="h-5 w-5 text-muted-foreground" />
                  <span>Participer au Sondage</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/results" className="flex items-center space-x-3 p-2.5 rounded-md hover:bg-muted text-base">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <span>Voir les Résultats</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                 <AddPlayerDialog 
                    isMobile={true} 
                    triggerButtonClassName="w-full text-base !justify-start space-x-3 p-2.5"
                 />
              </SheetClose>
            </nav>
            <div className="p-4 border-t mt-auto space-y-3">
              <div className="text-center">
                 <span className="text-xs text-muted-foreground font-medium">Fin du sondage :</span>
                <CountdownTimer 
                  targetDate={TARGET_DATE_STRING} 
                  className="text-card-foreground justify-center" 
                  textClassName="text-sm tracking-normal"
                  iconClassName="h-4 w-4"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                © {new Date().getFullYear()} NBFC Futsal Club
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
