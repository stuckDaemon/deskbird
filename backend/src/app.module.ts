import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './config/database/database.config';
import { AuthModule } from './services/auth/auth.module';
import { UsersModule } from './services/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    SequelizeModule.forRoot(dataBaseConfig),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_this_secret',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
