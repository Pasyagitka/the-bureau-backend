import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AbilityFactory } from './ability/ability.factory';
import { AbilitiesGuard } from './ability/guards/abilities.guard';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  //TODO move logger creating here
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
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.getHttpAdapter().getInstance().disable('x-powered-by');
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
    .addTag('Accessories', 'CRUD for working with accessories in storage')
    .addTag('Brigadiers')
    .addTag('Clients')
    .addTag('Equipment', 'CRUD for working with equipment (enum) in storage')
    .addTag('Requests')
    .addTag('Request Report', 'CRUD for working with request reports (quality control)')
    .addTag('Rental')
    .addTag('Schedules')
    .addTag('Stages', 'Requests for working with stages (enum)')
    .addTag('Tools', 'CRUD for working with tools in storage')
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });
  SwaggerModule.setup('/api/docs', app, document, {
    customSiteTitle: 'TheBureau API',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: false,
    },
  });
}

bootstrap();
