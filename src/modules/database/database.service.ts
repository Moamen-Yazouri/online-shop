import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { IPaginationQuery, IPaginationResult } from 'src/@types';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  handlePagination(queries: IPaginationQuery) {
    const page = Number(queries.page ?? 1);
    const limit = Number(queries.limit ?? 10);

    return {
      skip: (page - 1) * limit,
      take: limit
    }
  }

  handleMetaWithPagination<T>(limit: number, page: number, total: number,): IPaginationResult<T>["meta"] {
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total/limit)
    }
  }
}
