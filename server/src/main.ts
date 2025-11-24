import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { BusinessRuleExceptionFilter } from './presentation/filters/business-rule-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar filtro global de excepciones
  app.useGlobalFilters(new BusinessRuleExceptionFilter());

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe());

  // Configurar prefijo global de la API
  app.setGlobalPrefix('api');

  // Configurar versionado
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Mercado Trueque API')
    .setDescription('🔄 API para la plataforma de intercambio (trueque)')
    .setVersion('1.0')
    .addTag(
      'Trades',
      'Operaciones de trueque - 6 fases del proceso de intercambio',
    )
    .addTag('Products', 'Gestión de productos del catálogo')
    .addTag('Categories', 'Categorías de productos')
    .addTag('Users', 'Gestión de usuarios y perfiles')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT obtenido del login',
        in: 'header',
      },
      'access-token', // Este es el nombre de la referencia
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
      showRequestHeaders: true,
      docExpansion: 'list',
    },
    jsonDocumentUrl: '/api-docs/openapi.json', // URL para descargar el JSON
    yamlDocumentUrl: '/api-docs/openapi.yaml', // URL para descargar el YAML
  });

  // CORS configurado para aceptar cualquier origen
  app.enableCors({
    origin: true, // Acepta cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: '*',
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log('🚀 API running on: http://localhost:3000/api/v1');
  console.log('📚 Swagger docs: http://localhost:3000/api-docs');
  console.log('📄 OpenAPI JSON: http://localhost:3000/api-docs/openapi.json');
  console.log('📄 OpenAPI YAML: http://localhost:3000/api-docs/openapi.yaml');
}
bootstrap();
