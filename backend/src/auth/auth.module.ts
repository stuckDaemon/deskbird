import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../services/users/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_this_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
