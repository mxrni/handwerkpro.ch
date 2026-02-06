import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { useCustomerSearchParams } from "@/hooks/use-customer-search-params";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type Props = {
  meta: {
    page: number;
    totalPages: number;
  };
};

export default function CustomerPagination({ meta }: Props) {
  const [, setParams] = useCustomerSearchParams();
  const { page, totalPages } = meta;

  const goToPage = (p: number) => {
    const newPage = Math.max(1, Math.min(p, totalPages));
    setParams({ page: newPage });
  };

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div className="flex justify-center">
      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(1)}
          disabled={isFirstPage}
          aria-label="Zur ersten Seite"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(page - 1)}
          disabled={isFirstPage}
          aria-label="Vorherige Seite"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <ButtonGroupText aria-live="polite" className="bg-background">
          Seite {page} von {totalPages}
        </ButtonGroupText>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(page + 1)}
          disabled={isLastPage}
          aria-label="Nächste Seite"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(totalPages)}
          disabled={isLastPage}
          aria-label="Zur letzten Seite"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </ButtonGroup>
    </div>
  );
}
