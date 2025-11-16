import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import type { IPaginationQuery, IPaginationResult } from 'src/@types';
import type { CreateOrderDTO, OrderOverviewDTO } from './dto/order.dto';
import { User } from 'src/decorators/user.dec';
import type { User as PrismaUser } from 'generated/prisma';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @User() user: PrismaUser,
    @Body() createOrderDto: CreateOrderDTO
  ) {
    return this.orderService.create(createOrderDto, BigInt(user.id));
  }

  @Get()
  findAll(
    @User() user: PrismaUser,
    @Query() query: IPaginationQuery
  ): Promise<IPaginationResult<OrderOverviewDTO>> {
    return this.orderService.findAll(query, BigInt(user.id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
