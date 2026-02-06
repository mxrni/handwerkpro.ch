# HandwerkPro - AI Development Guide

**Version:** 1.1  
**Last Updated:** 4. Februar 2026

## 🎯 Projekt-Übersicht

HandwerkPro ist eine moderne SaaS-Plattform für Schweizer Handwerksbetriebe, die verstreute Excel-Listen ersetzt und alle zentralen Betriebsprozesse in einem System bündelt.

**Zielgruppe:**
- Kleine bis mittlere Handwerksbetriebe (Bau, Elektro, SHK, etc.)
- Fokus auf einfache Bedienung und Zeitersparnis
- Anwender ohne IT-Vorkenntnisse

**Design-Prinzipien:**
- Modern, klar, wenig Klicks
- Mobile-tauglich (Tablet/Smartphone auf Baustelle)
- Visuelle Übersichten statt Tabellen
- Schneller Einstieg ohne Schulung

**Lokalisierung:**
- Deutsche Sprache (Schweiz: de-CH)
- CHF-Währung
- Schweizer Datumsformate (DD.MM.YYYY)
- Länderfokus: CH, DE, AT, LI

---

## � OPEN TODOs

### Customer Detail Route

**Status:** 📋 Geplant

**Beschreibung:** `/kunden/$id` Route für Kunden-Detailansicht fehlt noch

**Benötigte Dateien:**
- `frontend/src/routes/kunden.$id.tsx`: Detail-Ansicht mit TanStack Router
- Customer-Detail-Komponenten (Header, Stats, History, Documents)

**Implementierungs-Schritte:**
- [ ] Customer Detail Route erstellen (`kunden.$id.tsx`)
- [ ] `useCustomer(id)` Hook für Single-Customer-Abfrage implementieren
- [ ] Customer-Detail-Komponenten implementieren
- [ ] Navigation von Customer-Card zur Detail-Seite
- [ ] Breadcrumb-Navigation hinzufügen

---

## 💡 Wichtige Code-Patterns

### Enum/Status Pattern (KRITISCH!)

Das Projekt verwendet **const arrays** mit Zod statt TypeScript Enums:

```typescript
// ✅ RICHTIG - String Literals verwenden
import { CustomerType } from '@app/shared';
if (customer.type === "BUSINESS") { ... }

// ❌ FALSCH - TypeScript Enums gibt es nicht
if (customer.type === CustomerType.BUSINESS) { ... }
```

### Type Exports Pattern

Alle Zod-Schemas exportieren auch ihre TypeScript-Types:

```typescript
// shared/src/customers.ts
export const CustomerOutput = z.object({
  id: z.string(),
  name: z.string(),
  // ...
});

// ✅ Type wird exportiert
export type CustomerOutput = z.infer<typeof CustomerOutput>;
```

### Error Handling Pattern (WICHTIG!)

Das Projekt verwendet ein mehrstufiges Error-Handling-System:

#### 1. Component-Level Error Boundaries

Wrap einzelne Komponenten, um isolierte Fehlerbehandlung zu ermöglichen:

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

// Standard Error Boundary
<ErrorBoundary>
  <CustomerStats />
</ErrorBoundary>

// Mit custom fallback
<ErrorBoundary fallback={(error, reset) => (
  <div className="text-sm text-destructive">
    Fehler: {error.message}
  </div>
)}>
  <CustomerCard customer={customer} />
</ErrorBoundary>
```

#### 2. Query-Level Error Handling

Für TanStack Query Errors mit graceful degradation:

```typescript
import { QueryError } from '@/components/error-boundary';
import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const { data, error } = useCustomers();
  const queryClient = useQueryClient();

  if (error) {
    return (
      <QueryError
        error={error}
        title="Daten konnten nicht geladen werden"
        reset={() => queryClient.invalidateQueries({ queryKey: ['customers'] })}
      />
    );
  }

  return <div>{/* normal rendering */}</div>;
}
```

#### 3. Route-Level Error Handling

Fehler auf Route-Ebene bleiben im Layout (Sidebar + Header sichtbar):

```typescript
// In __root.tsx ist errorComponent definiert
export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: RootErrorComponent, // Custom Error Page im Layout
});
```

**Best Practices:**
- ✅ Wrap kritische Bereiche (Stats, Charts, Listen) in ErrorBoundary
- ✅ Verwende `QueryError` für einheitliche Query-Error-Darstellung
- ✅ Provide reset callbacks für Retry ohne Full-Page-Reload
- ✅ Einzelne Komponenten sollen fehlschlagen können ohne die ganze Seite zu blockieren
- ✅ Fehler in Development Mode zeigen Stack Traces

---

## 🏗️ Architektur & Tech Stack

### High-Level Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React 19 + Vite + TanStack (Router/Query/Form)             │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐    │
│  │  Routes  │→ │Components│→ │  Hooks  │→ │API Client│    │
│  │ (Pages)  │  │   (UI)   │  │(Logic)  │  │(fetch)   │    │
│  └──────────┘  └──────────┘  └─────────┘  └────┬─────┘    │
│                                                  │          │
└──────────────────────────────────────────────────┼──────────┘
                                                   │
                                          ┌────────▼─────────┐
                                          │   HTTP REST      │
                                          │  /api/customers  │
                                          │  /api/orders     │
                                          └────────┬─────────┘
                                                   │
┌──────────────────────────────────────────────────┼──────────┐
│                        BACKEND                   │          │
│            Express.js + Prisma ORM               │          │
│                                                  │          │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌────▼─────┐   │
│  │  Routes  │→ │  Service │→ │ Prisma  │→ │PostgreSQL│   │
│  │(Handlers)│  │ (Logic)  │  │ Client  │  │   DB     │   │
│  └──────────┘  └──────────┘  └─────────┘  └──────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                         ▲
                         │
                    ┌────┴─────┐
                    │  SHARED  │
                    │ Zod Types│
                    └──────────┘
```

### Tech Stack Details

#### Backend (`backend/`)
- **Runtime:** Node.js 25.3.0 mit TypeScript 5.9 (siehe `.nvmrc` für NVM)
- **Framework:** Express.js 5.2
- **Database:** PostgreSQL 16 mit Prisma ORM 7.2
- **Validation:** Zod 4.3 (Input/Output-Schemas)
- **Security:** Helmet, CORS, express-rate-limit
- **Logging:** Morgan (combined prod, dev development)
- **Dev Environment:** Docker Compose (Postgres, MailHog, S3Mock)

**Key Dependencies:**
```json
{
  "express": "^5.2.0",
  "prisma": "^7.2.0",
  "@prisma/adapter-pg": "^7.2.0",
  "@prisma/client": "^7.2.0",
  "zod": "^4.3.0",
  "helmet": "^8.0.3",
  "cors": "^2.8.5",
  "express-rate-limit": "^7.5.0",
  "morgan": "^1.10.0"
}
```

#### Frontend (`frontend/`)
- **Runtime:** React 19.0.0 mit TypeScript 5.9
- **Build Tool:** Vite 7.2
- **Routing:** TanStack Router 1.151 (file-based)
- **State Management:** TanStack Query 5.90
- **Forms:** TanStack Form mit Zod-Validation
- **Styling:** Tailwind CSS 4.1
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React
- **Theme:** next-themes (dark/light mode)
- **Notifications:** Sonner (Toast)

**Key Dependencies:**
```json
{
  "react": "^19.0.0",
  "@tanstack/react-router": "^1.151.0",
  "@tanstack/react-query": "^5.90.0",
  "@tanstack/react-form": "^0.45.5",
  "tailwindcss": "^4.1.0",
  "@radix-ui/*": "latest",
  "lucide-react": "^0.468.0",
  "zod": "^4.3.0"
}
```

#### Shared (`shared/`)
- **Purpose:** Type-safe shared contracts
- **Validation:** Zod-Schemas
- **Export:** ESM compiled TypeScript
- **Consumed by:** Frontend + Backend

---

## 📁 Ordnerstruktur & Verantwortlichkeiten

### Backend Structure

```
backend/
├── src/
│   ├── server.ts                 # Express app setup, middleware, error handler
│   ├── db/
│   │   ├── prisma.ts            # Prisma client singleton (PrismaPg adapter)
│   │   └── seed.ts              # Database seeding (Faker.js data)
│   ├── middlewares/
│   │   ├── errorHandler.ts      # Centralized error handling
│   │   └── handleRequest.ts     # Request/response validation wrapper
│   ├── modules/                 # FEATURE-BASED ORGANIZATION
│   │   └── customers/
│   │       ├── customers.routes.ts   # Express router + endpoints
│   │       └── customers.service.ts  # Business logic (DB queries)
│   └── utils/
│       ├── env.ts               # Environment validation (Zod)
│       └── errors.ts            # Custom error classes (NotFoundError, etc.)
└── prisma/
    └── schema.prisma            # Database schema (467 lines)
```

**Separation of Concerns:**
```
Route Handler → Service → Prisma → Database
(Validation)    (Logic)   (Query)   (Storage)
```

### Frontend Structure

```
frontend/
├── src/
│   ├── main.tsx                # App entry + TanStack Router setup
│   ├── routes/                 # FILE-BASED ROUTING (TanStack Router)
│   │   ├── __root.tsx          # Root layout (AppSidebar + Providers)
│   │   ├── index.tsx           # Home/Dashboard page
│   │   └── kunden.tsx          # Customer list page
│   ├── components/
│   │   ├── app-shell/          # Layout components (Sidebar, Header, Nav)
│   │   ├── customers/          # Customer feature components
│   │   │   ├── customer-card.tsx
│   │   │   ├── customer-list.tsx
│   │   │   ├── customer-dialog.tsx
│   │   │   └── customer-toolbar.tsx
│   │   ├── ui/                 # REUSABLE UI COMPONENTS (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (~60 components)
│   │   ├── provider.tsx        # Global providers wrapper
│   │   └── main-content.tsx    # Page wrapper component
│   ├── hooks/                  # CUSTOM HOOKS (Business Logic)
│   │   ├── use-customers.ts    # TanStack Query hooks
│   │   └── use-mobile.ts       # Responsive breakpoint
│   ├── api/                    # API CLIENT LAYER
│   │   └── customers.ts        # ⚠️ TO BE IMPLEMENTED
│   └── lib/
│       ├── utils.ts            # Utilities (cn, formatDate, formatCurrency)
│       └── constants.ts        # ⚠️ TO BE IMPLEMENTED (status maps, etc.)
└── vite.config.ts
```

**Separation of Concerns:**
```
Route (Page) → Container Component → Presentational Component
     ↓              ↓                        ↓
   Hooks    →   API Client        →   UI Components
 (Logic)        (Data Fetch)           (Pure UI)
```

### Shared Structure

```
shared/
├── src/
│   ├── index.ts         # Re-exports all types & schemas
│   ├── customers.ts     # Customer Zod schemas + types
│   └── enums.ts         # All enum definitions
└── package.json
```

---

## 🎯 Sprachkonventionen (KRITISCH!)

### Regel: UI Deutsch, Code Englisch

#### ✅ DO: Deutsch für User-Facing Content
- Alle Labels, Buttons, Überschriften
- Fehlermeldungen und Validierungstexte
- Navigationselemente
- Formular-Beschriftungen
- Toast-Notifications

```typescript
// ✅ RICHTIG
<Button>Kunde hinzufügen</Button>
<DialogTitle>Neuen Kunden erstellen</DialogTitle>
<Label>E-Mail-Adresse</Label>
toast.success('Kunde erfolgreich erstellt');
```

#### ✅ DO: Englisch für technischen Code
- Variablennamen, Funktionsnamen, Klassennamen
- Code-Kommentare
- Routes (`/customers`, NICHT `/kunden` für API)
- API-Endpoints (`/api/customers`, `/api/orders`)
- Datenbank-Feldnamen
- Git-Commits, technische Dokumentation

```typescript
// ✅ RICHTIG
const customerList = customers.map(customer => (
  <CustomerCard key={customer.id} customer={customer} />
));

// API Route
app.get('/api/customers', handleRequest(...));

// Service Method
async listCustomers(params: ListCustomersInput) { }
```

#### ❌ DON'T: Mischen von Deutsch/Englisch in Code

```typescript
// ❌ FALSCH
const kundenListe = customers.map(kunde => (
  <div>{kunde.name}</div>
));

// ❌ FALSCH - API Route auf Deutsch
app.get('/api/kunden', ...);

// ❌ FALSCH - Englischer UI-Text
<Button>Add Customer</Button>
```

#### ⚠️ AUSNAHME: Frontend Routes

Frontend-Routes für Benutzer-Navigation **können** deutsch sein:
```typescript
// ✅ ERLAUBT für User-Facing Routes
routes/
  kunden.tsx     // Frontend route: /kunden
  auftraege.tsx  // Frontend route: /auftraege

// API-Endpoints bleiben IMMER englisch
/api/customers
/api/orders
```

---

## 🔧 Code Patterns & Best Practices

### Backend Patterns

#### 1. Module Organization (Feature-Based)

```
modules/
  customers/
    customers.routes.ts   # Express router
    customers.service.ts  # Business logic
  orders/
    orders.routes.ts
    orders.service.ts
  members/
    members.routes.ts
    members.service.ts
```

**Jedes Feature-Modul enthält:**
- `*.routes.ts` - Express Router mit Endpoint-Definitionen
- `*.service.ts` - Business Logic Klasse mit DB-Queries

---

#### 2. Route Handler Pattern mit `handleRequest`

**Problem:** Repetitive Validation + Error-Handling in jedem Endpoint

**Lösung:** `handleRequest` Middleware

```typescript
// backend/src/middlewares/handleRequest.ts
export function handleRequest<TInput, TOutput>(
  inputSchema: z.ZodSchema<TInput>,
  outputSchema: z.ZodSchema<TOutput>,
  handler: (input: TInput, req: Request) => Promise<TOutput>
): RequestHandler {
  return async (req, res, next) => {
    try {
      // 1. Validate Input (body + query + params)
      const input = inputSchema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });

      // 2. Execute Handler mit validated input
      const output = await handler(input, req);

      // 3. Validate Output
      const validatedOutput = outputSchema.parse(output);

      // 4. Send Response
      res.json(validatedOutput);
    } catch (error) {
      next(error); // Error handler middleware fängt ab
    }
  };
}
```

**Verwendung:**

```typescript
// backend/src/modules/customers/customers.routes.ts
import { handleRequest } from '../../middlewares/handleRequest';
import { 
  ListCustomersInput, 
  ListCustomersOutput,
  CreateCustomerInput,
  CustomerOutput 
} from '@app/shared';
import { CustomerService } from './customers.service';

const router = Router();
const customerService = new CustomerService();

// GET /api/customers
router.get(
  '/',
  handleRequest(
    ListCustomersInput,
    ListCustomersOutput,
    async (input) => {
      return await customerService.listAll(input);
    }
  )
);

// POST /api/customers
router.post(
  '/',
  handleRequest(
    CreateCustomerInput,
    CustomerOutput,
    async (input) => {
      return await customerService.create(input);
    }
  )
);
```

**Vorteile:**
- ✅ Input automatisch validiert (Zod)
- ✅ Output automatisch validiert
- ✅ Type-Safety durch Generics
- ✅ Einheitliches Error-Handling
- ✅ Kein repetitiver Boilerplate

---

#### 3. Service Class Pattern

**Regel:** Alle Business Logic in Service-Klassen

```typescript
// backend/src/modules/customers/customers.service.ts
import { prisma } from '../../db/prisma';
import { 
  CreateCustomerInput, 
  UpdateCustomerInput,
  ListCustomersInput,
  Customer 
} from '@app/shared';
import { NotFoundError } from '../../utils/errors';

export class CustomerService {
  /**
   * List all customers with pagination and filtering
   */
  async listAll(data: ListCustomersInput) {
    const { page, pageSize, search, type } = data;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(type && { type }),
    };

    // Parallel queries for data + count
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              orders: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: customers.map(customer => ({
        ...customer,
        stats: {
          orderCount: customer._count.orders,
          revenue: 0, // TODO: Calculate from orders
        },
      })),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get single customer by ID
   */
  async getById(id: string): Promise<Customer> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true,
        invoices: true,
      },
    });

    if (!customer) {
      throw new NotFoundError(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  /**
   * Create new customer
   */
  async create(data: CreateCustomerInput): Promise<Customer> {
    return await prisma.customer.create({
      data,
    });
  }

  /**
   * Update existing customer
   */
  async update(id: string, data: UpdateCustomerInput): Promise<Customer> {
    try {
      return await prisma.customer.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(`Customer with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Delete customer
   */
  async delete(id: string): Promise<void> {
    try {
      await prisma.customer.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(`Customer with ID ${id} not found`);
      }
      throw error;
    }
  }
}
```

**Best Practices:**
- ✅ Eine Service-Klasse pro Feature
- ✅ Methoden sind async/await
- ✅ Pagination und Filtering
- ✅ JSDoc-Kommentare für Methodenbeschreibungen
- ✅ Custom Errors mit sprechenden Messages
- ✅ Prisma Error-Handling (P2025 = Not Found)
- ✅ Use `Promise.all()` für parallele Queries

---

#### 4. Custom Error Classes

```typescript
// backend/src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public type: 'validation' | 'error' | 'internal' = 'error'
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'error');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors?: any) {
    super(message, 400, 'validation');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, 'error');
  }
}
```

**Error Handler Middleware:**

```typescript
// backend/src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Zod Validation Errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      type: 'validation',
      message: 'Validation failed',
      errors: error.flatten(),
    });
  }

  // Custom App Errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      type: error.type,
      message: error.message,
      ...(error instanceof ValidationError && { errors: error.errors }),
    });
  }

  // Unexpected Errors
  console.error('Unexpected error:', error);
  return res.status(500).json({
    type: 'internal',
    message: 'Internal server error',
  });
}
```

---

### Frontend Patterns

#### 1. Component Architecture (3-Layer)

```
┌─────────────────────────────────────────┐
│         ROUTE LAYER (Pages)             │
│  - Data fetching coordination           │
│  - URL state management                 │
│  - Page-level layout                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│     CONTAINER COMPONENTS                │
│  - Business logic (hooks)               │
│  - State management                     │
│  - Event handlers                       │
│  - Data transformation                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   PRESENTATIONAL COMPONENTS (UI)        │
│  - Pure rendering (keine Logic)         │
│  - Props-driven                         │
│  - Reusable across features             │
└─────────────────────────────────────────┘
```

**Beispiel:**

```typescript
// ✅ ROUTE LAYER - routes/kunden.tsx
export const Route = createFileRoute('/kunden')({
  component: KundenPage,
  loader: async () => {
    // Pre-fetch data for route
  },
});

function KundenPage() {
  return (
    <MainContent title="Kundenverwaltung">
      <CustomerListContainer />
    </MainContent>
  );
}

// ✅ CONTAINER LAYER - components/customers/customer-list-container.tsx
function CustomerListContainer() {
  // Business logic & state
  const [params, setParams] = useCustomerSearchParams();
  const { data, isLoading } = useCustomers(params);
  
  const handleDelete = async (id: string) => {
    await deleteCustomer.mutateAsync(id);
    toast.success('Kunde gelöscht');
  };

  if (isLoading) return <CustomerListSkeleton />;

  return (
    <CustomerList 
      customers={data.data}
      onDelete={handleDelete}
      onPageChange={(page) => setParams({ page })}
    />
  );
}

// ✅ PRESENTATIONAL LAYER - components/customers/customer-list.tsx
interface CustomerListProps {
  customers: Customer[];
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

function CustomerList({ customers, onDelete, onPageChange }: CustomerListProps) {
  return (
    <div className="grid gap-4">
      {customers.map(customer => (
        <CustomerCard 
          key={customer.id} 
          customer={customer}
          onDelete={() => onDelete(customer.id)}
        />
      ))}
      <Pagination onPageChange={onPageChange} />
    </div>
  );
}
```

**Vorteile:**
- ✅ Separation of Concerns
- ✅ Testbare Components
- ✅ Wiederverwendbare UI-Components
- ✅ Klare Verantwortlichkeiten

---

#### 2. TanStack Query Hooks Pattern

**Regel:** Alle Server-State-Management über Custom Hooks

```typescript
// frontend/src/hooks/use-customers.ts
import { 
  useSuspenseQuery, 
  useMutation, 
  useQueryClient 
} from '@tanstack/react-query';
import { customersApi } from '@/api/customers';
import type { ListCustomersInput } from '@app/shared';

// Query Hook
export function useCustomers(params: ListCustomersInput) {
  return useSuspenseQuery({
    queryKey: ['customers', params],
    queryFn: () => customersApi.list(params),
    staleTime: 30000, // 30 seconds
  });
}

// Single Customer Hook
export function useCustomer(id: string) {
  return useSuspenseQuery({
    queryKey: ['customers', id],
    queryFn: () => customersApi.getById(id),
  });
}

// Create Mutation Hook
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// Update Mutation Hook
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerInput }) =>
      customersApi.update(id, data),
    onSuccess: (data, variables) => {
      // Update cache optimistically
      queryClient.setQueryData(['customers', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// Delete Mutation Hook
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
```

**Best Practices:**
- ✅ `useSuspenseQuery` für automatic loading states
- ✅ QueryKey-Arrays für granulare Cache-Kontrolle
- ✅ `onSuccess` für Cache-Invalidierung
- ✅ Optimistic Updates wo sinnvoll
- ✅ Error-Handling über TanStack Query's error boundaries

---

#### 3. Form Handling mit TanStack Form + Zod

**Pattern:** TanStack Form mit manueller Zod-Validation im `onSubmit` + deutsche Fehlermeldungen via `translateZodError`.

> **Warum nicht `validators` prop?** Wenn Zod-Schemas optional/nullable Felder haben (`z.string().nullable().optional()`), 
> aber defaultValues leere Strings verwendet, gibt es Type-Mismatches mit Standard Schema. Manuelle Validation ist flexibler.

```typescript
// components/customers/customer-dialog.tsx
import { useForm } from '@tanstack/react-form';
import { ZodError } from 'zod';
import { CreateCustomerInput } from '@app/shared';
import { translateZodError } from '@/lib/zod-errors';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';

export function CustomerDialog({ open, onOpenChange }) {
  const createCustomer = useCreateCustomer();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      type: 'PRIVATE' as const,
      status: 'ACTIVE' as const,
    },
    onSubmit: async ({ value }) => {
      try {
        const validated = CreateCustomerInput.parse(value);
        await createCustomer.mutateAsync(validated);
        toast.success('Kunde erstellt');
        onOpenChange(false);
      } catch (error) {
        if (error instanceof ZodError) {
          // ✅ Set field-level errors with German messages
          for (const issue of error.issues) {
            const fieldName = issue.path[0];
            if (fieldName) {
              const message = translateZodError(issue);
              form.setFieldMeta(fieldName, (prev) => ({
                ...prev,
                errors: [{ message }],
                isTouched: true,
              }));
            }
          }
          return; // No toast for validation errors
        }
        toast.error('Fehler beim Speichern');
      }
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.Field
        name="name"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name} required>Name</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={formatErrors(field.state.meta.errors)} />}
            </Field>
          );
        }}
      />
    </form>
  );
}

// Helper für FieldError-Kompatibilität
function formatErrors(errors: Array<string | { message: string } | undefined>) {
  return errors.map((err) => {
    if (typeof err === 'string') return { message: err };
    if (err && typeof err === 'object' && 'message' in err) return err;
    return undefined;
  });
}
```

**Deutsche Zod-Fehlermeldungen (`lib/zod-errors.ts`):**

```typescript
import type { $ZodIssue } from 'zod/v4/core';

export function translateZodError(issue: $ZodIssue): string {
  if (issue.code === 'too_small' && issue.origin === 'string' && issue.minimum === 1) {
    return 'Dieses Feld ist erforderlich';
  }
  if (issue.code === 'invalid_format' && issue.format === 'email') {
    return 'Ungültige E-Mail-Adresse';
  }
  // ... weitere Übersetzungen siehe lib/zod-errors.ts
  return issue.message || 'Ungültige Eingabe';
}
```

**Best Practices:**
- ✅ `FieldLabel required` für Pflichtfelder (zeigt rotes `*`)
- ✅ `data-invalid` auf Field für Error-Styling
- ✅ `aria-invalid` auf Input für Accessibility
- ✅ `translateZodError()` für deutsche Fehlermeldungen
- ✅ `form.setFieldMeta()` um Zod-Fehler als Field-Level-Errors zu setzen
- ✅ Toast nur für API-Fehler, nicht für Validation-Fehler

---

#### 4. Routing & Navigation (TanStack Router)

**File-Based Routing:**

```
routes/
  __root.tsx          → Layout (AppSidebar + Providers)
  index.tsx           → / (Dashboard)
  kunden.tsx          → /kunden
  kunden.$id.tsx      → /kunden/:id
  auftraege.tsx       → /auftraege
  auftraege.$id.tsx   → /auftraege/:id
```

**Route Definition:**

```typescript
// routes/kunden.$id.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/kunden/$id')({
  component: CustomerDetailPage,
  loader: async ({ params }) => {
    // Pre-fetch customer data
    const customer = await queryClient.ensureQueryData({
      queryKey: ['customers', params.id],
      queryFn: () => customersApi.getById(params.id),
    });
    return { customer };
  },
});

function CustomerDetailPage() {
  const { id } = Route.useParams();
  const { customer } = Route.useLoaderData();

  return (
    <MainContent title={customer.name}>
      <CustomerDetails customer={customer} />
    </MainContent>
  );
}
```

**Navigation:**

```typescript
// ✅ DO: Programmatic Navigation
import { useNavigate } from '@tanstack/react-router';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate({ to: '/kunden/$id', params: { id: '123' } });
  };
}

// ✅ DO: Link Component
import { Link } from '@tanstack/react-router';

<Link to="/kunden/$id" params={{ id: customer.id }}>
  {customer.name}
</Link>
```

**⚠️ WICHTIG: Routing-Decoupling**

```typescript
// ❌ DON'T: useRouter/useNavigate in Presentational Components
function CustomerCard({ customer }) {
  const router = useRouter(); // ❌ FALSCH
  
  return (
    <Card onClick={() => router.push(`/kunden/${customer.id}`)}>
      {customer.name}
    </Card>
  );
}

// ✅ DO: Props-driven mit Callbacks
function CustomerCard({ customer, onSelect }) {
  return (
    <Card onClick={() => onSelect(customer.id)}>
      {customer.name}
    </Card>
  );
}

// Container ruft Navigation auf
function CustomerListContainer() {
  const navigate = useNavigate();
  
  return (
    <CustomerCard 
      customer={customer}
      onSelect={(id) => navigate({ to: '/kunden/$id', params: { id } })}
    />
  );
}
```

---

#### 5. shadcn/ui Component Patterns

**Composition Pattern:**

```typescript
// ✅ DO: Compose shadcn components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function CustomerCard({ customer }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{customer.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{customer.email}</p>
      </CardContent>
      <CardFooter>
        <Button>Bearbeiten</Button>
      </CardFooter>
    </Card>
  );
}
```

**Dialog Pattern:**

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function MyDialog({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bestätigung</DialogTitle>
        </DialogHeader>
        <p>Möchten Sie fortfahren?</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={onConfirm}>
            Bestätigen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Dropdown Menu Pattern:**

```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function ActionsMenu({ onEdit, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          Bearbeiten
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          Löschen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 🗄️ Datenbank Schema (Prisma)

### Core Entities Übersicht

```prisma
// backend/prisma/schema.prisma

model Customer {
  id           String         @id @default(cuid())
  name         String
  type         CustomerType   // PRIVATE | BUSINESS
  status       CustomerStatus // ACTIVE | INACTIVE | ARCHIVED
  email        String?
  phone        String?
  mobile       String?
  contactName  String?        // Ansprechperson bei Firmen
  
  // Address
  street       String?
  postalCode   String?
  city         String?
  country      String?        @default("CH")
  
  // Relations
  orders       Order[]
  quotes       Quote[]
  invoices     Invoice[]
  
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model Order {
  id                String         @id @default(cuid())
  orderNumber       String         @unique
  status            OrderStatus    // PLANNED | IN_PROGRESS | REVIEW | COMPLETED | CANCELLED
  priority          OrderPriority  // LOW | NORMAL | HIGH | URGENT
  
  // Relationen
  customer          Customer       @relation(fields: [customerId], references: [id])
  customerId        String
  
  // Details
  title             String
  description       String?
  location          String?        // Arbeitsort
  estimatedCost     Decimal?
  actualCost        Decimal?
  startDate         DateTime?
  endDate           DateTime?
  completedAt       DateTime?
  
  // Relations
  assignments       OrderAssignment[]  // Zugewiesene Mitarbeiter
  documents         Document[]
  timeEntries       TimeEntry[]
  quotes            Quote[]
  invoices          Invoice[]
  calendarEvents    CalendarEvent[]
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}

model Member {
  id                String             @id @default(cuid())
  firstName         String
  lastName          String
  email             String             @unique
  phone             String?
  
  employmentType    EmploymentType     // FULL_TIME | PART_TIME | APPRENTICE | TEMPORARY
  status            MemberStatus       // ACTIVE | ON_VACATION | SICK | INACTIVE
  hourlyRate        Decimal?
  vacationDays      Int                @default(0)
  usedVacationDays  Int                @default(0)
  
  // Relations
  orderAssignments  OrderAssignment[]
  timeEntries       TimeEntry[]
  absences          Absence[]
  
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
}

model Invoice {
  id                String         @id @default(cuid())
  invoiceNumber     String         @unique
  status            InvoiceStatus  // DRAFT | SENT | PAID | PARTIAL | OVERDUE | CANCELLED
  
  // Relations
  customer          Customer       @relation(fields: [customerId], references: [id])
  customerId        String
  order             Order?         @relation(fields: [orderId], references: [id])
  orderId           String?
  quote             Quote?         @relation(fields: [quoteId], references: [id])
  quoteId           String?
  
  // Amounts
  subtotal          Decimal
  taxRate           Decimal        @default(7.7) // Swiss VAT
  taxAmount         Decimal
  total             Decimal
  
  // Dates
  issueDate         DateTime       @default(now())
  dueDate           DateTime
  paidDate          DateTime?
  
  // Items & Payments
  items             InvoiceItem[]
  payments          Payment[]
  
  notes             String?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}

model Quote {
  id                String         @id @default(cuid())
  quoteNumber       String         @unique
  status            QuoteStatus    // DRAFT | SENT | ACCEPTED | REJECTED | EXPIRED
  
  // Relations
  customer          Customer       @relation(fields: [customerId], references: [id])
  customerId        String
  order             Order?         @relation(fields: [orderId], references: [id])
  orderId           String?
  
  // Amounts
  subtotal          Decimal
  taxRate           Decimal        @default(7.7)
  taxAmount         Decimal
  total             Decimal
  
  // Dates
  issueDate         DateTime       @default(now())
  validUntil        DateTime
  acceptedDate      DateTime?
  
  items             QuoteItem[]
  invoices          Invoice[]      // Kann zu Invoice konvertiert werden
  
  notes             String?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}

model TimeEntry {
  id                String         @id @default(cuid())
  
  // Relations
  member            Member         @relation(fields: [memberId], references: [id])
  memberId          String
  order             Order          @relation(fields: [orderId], references: [id])
  orderId           String
  
  // Time tracking
  date              DateTime
  startTime         DateTime
  endTime           DateTime?
  breakMinutes      Int            @default(0)
  totalHours        Decimal?       // Calculated field
  
  status            TimeEntryStatus // PENDING | APPROVED | REJECTED
  description       String?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}

model Absence {
  id                String         @id @default(cuid())
  
  // Relations
  member            Member         @relation(fields: [memberId], references: [id])
  memberId          String
  
  type              AbsenceType    // VACATION | SICK | UNPAID | SPECIAL | TRAINING | OTHER
  status            AbsenceStatus  // PENDING | APPROVED | REJECTED
  
  startDate         DateTime
  endDate           DateTime
  days              Int            // Anzahl Tage
  reason            String?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}

model Document {
  id                String         @id @default(cuid())
  
  // Relations
  order             Order          @relation(fields: [orderId], references: [id])
  orderId           String
  
  type              DocumentType   // PLAN | PHOTO | PDF | CONTRACT | OTHER
  name              String
  fileUrl           String         // S3/Cloud Storage URL
  fileSize          Int            // Bytes
  mimeType          String
  
  uploadedAt        DateTime       @default(now())
}

model CalendarEvent {
  id                String         @id @default(cuid())
  
  type              EventType      // ORDER | APPOINTMENT | MEETING | HOLIDAY | REMINDER | OTHER
  title             String
  description       String?
  
  startDate         DateTime
  endDate           DateTime
  allDay            Boolean        @default(false)
  
  // Optional order linkage
  order             Order?         @relation(fields: [orderId], references: [id])
  orderId           String?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}
```

### Enums

```prisma
enum CustomerType {
  PRIVATE
  BUSINESS
}

enum CustomerStatus {
  ACTIVE
  INACTIVE
  ARCHIVED
}

enum OrderStatus {
  PLANNED
  IN_PROGRESS
  REVIEW
  COMPLETED
  CANCELLED
}

enum OrderPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum EmploymentType {
  FULL_TIME
  PART_TIME
  APPRENTICE
  TEMPORARY
}

enum MemberStatus {
  ACTIVE
  ON_VACATION
  SICK
  INACTIVE
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  PARTIAL
  OVERDUE
  CANCELLED
}

enum QuoteStatus {
  DRAFT
  SENT
  ACCEPTED
  REJECTED
  EXPIRED
}

enum TimeEntryStatus {
  PENDING
  APPROVED
  REJECTED
}

enum AbsenceType {
  VACATION
  SICK
  UNPAID
  SPECIAL
  TRAINING
  OTHER
}

enum AbsenceStatus {
  PENDING
  APPROVED
  REJECTED
}

enum DocumentType {
  PLAN
  PHOTO
  PDF
  CONTRACT
  OTHER
}

enum EventType {
  ORDER
  APPOINTMENT
  MEETING
  HOLIDAY
  REMINDER
  OTHER
}
```

### Prisma Best Practices

#### 1. Relations mit `include`

```typescript
// ✅ DO: Include related data
const customer = await prisma.customer.findUnique({
  where: { id },
  include: {
    orders: {
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
    invoices: {
      where: { status: 'OVERDUE' },
    },
  },
});
```

#### 2. Pagination Pattern

```typescript
// ✅ DO: Standard pagination
const { page, pageSize } = params;
const skip = (page - 1) * pageSize;

const [data, total] = await Promise.all([
  prisma.customer.findMany({
    skip,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  }),
  prisma.customer.count(),
]);

return {
  data,
  meta: {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  },
};
```

#### 3. Filtering mit Where Clause

```typescript
// ✅ DO: Dynamic where clause
const where = {
  ...(search && {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ],
  }),
  ...(status && { status }),
  ...(type && { type }),
};

const customers = await prisma.customer.findMany({ where });
```

#### 4. Transactions

```typescript
// ✅ DO: Use transactions for multi-step operations
const invoice = await prisma.$transaction(async (tx) => {
  const invoice = await tx.invoice.create({
    data: invoiceData,
  });

  await tx.invoiceItem.createMany({
    data: items.map(item => ({ ...item, invoiceId: invoice.id })),
  });

  await tx.order.update({
    where: { id: orderId },
    data: { status: 'COMPLETED' },
  });

  return invoice;
});
```

---

## 🧪 Testing

### Setup

- **Test Runner:** Vitest 4.x in allen drei Packages
- **Config:** `vitest.config.ts` je Package (Frontend mit `@` alias)
- **Dateikonvention:** `*.spec.ts` (von tsconfig excluded)
- **Ausführung:** `pnpm test` (einmalig) / `pnpm test:watch` (watch-mode)

```bash
# Alle Tests ausführen
cd shared && pnpm test && cd ../backend && pnpm test && cd ../frontend && pnpm test

# Einzelnes Package
cd shared && pnpm test
cd backend && pnpm test
cd frontend && pnpm test
```

### Test-Übersicht

| Package | Datei | Tests | Was wird getestet |
|---------|-------|-------|-------------------|
| shared | `customers.spec.ts` | 22 | Zod-Schemas: Create/Update/List Validierung, Coercion, Refine |
| backend | `customers.service.spec.ts` | 13 | Service-Logik: Filter, Pagination, Revenue-Aggregation, NotFoundError |
| frontend | `zod-errors.spec.ts` | 18 | `translateZodError()`: Alle Branches (too_small, too_big, invalid_format, etc.) |

### Philosophie

Tests dort wo sie Bugs verhindern, nicht für Formalität:

1. **Shared Schemas** — Sind der Vertrag zwischen FE und BE. Drift hier verursacht stille Bugs.
2. **translateZodError** — Pure Function, viele Branches, User-facing German Strings.
3. **CustomerService.listAll** — Komplexeste Backend-Methode: dynamische Filter, Pagination-Math, Revenue-Aggregation.
4. **Service Error Handling** — NotFoundError-Mapping bei listOne/update/delete.

### Backend: Prisma Mocking Pattern

```typescript
// Prisma und env werden gemockt um DB/env-Abhängigkeit zu vermeiden
vi.mock("../../db/prisma", () => ({
  default: {
    customer: {
      findMany: vi.fn(),
      count: vi.fn(),
      // ...
    },
  },
}));

vi.mock("../../utils/env", () => ({
  env: { DATABASE_URL: "mock", NODE_ENV: "development" },
}));
```

### Backend: Testbarkeit

`server.ts` exportiert `createApp()` Funktion (ohne `.listen()`), damit Tests den Express-App ohne Port-Binding erstellen können (z.B. für Supertest).

### Was bewusst NICHT getestet wird

- **Thin CRUD-Passthroughs** (create/update sind 1:1 Prisma-Calls)
- **React Query Hooks** (Wrapper um fetch, kein eigener Logic)
- **UI-Komponenten** (Setup-Overhead mit QueryClient/Suspense überwiegt Nutzen — erst bei mehr Komplexität oder weiteren Bugs)

---

## 🚀 Development-Workflow

### Setup

```bash
# 1. Clone repository
git clone https://github.com/mxrni/handwerkpro-ch.git
cd handwerkpro-ch

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Start Docker services (Postgres, MailHog, S3Mock)
cd backend
docker compose up -d

# 5. Run Prisma migrations
cd backend
pnpm prisma migrate dev

# 6. Seed database (optional)
pnpm prisma db seed

# 7. Start all dev servers
# Terminal 1: Backend
cd backend && pnpm dev

# Terminal 2: Frontend
cd frontend && pnpm dev

# Terminal 3: Shared (watch mode)
cd shared && pnpm dev
```

### Environment Variables

```bash
# backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/handwerkpro"
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS="http://localhost:5173"

# MailHog (local SMTP testing)
SMTP_HOST=localhost
SMTP_PORT=1025

# S3Mock (local file storage)
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=handwerkpro
S3_ACCESS_KEY=test
S3_SECRET_KEY=test
```

```bash
# frontend/.env
VITE_API_URL=http://localhost:3001
```

### TDD Workflow (Test-Driven Development)

#### 1. Write Test First (RED)

```bash
# 1. Create test file
touch backend/src/modules/orders/__tests__/orders.service.test.ts

# 2. Write failing test
# Test beschreibt gewünschtes Verhalten
```

```typescript
describe('OrderService', () => {
  it('should create order with assignments', async () => {
    const orderData = {
      title: 'Test Order',
      customerId: 'customer-1',
      memberIds: ['member-1', 'member-2'],
    };

    const order = await orderService.create(orderData);

    expect(order.assignments).toHaveLength(2);
  });
});
```

#### 2. Run Test (Should Fail)

```bash
cd backend
pnpm test orders.service.test.ts

# ❌ FAIL - Function not implemented yet
```

#### 3. Implement Minimal Code (GREEN)

```typescript
// backend/src/modules/orders/orders.service.ts
async create(data: CreateOrderInput) {
  const { memberIds, ...orderData } = data;

  return await prisma.order.create({
    data: {
      ...orderData,
      assignments: {
        create: memberIds.map(memberId => ({ memberId })),
      },
    },
    include: { assignments: true },
  });
}
```

#### 4. Run Test Again

```bash
pnpm test orders.service.test.ts

# ✅ PASS - Test passes
```

#### 5. Refactor (REFACTOR)

```typescript
// Cleanup, optimize, remove duplication
async create(data: CreateOrderInput) {
  return await this.createOrderWithAssignments(data);
}

private async createOrderWithAssignments(data: CreateOrderInput) {
  // ... implementation
}
```

#### 6. Run All Tests

```bash
# Ensure refactoring didn't break anything
pnpm test

# Check coverage
pnpm test:coverage
```

### Development-Checkliste

**Vor jedem Feature:**
- [ ] Branch erstellen (`git checkout -b feat/order-management`)
- [ ] Test schreiben (Service + API Test)
- [ ] Shared-Types definieren (Zod-Schemas)

**Während der Implementierung:**
- [ ] Backend Service implementieren
- [ ] Backend Routes definieren
- [ ] Frontend API Client erweitern
- [ ] Frontend Hook erstellen
- [ ] Frontend Component bauen
- [ ] Tests laufen lassen (`pnpm test`)

**Nach der Implementierung:**
- [ ] `pnpm build` in allen Packages (muss kompilieren)
- [ ] `pnpm test` (alle Tests müssen bestehen)
- [ ] Coverage prüfen (>80%)
- [ ] Code-Review (selbst durchlesen)
- [ ] Git Commit (`git commit -m "feat: add order management"`)
- [ ] Push & Pull Request

---

## 📚 Quick Reference

### Häufige Aufgaben

#### 1. Neues Feature-Modul erstellen

```bash
# 1. Backend Service & Routes
mkdir -p backend/src/modules/orders
touch backend/src/modules/orders/orders.service.ts
touch backend/src/modules/orders/orders.routes.ts

# 2. Shared Types
touch shared/src/orders.ts

# 3. Frontend API Client & Hook
touch frontend/src/api/orders.ts
touch frontend/src/hooks/use-orders.ts

# 4. Frontend Components
mkdir -p frontend/src/components/orders
touch frontend/src/components/orders/order-list.tsx
touch frontend/src/components/orders/order-card.tsx

# 5. Frontend Route
touch frontend/src/routes/auftraege.tsx
```

**Template Files:** Siehe [Customer Module](backend/src/modules/customers/) als Referenz

---

#### 2. Prisma Schema ändern

```bash
# 1. Schema editieren
code backend/prisma/schema.prisma

# 2. Migration erstellen
cd backend
pnpm prisma migrate dev --name add_order_fields

# 3. Prisma Client regenerieren
pnpm prisma generate

# 4. Types in Shared Package aktualisieren (falls nötig)
code shared/src/orders.ts
```

---

#### 3. Neue API-Endpoint hinzufügen

```typescript
// 1. Shared Type definieren
// shared/src/orders.ts
export const CreateOrderInput = z.object({
  title: z.string().min(1),
  customerId: z.string(),
  // ...
});

// 2. Service Method
// backend/src/modules/orders/orders.service.ts
async create(data: CreateOrderInput) {
  return await prisma.order.create({ data });
}

// 3. Route Handler
// backend/src/modules/orders/orders.routes.ts
router.post(
  '/',
  handleRequest(CreateOrderInput, OrderOutput, async (input) => {
    return await orderService.create(input);
  })
);

// 4. Frontend API Client
// frontend/src/api/orders.ts
export const ordersApi = {
  create: (data: CreateOrderInput) =>
    apiClient<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// 5. Frontend Hook
// frontend/src/hooks/use-orders.ts
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
```

---

#### 4. Neue shadcn/ui Component hinzufügen

```bash
# CLI verwenden
cd frontend
npx shadcn@latest add [component-name]

# Beispiel: Tabs
npx shadcn@latest add tabs

# Component wird nach frontend/src/components/ui/ hinzugefügt
```

---

#### 5. Neue Frontend-Route erstellen

```bash
# 1. Route-File erstellen
touch frontend/src/routes/auftraege.tsx

# 2. Route definieren
```

```typescript
// frontend/src/routes/auftraege.tsx
import { createFileRoute } from '@tanstack/react-router';
import { OrderList } from '@/components/orders/order-list';

export const Route = createFileRoute('/auftraege')({
  component: AuftraegePage,
});

function AuftraegePage() {
  return (
    <MainContent title="Auftragsverwaltung">
      <OrderList />
    </MainContent>
  );
}
```

```bash
# 3. TanStack Router regeneriert automatisch routeTree.gen.ts
# Falls nicht, manuell:
cd frontend
pnpm exec tsr generate
```

---

#### 6. Error Debugging Workflow

```bash
# 1. Check TypeScript Errors
cd frontend
pnpm exec tsc --noEmit

# 2. Check Backend Compilation
cd backend
pnpm build

# 3. Check Prisma Client
cd backend
pnpm prisma generate
pnpm prisma validate

# 4. Check Shared Package
cd shared
pnpm build

# 5. Restart Dev Servers
# Kill all terminals
cd backend && pnpm dev
cd frontend && pnpm dev
cd shared && pnpm dev
```

---

#### 7. Database Reset & Seed

```bash
cd backend

# Drop database, run all migrations, seed
pnpm prisma migrate reset

# Only seed (without reset)
pnpm prisma db seed
```

---

#### 8. Git Workflow

```bash
# 1. Feature Branch erstellen
git checkout -b feat/order-management

# 2. Änderungen committen
git add .
git commit -m "feat: add order management module"

# 3. Push
git push origin feat/order-management

# 4. Pull Request erstellen (GitHub/GitLab)

# 5. Nach Merge: Branch löschen
git switch main
git pull
git branch -d feat/order-management
```

**Commit Message Conventions:**
- `feat:` - Neues Feature
- `fix:` - Bugfix
- `refactor:` - Code-Refactoring (keine Feature-Änderung)
- `test:` - Tests hinzufügen/ändern
- `docs:` - Dokumentation
- `chore:` - Build, Dependencies, etc.

---

## 📖 Additional Resources

### Documentation Links

- **React 19:** https://react.dev
- **TanStack Router:** https://tanstack.com/router
- **TanStack Query:** https://tanstack.com/query
- **TanStack Form:** https://tanstack.com/form
- **Prisma:** https://www.prisma.io/docs
- **Zod:** https://zod.dev
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com/docs

### Project-Specific Patterns

Für tiefergehende Code-Beispiele siehe:
- Customer Module: [`backend/src/modules/customers/`](backend/src/modules/customers/)
- Customer Components: [`frontend/src/components/customers/`](frontend/src/components/customers/)
- Shared Types: [`shared/src/customers.ts`](shared/src/customers.ts)

---

## 🎯 Kernfunktionen Roadmap

### Status Legend
- ✅ Implementiert
- 🚧 In Arbeit
- 📋 Geplant

### 1. ✅ Kundenverwaltung
- ✅ CRUD Operations (Create, Read, Update, Delete)
- ✅ Pagination & Filtering
- ✅ Status-Management (Active, Inactive, Archived)
- ✅ Typ-Unterscheidung (Privat, Geschäftlich)
- 🚧 Kunden-Detail-Seite mit Historie
- 📋 Dokument-Upload pro Kunde

### 2. 🚧 Auftragsmanagement
- ✅ Datenbank-Schema
- 📋 CRUD Operations
- 📋 Status-Workflow (Geplant → In Arbeit → Überprüfung → Abgeschlossen)
- 📋 Prioritäts-Management
- 📋 Mitarbeiter-Zuweisung
- 📋 Dokument-Upload (Pläne, Fotos)
- 📋 Kosten-Tracking (geschätzt vs. tatsächlich)

### 3. 🚧 Mitarbeiterverwaltung
- ✅ Datenbank-Schema
- 📋 CRUD Operations
- 📋 Beschäftigungstypen (Vollzeit, Teilzeit, Lehrling)
- 📋 Status-Management (Aktiv, Ferien, Krank)
- 📋 Ferien-Verwaltung
- 📋 Stundensatz-Konfiguration

### 4. 📋 Zeiterfassung
- ✅ Datenbank-Schema
- 📋 Zeit-Erfassung pro Auftrag
- 📋 Pausen-Verwaltung
- 📋 Genehmigungsprozess
- 📋 Übersicht geleistete Stunden
- 📋 Export für Lohnabrechnung

### 5. 📋 Abwesenheitsverwaltung
- ✅ Datenbank-Schema
- 📋 Abwesenheits-Anfragen (Ferien, Krankheit, Sonderurlaub)
- 📋 Genehmigungs-Workflow
- 📋 Kalender-Integration
- 📋 Verbleibende Ferientage Tracking

### 6. 📋 Kalender-System
- ✅ Datenbank-Schema
- 📋 Kalender-Ansichten (Tag, Woche, Monat)
- 📋 Ereignis-Typen (Aufträge, Termine, Feiertage)
- 📋 Mitarbeiter-Abwesenheiten im Kalender
- 📋 Drag & Drop für Terminplanung

### 7. 📋 Dashboard
- 📋 Nächste anstehende Aufträge
- 📋 Aktuelle Arbeiten
- 📋 Offene Aufgaben
- 📋 Überfällige Rechnungen
- 📋 Mitarbeiter-Auslastung Übersicht
- 📋 Quick-Actions (Kunde erstellen, Auftrag anlegen)

### 8. 📋 Kapazitätsplanung
- 📋 Mitarbeiter-Verfügbarkeit Übersicht
- 📋 Auslastungs-Heatmap
- 📋 Drag & Drop Mitarbeiter-Zuweisung
- 📋 Konflikt-Warnungen bei Überbuchungen
- 📋 Zeitliche Übersicht (Woche, Monat)

### 9. 🚧 Offerten & Rechnungen
- ✅ Datenbank-Schema
- 📋 Offerten erstellen
- 📋 Offerten → Rechnung konvertieren
- 📋 Rechnung erstellen
- 📋 Status-Tracking (Offen, Bezahlt, Überfällig)
- 📋 PDF-Generierung
- 📋 E-Mail-Versand
- 📋 Zahlungs-Tracking

### 10. 📋 Kennzahlen & Diagramme
- 📋 Umsatz-Übersicht (Monat, Jahr)
- 📋 Offene Aufträge Chart
- 📋 Mitarbeiter-Auslastung Chart
- 📋 Geleistete Stunden pro Mitarbeiter
- 📋 Überfällige Rechnungen Übersicht
- 📋 Export als PDF/Excel

---

## 🔐 Security Best Practices

### Backend Security

1. **Input Validation:** Alle Inputs durch Zod-Schemas validiert
2. **Rate Limiting:** 100 Requests pro 15 Minuten
3. **Helmet.js:** Security Headers gesetzt
4. **CORS:** Nur erlaubte Origins
5. **SQL Injection:** Prisma ORM verhindert automatisch
6. **Error Sanitization:** Keine Stacktraces in Production

### Frontend Security

1. **XSS Prevention:** React escaped automatisch
2. **CSRF:** Tokens für State-Changing Operations (TODO)
3. **Sensitive Data:** Keine Credentials im LocalStorage
4. **HTTPS:** Nur HTTPS in Production

---

## 📝 Notes für AI-Assistenten

### Wichtige Entscheidungen

1. **Keine ORPC:** Code referenziert `orpc` aber Projekt nutzt es nicht → Plain Fetch API verwenden
2. **TanStack Ecosystem:** Alle State/Forms/Routing über TanStack-Libraries
3. **Feature-Based Organization:** Nicht nach Typ (controllers, models) sondern nach Feature (customers, orders)
4. **Prisma PG Adapter:** Nutzt `@prisma/adapter-pg` statt Standard-Client
5. **Swiss Market:** Alle UI-Texte auf Deutsch, CHF-Währung, Schweizer Formate

### Häufige Pitfalls

- ❌ `CustomerListItemOutput` Type ist nicht exportiert → MUSS in Shared Package behoben werden
- ❌ `orpc` existiert nicht → Eigenen API Client bauen
- ❌ `useRouter()` in UI-Components → Nur in Container/Pages verwenden
- ❌ Englische UI-Texte → Immer Deutsch für User-Facing Content
- ❌ Prisma Enums direkt importieren → Über Shared Package

### Development-Philosophie

- **Test-First:** Immer erst Test schreiben, dann implementieren
- **Type-Safety:** Zod-Schemas als Single Source of Truth
- **Separation of Concerns:** Klare Layer-Trennung (UI → Logic → Data)
- **Simple & Clear:** KISS-Prinzip - keine Over-Engineering
- **Swiss Quality:** Solide, zuverlässig, benutzerfreundlich

---

**Ende des Dokuments**
