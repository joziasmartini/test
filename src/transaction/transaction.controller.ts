import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    if (
      !dto.from ||
      typeof dto.from !== 'string' ||
      !dto.to ||
      typeof dto.to !== 'string' ||
      typeof dto.amount !== 'number' ||
      dto.amount <= 0
    ) {
      throw new BadRequestException(
        'Dados inválidos. Verifique os campos "from", "to" e "amount".',
      );
    }

    return this.transactionService.create(dto);
  }
}
