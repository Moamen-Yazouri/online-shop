import * as z from "zod";
import { CreateOrderDTO } from "../dto/order.dto";

export const createOrderValidationSchema = z.array(
    z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive().min(0),
    })
) satisfies z.ZodType<CreateOrderDTO>
