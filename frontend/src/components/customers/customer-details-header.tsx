import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomer } from "@/hooks/use-customers";
import { customerStatusMap } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Briefcase, Building2, Edit, FileText } from "lucide-react";
import { Suspense } from "react";

export function CustomerDetailsHeaderContent({ id }: { id: string }) {
  const { data: customer } = useCustomer(id);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* left info */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/kunden"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <Avatar className="w-14 h-14 shrink-0">
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              <Building2 className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold truncate">
                {customer.name}
              </h1>
              <Badge
                variant="outline"
                className={
                  customerStatusMap[
                    customer.status as "ACTIVE" | "INACTIVE" | "ARCHIVED"
                  ].className
                }
              >
                {
                  customerStatusMap[
                    customer.status as "ACTIVE" | "INACTIVE" | "ARCHIVED"
                  ].label
                }
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Geschäftskunde seit {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>

        {/* actions */}
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Offerte</span>
          </Button>
          <Button variant="outline" size="sm">
            <Briefcase className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Auftrag</span>
          </Button>
          <Button size="sm">
            <Edit className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Bearbeiten</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CustomerDetailsHeaderFallback() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* left skeleton */}
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

        {/* action skeletons */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
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
