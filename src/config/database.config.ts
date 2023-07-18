import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: true,
    autoLoadEntities: true,
  };
});
