import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomer } from "@/hooks/use-customers";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { Suspense } from "react";
import { invoiceColumns } from "./customer-invoices-columns";
import { orderColumns } from "./customer-orders-columns";
import { quoteColumns } from "./customer-quotes-columns";

function CustomerDetailsDataContent({ id }: { id: string }) {
  const { data: customer } = useCustomer(id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Contact Info & Notes */}
      <div className="space-y-6">
        {/* Contact Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Kontaktdaten
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {customer.type === "BUSINESS" && customer.contactName && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ansprechpartner
                    </p>
                    <p className="text-foreground">{customer.contactName}</p>
                  </div>
                </div>
              )}

              {customer.email && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-Mail</p>
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-primary hover:underline"
                    >
                      {customer.email}
                    </a>
                  </div>
                </div>
              )}

              {(customer.phone || customer.mobile) && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefon</p>
                    {customer.phone && (
                      <a
                        href={`tel:${customer.phone}`}
                        className="text-primary hover:underline"
                      >
                        {customer.phone}
                      </a>
                    )}
                    {customer.mobile && (
                      <a
                        href={`tel:${customer.mobile}`}
                        className="text-primary hover:underline text-sm block"
                      >
                        {customer.mobile} (Mobil)
                      </a>
                    )}
                  </div>
                </div>
              )}

              {(customer.street || customer.city) && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${customer.street || ""}, ${customer.postalCode || ""} ${customer.city || ""}`)}`}
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      {customer.street && <span>{customer.street}</span>}
                      {(customer.postalCode || customer.city) && (
                        <span className="block">
                          {customer.postalCode} {customer.city}
                        </span>
                      )}
                    </a>
                  </div>
                </div>
              )}

              {!customer.email &&
                !customer.phone &&
                !customer.mobile &&
                !customer.street &&
                !customer.city && (
                  <p className="text-sm text-muted-foreground">
                    Keine Kontaktdaten hinterlegt
                  </p>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Notizen</CardTitle>
            <CardDescription>
              {customer.notes || "Keine Notizen vorhanden"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Right Column - Tabs for orders, quotes, invoices */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="orders">Aufträge</TabsTrigger>
            <TabsTrigger value="quotes">Offerten</TabsTrigger>
            <TabsTrigger value="invoices">Rechnungen</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardContent>
                <DataTable
                  columns={orderColumns}
                  data={customer.orders}
                  emptyMessage="Keine Aufträge vorhanden"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardContent>
                <DataTable
                  columns={quoteColumns}
                  data={customer.quotes}
                  emptyMessage="Keine Offerten vorhanden"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardContent>
                <DataTable
                  columns={invoiceColumns}
                  data={customer.invoices}
                  emptyMessage="Keine Rechnungen vorhanden"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CustomerDetailsDataSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
      </div>
      <div className="lg:col-span-2">
        <Skeleton className="h-96 rounded-md" />
      </div>
    </div>
  );
}

export default function CustomerDetailsData({ id }: { id: string }) {
  return (
    <Suspense fallback={<CustomerDetailsDataSkeleton />}>
      <CustomerDetailsDataContent id={id} />
    </Suspense>
  );
}
