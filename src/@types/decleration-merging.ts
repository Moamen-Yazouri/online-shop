import { UserResponse } from "src/modules/auth/dto/auth.dto";
import { EnvVars } from ".";

declare global {
    namespace Express {
        interface Request {
            user?: UserResponse['user'],
        }
    }

    namespace NodeJS {
        interface ProcessEnv extends EnvVars{}
    }

}