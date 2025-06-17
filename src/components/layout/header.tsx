"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, UserCircle } from "lucide-react";
import FutsalBallIcon from "../icons/futsal-ball-icon";
import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex w-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:hidden" aria-label="Futsal Focus Home">
            <FutsalBallIcon className="w-8 h-8 text-primary" />
        </Link>
        <div className="flex-1">
          {/* Placeholder for breadcrumbs or page title */}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="User Profile">
            <UserCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
