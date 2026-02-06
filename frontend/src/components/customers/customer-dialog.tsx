import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/use-customers";
import { translateZodError } from "@/lib/zod-errors";
import { CreateCustomerInput, type Customer } from "@app/shared";
import { useForm } from "@tanstack/react-form";
import { Building2, FileText, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { Spinner } from "../ui/spinner";

// Helper to format TanStack Form errors for FieldError component
function formatErrors(
  errors: Array<string | { message: string } | undefined>,
): Array<{ message?: string } | undefined> {
  return errors.map((err) => {
    if (typeof err === "string") return { message: err };
    if (err && typeof err === "object" && "message" in err) return err;
    return undefined;
  });
}

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer;
}

export function CustomerDialog({
  open,
  onOpenChange,
  customer,
}: CustomerDialogProps) {
  const isEdit = !!customer;
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const isPending = createCustomer.isPending || updateCustomer.isPending;

  const defaultValues = {
    type: customer?.type || ("PRIVATE" as const),
    name: customer?.name || "",
    contactName: customer?.contactName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    mobile: customer?.mobile || "",
    street: customer?.street || "",
    postalCode: customer?.postalCode || "",
    city: customer?.city || "",
    country: (customer?.country || "CH") as "CH" | "DE" | "AT" | "LI",
    notes: customer?.notes || "",
    status: (customer?.status || "ACTIVE") as
      | "ACTIVE"
      | "INACTIVE"
      | "ARCHIVED",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        // Validate with Zod before submitting
        const validated = CreateCustomerInput.parse(value);
        if (isEdit && customer) {
          await updateCustomer.mutateAsync({
            id: customer.id,
            data: { ...validated, id: customer.id },
          });
          toast.success("Kunde aktualisiert");
          onOpenChange(false);
        } else {
          await createCustomer.mutateAsync(validated);
          toast.success("Kunde angelegt");
          form.reset();
          onOpenChange(false);
        }
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          // Set field-level errors from Zod validation
          for (const issue of error.issues) {
            const fieldName = issue.path[0] as keyof typeof defaultValues;
            if (fieldName) {
              const message = translateZodError(issue);
              form.setFieldMeta(fieldName, (prev) => ({
                ...prev,
                errors: [{ message }],
                errorMap: { onSubmit: message },
                isTouched: true,
              }));
            }
          }
          return; // Don't show toast for validation errors
        }
        // Only show toast for actual API/network errors
        const message =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        toast.error(message ?? "Kunde konnte nicht erstellt werden");
      }
    },
  });

  // Reset form when customer changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      const newValues = {
        type: customer?.type || ("PRIVATE" as const),
        name: customer?.name || "",
        contactName: customer?.contactName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        mobile: customer?.mobile || "",
        street: customer?.street || "",
        postalCode: customer?.postalCode || "",
        city: customer?.city || "",
        country: (customer?.country || "CH") as "CH" | "DE" | "AT" | "LI",
        notes: customer?.notes || "",
        status: (customer?.status || "ACTIVE") as
          | "ACTIVE"
          | "INACTIVE"
          | "ARCHIVED",
      };
      form.reset(newValues);
    }
  }, [customer, open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl bg-card border-border"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-card-foreground">
            {isEdit ? "Kunde bearbeiten" : "Neuen Kunden anlegen"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit
              ? "Bearbeiten Sie die Kundendaten"
              : "Erfassen Sie einen neuen Kunden"}
          </DialogDescription>
        </DialogHeader>

        <form
          id="customer-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="bg-secondary w-full justify-start">
              <TabsTrigger value="general">Stammdaten</TabsTrigger>
              <TabsTrigger value="address">Adresse</TabsTrigger>
              <TabsTrigger value="notes">Notizen</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-4">
              <FieldGroup>
                {/* Kundentyp */}
                <form.Field
                  name="type"
                  children={(field) => (
                    <Field>
                      <FieldLabel required>Kundentyp</FieldLabel>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={
                            field.state.value === "PRIVATE"
                              ? "default"
                              : "outline"
                          }
                          className={
                            field.state.value === "PRIVATE"
                              ? "bg-primary"
                              : "border-border bg-transparent"
                          }
                          onClick={() => field.handleChange("PRIVATE")}
                          disabled={isPending}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Privatkunde
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.state.value === "BUSINESS"
                              ? "default"
                              : "outline"
                          }
                          className={
                            field.state.value === "BUSINESS"
                              ? "bg-primary"
                              : "border-border bg-transparent"
                          }
                          onClick={() => field.handleChange("BUSINESS")}
                          disabled={isPending}
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          Geschäftskunde
                        </Button>
                      </div>
                    </Field>
                  )}
                />

                {/* Name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field
                    name="name"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name} required>
                            {form.state.values.type === "BUSINESS"
                              ? "Firmenname"
                              : "Name"}
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder={
                              form.state.values.type === "BUSINESS"
                                ? "Firma AG"
                                : "Max Mustermann"
                            }
                            className="bg-secondary border-border"
                            disabled={isPending}
                          />
                          {isInvalid && (
                            <FieldError
                              errors={formatErrors(field.state.meta.errors)}
                            />
                          )}
                        </Field>
                      );
                    }}
                  />

                  <form.Subscribe
                    selector={(state: { values: { type: string } }) =>
                      state.values.type
                    }
                    children={(type: string) =>
                      type === "BUSINESS" && (
                        <form.Field
                          name="contactName"
                          children={(field) => (
                            <Field>
                              <FieldLabel htmlFor={field.name}>
                                Ansprechpartner
                              </FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                placeholder="Hans Muster"
                                className="bg-secondary border-border"
                                disabled={isPending}
                              />
                            </Field>
                          )}
                        />
                      )
                    }
                  />
                </div>

                {/* Kontakt */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <form.Field
                    name="email"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name} required>
                            <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                            E-Mail
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="kunde@beispiel.ch"
                            className="bg-secondary border-border"
                            disabled={isPending}
                          />
                          {isInvalid && (
                            <FieldError
                              errors={formatErrors(field.state.meta.errors)}
                            />
                          )}
                        </Field>
                      );
                    }}
                  />

                  <form.Field
                    name="phone"
                    children={(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                          Telefon
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="+41 44 123 45 67"
                          className="bg-secondary border-border"
                          disabled={isPending}
                        />
                      </Field>
                    )}
                  />
                </div>

                <form.Field
                  name="mobile"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                        Mobil
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="+41 79 123 45 67"
                        className="bg-secondary border-border"
                        disabled={isPending}
                      />
                    </Field>
                  )}
                />

                {/* Status */}
                <form.Field
                  name="status"
                  children={(field) => (
                    <Field>
                      <FieldLabel required>Status</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) =>
                          field.handleChange(
                            val as "ACTIVE" | "INACTIVE" | "ARCHIVED",
                          )
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="ACTIVE">Aktiv</SelectItem>
                          <SelectItem value="INACTIVE">Inaktiv</SelectItem>
                          {isEdit && (
                            <SelectItem value="ARCHIVED">Archiviert</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </FieldGroup>
            </TabsContent>

            <TabsContent value="address" className="mt-4">
              <FieldGroup>
                <form.Field
                  name="street"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        <MapPin className="w-3.5 h-3.5 inline mr-1.5" />
                        Strasse
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Musterstrasse 123"
                        className="bg-secondary border-border"
                        disabled={isPending}
                      />
                    </Field>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <form.Field
                    name="postalCode"
                    children={(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>PLZ</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="8000"
                          className="bg-secondary border-border"
                          disabled={isPending}
                        />
                      </Field>
                    )}
                  />
                  <form.Field
                    name="city"
                    children={(field) => (
                      <Field className="sm:col-span-2">
                        <FieldLabel htmlFor={field.name}>Ort</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Zürich"
                          className="bg-secondary border-border"
                          disabled={isPending}
                        />
                      </Field>
                    )}
                  />
                </div>

                <form.Field
                  name="country"
                  children={(field) => (
                    <Field>
                      <FieldLabel required>Land</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) =>
                          field.handleChange(val as "CH" | "DE" | "AT" | "LI")
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="CH">Schweiz</SelectItem>
                          <SelectItem value="LI">Liechtenstein</SelectItem>
                          <SelectItem value="AT">Österreich</SelectItem>
                          <SelectItem value="DE">Deutschland</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </FieldGroup>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <FieldGroup>
                <form.Field
                  name="notes"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                        Interne Notizen
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Notizen zum Kunden..."
                        className="bg-secondary border-border min-h-37.5"
                        disabled={isPending}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Field orientation="horizontal" className="justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Abbrechen
              </Button>
              <Button type="submit" form="customer-form" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner className="mr-2" />
                    Wird gespeichert...
                  </>
                ) : isEdit ? (
                  "Speichern"
                ) : (
                  "Kunde anlegen"
                )}
              </Button>
            </Field>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
