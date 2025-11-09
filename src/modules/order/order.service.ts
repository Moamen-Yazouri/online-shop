import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDTO, OrderOverviewDTO, OrderResponseDTO, OrderReturnDTO } from './dto/order.dto';
import { DatabaseService } from '../database/database.service';
import { generatePriceById, generatePriceWithQty } from './utils/builder.utils';
import { calcTheTotalAmount } from './utils/money.util';
import { IPaginationQuery, IPaginationResult } from 'src/@types';

@Injectable()
export class OrderService {
  constructor(private readonly prismaClient: DatabaseService) {}

  async create(createOrderDto: CreateOrderDTO, userId: bigint): Promise<OrderResponseDTO> {

    const prodIds = createOrderDto.map((item) => BigInt(item.productId));

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
    console.log(priceAndQty);
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

  async createOrderReturn(
    userId: bigint,
    orderReturnDto: OrderReturnDTO
  ) {
    const { orderId, products } = orderReturnDto;

    await this.prismaClient.$transaction(async(tx) => {
    await tx.order.findUniqueOrThrow({
        where: {
          id: orderId,
          userId,
        },
      });


      const prodsIds = products.map((item) => BigInt(item.productId));

      const items = await tx.orderProduct.findMany({
        where: {
          orderId,
          productId: {
            in: prodsIds,
          }
        }
      });

      if(items.length !== products.length) {
        throw new BadRequestException('Some products not found');
      }

      
        const updates = await Promise.all(products.map(async (item) => {
           return await this.prismaClient.orderProduct.update({
            where: {
              orderId_productId: {
                orderId,
                productId: item.productId,
              },
              quantity: {gte: item.quantity},
            },
            data: {
              quantity: {decrement: item.quantity}
            }
          });
        }) 
        )

      if(updates.length !== products.length) {
        throw new BadRequestException('Some quantities are grater than you orderd previously');
      }

      await tx.orderReturn.create({
        data: {
          orderId,
          items: {
            createMany: {
              data: products
            },
          },
          status: "PENDING",
        }
      })
    });
    
    const order = this.findOne(orderId);
    return order;
  }
  async findAll(query: IPaginationQuery, userId: bigint): Promise<IPaginationResult<OrderOverviewDTO>> {
    const allOrders = await this.prismaClient.$transaction(async(prisma) => {
      
      const pagination = this.prismaClient.handlePagination(query);

      const orders = await prisma.order.findMany({
        where: {
          userId,
        },
        include: {
          items: true,
          txns: true,
          returns: true,
        },
        ...pagination
      });

      const total = await prisma.order.count();

      const paginationMeta = this.prismaClient.handleMetaWithPagination(query.limit, query.page, total);

      return {
        data: orders,
        meta: paginationMeta,
      }
    });

    return allOrders;
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
