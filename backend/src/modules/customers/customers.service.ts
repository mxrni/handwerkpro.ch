import {
  CreateCustomerInput,
  ListCustomersInput,
  UpdateCustomerInput,
} from "@app/shared/src/index";
import prisma from "../../db/prisma";
import { CustomerWhereInput } from "../../generated/prisma/models";
import { isPrismaNotFoundError, NotFoundError } from "../../utils/errors";

export class CustomerService {
  async listAll(data: ListCustomersInput) {
    const where: CustomerWhereInput = {
      ...(data.type && { type: data.type }),
      ...(data.search && {
        name: {
          contains: data.search,
          mode: "insensitive",
        },
      }),
    };

    const skip = (data.page - 1) * data.pageSize;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: data.pageSize,
        orderBy: [{ status: "asc" }, { name: "asc" }],
        include: {
          _count: {
            select: {
              orders: true,
            },
          },
          invoices: {
            select: {
              status: true,
              total: true,
            },
          },
          orders: {
            where: {
              status: { in: ["PLANNED", "IN_PROGRESS"] },
            },
            select: { id: true },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    const customersData = customers.map((customer) => {
      const revenue = customer.invoices
        .filter((inv) => inv.status === "PAID")
        .reduce((sum, inv) => sum + inv.total, 0);

      const openInvoices = customer.invoices
        .filter((inv) => inv.status !== "PAID" && inv.status !== "CANCELLED")
        .reduce((sum, inv) => sum + inv.total, 0);

      return {
        ...customer,
        stats: {
          orderCount: customer._count.orders,
          revenue,
          openInvoices,
          activeOrders: customer.orders.length,
        },
      };
    });

    return {
      data: customersData,
      total: total,
    };
  }

  async listOne(id: string) {
    try {
      const customer = await prisma.customer.findUniqueOrThrow({
        where: { id },
        include: {
          _count: {
            select: {
              orders: true,
            },
          },
          invoices: {
            select: {
              id: true,
              invoiceNumber: true,
              title: true,
              status: true,
              issueDate: true,
              dueDate: true,
              paidDate: true,
              total: true,
              paidAmount: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
          orders: {
            select: {
              id: true,
              orderNumber: true,
              title: true,
              status: true,
              priority: true,
              startDate: true,
              endDate: true,
              deadline: true,
              estimatedCost: true,
              actualCost: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
          quotes: {
            select: {
              id: true,
              quoteNumber: true,
              title: true,
              status: true,
              issueDate: true,
              validUntil: true,
              total: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      const revenue = customer.invoices
        .filter((inv) => inv.status === "PAID")
        .reduce((sum, inv) => sum + inv.total, 0);

      const openInvoices = customer.invoices
        .filter((inv) => inv.status !== "PAID" && inv.status !== "CANCELLED")
        .reduce((sum, inv) => sum + inv.total, 0);

      const activeOrders = customer.orders.filter(
        (o) => o.status === "PLANNED" || o.status === "IN_PROGRESS",
      ).length;

      return {
        ...customer,
        stats: {
          orderCount: customer._count.orders,
          revenue,
          openInvoices,
          activeOrders,
        },
      };
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundError(`Customer with id ${id} not found`);
      }
      throw error;
    }
  }

  async create(data: CreateCustomerInput) {
    const newCustomer = await prisma.customer.create({
      data: {
        ...data,
      },
    });
    return newCustomer;
  }

  async update(id: string, data: UpdateCustomerInput) {
    try {
      const updatedCustomer = await prisma.customer.update({
        data: {
          ...data,
        },
        where: {
          id: id,
        },
      });
      return updatedCustomer;
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundError(`Customer with id ${id} not found`);
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const deletedCustomer = await prisma.customer.delete({ where: { id } });
      return deletedCustomer;
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundError(`Customer with id ${id} not found`);
      }
      throw error;
    }
  }

  async getStats() {
    const [active, inactive, archived, total] = await Promise.all([
      prisma.customer.count({ where: { status: "ACTIVE" } }),
      prisma.customer.count({ where: { status: "INACTIVE" } }),
      prisma.customer.count({ where: { status: "ARCHIVED" } }),
      prisma.customer.count(),
    ]);

    return {
      active,
      inactive,
      archived,
      total,
    };
  }
}
