import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Swagger Config พร้อม BearerAuth
  const config = new DocumentBuilder()
    .setTitle('Leave Management System')
    .setDescription('Leave Management System API description')
    .setVersion('1.0')
    .addTag('Leave Management System')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // 👈 ต้องใช้ชื่อเดียวกับ @ApiBearerAuth('access-token')
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
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
