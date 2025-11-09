import * as z from "zod";
import { CreateOrderDTO } from "../dto/order.dto";

export const createOrderValidationSchema: z.ZodType<CreateOrderDTO> =
    z.array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(), // use .nonnegative() if 0 is allowed
      })
    )
    .superRefine((items, ctx) => {
      const seen = new Map<number, number>(); // productId -> first index
      items.forEach((item, idx) => {
        const firstIdx = seen.get(item.productId);
        if (firstIdx !== undefined) {
          ctx.addIssue({
            code: "custom",
            message: `Duplicate productId ${item.productId} (first seen at index ${firstIdx}).`,
            path: [idx, "productId"], // pin the error to the offending element
          });
        } else {
          seen.set(item.productId, idx);
        }
      });
    });

    export const orderReturnValidationSchema = z.object({
        orderId: z.number().int().positive(),
        products: createOrderValidationSchema,
    })
