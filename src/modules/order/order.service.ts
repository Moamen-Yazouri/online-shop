import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDTO, OrderResponseDTO } from './dto/order.dto';
import { DatabaseService } from '../database/database.service';
import { generatePriceById, generatePriceWithQty } from './utils/builder.utils';
import { calcTheTotalAmount } from './utils/money.util';

@Injectable()
export class OrderService {
  constructor(private readonly prismaClient: DatabaseService) {}
  async create(createOrderDto: CreateOrderDTO, userId: bigint): Promise<OrderResponseDTO> {

    const prodIds = createOrderDto.map((item) => item.productId);

    const foundedProds = await this.prismaClient.product.findMany({
      where: {
        id: {
          in: prodIds,
        }
      }
    });

    if (foundedProds.length !== prodIds.length) {
      throw new BadRequestException('Some products not found');
    };
    
    const priceWithId = generatePriceById(foundedProds);

    const priceAndQty = generatePriceWithQty(createOrderDto, priceWithId);

    const totalAmount = calcTheTotalAmount(priceAndQty);

    const orderProducts = createOrderDto.map((item) => ({
      productId: item.productId,
      price: priceWithId.get(BigInt(item.productId))!,
      quantity: item.quantity,
    }));

    const createorder = await this.prismaClient.order.create({
      data: {
        items: {
          createMany: {
            data: orderProducts,
          }
        },
        txns: {
          create: {
            amount: totalAmount,
            type: "DEBIT",
            userId
          }
        },
        orderStatus: "PENDING",
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          }
        },
        txns: true,
        returns: {            
          include: {
            items: true,
          }
        }
      }
    });
    return createorder;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    console.log(updateOrderDto);
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

 

}
