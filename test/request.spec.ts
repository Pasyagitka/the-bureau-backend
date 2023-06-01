import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';
import { delay, getToken } from './helpers';

describe('Request', () => {
  let app: INestApplication;
  let accessToken: string;
  let maxRequestId: number;

  const expectedRequest = {
    id: expect.any(Number),
    registerDate: expect.any(String),
    mountingDate: expect.any(String),
    comment: expect.any(String),
    status: expect.any(String),
    client: {
      id: expect.any(Number),
      firstname: expect.any(String),
      surname: expect.any(String),
      contactNumber: expect.any(String),
      patronymic: expect.any(String),
      user: {
        id: expect.any(Number),
        login: expect.any(String),
        email: expect.any(String),
        role: expect.any(String),
        isActivated: expect.any(Boolean),
      },
    },
    address: {
      id: expect.any(Number),
      city: expect.any(String),
      street: expect.any(String),
      house: expect.any(String),
      flat: expect.any(Number),
      lat: expect.any(String),
      lon: expect.any(String),
    },
    brigadier: {
      id: expect.any(Number),
      firstname: expect.any(String),
      surname: expect.any(String),
      patronymic: expect.any(String),
      contactNumber: expect.any(String),
      avatarUrl: expect.any(String),
    },
    stage: {
      id: expect.any(Number),
      stage: expect.any(String),
      mountingPrice: expect.any(String),
    },
    requestEquipment: expect.any(Array),
    // requestEquipment: expect.arrayContaining([
    //   {
    //     id: expect.any(Number),
    //     quantity: expect.any(Number),
    //     deletedAt: expect.any(null),
    //     equipment: {
    //       id: expect.any(Number),
    //       type: expect.any(String),
    //       mounting: expect.any(String),
    //     },
    //   },
    // ]),
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

  it(`/GET requests`, async () => {
    const req = await request(app.getHttpServer())
      .get('/api/request')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ limit: 10, offset: 0 });
    expect(req.status).toBe(200);
    maxRequestId = req.body[req.body.length - 1].id;
    return req;
  });

  it(`/GET request`, async () => {
    expect.assertions(2);
    const req = await request(app.getHttpServer())
      .get(`/api/request/${maxRequestId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
    expect(req.body).toEqual(expectedRequest);
  });

  it(`/GET request weekly report`, async () => {
    expect.assertions(1);
    const req = await request(app.getHttpServer())
      .get('/api/request/weekly-report')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
  });

  it(`/GET request calendar`, async () => {
    expect.assertions(1);
    const req = await request(app.getHttpServer())
      .get('/api/request/calendar')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
  });

  it('/GET requests (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/request');
    expect(response.status).toBe(401);
  });

  it('/GET request (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/request/1');
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
