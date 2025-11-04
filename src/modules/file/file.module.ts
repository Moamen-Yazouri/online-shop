import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { ImageKitProvider } from './image.provider';


@Module({
  imports: [
    MulterModule.registerAsync({
      // This factory is async and need to import the FileModule to use the service injected
      imports: [FileModule],
      useFactory: (fileService: FileService) => {

        return {
          storage: fileService.imageKitMulterStorage(),
          limits: {
            fileSize: 5 * 1024 * 1024,
          },
          fileFilter: (req, file, cb) => {

            if (!file.mimetype.startsWith("image/")) {
              return cb(new Error('Only image files are allowed!'), false);
            }
    
            cb(null, true);
          },
        };

      },
      inject: [FileService],
    }),
  ],
  providers: [FileService, ImageKitProvider],
  exports: [FileService, MulterModule],
})
export class FileModule {}
