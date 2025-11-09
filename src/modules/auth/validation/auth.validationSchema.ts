import { userValidationSchmea } from "src/modules/user/validation/user.validationSchema";
import { ZodType } from "zod";
import { LoginDTO } from "../dto/auth.dto";

export const registerSchema = userValidationSchmea;

export const loginSchema = userValidationSchmea.pick({
    email: true,
    password: true,
}) satisfies ZodType<LoginDTO>