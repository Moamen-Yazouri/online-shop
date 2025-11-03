import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import type { CreateProductDTO, UpdateProductDTO } from './dto/product.dto';
import type { IProductPaginationQuery } from './types';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image' ),
  )
  create(
    @Body() createProductDto: CreateProductDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
      console.log(image);
      return "Uploaded successfully"
  }

  @Get()
  findAll(@Query() query: IProductPaginationQuery) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDTO) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
