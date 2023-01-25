import { ConfigModule } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import dbConfiguration from './src/config/database.config';

ConfigModule.forRoot({
  isGlobal: true,
  load: [dbConfiguration],
});

export default {
  ...dbConfiguration(),
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migrations/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'database/migrations',
    subscribersDir: 'src/subscriber',
  },
} as DataSourceOptions;
