import { Injectable } from '@nestjs/common';

interface FileOperation {
  from: string;
  to: string;
  amount: number;
  suspect?: boolean;
}

@Injectable()
export class AppService {
  mathOperation(file: string[]) {
    let fileOperations: FileOperation[] = [];

    const splittedFile = file.map((line) => line.split(';'));

    for (let i = 1; i < splittedFile.length; i++) {
      for (let j = 0; j < splittedFile[i].length; j++) {
        fileOperations.push({
          from: splittedFile[i][j],
          to: splittedFile[i][j],
          amount: Number(splittedFile[i][j]),
        });
      }
    }

    // Filter duplicated values
    const setTest = new Set<string>();

    const duplicatedTransactions: FileOperation[] = [];
    const notDuplicatedTransations: FileOperation[] = [];

    fileOperations.map((operation) => {
      const identifier = JSON.stringify(operation);
      if (setTest.has(identifier)) {
        duplicatedTransactions.push(operation);
      } else {
        setTest.add(identifier);
        notDuplicatedTransations.push(operation);
      }
    });

    // Filter negative values
    const operationsWithoutNegativeValues = notDuplicatedTransations.filter(
      (operation) => operation.amount > 0,
    );

    // Include flag in case of suspect values
    const operationsWithSuspectCases = operationsWithoutNegativeValues.map(
      (operation) => {
        if (operation.amount > 50_000_00) {
          return { ...operation, suspect: true };
        } else {
          return operation;
        }
      },
    );

    operationsWithSuspectCases;

    console.log(duplicatedTransactions);
    console.log(notDuplicatedTransations);
  }
}
