import { Transaction } from '@prisma/client';

export interface OperationsResult {
  validOperationsCount: number;
  notValidOperations: {
    operation: Transaction;
    error: string;
  }[];
}
