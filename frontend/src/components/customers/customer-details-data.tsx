import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomer } from "@/hooks/use-customers";
import { Building2, Mail, MapPin, Phone, Plus } from "lucide-react";
import { Suspense } from "react";

function CustomerDetailsDataContent({ id }: { id: string }) {
  const { data: customer } = useCustomer(id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Contact Info & Activity */}
      <div className="space-y-6">
        {/* Contact Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium text-card-foreground">
              Kontaktdaten
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {customer.type === "BUSINESS" && (
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
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <a
                    href={`tel:${customer.phone}`}
                    className="text-primary hover:underline"
                  >
                    {customer.phone}
                  </a>
                  {customer.mobile && (
                    <p className="text-muted-foreground text-sm">
                      {customer.mobile} (Mobil)
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <a
                    href={`https://maps.google.com/?q=${customer.street || ""}, ${customer.postalCode || ""} ${customer.city || ""}`}
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    <span>{customer.street}</span>
                    <span>
                      {customer.postalCode} {customer.city}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium text-card-foreground">
              Notizen
            </CardTitle>
            <CardDescription>
              {customer.notes || "Keine Notizen"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* right column - tabs with orders, quotes, invoices */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="orders">
              Aufträge
              <Badge variant="secondary" className="ml-2 bg-background">
                3 (tbd)
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="quotes">
              Offerten
              <Badge variant="secondary" className="ml-2 bg-background">
                2 (tbd)
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="invoices">
              Rechnungen
              <Badge variant="secondary" className="ml-2 bg-background">
                1 (tbd)
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-end">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                onClick={() => {
                  // setSelectedOrder(null);
                  // setIsOrderDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Neuer Auftrag
              </Button>
            </div>
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">
                        Nr.
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Beschreibung
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Team
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Betrag
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  {/* <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-border hover:bg-secondary/50 cursor-pointer"
                        onClick={() => {
                          // setSelectedOrder(order);
                          // setIsOrderDialogOpen(true);
                        }}
                      >
                        <TableCell className="font-medium text-card-foreground">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            {order.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-card-foreground">
                              {order.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.date}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-1">
                            {order.team.map((member) => (
                              <Avatar
                                key={member}
                                className="w-6 h-6 border-2 border-card"
                              >
                                <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                                  {member}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-card-foreground">
                          {order.amount}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              orderStatusConfig[
                                order.status as keyof typeof orderStatusConfig
                              ].className
                            }
                          >
                            {
                              orderStatusConfig[
                                order.status as keyof typeof orderStatusConfig
                              ].label
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-popover border-border"
                            >
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // setSelectedOrder(order);
                                  // setIsOrderDialogOpen(true);
                                }}
                              >
                                Bearbeiten
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                              >
                                Rechnung erstellen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody> */}
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-4">
            <div className="flex justify-end">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                onClick={() => {
                  // setSelectedQuote(null);
                  // setIsQuoteDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Neue Offerte
              </Button>
            </div>
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">
                        Nr.
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Beschreibung
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Betrag
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Gültig bis
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground w-25"></TableHead>
                    </TableRow>
                  </TableHeader>
                  {/* <TableBody>
                    {quotes.map((quote) => (
                      <TableRow
                        key={quote.id}
                        className="border-border hover:bg-secondary/50 cursor-pointer"
                        onClick={() => {
                          // setSelectedQuote(quote);
                          // setIsQuoteDialogOpen(true);
                        }}
                      >
                        <TableCell className="font-medium text-card-foreground">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            {quote.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-card-foreground">
                              {quote.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {quote.date}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-card-foreground">
                          {quote.amount}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {quote.validUntil}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              // quoteStatusConfig[
                              //   quote.status as keyof typeof quoteStatusConfig
                              // ].className
                            }
                          >
                            {
                              // quoteStatusConfig[
                              //   quote.status as keyof typeof quoteStatusConfig
                              // ].label
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download className="w-4 h-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Send className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody> */}
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <div className="flex justify-end">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                onClick={() => {
                  // setSelectedInvoice(null);
                  // setIsInvoiceDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Neue Rechnung
              </Button>
            </div>
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">
                        Nr.
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Beschreibung
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Betrag
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Fällig am
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground w-25"></TableHead>
                    </TableRow>
                  </TableHeader>
                  {/* <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className="border-border hover:bg-secondary/50 cursor-pointer"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setIsInvoiceDialogOpen(true);
                        }}
                      >
                        <TableCell className="font-medium text-card-foreground">
                          <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-muted-foreground" />
                            {invoice.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-card-foreground">
                              {invoice.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {invoice.date}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-card-foreground">
                          {invoice.amount}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {invoice.dueDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              invoiceStatusConfig[
                                invoice.status as keyof typeof invoiceStatusConfig
                              ].className
                            }
                          >
                            {
                              invoiceStatusConfig[
                                invoice.status as keyof typeof invoiceStatusConfig
                              ].label
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download className="w-4 h-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Send className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody> */}
                </Table>
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
      <Skeleton className="h-100 lg:col-span-1 rounded-md" />
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
