import prisma from "../../db/prisma";
import { CustomerWhereInput } from "../../generated/prisma/models";
import { isPrismaNotFoundError, NotFoundError } from "../../utils/errors";
import {
  CreateCustomerInput,
  ListCustomersInput,
  UpdateCustomerInput,
} from "./customers.schema";

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
            where: {
              status: "PAID",
            },
            select: {
              total: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    const customersData = customers.map((customer) => {
      const revenue = customer.invoices.reduce(
        (sum, invoice) => sum + invoice.total,
        0,
      );

      return {
        ...customer,
        stats: {
          orderCount: customer._count.orders,
          revenue,
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
      });
      return customer;
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
}
