"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, LayoutDashboard, Settings, Users, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const navItems = [
  { href: '/survey', label: 'Sondage', icon: ClipboardList },
  { href: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
];

const additionalLinks = [
    { href: '/team-management', label: 'Gestion Équipe', icon: Users, subItems: [
        { href: '/team-management/players', label: 'Joueurs'},
        { href: '/team-management/formations', label: 'Formations'},
    ]},
    { href: '/settings', label: 'Paramètres', icon: Settings },
    { href: '/help', label: 'Aide & Infos', icon: Info },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
              tooltip={{ children: item.label, side: 'right', align: 'center' }}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <item.icon className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}

      <div className="my-4 mx-2 border-t border-sidebar-border group-data-[collapsible=icon]:mx-0"></div>
      
      <Accordion type="multiple" className="w-full group-data-[collapsible=icon]:hidden px-2">
        {additionalLinks.filter(link => link.subItems).map((item) => (
          <AccordionItem value={item.href} key={item.href} className="border-none">
            <AccordionTrigger 
              className="py-2 px-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md hover:no-underline data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center gap-2">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <SidebarMenuSub className="mx-0 border-l-0 px-0 py-0.5">
                {item.subItems?.map(subItem => (
                   <SidebarMenuSubItem key={subItem.href}>
                     <Link href={subItem.href} passHref legacyBehavior>
                       <SidebarMenuSubButton
                         isActive={pathname === subItem.href}
                         size="sm"
                         aria-current={pathname === subItem.href ? "page" : undefined}
                       >
                         <span>{subItem.label}</span>
                       </SidebarMenuSubButton>
                     </Link>
                   </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

       {additionalLinks.filter(link => !link.subItems).map((item) => (
        <SidebarMenuItem key={item.href} className="group-data-[collapsible=icon]:px-0">
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={{ children: item.label, side: 'right', align: 'center' }}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <item.icon className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}

    </SidebarMenu>
  );
}
