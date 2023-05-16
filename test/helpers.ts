import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function getToken(app: INestApplication): Promise<string> {
  const authData = await request(app.getHttpServer()).post('/api/auth/login').send({
    login: 'admin',
    password: 'admin1',
  });
  return authData.body.access_token;
}
