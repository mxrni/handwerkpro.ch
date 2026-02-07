import {
  CreateCustomerInput,
  CustomerDetailOutput,
  CustomerIDInput,
  CustomerOutput,
  CustomerStatsOutput,
  ListCustomersInput,
  ListCustomersOutput,
  UpdateCustomerInput,
} from "@app/shared";
import { Router } from "express";
import z from "zod";
import { handleRequest } from "../../middlewares/handleRequest";
import { CustomerService } from "./customers.service";

export const customersRouter: Router = Router();
const service = new CustomerService();

customersRouter.get(
  "/stats",
  handleRequest(z.object({}), CustomerStatsOutput, async () => {
    return service.getStats();
  }),
);

customersRouter.get(
  "/",
  handleRequest(ListCustomersInput, ListCustomersOutput, async (input) => {
    const { page, pageSize, search, type } = input;

    const { data, total } = await service.listAll({
      page,
      pageSize,
      search,
      type,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: data,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }),
);

customersRouter.get(
  "/:id",
  handleRequest(CustomerIDInput, CustomerDetailOutput, async (input) => {
    return service.listOne(input.id);
  }),
);

customersRouter.post(
  "/",
  handleRequest(
    CreateCustomerInput,
    CustomerOutput,
    async (input) => {
      return service.create(input);
    },
    { statusCode: 201 },
  ),
);

customersRouter.patch(
  "/:id",
  handleRequest(UpdateCustomerInput, CustomerOutput, async (input) => {
    const id = input.id;
    return service.update(id, input);
  }),
);

customersRouter.delete(
  "/:id",
  handleRequest(
    CustomerIDInput,
    CustomerOutput,
    async (input) => {
      return service.delete(input.id);
    },
    { statusCode: 204 },
  ),
);
