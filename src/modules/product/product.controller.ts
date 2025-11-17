import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, Req, UseFilters } from '@nestjs/common';
import type { Request } from 'express'
import { ProductService } from './product.service';
import type { CreateProductDTO, ProductResponseDTO, UpdateProductDTO } from './dto/product.dto';
import type { IProductPaginationQuery } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import { FolderInterceptor } from 'src/interceptors/folder.interceptor';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { productValidationSchema, updateProductValidationSchema } from './validation/product.validationSchema';
import { Roles } from 'src/decorators/roles.dec';
import { productQuerySchema } from './validation/query.validationSchem';
import { ImageKitExceptionFilter } from 'src/errors/exceptions.errors';
import { FileCleanupInterceptor } from 'src/interceptors/fileCleanup.interceptor';


@Controller('product')
@Roles(['MERCHANT', 'ADMIN'])
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FolderInterceptor("products"),
    FileInterceptor('image' ),
    FileCleanupInterceptor
  )
  @UseFilters(ImageKitExceptionFilter)
  create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(productValidationSchema)) createProductDto: CreateProductDTO,
    @UploadedFile() image?: Express.Multer.File,
  ) {
     return this.productService.create(req, createProductDto, image);
  }

  @Roles(['MERCHANT', 'CUSTOMER', 'ADMIN'])
  @Get()
  findAll(@Query(new ZodValidationPipe(productQuerySchema)) query: IProductPaginationQuery) {
    return this.productService.findAll(query);
  }

  @Roles(['MERCHANT', 'CUSTOMER', 'ADMIN'])
  @Get(':id')
  findOne(@Param('id') id: bigint) {
    return this.productService.findOne(id);
  }

  @UseInterceptors(
    FolderInterceptor("products"),
    FileInterceptor('image' ),
    FileCleanupInterceptor,
  )
  @UseFilters(ImageKitExceptionFilter)
  @Patch(':id')
  update(
    @Param('id') id: bigint,
    @Req() req: Request,
    @Body(new ZodValidationPipe(updateProductValidationSchema)) updateProductDto: UpdateProductDTO,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<ProductResponseDTO> {
    return this.productService.update(id, req.user, updateProductDto, image);
  }

  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id') id: bigint
  ) {
    return this.productService.remove(id, BigInt(req.user!.id));
  }
}