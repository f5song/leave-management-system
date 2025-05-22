// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // ตัด field ที่ไม่อยู่ใน DTO ทิ้ง
      forbidNonWhitelisted: true, // ถ้ามี field ที่ไม่อนุญาต ให้ throw error
    }),
  );

  await app.listen(3000);
}
bootstrap();
