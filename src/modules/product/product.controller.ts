import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import type { Request } from 'express'
import { ProductService } from './product.service';
import type { CreateProductDTO, ProductResponseDTO, UpdateProductDTO } from './dto/product.dto';
import type { IProductPaginationQuery } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import { FolderInterceptor } from 'src/interceptors/folder.interceptor';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { productValidationSchema, updateProductValidationSchema } from './validation/product.validationSchema';
import { Roles } from 'src/decorators/roles.dec';
import { ProductQuerySchema } from './validation/query.validationSchem';


@Controller('product')
@Roles(['MERCHANT', 'ADMIN'])
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FolderInterceptor("products"),
    FileInterceptor('image' ),
  )
  create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(productValidationSchema)) createProductDto: CreateProductDTO,
    @UploadedFile() image?: Express.Multer.File,
  ) {
     return this.productService.create(req, createProductDto, image);
  }

  @Roles(['MERCHANT', 'CUSTOMER', 'ADMIN'])
  @Get()
  findAll(@Query(new ZodValidationPipe(ProductQuerySchema)) query: IProductPaginationQuery = {
    limit: 50,
    page: 1,
  }) {
    return this.productService.findAll(query);
  }

  @Roles(['MERCHANT', 'CUSTOMER', 'ADMIN'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @UseInterceptors(
    FolderInterceptor("products"),
    FileInterceptor('image' ),
  )
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
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
