import { Controller, Get, Post, Body, Req, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import type {Request} from 'express';
import type { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { IsPublic } from 'src/decorators/auth.dec';
import { loginSchema, registerSchema } from './validation/auth.validationSchema';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post('register')
  @IsPublic()
  create(@Body(new ZodValidationPipe(registerSchema)) registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  login(@Body(new ZodValidationPipe(loginSchema)) loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Get('validate')
  validate(@Req() req: Request) {
    return this.authService.validate(req.user!);
  }
}
