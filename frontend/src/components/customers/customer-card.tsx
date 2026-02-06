import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { customerStatusMap } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { CustomerListItemOutput } from "@app/shared";
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
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      {/* TODO: Add Link to="/kunden/$id" when customer detail route is created */}
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
          <CustomerActionsMenu customer={customer} onEdit={onEdit} />
        </div>

        <div className="space-y-2 text-sm">
          <a
            href={`mailto:${customer.email}`}
            className="flex items-center gap-2 text-muted-foreground hover:underline"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{customer.email}</span>
          </a>
          <a
            href={`tel:${customer.phone}`}
            className="flex items-center gap-2 text-muted-foreground hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{customer.phone}</span>
          </a>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(address || "")}`}
            className="flex items-center gap-2 text-muted-foreground hover:underline"
            target="_blank"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{address || "—"}</span>
          </a>
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
  );
}
