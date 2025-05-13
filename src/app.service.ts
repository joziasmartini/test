import { Injectable } from '@nestjs/common';

interface FileOperation {
  from: string;
  to: string;
  amount: number;

  suspectAmount?: boolean;
  negativeAmount?: boolean;
  duplicatedTransaction?: boolean;
}

@Injectable()
export class AppService {
  private structureFile(file: string[][]): FileOperation[] {
    let fileStructured: FileOperation[] = [];

    for (let i = 1; i < file.length; i++) {
      const dataRow = file[i];
      const operation: any = {};

      for (let j = 0; j < dataRow.length; j++) {
        const key = file[0][j];
        operation[key] = key === 'amount' ? Number(dataRow[j]) : dataRow[j];
      }

      fileStructured.push(operation as FileOperation);
    }

    return fileStructured;
  }

  processTransactions(file: Express.Multer.File) {
    const fileName = file.originalname;
    const fileUploadedAt = Date.now();
    const fileAsString = file.buffer.toString();
    const fileParsed = fileAsString.split('\n');
    const fileSplitted = fileParsed.map((line) => line.split(';'));

    const fileStructured = this.structureFile(fileSplitted);

    const uniqueTransactionKeys = new Set<string>();
    const duplicatedTransactions: FileOperation[] = [];
    const uniqueTransactions: FileOperation[] = [];

    fileStructured.forEach((transaction) => {
      const transactionKey = JSON.stringify(transaction);

      // Marcar transações duplicadas
      if (uniqueTransactionKeys.has(transactionKey)) {
        transaction.duplicatedTransaction = true;
        duplicatedTransactions.push(transaction);
      } else {
        uniqueTransactionKeys.add(transactionKey);
        uniqueTransactions.push(transaction);
      }

      // Marcar transações com valores negativos
      if (transaction.amount < 0) {
        transaction.negativeAmount = true;
      }

      // Marcar transações suspeitas (baseado no SUSPICIOUS_THRESHOLD)
      const suspiciousThreshold = Number(process.env.SUSPICIOUS_THRESHOLD);
      if (transaction.amount > suspiciousThreshold) {
        transaction.suspectAmount = true;
      }
    });
  }
}
