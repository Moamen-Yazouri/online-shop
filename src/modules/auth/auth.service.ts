import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import * as argon from "argon2";
import { LoginDTO, RegisterDTO, UserResponse } from "./dto/auth.dto";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { IJWTPayload } from "src/@types";
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDTO: RegisterDTO): Promise<UserResponse> {
    //hash pass
    const hashedPass = await this.hashPassword(registerDTO.password);
    //create user
    const newUser = await this.userService.create({
      ...registerDTO,
      password: hashedPass,
    });
    
    const userForToken = this.userService.prepareForToken(newUser);
    const token = this.generateToken(userForToken);
    
    const userForDTO = this.userService.prepareUserForDTO(newUser);
    return {
      token,
      user: userForDTO,
    };
  }

  async login(loginInfo: LoginDTO) {

    const {email } = loginInfo;

    try {
      const foundedUser = await this.userService.findByEmailOrThrow(
        email,
      );
      
      if(foundedUser.isDeleted) {
        throw new UnauthorizedException('User is deleted');
      }
      
      const isPasswordValid = await this.verifyPassword(
        foundedUser.password,
        loginInfo.password,
      );
  
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }
  
      const userForToken = this.userService.prepareForToken(foundedUser);
  
      const token = this.generateToken(userForToken);

      const userForDTO = this.userService.prepareUserForDTO(foundedUser);
  
      return {
        token,
        user: userForDTO,
      };
    }
    catch(err: unknown){
      if (err instanceof PrismaClientKnownRequestError) {

        throw new UnauthorizedException('User not found');
      }
      
      this.logger.error('Login failed', err instanceof Error ? err.stack : String(err));

      throw new UnauthorizedException('Invalid credentials');
    }
  }

  validate(user: UserResponse['user']): UserResponse {
    const userForToken = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    const token = this.generateToken(userForToken);
    return{
      user,
      token
    }
  }

  private hashPassword(password: string) {
    return argon.hash(password);
  }

  private verifyPassword(hash: string, password: string) {
    return argon.verify(hash, password);
  }

  private generateToken(
    userForToken: Pick<UserResponse["user"], "id" | "role" | "email" | "name"> ,
  ) {
    const token = this.jwtService.sign<IJWTPayload>({
      sub: userForToken.id,
      role: userForToken.role,
      email: userForToken.email,
      name: userForToken.name,
    });
    return token;
  }
}
