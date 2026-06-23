import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ─── Security ─────────────────────────────────────────────────────────
  app.use(helmet());
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
  });

  // ─── Global prefix ───────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ─── Global validation pipe ──────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── Swagger / OpenAPI ───────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('QHSSE Platform API')
    .setDescription('QHSSE Integrated Management System — REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ─── Start ───────────────────────────────────────────────────────────
  const port = configService.get('PORT', 4000);
  await app.listen(port);

  console.log(`🚀 QHSSE API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
