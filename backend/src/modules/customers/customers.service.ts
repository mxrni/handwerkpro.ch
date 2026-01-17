import prisma from "../../db/prisma";
import { CreateCustomerInput, UpdateCustomerInput } from "./customers.schema";

export class CustomerService {
  async getAll() {
    const customers = await prisma.customer.findMany();
    return customers;
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
    const updatedCustomer = await prisma.customer.update({
      data: {
        ...data,
      },
      where: {
        id: id,
      },
    });
    return updatedCustomer;
  }

  async delete(id: string) {
    const deletedCustomer = await prisma.customer.delete({
      where: {
        id: id,
      },
    });
    return deletedCustomer;
  }
}
