import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar prefijo global de la API
  app.setGlobalPrefix('api');

  // Configurar versionado
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log('🚀 API running on: http://localhost:3000/api/v1');
}
bootstrap();
