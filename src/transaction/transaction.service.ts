import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      return tx.transaction.create({
        data: {
          from: dto.from,
          to: dto.to,
          amount: dto.amount,
        },
      });
    });
  }
}
