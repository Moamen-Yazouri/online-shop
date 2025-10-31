import { Product } from "generated/prisma";
import { faker } from "@faker-js/faker"
export const generateProductForSeed = (merchantId: bigint) => {
    const productForSeed: Omit<
        Product,
        | "id" 
        | "createdAt" 
        | "updatedAt" 
        | "price"
    > & {
        price: number;
    } = {
        name: faker.commerce.productName(),
        price: faker.number.int({ min: 10, max: 1000 }),
        description: faker.commerce.productDescription(),
        merchantId
    }
    return productForSeed;
}