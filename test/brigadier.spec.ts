import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';
import { delay, getToken } from './helpers';
import dayjs from 'dayjs';

describe('Brigadier', () => {
  let app: INestApplication;
  let accessToken: string;

  const expectedBrigadier = {
    id: expect.any(Number),
    firstname: expect.any(String),
    surname: expect.any(String),
    patronymic: expect.any(String),
    contactNumber: expect.any(String),
    avatarUrl: expect.any(String),
    user: {
      id: expect.any(Number),
      login: expect.any(String),
      email: expect.any(String),
      role: expect.any(String),
      isActivated: expect.any(Boolean),
    },
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();

    setupApp(app);
    await app.init();
    accessToken = await getToken(app);
  });

  afterEach(async () => {
    await delay(500);
  });

  it(`/GET brigadiers`, () => {
    const req = request(app.getHttpServer())
      .get('/api/brigadier')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ limit: 10, offset: 0 })
      .expect(200);
    return req;
  });

  it(`/GET brigadier`, async () => {
    expect.assertions(2);
    const req = await request(app.getHttpServer())
      .get('/api/brigadier/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
    expect(req.body).toEqual(expectedBrigadier);
  });

  it(`/GET recommended brigadiers`, async () => {
    expect.assertions(1);
    const req = await request(app.getHttpServer())
      .get('/api/brigadier/recommended')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ date: dayjs().toDate() });
    expect(req.status).toBe(200);
  });

  it('/GET brigadiers (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/brigadier');
    expect(response.status).toBe(401);
  });

  it('/GET brigadier (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/brigadier/1');
    expect(response.status).toBe(401);
  });

  it('/PATCH brigadier (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).patch('/api/brigadier/1');
    expect(response.status).toBe(401);
  });

  it('/DELETE brigadier (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).delete('/api/brigadier/1');
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
