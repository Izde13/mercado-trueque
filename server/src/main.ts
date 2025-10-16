import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { BusinessRuleExceptionFilter } from './presentation/filters/business-rule-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar filtro global de excepciones
  app.useGlobalFilters(new BusinessRuleExceptionFilter());

  // Configurar prefijo global de la API
  app.setGlobalPrefix('api');

  // Configurar versionado
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: 'http://localhost:5400',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log('🚀 API running on: http://localhost:3000/api/v1');
}
bootstrap();
