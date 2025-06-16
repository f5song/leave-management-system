import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleAuthService } from './google.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserEntity } from '../../database/entity/users.entity';

import { UserModule } from '../../features/users/user.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('EXPIRE_TOKEN') },
      }),
    }),
    UserModule,  // <-- ต้องมี เพื่อให้ UserService สามารถ inject ได้
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleAuthService,
    RolesGuard,
    {
      provide: JwtAuthGuard,
      useClass: JwtAuthGuard,  // <-- ให้ Nest สร้างด้วย DI container (สำคัญมาก)
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}



