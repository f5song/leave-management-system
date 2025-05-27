// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT);

  const logger = new Logger('Bootstrap');

  logger.log('========================================');
  logger.log(`ENVIRONMENT=${process.env.NODE_ENV}`);
  logger.log(`App listening on port ${process.env.PORT}`);
  logger.log('========================================');
}
bootstrap();
