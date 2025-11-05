import z, { ZodType } from "zod";
import { IProductPaginationQuery } from "../types";
import { querySchema } from "src/utils/validation/query.validation";

export const productQuerySchema = querySchema.extend({
  name: z.string().max(255).optional(),
}) satisfies ZodType<IProductPaginationQuery>;
