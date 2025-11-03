import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FileModule } from '../file/file.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [FileModule],
})
export class ProductModule {}
