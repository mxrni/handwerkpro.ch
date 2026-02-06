import CustomerDetailsData from "@/components/customers/customer-details-data";
import CustomerDetailsHeader from "@/components/customers/customer-details-header";
import CustomerDetailsStats from "@/components/customers/customer-details-stats";
import { MainContent } from "@/components/main-content";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/kunden/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MainContent>
      <div className="flex flex-col gap-4">
        <CustomerDetailsHeader id={Route.id} />
        <CustomerDetailsStats id={Route.id} />
        <CustomerDetailsData id={Route.id} />
      </div>
    </MainContent>
  );
}
