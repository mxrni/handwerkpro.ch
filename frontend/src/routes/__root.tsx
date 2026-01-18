import { AppSidebar } from "@/components/app-sidebar";
import Provider from "@/components/provider";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <Provider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </SidebarInset>
    </Provider>
  </>
);

export const Route = createRootRoute({ component: RootLayout });
