import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Readable } from 'stream';

const buffer = Buffer.from('from;to;amount\nA;B;100\nC;D;200');

const mockFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'filename.csv',
  encoding: '7bit',
  mimetype: 'text/csv',
  size: buffer.length,
  stream: Readable.from(buffer),
  destination: '',
  filename: '',
  path: '',
  buffer,
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.uploadFile(mockFile)).toBe('Hello World!');
    });
  });
});
