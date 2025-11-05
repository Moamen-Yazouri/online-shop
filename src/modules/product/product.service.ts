import { Injectable } from '@nestjs/common';
import type { CreateProductDTO, ProductResponseDTO, UpdateProductDTO } from './dto/product.dto';
import type { Request } from 'express';
import { DatabaseService } from '../database/database.service';
import { IPaginationResult } from 'src/@types';
import { IProductPaginationQuery } from './types';
import { Prisma, Product } from 'generated/prisma';
import { serializeMany, serializeOne } from 'src/utils/serialize.util';
import { FileService } from '../file/file.service';
import { SideEffectsQueue } from 'src/utils/side-effects/sideEffects.utils';



@Injectable()
export class ProductService {
  constructor(
    private prismaClient: DatabaseService,
    private fileService: FileService,
  ) {}

  
  async create(
    req: Request,
    newProduct: CreateProductDTO,
    file?: Express.Multer.File
  ) {

    const payloadData: Prisma.ProductUncheckedCreateInput = {
      ...newProduct, 
      merchantId: BigInt(req.user!.id)
    }

    if(file) {
      payloadData.assets = {
        create: this.fileService.createFileAssetData(file)
      }; 
    }
    const createdProduct = await this.prismaClient.product.create({
      data: payloadData,
      include: {
        assets: true,
      }
    })
    return serializeOne(createdProduct);

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
        include: {
          assets: true,
        }
      });

      const total = await prisma.product.count();
      const serilaizedProducts = serializeMany(products);
      return {
        data: serilaizedProducts,
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

  async update(
    id: bigint,
    user: Request["user"], 
    updateProductDto: UpdateProductDTO, 
    file?: Express.Multer.File
  ): Promise<ProductResponseDTO> {

    
    const sideEffect = new SideEffectsQueue();
    const updatePayload = await this.prismaClient.$transaction(async (tx) => {

      const dataPayload: Prisma.ProductUncheckedUpdateInput = {
        ...updateProductDto
      };

      if(file) {

        await this.fileService.deleteFileAsset(tx, id, sideEffect);

        dataPayload.assets = {
          create: this.fileService.createFileAssetData(file)
        };

      }
      return await tx.product.update({
        where: {
          id,
          merchantId: Number(user!.id)
        },
        data: dataPayload,
        include: {
          assets: true,
        }
      })
    });
    
    await sideEffect.runAll();

    return updatePayload;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
