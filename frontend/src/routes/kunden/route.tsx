import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/kunden")({
  component: KundenLayout,
});

function KundenLayout() {
  return <Outlet />;
}
