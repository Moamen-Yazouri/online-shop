import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import type { IPaginationQuery, IPaginationResult } from 'src/@types';
import type { Request } from 'express';
import type { CreateOrderDTO, OrderOverviewDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDTO
  ) {
    return this.orderService.create(createOrderDto, BigInt(req.user!.id));
  }

  @Get()
  findAll(
    @Req() req: Request,
    @Query() query: IPaginationQuery
  ): Promise<IPaginationResult<OrderOverviewDTO>> {
    return this.orderService.findAll(query, BigInt(req.user!.id));
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
