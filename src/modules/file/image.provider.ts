import ImageKit from "@imagekit/nodejs";
import { ConfigService } from "@nestjs/config";
import { EnvVars } from "src/@types";

export const imageKitToken = "IMAGE_KIT_TOKEN";
export const ImageKitProvider = {
    provide: imageKitToken,
    useFactory: (configService: ConfigService<EnvVars>) => {
        return new ImageKit({
            privateKey: configService.getOrThrow("IMAGEKIT_PRIVATE_KEY"),
        })
    },
    inject: [ConfigService],   
}