import { Prisma } from "generated/prisma";

export type CreateOrderDTO = {
    productId: number;
    quantity: number;
} [];

export type OrderResponseDTO = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                product: true,
            }
        },
        txns: true,
        returns: {            
            include: {
                items: true,
            }
        };
}}>;

