import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { SidebarProvider } from "./ui/sidebar";

export default function Provider({ children }: { children: ReactNode }) {
  return (
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
      </SidebarProvider>
    </ThemeProvider>
  );
}
