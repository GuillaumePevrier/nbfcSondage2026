'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Dribbble, Home, ListChecks, BarChart3, Menu } from 'lucide-react'; // Dribbble as Futsal ball icon

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl md:hidden bg-primary hover:bg-primary/90 text-primary-foreground z-50"
            aria-label="Ouvrir le menu de navigation"
          >
            <Dribbble className="h-7 w-7" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[270px] p-0 bg-card text-card-foreground md:hidden">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <Image src="/logo.png" alt="Logo NBFC Futsal Club" width={40} height={40} />
                <span className="font-bold font-headline text-lg text-primary">
                  NBFC Futsal Club
                </span>
              </Link>
            </div>
            <nav className="flex-1 p-6 space-y-4">
              <SheetClose asChild>
                <Link href="/" className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span className="text-base">Accueil</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/survey" className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                  <ListChecks className="h-5 w-5 text-muted-foreground" />
                  <span className="text-base">Participer au Sondage</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/results" className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-base">Voir les Résultats</span>
                </Link>
              </SheetClose>
            </nav>
            <div className="p-6 border-t mt-auto">
              <p className="text-xs text-muted-foreground text-center">
                © {new Date().getFullYear()} NBFC Futsal Club
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Fallback for desktop if needed, or just for triggering from header */}
       <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary" aria-label="Ouvrir le menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          {/* SheetContent is the same as above, defined once is enough if state is managed globally or passed down */}
        </Sheet>
      </div>
    </>
  );
}
