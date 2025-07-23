import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './config/database/database.config';
import { UserModule } from './services/users/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRoot(dataBaseConfig),
    PassportModule,
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
