import { ErrorBoundary } from "@/components/error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomersStats } from "@/hooks/use-customers";
import { AlertTriangle } from "lucide-react";
import { Suspense } from "react";

function CustomerStatsContent() {
  const { data, error } = useCustomersStats();

  // Handle query-level errors gracefully
  if (error) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-destructive/50 bg-destructive/5">
        <AlertTriangle className="h-3 w-3 text-destructive" />
        <span className="text-xs text-destructive">Nicht verfügbar</span>
      </div>
    );
  }

  return (
    <div className="text-sm text-muted-foreground">
      {data.active} {data.active === 1 ? "aktiver Kunde" : "aktive Kunden"}
    </div>
  );
}

export default function CustomerStats() {
  return (
    <ErrorBoundary
      fallback={(_error, _reset) => (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-3 w-3 text-destructive" />
          <span className="text-xs text-destructive">Fehler</span>
        </div>
      )}
    >
      <Suspense fallback={<Skeleton className="h-5 w-28" />}>
        <CustomerStatsContent />
      </Suspense>
    </ErrorBoundary>
  );
}
