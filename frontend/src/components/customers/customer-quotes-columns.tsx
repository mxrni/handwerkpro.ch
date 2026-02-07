import { Badge } from "@/components/ui/badge";
import { quoteStatusMap } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CustomerQuoteOutput } from "@app/shared";
import type { ColumnDef } from "@tanstack/react-table";

export const quoteColumns: ColumnDef<CustomerQuoteOutput>[] = [
  {
    accessorKey: "title",
    header: "Bezeichnung",
    cell: ({ row }) => (
      <span className="max-w-50 truncate block">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as CustomerQuoteOutput["status"];
      const mapped = quoteStatusMap[status];
      return (
        <Badge variant="outline" className={mapped.className}>
          {mapped.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "issueDate",
    header: "Datum",
    cell: ({ row }) => formatDate(row.getValue("issueDate")),
  },
  {
    accessorKey: "validUntil",
    header: "Gültig bis",
    cell: ({ row }) => {
      const date = row.getValue("validUntil") as string | null;
      return date ? formatDate(date) : "–";
    },
  },
  {
    accessorKey: "total",
    header: "Betrag",
    cell: ({ row }) => formatCurrency(row.getValue("total")),
  },
];
