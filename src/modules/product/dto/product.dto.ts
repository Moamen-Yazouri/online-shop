import { Product } from "generated/prisma";

export type CreateProductDTO = Pick<Product, 'name' | 'description' | 'price'>

export type UpdateProductDTO = Partial<CreateProductDTO>