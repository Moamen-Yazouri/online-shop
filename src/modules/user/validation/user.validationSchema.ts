import { RegisterDTO } from "src/modules/auth/dto/auth.dto";
import z, { ZodType } from "zod";
import { UpdateUserDTO } from "../dto/user.dto";

export const userValidationSchmea = z.object({
    name: z.string().min(3).max(100),
    email: z.email().toLowerCase(),
    password: z.string().min(6).max(100),
    role: z.enum(['CUSTOMER', 'MERCHANT']),

}) satisfies ZodType<RegisterDTO>;

export const updateUserValidationSchema = userValidationSchmea.pick({
    name: true,
    email: true,
    password: true,
})
.partial() satisfies ZodType<UpdateUserDTO>;