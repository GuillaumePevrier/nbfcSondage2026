'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Home, ListChecks, BarChart3, Menu } from 'lucide-react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sheet for mobile navigation, triggered from the header */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {/* This button is part of the SiteHeader and only visible on mobile */}
          <Button variant="ghost" size="icon" className="text-primary md:hidden" aria-label="Ouvrir le menu">
            <Menu className="h-6 w-6" />
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
    </>
  );
}
