import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {dataBaseConfig} from "./config/database/database.config";

@Module({
  imports: [
    SequelizeModule.forRoot(dataBaseConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
