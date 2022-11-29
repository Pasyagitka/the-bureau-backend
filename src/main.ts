import { ValidationPipe } from '@nestjs/common';
import { ModuleRef, NestFactory, Reflector } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AbilityFactory } from './ability/ability.factory';
import { AbilitiesGuard } from './ability/guards/abilities.guard';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  //const moduleRef = app.get(ModuleRef);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('/api');
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalGuards(new AbilitiesGuard(reflector, new AbilityFactory()));
  await app.listen(process.env.PORT);
}
bootstrap();
