

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppLogo } from "@/components/AppLogo";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import type { NavItem } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Card } from "./ui/card";
import { useEffect, useState } from "react";

type Persona = 'medico' | 'paciente';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarContext = useSidebar();
  const isMobile = sidebarContext.isMobile;
  const [persona, setPersona] = useState<Persona | null>(null);
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPersona = localStorage.getItem('userPersona') as Persona;
      if (storedPersona) {
        setPersona(storedPersona);
      } else {
        router.push('/');
      }
    }
  }, [router]);

  useEffect(() => {
    if (persona) {
      const items = NAV_ITEMS.filter(item => 
        item.persona === 'all' || item.persona === persona
      );
      setFilteredNavItems(items);
    }
  }, [persona]);
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userPersona');
      localStorage.removeItem('doctorProfile');
    }
  };


  const currentTitle = filteredNavItems.find(item => pathname.startsWith(item.href))?.title || APP_NAME;

  if (!persona) {
    // Optional: Render a loading state or nothing while redirecting
    return null; 
  }

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"}>
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <AppLogo showText={isMobile ? true : sidebarContext.open} />
            {/* Mobile trigger is now in the main header */}
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <ScrollArea className="h-full">
            <SidebarMenu className="p-2">
              {filteredNavItems.map((item: NavItem) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')}
                      tooltip={{ children: item.title, className: "bg-primary text-primary-foreground" }}
                      className="justify-start"
                    >
                      <a>
                        <item.icon className="h-5 w-5 text-sidebar-foreground group-data-[active=true]:text-sidebar-primary" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        {/* Footer can be added here if needed */}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
          {isMobile ? (
            <SidebarTrigger className="md:hidden" /> /* Show only on mobile */
          ) : (
            <SidebarTrigger className="hidden md:flex" /> /* Show only on desktop */
          )}
          <div className="flex-1">
            <h1 className="text-xl font-semibold font-headline">
              {currentTitle}
            </h1>
          </div>
          {persona === 'paciente' && (
            <Link href="/profile">
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="child avatar" />
                <AvatarFallback>AN</AvatarFallback>
              </Avatar>
            </Link>
          )}
           <Button variant="ghost" size="icon" className="text-muted-foreground" asChild>
             <Link href="/" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
             </Link>
           </Button>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Card className="p-6 min-h-[calc(100vh-10rem)] shadow-lg">
             {children}
          </Card>
        </main>
      </SidebarInset>
    </>
  );
}
