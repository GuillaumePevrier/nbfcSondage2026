"use client";

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMain,
  SidebarFooter,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'; // Assuming SidebarMain and SidebarFooter are part of your ui/sidebar or custom
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, LayoutDashboard, LogOut, Settings, UserCircle } from 'lucide-react';
import FutsalBallIcon from '@/components/icons/futsal-ball-icon';
import AppHeader from './header'; // Renamed from header.tsx
import SidebarNav from './sidebar-nav';

// These might be custom components if not in shadcn/ui/sidebar
const SidebarMainContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-grow overflow-y-auto">{children}</div>
);

const SidebarFooterContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-t border-sidebar-border">{children}</div>
);


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // DefaultOpen for SidebarProvider could be managed by cookie or prop.
  // For this example, it's true.
  return (
    <SidebarProvider defaultOpen={true} open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Futsal Focus Home">
            <FutsalBallIcon className="w-10 h-10 text-sidebar-primary" />
            <span className="text-2xl font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Futsal Focus
            </span>
          </Link>
        </SidebarHeader>
        <SidebarMainContainer>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </SidebarMainContainer>
        <SidebarFooterContainer>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center">
            <LogOut className="mr-2 h-5 w-5 group-data-[collapsible=icon]:mr-0" />
            <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
          </Button>
        </SidebarFooterContainer>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
