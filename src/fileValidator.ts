export function fileIsCsv(file: Express.Multer.File): boolean {
  return file.originalname.includes('.csv');
}

export function fileSizeIsAcceptable(file: Express.Multer.File): boolean {
  return file.size <= Number(process.env.MAX_FILE_SIZE);
}

export function fileHasTheExpectedHeaders(file: Express.Multer.File): boolean {
  const fileHeaders = file.buffer.toString().split('\n')[0];
  const firstHeaderIsValid = fileHeaders.includes('from');
  const secondHeaderIsValid = fileHeaders.includes('to');
  const thirdHeaderIsValid = fileHeaders.includes('amount');
  const headersAreValid =
    firstHeaderIsValid && secondHeaderIsValid && thirdHeaderIsValid;

  return headersAreValid;
}

export default function validateFile(file: Express.Multer.File): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!fileIsCsv(file)) {
    errors.push('File is not a CSV');
  }

  if (!fileSizeIsAcceptable(file)) {
    errors.push('File size is too large');
  }

  if (!fileHasTheExpectedHeaders(file)) {
    errors.push('File does not have the expected headers');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
