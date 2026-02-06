import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDeleteCustomer } from "@/hooks/use-customers";
import type { CustomerListItemOutput } from "@app/shared";
import {
  Archive,
  FileText,
  MoreHorizontal,
  Pencil,
  Receipt,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface CustomerActionsMenuProps {
  customer: CustomerListItemOutput;
  onEdit?: () => void;
}

export function CustomerActionsMenu({
  customer,
  onEdit,
}: CustomerActionsMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const deleteCustomer = useDeleteCustomer();

  // Reset confirmName when dialog closes
  useEffect(() => {
    if (!deleteDialogOpen) {
      setConfirmName("");
    }
  }, [deleteDialogOpen]);

  const handleDelete = () => {
    deleteCustomer.mutate(customer.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setConfirmName("");
      },
    });
  };

  const isConfirmNameValid =
    confirmName.trim().toLowerCase() === customer.name.trim().toLowerCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => e.preventDefault()}
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-auto min-w-48 bg-popover border-border"
        >
          <DropdownMenuItem
            className="whitespace-nowrap"
            onClick={(e) => {
              e.preventDefault();
              onEdit?.();
            }}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Bearbeiten
          </DropdownMenuItem>
          <DropdownMenuItem
            className="whitespace-nowrap"
            onClick={(e) => e.preventDefault()}
          >
            <FileText className="w-4 h-4 mr-2" />
            Auftrag erstellen
          </DropdownMenuItem>
          <DropdownMenuItem
            className="whitespace-nowrap"
            onClick={(e) => e.preventDefault()}
          >
            <Receipt className="w-4 h-4 mr-2" />
            Offerte erstellen
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive whitespace-nowrap"
            onClick={(e) => {
              e.preventDefault();
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Löschen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kunde löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Der Kunde und
              alle zugehörigen Daten werden endgültig gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
            <div className="flex items-start gap-2">
              <Archive className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-amber-600 dark:text-amber-400">
                <strong>Tipp:</strong> Statt zu löschen, können Sie den Kunden
                archivieren. So bleiben alle Daten erhalten und können bei
                Bedarf wiederhergestellt werden.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Geben Sie{" "}
              <span className="font-semibold text-foreground">
                {customer.name}
              </span>{" "}
              ein, um das Löschen zu bestätigen:
            </p>
            <Input
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Kundenname eingeben"
              autoComplete="off"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmName("")}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!isConfirmNameValid || deleteCustomer.isPending}
              onClick={handleDelete}
            >
              {deleteCustomer.isPending ? "Löschen..." : "Endgültig löschen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
