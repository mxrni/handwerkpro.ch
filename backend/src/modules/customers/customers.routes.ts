import { Router } from "express";
import { handleRequest } from "../../middlewares/handleRequest";
import {
  CreateCustomerInput,
  CustomerIDInput,
  CustomerOutput,
  ListCustomersInput,
  ListCustomersOutput,
  UpdateCustomerInput,
} from "./customers.schema";
import { CustomerService } from "./customers.service";

export const customersRouter = Router();
const service = new CustomerService();

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
  handleRequest(CustomerIDInput, CustomerOutput, async (input) => {
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
