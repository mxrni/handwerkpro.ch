import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { customerStatusMap } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { CustomerListItemOutput } from "@app/shared";
import { Link } from "@tanstack/react-router";
import { Building2, Mail, MapPin, Phone, User } from "lucide-react";
import { CustomerActionsMenu } from "./customer-actions-menu";

interface CustomerCardProps {
  customer: CustomerListItemOutput;
  onEdit?: () => void;
}

export function CustomerCard({ customer, onEdit }: CustomerCardProps) {
  const address =
    `${customer.street ? customer.street + "," : ""} ${customer.postalCode || ""} ${customer.city || ""}`.trim();
  const isBusinessCustomer = customer.type === "BUSINESS";

  return (
    <Link
      to="/kunden/$id"
      params={{ id: customer.id }}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="bg-card border-border hover:border-primary/50 transition-colors">
        <CardContent>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-11 h-11">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {isBusinessCustomer ? (
                    <Building2 className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-card-foreground">
                  {customer.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {customer.contactName}
                </p>
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <CustomerActionsMenu customer={customer} onEdit={onEdit} />
            </div>
          </div>

          <div
            className="space-y-2 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <a
                href={`mailto:${customer.email}`}
                className="text-primary hover:underline truncate"
              >
                {customer.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <a
                href={`tel:${customer.phone}`}
                className="text-primary hover:underline"
              >
                {customer.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(address || "")}`}
                className="text-primary hover:underline"
                target="_blank"
              >
                {address || "—"}
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-lg font-semibold text-card-foreground">
                {customer.stats.orderCount}
              </p>
              <p className="text-xs text-muted-foreground">Aufträge</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-card-foreground">
                {formatCurrency(customer.stats.revenue)}
              </p>
              <p className="text-xs text-muted-foreground">Umsatz</p>
            </div>
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
        </CardContent>
      </Card>
    </Link>
  );
}
