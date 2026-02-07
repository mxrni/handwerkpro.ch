import { Badge } from "@/components/ui/badge";
import { orderStatusMap, priorityMap } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CustomerOrderOutput } from "@app/shared";
import type { ColumnDef } from "@tanstack/react-table";

export const orderColumns: ColumnDef<CustomerOrderOutput>[] = [
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
      const status = row.getValue("status") as CustomerOrderOutput["status"];
      const mapped = orderStatusMap[status];
      return (
        <Badge variant="outline" className={mapped.className}>
          {mapped.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priorität",
    cell: ({ row }) => {
      const priority = row.getValue(
        "priority",
      ) as CustomerOrderOutput["priority"];
      const mapped = priorityMap[priority];
      return (
        <Badge variant="outline" className={mapped.className}>
          {mapped.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Start",
    cell: ({ row }) => {
      const date = row.getValue("startDate") as string | null;
      return date ? formatDate(date) : "–";
    },
  },
  {
    accessorKey: "deadline",
    header: "Frist",
    cell: ({ row }) => {
      const date = row.getValue("deadline") as string | null;
      return date ? formatDate(date) : "–";
    },
  },
  {
    accessorKey: "estimatedCost",
    header: "Geschätzte Kosten",
    cell: ({ row }) => {
      const cost = row.getValue("estimatedCost") as number | null;
      return cost != null ? formatCurrency(cost) : "–";
    },
  },
];
