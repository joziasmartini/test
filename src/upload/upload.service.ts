import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { OperationsResult } from './types';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async createFile(filename: string) {
    const file = await this.prisma.file.create({
      data: {
        filename: filename,
      },
    });

    console.log('File created:', file);

    return file;
  }

  async createTransaction(dto: Transaction, fileId: number) {
    return await this.prisma.transaction.create({
      data: {
        from: dto.from,
        to: dto.to,
        amount: dto.amount,
        fileId: fileId,
        suspectAmount: dto.suspectAmount || false,
        negativeAmount: dto.negativeAmount || false,
        duplicatedTransaction: dto.duplicatedTransaction || false,
      },
    });
  }

  async processTransactions(file: Express.Multer.File) {
    const fileName = file.originalname;
    const fileAsString = file.buffer.toString().trim();
    const fileParsed = fileAsString.split('\n');
    const fileSplitted = fileParsed.map((line) => line.split(';'));

    const transactions: Transaction[] = [];
    const uniqueTransactionKeys = new Set<string>();

    fileSplitted.slice(1).forEach((dataRow) => {
      const operation: Partial<Transaction> = {};

      // Estrutura o arquivo
      dataRow.forEach((data, index) => {
        const key = fileSplitted[0][index];
        operation[key] = key === 'amount' ? Number(data) : data;
      });

      const transaction = operation as Transaction;

      const transactionKey = JSON.stringify(transaction);

      // Valida duplicatas
      if (uniqueTransactionKeys.has(transactionKey)) {
        transaction.duplicatedTransaction = true;
      } else {
        uniqueTransactionKeys.add(transactionKey);
      }

      // Valida valores negativos
      if (Number(transaction.amount) < 0) {
        transaction.negativeAmount = true;
      }

      // Valida valores suspeitos
      const suspiciousThreshold = parseInt(
        process.env.SUSPICIOUS_THRESHOLD || '50_000_00',
      );
      if (Number(transaction.amount) > suspiciousThreshold) {
        transaction.suspectAmount = true;
      }

      transactions.push(transaction);
    });

    console.log('Transactions parsed:', transactions);

    const fileCreated = await this.createFile(fileName);

    const operationsResult: OperationsResult = {
      validOperationsCount: 0,
      notValidOperations: [],
    };

    for (const transaction of transactions) {
      if (transaction.negativeAmount) {
        operationsResult.notValidOperations.push({
          operation: transaction,
          error: 'Negative amount',
        });
      }
      if (transaction.duplicatedTransaction) {
        operationsResult.notValidOperations.push({
          operation: transaction,
          error: 'Duplicated transaction',
        });
      }
      if (!transaction.negativeAmount && !transaction.duplicatedTransaction) {
        console.log('Creating transaction:', transaction);
        await this.createTransaction(transaction, fileCreated.id);
        operationsResult.validOperationsCount++;
      }
    }

    return operationsResult;
  }
}
