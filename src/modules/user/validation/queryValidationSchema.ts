import { IPaginationQuery } from "src/@types";
import z, { ZodType } from "zod";

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
}) satisfies ZodType<IPaginationQuery>;