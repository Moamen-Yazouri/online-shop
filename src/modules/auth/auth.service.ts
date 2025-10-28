import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as argon from "argon2";
import { LoginDTO, RegisterDTO, UserResponse } from "./dto/auth.dto";
import { User } from "generated/prisma/client";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EnvVars, IJWTPayload } from "src/@types";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  async register(registerDTO: RegisterDTO): Promise<UserResponse> {
    //hash pass
    const hashedPass = await this.hashPassword(registerDTO.password);
    //create user
    const newUser = await this.userService.create({
      ...registerDTO,
      password: hashedPass,
    });
    //generate token
    const userForToken = this.userService.prepareForToken(newUser);
    const token = this.generateToken(userForToken);
    //return user with token
    const userForDTO = this.userService.prepareUserForDTO(newUser);
    return {
      token,
      user: userForDTO,
    };
  }

  async login(loginInfo: LoginDTO) {
    const foundedUser = await this.userService.findByEmailOrThrow(
      loginInfo.email,
    );

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
    userForToken: Pick<User, "id" | "role" | "email" | "name">,
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
