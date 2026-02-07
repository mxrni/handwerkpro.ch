import { Badge } from "@/components/ui/badge";
import { invoiceStatusMap } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CustomerInvoiceOutput } from "@app/shared";
import type { ColumnDef } from "@tanstack/react-table";

export const invoiceColumns: ColumnDef<CustomerInvoiceOutput>[] = [
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
      const status = row.getValue("status") as CustomerInvoiceOutput["status"];
      const mapped = invoiceStatusMap[status];
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
    accessorKey: "dueDate",
    header: "Fällig",
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as string | null;
      return date ? formatDate(date) : "–";
    },
  },
  {
    accessorKey: "total",
    header: "Betrag",
    cell: ({ row }) => formatCurrency(row.getValue("total")),
  },
  {
    accessorKey: "paidAmount",
    header: "Bezahlt",
    cell: ({ row }) => {
      const amount = row.getValue("paidAmount") as number | null;
      return amount != null ? formatCurrency(amount) : "–";
    },
  },
];
