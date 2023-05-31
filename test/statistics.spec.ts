import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';
import { delay, getToken } from './helpers';

describe('Statistics', () => {
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

  it(`/GET brigadier statistics`, () => {
    const req = request(app.getHttpServer())
      .get('/api/statistics/brigadier')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    return req;
  });

  it(`/GET brigadier top statistics`, () => {
    const req = request(app.getHttpServer())
      .get('/api/statistics/brigadier/top')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    return req;
  });

  it(`/GET client statistics`, () => {
    const req = request(app.getHttpServer())
      .get('/api/statistics/client')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    return req;
  });

  it(`/GET request statistics`, () => {
    const req = request(app.getHttpServer())
      .get('/api/statistics/request')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    return req;
  });

  it(`/GET invoice statistics`, () => {
    const req = request(app.getHttpServer())
      .get('/api/statistics/request')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    return req;
  });

  it(`/GET equipment/installed statistics`, () => {
    const req = request(app.getHttpServer())
      .get('/api/statistics/equipment/installed')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    return req;
  });

  it(`/GET accessories/sold statistics`, () => {
    const req = request(app.getHttpServer())
      .get('/api/statistics/accessories/sold')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    return req;
  });

  it('/GET brigadier statistics (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/statistics/brigadier');
    expect(response.status).toBe(401);
  });

  it('/GET client statistics (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/statistics/client');
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
