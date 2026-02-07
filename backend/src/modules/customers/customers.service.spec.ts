import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError } from "../../utils/errors";
import { CustomerService } from "./customers.service";

// Mock the prisma module
vi.mock("../../db/prisma", () => {
  return {
    default: {
      customer: {
        findMany: vi.fn(),
        count: vi.fn(),
        findUniqueOrThrow: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

// Mock env to prevent eager validation
vi.mock("../../utils/env", () => ({
  env: {
    DATABASE_URL: "mock",
    NODE_ENV: "development",
  },
}));

// Import prisma after mock is set up
import prisma from "../../db/prisma";

const mockedPrisma = vi.mocked(prisma, true);
const service = new CustomerService();

// Factory for a mock customer from Prisma (with _count and invoices)
function mockPrismaCustomer(overrides: Record<string, unknown> = {}) {
  return {
    id: "cuid_1",
    name: "Muster AG",
    type: "BUSINESS",
    contactName: "Hans Muster",
    email: "hans@muster.ch",
    phone: "+41 44 123 45 67",
    mobile: null,
    street: "Bahnhofstrasse 1",
    postalCode: "8001",
    city: "Zürich",
    country: "CH",
    notes: null,
    status: "ACTIVE",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    _count: { orders: 3 },
    invoices: [
      { status: "PAID", total: 1500 },
      { status: "PAID", total: 2500 },
      { status: "SENT", total: 800 },
      { status: "OVERDUE", total: 200 },
    ],
    orders: [{ id: "order_1" }, { id: "order_2" }],
    ...overrides,
  };
}

// Factory for a mock customer from Prisma with full relation data (for listOne)
function mockPrismaCustomerDetail(overrides: Record<string, unknown> = {}) {
  return {
    id: "cuid_1",
    name: "Muster AG",
    type: "BUSINESS",
    contactName: "Hans Muster",
    email: "hans@muster.ch",
    phone: "+41 44 123 45 67",
    mobile: null,
    street: "Bahnhofstrasse 1",
    postalCode: "8001",
    city: "Zürich",
    country: "CH",
    notes: null,
    status: "ACTIVE",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    _count: { orders: 3 },
    invoices: [
      {
        id: "inv_1",
        invoiceNumber: "RE-001",
        title: "Rechnung Januar",
        status: "PAID",
        issueDate: new Date("2025-01-15"),
        dueDate: new Date("2025-02-15"),
        paidDate: new Date("2025-01-20"),
        total: 1500,
        paidAmount: 1500,
        createdAt: new Date("2025-01-15"),
      },
      {
        id: "inv_2",
        invoiceNumber: "RE-002",
        title: "Rechnung Februar",
        status: "PAID",
        issueDate: new Date("2025-02-15"),
        dueDate: new Date("2025-03-15"),
        paidDate: new Date("2025-02-20"),
        total: 2500,
        paidAmount: 2500,
        createdAt: new Date("2025-02-15"),
      },
      {
        id: "inv_3",
        invoiceNumber: "RE-003",
        title: "Rechnung März",
        status: "SENT",
        issueDate: new Date("2025-03-01"),
        dueDate: new Date("2025-04-01"),
        paidDate: null,
        total: 800,
        paidAmount: null,
        createdAt: new Date("2025-03-01"),
      },
      {
        id: "inv_4",
        invoiceNumber: "RE-004",
        title: "Rechnung April",
        status: "OVERDUE",
        issueDate: new Date("2025-04-01"),
        dueDate: new Date("2025-05-01"),
        paidDate: null,
        total: 200,
        paidAmount: null,
        createdAt: new Date("2025-04-01"),
      },
    ],
    orders: [
      {
        id: "order_1",
        orderNumber: "AU-001",
        title: "Badezimmer Renovation",
        status: "PLANNED",
        priority: "NORMAL",
        startDate: new Date("2025-02-01"),
        endDate: null,
        deadline: new Date("2025-04-01"),
        estimatedCost: 15000,
        actualCost: null,
        createdAt: new Date("2025-01-10"),
      },
      {
        id: "order_2",
        orderNumber: "AU-002",
        title: "Küche Einbau",
        status: "IN_PROGRESS",
        priority: "HIGH",
        startDate: new Date("2025-03-01"),
        endDate: null,
        deadline: new Date("2025-05-01"),
        estimatedCost: 25000,
        actualCost: 12000,
        createdAt: new Date("2025-02-15"),
      },
      {
        id: "order_3",
        orderNumber: "AU-003",
        title: "Dach Reparatur",
        status: "COMPLETED",
        priority: "LOW",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-15"),
        deadline: new Date("2025-02-01"),
        estimatedCost: 5000,
        actualCost: 4800,
        createdAt: new Date("2024-12-20"),
      },
    ],
    quotes: [
      {
        id: "quote_1",
        quoteNumber: "OF-001",
        title: "Offerte Badezimmer",
        status: "ACCEPTED",
        issueDate: new Date("2025-01-05"),
        validUntil: new Date("2025-02-05"),
        total: 15000,
        createdAt: new Date("2025-01-05"),
      },
    ],
    ...overrides,
  };
}

describe("CustomerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listAll", () => {
    it("returns customers with computed stats (orderCount + revenue)", async () => {
      const mockCustomer = mockPrismaCustomer();
      mockedPrisma.customer.findMany.mockResolvedValue([mockCustomer] as never);
      mockedPrisma.customer.count.mockResolvedValue(1 as never);

      const result = await service.listAll({ page: 1, pageSize: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].stats.orderCount).toBe(3);
      expect(result.data[0].stats.revenue).toBe(4000); // 1500 + 2500
      expect(result.data[0].stats.openInvoices).toBe(1000); // 800 + 200
      expect(result.data[0].stats.activeOrders).toBe(2);
      expect(result.total).toBe(1);
    });

    it("calculates revenue as 0 when no paid invoices exist", async () => {
      const mockCustomer = mockPrismaCustomer({ invoices: [], orders: [] });
      mockedPrisma.customer.findMany.mockResolvedValue([mockCustomer] as never);
      mockedPrisma.customer.count.mockResolvedValue(1 as never);

      const result = await service.listAll({ page: 1, pageSize: 20 });

      expect(result.data[0].stats.revenue).toBe(0);
      expect(result.data[0].stats.openInvoices).toBe(0);
      expect(result.data[0].stats.activeOrders).toBe(0);
    });

    it("computes correct skip for pagination", async () => {
      mockedPrisma.customer.findMany.mockResolvedValue([] as never);
      mockedPrisma.customer.count.mockResolvedValue(0 as never);

      await service.listAll({ page: 3, pageSize: 10 });

      expect(mockedPrisma.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20, // (3-1) * 10
          take: 10,
        }),
      );
    });

    it("builds where clause with type filter", async () => {
      mockedPrisma.customer.findMany.mockResolvedValue([] as never);
      mockedPrisma.customer.count.mockResolvedValue(0 as never);

      await service.listAll({ page: 1, pageSize: 20, type: "BUSINESS" });

      expect(mockedPrisma.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: "BUSINESS" }),
        }),
      );
      // count should use the same where
      expect(mockedPrisma.customer.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: "BUSINESS" }),
        }),
      );
    });

    it("builds where clause with search filter (case-insensitive)", async () => {
      mockedPrisma.customer.findMany.mockResolvedValue([] as never);
      mockedPrisma.customer.count.mockResolvedValue(0 as never);

      await service.listAll({ page: 1, pageSize: 20, search: "Muster" });

      expect(mockedPrisma.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: { contains: "Muster", mode: "insensitive" },
          }),
        }),
      );
    });

    it("combines type and search filters", async () => {
      mockedPrisma.customer.findMany.mockResolvedValue([] as never);
      mockedPrisma.customer.count.mockResolvedValue(0 as never);

      await service.listAll({
        page: 1,
        pageSize: 20,
        type: "PRIVATE",
        search: "Hans",
      });

      const calledWith = mockedPrisma.customer.findMany.mock.calls[0][0];
      expect(calledWith?.where).toEqual({
        type: "PRIVATE",
        name: { contains: "Hans", mode: "insensitive" },
      });
    });

    it("passes empty where when no filters given", async () => {
      mockedPrisma.customer.findMany.mockResolvedValue([] as never);
      mockedPrisma.customer.count.mockResolvedValue(0 as never);

      await service.listAll({ page: 1, pageSize: 20 });

      const calledWith = mockedPrisma.customer.findMany.mock.calls[0][0];
      expect(calledWith?.where).toEqual({});
    });

    it("orders by status asc then name asc", async () => {
      mockedPrisma.customer.findMany.mockResolvedValue([] as never);
      mockedPrisma.customer.count.mockResolvedValue(0 as never);

      await service.listAll({ page: 1, pageSize: 20 });

      expect(mockedPrisma.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ status: "asc" }, { name: "asc" }],
        }),
      );
    });
  });

  describe("listOne", () => {
    it("returns customer with stats and full relation data when found", async () => {
      const mockCustomer = mockPrismaCustomerDetail();
      mockedPrisma.customer.findUniqueOrThrow.mockResolvedValue(
        mockCustomer as never,
      );

      const result = await service.listOne("cuid_1");
      expect(result.id).toBe("cuid_1");
      expect(result.stats.orderCount).toBe(3);
      expect(result.stats.revenue).toBe(4000); // 1500 + 2500
      expect(result.stats.openInvoices).toBe(1000); // 800 + 200
      expect(result.stats.activeOrders).toBe(2); // PLANNED + IN_PROGRESS

      // Verify full relation data is returned
      expect(result.orders).toHaveLength(3);
      expect(result.orders[0].orderNumber).toBe("AU-001");
      expect(result.quotes).toHaveLength(1);
      expect(result.quotes[0].quoteNumber).toBe("OF-001");
      expect(result.invoices).toHaveLength(4);
      expect(result.invoices[0].invoiceNumber).toBe("RE-001");
    });

    it("throws NotFoundError when customer does not exist", async () => {
      const prismaError = new Error("Not found");
      Object.assign(prismaError, {
        code: "P2025",
        name: "PrismaClientKnownRequestError",
      });

      // Need to match the isPrismaNotFoundError check
      const { Prisma } = await import("../../generated/prisma/client");
      const realError = new Prisma.PrismaClientKnownRequestError("Not found", {
        code: "P2025",
        clientVersion: "0",
      });
      mockedPrisma.customer.findUniqueOrThrow.mockRejectedValue(realError);

      await expect(service.listOne("nonexistent")).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("delete", () => {
    it("returns deleted customer", async () => {
      const mockCustomer = mockPrismaCustomer();
      mockedPrisma.customer.delete.mockResolvedValue(mockCustomer as never);

      const result = await service.delete("cuid_1");
      expect(result.id).toBe("cuid_1");
      expect(mockedPrisma.customer.delete).toHaveBeenCalledWith({
        where: { id: "cuid_1" },
      });
    });

    it("throws NotFoundError when deleting nonexistent customer", async () => {
      const { Prisma } = await import("../../generated/prisma/client");
      const realError = new Prisma.PrismaClientKnownRequestError("Not found", {
        code: "P2025",
        clientVersion: "0",
      });
      mockedPrisma.customer.delete.mockRejectedValue(realError);

      await expect(service.delete("nonexistent")).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe("getStats", () => {
    it("returns counts by status", async () => {
      mockedPrisma.customer.count
        .mockResolvedValueOnce(10 as never) // active
        .mockResolvedValueOnce(3 as never) // inactive
        .mockResolvedValueOnce(2 as never) // archived
        .mockResolvedValueOnce(15 as never); // total

      const result = await service.getStats();

      expect(result).toEqual({
        active: 10,
        inactive: 3,
        archived: 2,
        total: 15,
      });
    });
  });
});
