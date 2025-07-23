import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // or ['http://localhost:4200'] for tighter security
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // if you use cookies or Authorization header
  });

  const sequelize = app.get(Sequelize);
  await sequelize.sync();

  console.log('JWT_SECRET:', process.env.JWT_SECRET); // should NOT be undefined

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
