import CustomerDetailsData from "@/components/customers/customer-details-data";
import CustomerDetailsHeader from "@/components/customers/customer-details-header";
import CustomerDetailsStats from "@/components/customers/customer-details-stats";
import { ErrorBoundary } from "@/components/error-boundary";
import { MainContent } from "@/components/main-content";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/kunden/$id")({
  component: CustomerDetailPage,
});

function CustomerDetailPage() {
  const { id } = useParams({ from: "/kunden/$id" });

  return (
    <MainContent>
      <div className="flex flex-col gap-4">
        <ErrorBoundary>
          <CustomerDetailsHeader id={id} />
        </ErrorBoundary>
        <ErrorBoundary>
          <CustomerDetailsStats id={id} />
        </ErrorBoundary>
        <ErrorBoundary>
          <CustomerDetailsData id={id} />
        </ErrorBoundary>
      </div>
    </MainContent>
  );
}
