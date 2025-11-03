import { Injectable } from '@nestjs/common';
import type { CreateProductDTO, UpdateProductDTO } from './dto/product.dto';
import { DatabaseService } from '../database/database.service';
import { IPaginationResult } from 'src/@types';
import { IProductPaginationQuery } from './types';
import { Prisma, Product } from 'generated/prisma';



@Injectable()
export class ProductService {
  constructor(private prismaClient: DatabaseService) {}

  
  create(createProductDto: CreateProductDTO) {
    return this.prismaClient.product.create({
      data: createProductDto,
    });
  }

  findAll(query: IProductPaginationQuery): Promise<IPaginationResult<Product>> {

    const productsForRes = this.prismaClient.$transaction(async(prisma) => {
      const whereClause: Prisma.ProductWhereInput =
        query.name 
        ? {
          name: {
            contains: query.name,
          }
        }
        : {}

      
      const products =  await prisma.product.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where: whereClause,
      });

      const total = await prisma.product.count();

      return {
        data: products,
        meta: {
          total,
          page: query.page,
          limit: query.limit,
        }
      }
    });
    return productsForRes;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDTO) {
    return this.prismaClient.product.update({
      where: {
        id: id,
      },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
