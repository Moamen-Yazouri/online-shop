import z, { ZodType } from "zod";
import { IProductPaginationQuery } from "../types";

export const ProductQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  name: z.string().max(255).optional()
}) satisfies ZodType<IProductPaginationQuery>;