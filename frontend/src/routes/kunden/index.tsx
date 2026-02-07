import { CustomerList } from "@/components/customers/customer-list";
import CustomerToolbar from "@/components/customers/customer-toolbar";
import { MainContent } from "@/components/main-content";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

export const Route = createFileRoute("/kunden/")({
  component: KundenIndexPage,
});

function KundenIndexPage() {
  return (
    <MainContent
      title="Kundenverwaltung"
      icon={<Users className="h-5 w-5 text-primary" />}
    >
      <div className="flex flex-col gap-4 pt-6">
        <CustomerToolbar />
        <CustomerList />
      </div>
    </MainContent>
  );
}
