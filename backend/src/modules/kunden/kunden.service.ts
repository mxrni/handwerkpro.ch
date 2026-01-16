import prisma from "../../db/prisma";

let examples: any = [{ ni: "ga" }];

export class ExampleService {
  async getAll() {
    const customers = await prisma.customer.findMany();
    return customers;
  }

  async create(data: any) {
    examples = examples.push(JSON.parse(data));
    return examples;
  }
}
