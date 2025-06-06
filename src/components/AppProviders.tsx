"use client";

import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";

export function AppProviders({ children }: { children: React.ReactNode }) {
  // In a real app, you might add ThemeProvider, QueryClientProvider, etc.
  return (
    <SidebarProvider defaultOpen={true}>
      {children}
    </SidebarProvider>
  );
}
