import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AbilityFactory } from './ability/ability.factory';
import { AbilitiesGuard } from './ability/guards/abilities.guard';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const basePath = '/api';
  app.setGlobalPrefix(basePath);
  if (!process.env.SWAGGER_ENABLE || process.env.SWAGGER_ENABLE === 'true') {
    createSwagger(app, basePath);
  }
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalGuards(new AbilitiesGuard(reflector, new AbilityFactory()));
  await app.listen(process.env.PORT);
}

function createSwagger(app: INestApplication, basePath: string) {
  const config = new DocumentBuilder()
    .setTitle('The Bureau API')
    .setDescription('...')
    .addServer(basePath)
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .addTag('Authentication')
    .addTag('Accessories')
    .addTag('Brigadiers')
    .addTag('Clients')
    .addTag('Equipment')
    .addTag('Requests')
    .addTag('Schedules')
    .addTag('Stages')
    .addTag('Tools')
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });
  SwaggerModule.setup('/api/docs', app, document, {
    customSiteTitle: 'TheBureau API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

bootstrap();
