import { ErrorBoundary, QueryError } from "@/components/error-boundary";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers } from "@/hooks/use-customers";
import type { CustomerListItemOutput } from "@app/shared";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { Suspense, useState } from "react";
import { CustomerCard } from "./customer-card";
import { CustomerDialog } from "./customer-dialog";
import CustomerPagination from "./customer-pagination";

function CustomerListContent() {
  const { data, error } = useCustomers();
  const queryClient = useQueryClient();
  const [editCustomer, setEditCustomer] =
    useState<CustomerListItemOutput | null>(null);

  // Handle query errors gracefully
  if (error) {
    return (
      <QueryError
        error={error}
        title="Kunden konnten nicht geladen werden"
        reset={() =>
          queryClient.invalidateQueries({ queryKey: ["customers", "list"] })
        }
      />
    );
  }

  const customers = data.data;
  const meta = data.meta;

  return (
    <div className="flex flex-col min-h-145">
      <div className="mb-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.length === 0 ? (
          <div className="col-span-full rounded-lg border border-border bg-card/50 py-16 text-center">
            <p className="text-lg text-muted-foreground">Kein Kunde gefunden</p>
          </div>
        ) : (
          customers.map((customer: CustomerListItemOutput) => (
            <ErrorBoundary
              key={customer.id}
              fallback={(_error, _reset) => (
                <Card className="border-destructive/50 bg-card">
                  <CardContent className="flex flex-col items-center justify-center min-h-64 text-center space-y-3">
                    <div className="rounded-full bg-destructive/10 p-3">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-destructive">
                        Fehler beim Laden
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Kunde konnte nicht geladen werden
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            >
              <CustomerCard
                customer={customer}
                onEdit={() => setEditCustomer(customer)}
              />
            </ErrorBoundary>
          ))
        )}
      </div>

      {/* Pagination pinned below the grid */}
      {customers.length > 0 && (
        <div className="mt-4 flex justify-center">
          <CustomerPagination meta={meta} />
        </div>
      )}

      <CustomerDialog
        open={!!editCustomer}
        onOpenChange={(open) => !open && setEditCustomer(null)}
        customer={editCustomer ?? undefined}
      />
    </div>
  );
}

function CustomerListFallback() {
  return (
    <div className="mb-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="bg-muted/50 rounded-xl h-64" />
      ))}
    </div>
  );
}

export function CustomerList() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <QueryError
          error={error}
          title="Kundenliste konnte nicht geladen werden"
          reset={reset}
        />
      )}
    >
      <Suspense fallback={<CustomerListFallback />}>
        <CustomerListContent />
      </Suspense>
    </ErrorBoundary>
  );
}
