"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"}>
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <AppLogo showText={!useSidebar().open && !isMobile ? false : true} />
            {isMobile && <SidebarTrigger />}
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <ScrollArea className="h-full">
            <SidebarMenu className="p-2">
              {NAV_ITEMS.map((item: NavItem) => (
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
          {!isMobile && <SidebarTrigger className="hidden md:flex" />}
          <div className="flex-1">
            <h1 className="text-xl font-semibold font-headline">
              {NAV_ITEMS.find(item => pathname.startsWith(item.href))?.title || APP_NAME}
            </h1>
          </div>
          <Link href="/profile">
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="child avatar" />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
          </Link>
           <Button variant="ghost" size="icon" className="text-muted-foreground" asChild>
             <Link href="/">
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
