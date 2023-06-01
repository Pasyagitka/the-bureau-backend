import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export async function getToken(app: INestApplication): Promise<string> {
  const authData = await request(app.getHttpServer()).post('/api/auth/login').send({
    login: 'admin',
    password: 'admin1',
  });
  return authData.body.access_token;
}

export async function getBrigadierToken(app: INestApplication): Promise<string> {
  const authData = await request(app.getHttpServer()).post('/api/auth/login').send({
    login: 'brigadier2',
    password: 'brigadier2',
  });
  return authData.body.access_token;
}

export async function getClientToken(app: INestApplication): Promise<string> {
  const authData = await request(app.getHttpServer()).post('/api/auth/login').send({
    login: 'client1',
    password: 'client1',
  });
  return authData.body.access_token;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
