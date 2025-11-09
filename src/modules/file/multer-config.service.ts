import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly fileService: FileService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.fileService.imageKitMulterStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    };
  }
}
