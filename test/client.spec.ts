import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';
import { delay, getToken } from './helpers';

describe('Client', () => {
  let app: INestApplication;
  let accessToken: string;

  const expectedClient = {
    id: expect.any(Number),
    firstname: expect.any(String),
    surname: expect.any(String),
    patronymic: expect.any(String),
    contactNumber: expect.any(String),
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

  it(`/GET clients`, () => {
    const req = request(app.getHttpServer())
      .get('/api/client')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ limit: 10, offset: 0 })
      .expect(200);
    return req;
  });

  it(`/GET client`, async () => {
    expect.assertions(2);
    const req = await request(app.getHttpServer()).get('/api/client/1').set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
    expect(req.body).toEqual(expectedClient);
  });

  it('/GET clients (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/client');
    expect(response.status).toBe(401);
  });

  it('/GET client (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/client/1');
    expect(response.status).toBe(401);
  });

  it('/PATCH client (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).patch('/api/client/1').send({
      login: 'string',
      email: 'string',
      password: 'string',
      role: 'Client',
      activationLink: 'string',
      firstname: 'string',
      surname: 'string',
      patronymic: 'string',
      contactNumber: 'string',
    });
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
