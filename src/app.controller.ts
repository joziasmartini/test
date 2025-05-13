import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import validateFile from './fileValidator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
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

    try {
      this.appService.processTransactions(file);
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        errors: [error.message],
      };
    }
    return {
      statusCode: 200,
      message: 'File processed successfully',
    };
  }
}
