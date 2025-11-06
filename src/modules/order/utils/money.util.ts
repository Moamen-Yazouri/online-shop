import { Prisma } from "generated/prisma";
import { Decimal } from "generated/prisma/runtime/library";

export const calcTheTotalAmount = (priceAndQty: {price: Prisma.Decimal, quantity: number}[]) => {
    return priceAndQty.reduce((acc, item) => {
      return acc.add(item.price.mul(item.quantity));
    }, new Decimal(0));
}