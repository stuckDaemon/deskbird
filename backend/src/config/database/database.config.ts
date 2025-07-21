import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize/types';
import { User } from '../../models/User';

dotenv.config();

export const dataBaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres' as Dialect,
  logging: false,
  synchronize: false,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5222'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadModels: true,
  dialectOptions: {
    ssl:
      process.env.DB_SSL === 'false'
        ? false
        : {
            require: true,
            rejectUnauthorized: false,
          },
  },
  models: [User],
  pool: {
    max: 20, // Maximum number of connections in pool (adjust based on your database's capacity)
    min: 5, // Minimum number of connections in pool
    acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
    evict: 10000, // The time interval, in milliseconds, for evicting idle connections
  },
  retry: {
    max: 3, // How many times a failing query is automatically retried
  },
};
