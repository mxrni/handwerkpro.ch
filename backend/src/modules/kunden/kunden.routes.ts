import { Router } from "express";
import { ExampleService } from "./kunden.service";

export const kundenRouter = Router();
const service = new ExampleService();

kundenRouter.get("/", async (req, res, next) => {
  try {
    const items = await service.getAll();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

kundenRouter.post("/", async (req, res, next) => {
  try {
    const newItem = await service.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});
