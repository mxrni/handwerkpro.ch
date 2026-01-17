import { Router } from "express";
import { handleRequest } from "../../middlewares/handleRequest";
import {
  CreateCustomerInput,
  CustomerOutput,
  UpdateCustomerInput,
} from "./customers.schema";
import { CustomerService } from "./customers.service";

export const customersRouter = Router();
const service = new CustomerService();

customersRouter.get("/", async (req, res, next) => {
  try {
    const items = await service.getAll();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

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

import { DeleteCustomerInput } from "./customers.schema";

customersRouter.delete(
  "/:id",
  handleRequest(
    DeleteCustomerInput,
    CustomerOutput,
    async (input) => {
      return service.delete(input.id);
    },
    { statusCode: 204 },
  ),
);
