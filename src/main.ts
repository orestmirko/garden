import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';

import { SwaggerHelper } from '#common/helpers/swagger.helper';
import { GlobalExceptionFilter } from '#common/http';
import { AppConfigService } from '#config/app/configuration.service';
import { AppModule } from '#src/app.module';

function initSwagger(app: INestApplication): void {
  const documentBuilder: DocumentBuilder = new DocumentBuilder()
    .setTitle('Garden API')
    .setDescription('Garden API Documentation')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .setVersion('0.0.1');

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerHelper.setDefaultResponses(document);
  SwaggerHelper.setExplodeQueryStyle(document);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      defaultModelExpandDepth: 1,
      persistAuthorization: true,
    },
  });
}

function setCorsPolicy(app: INestApplication, isProduction?: boolean): void {
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With,content-type',
      'Origin',
      'Access-Control-Allow-Origin',
      'Cache-Control',
      'Pragma',
      'Expires',
    ],
    credentials: true,
    preflightContinue: isProduction,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const appConfig: AppConfigService = app.get<AppConfigService>(AppConfigService);
  app.use(compression());
  app.useGlobalFilters(new GlobalExceptionFilter(appConfig));
  setCorsPolicy(app);
  initSwagger(app);

  await app.listen(appConfig.port, appConfig.hostname, () => {
    Logger.log(`Server is running http://${appConfig.hostname}:${appConfig.port}/`);
    Logger.log(`Swagger is running http://${appConfig.hostname}:${appConfig.port}/docs`);
  });
}

void bootstrap();
