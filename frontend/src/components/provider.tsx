import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ThemeProvider } from "./app-shell/theme-provider";
import ThemedToaster from "./themed-toaster";
import { SidebarProvider } from "./ui/sidebar";

export default function Provider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          {children}
          <ThemedToaster />
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
