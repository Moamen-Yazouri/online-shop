import { Prisma, Product } from "generated/prisma";
import { CreateOrderDTO, OrderReturnDTO } from "../dto/order.dto";

export const generatePriceById = (prods: Product[]) => {
      const priceWithId: Map<bigint, Prisma.Decimal> = new Map();
      prods.forEach((prod) => {
        priceWithId.set(prod.id, prod.price);
      });
      return priceWithId;
  }

export const generatePriceWithQty = (createOrderDto: CreateOrderDTO, priceWithId: Map<bigint, Prisma.Decimal>) => {
    return createOrderDto.map((item) => ({
      price: priceWithId.get(BigInt(item.productId))!,
      quantity: item.quantity,
    }));

}

export const generateIdWithQty = (returnedtems: OrderReturnDTO): Map<bigint, number> => {
  const idWithQty: Map<bigint, number> = new Map();
  returnedtems.products.forEach((item) => {
    idWithQty.set(BigInt(item.productId), item.quantity);
  });
  return idWithQty;
}