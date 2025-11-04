import { UserResponse } from "src/modules/auth/dto/auth.dto";
import { EnvVars } from ".";
import ImageKit from "@imagekit/nodejs";

declare global {
    namespace Express {
        interface Request {
            user?: UserResponse['user'],
            folder?: string
        }
        namespace Multer {
            interface File extends ImageKit.Files.FileUploadResponse {}
        }
    }

    namespace NodeJS {
        interface ProcessEnv extends EnvVars{}
    }

}