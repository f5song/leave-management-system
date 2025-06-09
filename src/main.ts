import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { swaggerConfig } from './swagger/swagger.config';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SeedService } from './database/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.get(SeedService).seed();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT || 3000);

  const logger = new Logger('Bootstrap');
  logger.log('========================================');
  logger.log(`ENVIRONMENT=${process.env.NODE_ENV}`);
  logger.log(`App listening on port ${process.env.PORT || 3000}`);
  logger.log('Swagger URL: http://localhost:${process.env.PORT || 3000}/api');
  logger.log('========================================');
}
bootstrap();
