import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Briefcase, Clock, Receipt, TrendingUp } from "lucide-react";
import { Suspense } from "react";

export function CustomerDetailsStatsContent({ id: _id }: { id: string }) {
  const revenue = 12345.67;
  const ordersTotal = 12;

  const openInvoices = 3;
  const activeOrders = 2;

  const stats = [
    {
      key: "revenue",
      label: "Gesamtumsatz",
      value: formatCurrency(revenue),
      icon: TrendingUp,
      iconClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      key: "openInvoices",
      label: "Offene Rechnungen",
      value: openInvoices,
      icon: Receipt,
      iconClass: "text-chart-1",
      bgClass: "bg-chart-1/10",
    },
    {
      key: "ordersTotal",
      label: "Aufträge gesamt",
      value: ordersTotal,
      icon: Briefcase,
      iconClass: "text-chart-2",
      bgClass: "bg-chart-2/10",
    },
    {
      key: "activeOrders",
      label: "Aktive Aufträge",
      value: activeOrders,
      icon: Clock,
      iconClass: "text-chart-3",
      bgClass: "bg-chart-3/10",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.key}>
            <CardContent className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgClass}`} aria-hidden>
                <Icon className={`w-5 h-5 ${stat.iconClass}`} />
              </div>

              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {stat.value} (tbd)
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function CustomerDetailsStatsFallback() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, idx) => (
        <Skeleton key={idx} className="h-20 w-full rounded-md" />
      ))}
    </div>
  );
}

export default function CustomerDetailsStats({ id }: { id: string }) {
  return (
    <Suspense fallback={<CustomerDetailsStatsFallback />}>
      <CustomerDetailsStatsContent id={id} />
    </Suspense>
  );
}
