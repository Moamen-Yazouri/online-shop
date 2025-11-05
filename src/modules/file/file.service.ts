import { Inject, Injectable } from '@nestjs/common';
import { imageKitToken } from './image.provider';
import ImageKit, { toFile } from '@imagekit/nodejs';
import { StorageEngine } from 'multer';
import { Prisma } from 'generated/prisma';
import { PrismaClientTX } from 'src/@types';
import { SideEffectsQueue } from 'src/utils/side-effects/sideEffects.utils';

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
                        folder: req.folder ? req.folder : "products",
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

    createFileAssetData(file: Express.Multer.File): Prisma.AssetUncheckedCreateInput {
        return {
            fileId: file.fileId!,
            fileSizeInKB: Math.ceil(file.size),
            url: file.url!,
            fileType: file.mimetype, 
        }
    }

    async deleteFileAsset(
        tx: PrismaClientTX,
        productId: bigint,
        sideEffect: SideEffectsQueue,
    ) {
        const whereClause = {
            where: {
                productId: productId,
            }
        }

        const assets = await tx.asset.findMany(whereClause);
        
        if(assets.length == 0) {
            return;
        };
        
        await tx.asset.deleteMany(whereClause);

        assets.forEach(element => {
            sideEffect.insertOne({
                label: `Delete the asset with id: ${element.fileId}`,
                effect: async () => {
                    await this.imageKit.files.delete(element.fileId);
                }
            })
        })
    }
}
