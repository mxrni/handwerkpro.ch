import { NextFunction, Request, Response } from "express";
import { z, ZodTypeAny } from "zod";

export function handleRequest<
  InputSchema extends ZodTypeAny,
  OutputSchema extends ZodTypeAny,
>(
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
  handler: (input: z.infer<InputSchema>) => Promise<z.infer<OutputSchema>>,
  options?: { statusCode?: number },
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // merge body + params for validation
      const mergedInput = { ...req.params, ...req.body };
      const input = inputSchema.parse(mergedInput); // parse input

      const output = await handler(input);

      if (options?.statusCode) {
        if (options.statusCode === 204) {
          return res.status(204).send(); // no content
        }
        return res.status(options.statusCode).json(outputSchema.parse(output));
      }

      res.json(outputSchema.parse(output)); // parse output
    } catch (err) {
      next(err);
    }
  };
}
