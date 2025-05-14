import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { PrismaModule } from './../prisma/prisma.module';

@Module({
  imports: [UploadModule, PrismaModule],
})
export class AppModule {}
