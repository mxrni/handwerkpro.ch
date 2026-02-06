import { CustomerList } from "@/components/customers/customer-list";
import CustomerToolbar from "@/components/customers/customer-toolbar";
import { MainContent } from "@/components/main-content";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/kunden")({
  component: RouteComponent,
});

function RouteComponent() {
  // await prefetchQuery(
  //   orpc.customers.list.queryOptions({
  //     input: {
  //       page: loadedParams.page,
  //       pageSize: loadedParams.pageSize,
  //       search: loadedParams.search,
  //       type: loadedParams.type ?? undefined,
  //     },
  //   }),
  // );

  return (
    <MainContent
      title={"Kundenverwaltung"}
      description="Verwalten Sie Ihre Kundeninformationen effizient an einem Ort."
    >
      <div className="flex flex-col gap-4 mt-4">
        <CustomerToolbar />
        <CustomerList />
      </div>
    </MainContent>
  );
}
