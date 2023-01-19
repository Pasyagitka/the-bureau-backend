import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AbilityFactory } from './ability/ability.factory';
import { AbilitiesGuard } from './ability/guards/abilities.guard';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

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
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
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
    .addTag('Accessories')
    .addTag('Brigadiers')
    .addTag('Clients')
    .addTag('Equipment')
    .addTag('Requests')
    .addTag('Request Report')
    .addTag('Rental')
    .addTag('Schedules')
    .addTag('Stages')
    .addTag('Tools')
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
