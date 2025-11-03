import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './modules/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/roles.guard';
import { ProductModule } from './modules/product/product.module';
import { FileModule } from './modules/file/file.module';


@Module({
  imports: [
    AuthModule, 
    UserModule, 
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class AppModule {}
