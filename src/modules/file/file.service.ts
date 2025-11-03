import { Inject, Injectable } from '@nestjs/common';
import { imageKitToken } from './image.provider';
import ImageKit, { toFile } from '@imagekit/nodejs';
import { StorageEngine } from 'multer';

@Injectable()
export class FileService {
    constructor(@Inject(imageKitToken) private imageKit: ImageKit){}
    
    imageKitMulterStorage() {
    
        const customStorage: StorageEngine = {
            
            _handleFile: (req, file, cb) => {
                toFile(file.stream)
                .then((fileData) => ( 
                    this.imageKit.files.
                    upload({
                        file: fileData,
                        fileName: file.originalname,
                        useUniqueFileName: true,
                        folder: 'products',
                    })
                    .then((uploadedFile) => {
                        cb(null, uploadedFile);
                    })
                ))
                .catch(cb);
            },

            _removeFile: (req, file, cb) => {
                if(!file.fileId) return;

                console.log("Remove file from imageKit is triggered!");
                
                this.imageKit.files
                .delete(file.fileId)
                .then(() => cb(null))
                .catch(cb)
            },

        } 
        return customStorage;
    }
}
