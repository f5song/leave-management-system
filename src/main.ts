import { SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core'; // เพิ่มเข้ามา
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SeedService } from './database/seed/seed.service';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { swaggerConfig } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.get(SeedService).seed();

  // ✅ ลงทะเบียน Global Guard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);

  const logger = new Logger('Bootstrap');
  logger.log('========================================');
  logger.log(`ENVIRONMENT=${process.env.NODE_ENV}`);
  logger.log(`App listening on port ${process.env.PORT || 3000}`);
  logger.log(`Swagger URL: http://localhost:${process.env.PORT || 3000}/api`);
  logger.log('========================================');
}
