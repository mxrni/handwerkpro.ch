import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomer } from "@/hooks/use-customers";
import { formatCurrency } from "@/lib/utils";
import { Briefcase, FileText, Hammer, TrendingUp } from "lucide-react";
import { Suspense } from "react";

function CustomerDetailsStatsContent({ id }: { id: string }) {
  const { data: customer } = useCustomer(id);

  const stats = [
    {
      key: "revenue",
      label: "Gesamtumsatz",
      value: formatCurrency(customer.stats.revenue),
      icon: TrendingUp,
      iconClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      key: "openInvoices",
      label: "Offene Rechnungen",
      value: formatCurrency(customer.stats.openInvoices),
      icon: FileText,
      iconClass: "text-chart-4",
      bgClass: "bg-chart-4/10",
    },
    {
      key: "ordersTotal",
      label: "Aufträge gesamt",
      value: customer.stats.orderCount,
      icon: Briefcase,
      iconClass: "text-chart-2",
      bgClass: "bg-chart-2/10",
    },
    {
      key: "activeOrders",
      label: "Aktive Aufträge",
      value: customer.stats.activeOrders,
      icon: Hammer,
      iconClass: "text-chart-3",
      bgClass: "bg-chart-3/10",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  {stat.value}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
