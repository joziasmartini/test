import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import validateFile from './file-validator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { isValid, errors } = validateFile(file);

    if (!isValid) {
      return {
        statusCode: 400,
        message: 'File is not valid',
        errors,
      };
    }

    this.uploadService.processTransactions(file);

    return {
      statusCode: 200,
      message: 'File processed successfully',
    };
  }
}
