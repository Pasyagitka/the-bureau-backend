import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';
import { delay, getToken } from './helpers';

describe('Accessory', () => {
  let app: INestApplication;
  let accessToken: string;
  let maxAccessoryId: number;

  const testAccessory = {
    sku: 'string',
    name: 'string',
    equipmentId: 1,
    price: '2.90',
    quantity: 0,
  };

  const expectedAccessory = {
    id: expect.any(Number),
    sku: expect.any(String),
    name: expect.any(String),
    price: expect.any(String),
    quantity_in_stock: expect.any(Number),
    quantity_reserved: expect.any(Number),
    equipment: {
      id: expect.any(Number),
      mounting: expect.any(String),
      type: expect.any(String),
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

  it(`/GET accessories`, () => {
    const req = request(app.getHttpServer())
      .get('/api/accessory')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ limit: 10, offset: 0 })
      .expect(200);
    return req;
  });

  it(`Create accessory`, async () => {
    expect.assertions(2);
    const req = await request(app.getHttpServer())
      .post('/api/accessory')
      .send(testAccessory)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(201);
    expect(req.body).toEqual({
      ...expectedAccessory,
      sku: 'string',
      name: 'string',
      price: '2.90',
      quantity_in_stock: 0,
    });
    maxAccessoryId = req.body.id;
  });

  it(`/GET accessory`, async () => {
    expect.assertions(2);
    const req = await request(app.getHttpServer())
      .get(`/api/accessory/${maxAccessoryId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
    expect(req.body).toEqual(expectedAccessory);
  });

  it('/GET accessories (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/accessory');
    expect(response.status).toBe(401);
  });

  it('/GET accessory (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/api/accessory/1');
    expect(response.status).toBe(401);
  });

  it('/POST create accessory (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).post('/api/accessory');
    expect(response.status).toBe(401);
  });

  it('/POST import accessory (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).post('/api/accessory/import');
    expect(response.status).toBe(401);
  });

  it('/PATCH accessory (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).patch('/api/accessory/1');
    expect(response.status).toBe(401);
  });

  it('/DELETE accessory (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).delete('/api/accessory/1');
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
