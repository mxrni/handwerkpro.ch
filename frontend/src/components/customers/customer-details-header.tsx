import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomer } from "@/hooks/use-customers";
import { customerStatusMap } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { CustomerListItemOutput } from "@app/shared";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, User } from "lucide-react";
import { Suspense, useState } from "react";
import { CustomerActionsMenu } from "./customer-actions-menu";
import { CustomerDialog } from "./customer-dialog";

function CustomerDetailsHeaderContent({ id }: { id: string }) {
  const { data: customer } = useCustomer(id);
  const [editCustomer, setEditCustomer] =
    useState<CustomerListItemOutput | null>(null);

  const isBusinessCustomer = customer.type === "BUSINESS";
  const statusConfig =
    customerStatusMap[customer.status as keyof typeof customerStatusMap];

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: back button + avatar + info */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/kunden"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <Avatar className="w-14 h-14 shrink-0">
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {isBusinessCustomer ? (
                <Building2 className="w-6 h-6" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold truncate">
                {customer.name}
              </h1>
              <Badge variant="outline" className={statusConfig.className}>
                {statusConfig.label}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {isBusinessCustomer ? "Geschäftskunde" : "Privatkunde"} seit{" "}
              {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>

        {/* Right: actions menu */}
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <CustomerActionsMenu
            customer={customer}
            onEdit={() => setEditCustomer(customer)}
          />
        </div>
      </div>

      <CustomerDialog
        open={!!editCustomer}
        onOpenChange={(open) => !open && setEditCustomer(null)}
        customer={editCustomer ?? undefined}
      />
    </div>
  );
}

function CustomerDetailsHeaderFallback() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-40 sm:w-56" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}

export default function CustomerDetailsHeader({ id }: { id: string }) {
  return (
    <Suspense fallback={<CustomerDetailsHeaderFallback />}>
      <CustomerDetailsHeaderContent id={id} />
    </Suspense>
  );
}
