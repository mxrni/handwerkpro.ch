import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerSearchParams } from "@/hooks/use-customer-search-params";
import type { CustomerType } from "@app/shared";
import { Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CustomerDialog } from "./customer-dialog";
import CustomerStats from "./customer-stats";

const DEBOUNCE_MS = 300;

export default function CustomerToolbar() {
  const [params, setParams] = useCustomerSearchParams();
  const [searchInput, setSearchInput] = useState(params.search || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const previousSearchRef = useRef(params.search || "");

  // update the debounced search param only when search actually changes
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only update if search value actually changed
      if (searchInput !== previousSearchRef.current) {
        previousSearchRef.current = searchInput;
        setParams({ search: searchInput, page: 1 });
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handler); // cancel previous timeout
  }, [searchInput, setParams]);

  const handleCreateCustomer = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Kunde suchen..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9 bg-secondary border-border"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <CustomerStats />
        <Tabs
          value={params.type ?? "all"}
          onValueChange={(value) =>
            setParams({
              type: value === "all" ? null : (value as CustomerType),
              page: 1,
            })
          }
          className="flex-1 sm:flex-initial"
        >
          <TabsList className="bg-secondary">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="BUSINESS">Geschäft</TabsTrigger>
            <TabsTrigger value="PRIVATE">Privat</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleCreateCustomer}
        >
          <Plus className="w-4 h-4 mr-2" />
          Neuer Kunde
        </Button>
      </div>

      <CustomerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
