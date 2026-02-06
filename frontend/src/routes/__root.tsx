import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { SiteHeader } from "@/components/app-shell/site-header";
import { ErrorPage } from "@/components/error-page";
import Provider from "@/components/provider";
import { SidebarInset } from "@/components/ui/sidebar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRoute,
  type ErrorComponentProps,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <Provider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools position="right" />
      </SidebarInset>
    </Provider>
  </>
);

// Custom Error Component that stays within the layout
function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <Provider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <ErrorPage error={error} reset={reset} />
      </SidebarInset>
    </Provider>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: RootErrorComponent,
});
