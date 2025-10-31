import { RegisterDTO } from "src/modules/auth/dto/auth.dto";
import z, { ZodType } from "zod";

export const userValidationSchmea = z.object({
    name: z.string().min(3).max(100),
    email: z.email().toLowerCase(),
    password: z.string().min(7).max(100),
    role: z.enum(['CUSTOMER', 'MERCHANT']),

}) satisfies ZodType<RegisterDTO>