import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';
import { delay, getToken } from './helpers';

describe('Schedule', () => {
  let app: INestApplication;
  let accessToken: string;

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

  it(`/GET brigadier schedule`, () => {
    const req = request(app.getHttpServer())
      .get('/api/schedule/brigadier/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    return req;
  });


  it(`/GET request schedule`, () => {
    const req = request(app.getHttpServer())
      .get('/api/schedule/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    return req;
  });

  it('/GET brigadier schedule (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/schedule/brigadier/1');
    expect(response.status).toBe(401);
  });

  it('/GET request schedule (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/schedule/1');
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
