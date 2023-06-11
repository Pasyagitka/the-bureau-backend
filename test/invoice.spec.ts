import invoice from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';
import { delay, getBrigadierToken, getClientToken, getToken } from './helpers';

describe('Invoice', () => {
  let app: INestApplication;
  let accessToken: string;
  let brigadierToken: string;
  let clientToken: string;
  let maxInvoiceId: number;

  const expectedInvoice = {
    id: expect.any(Number),
    total: expect.any(String),
    status: expect.any(String),
    receiptUrl: expect.toBeOneOf([expect.any(String), null]),
    scanUrl: expect.toBeOneOf([expect.any(String), null]),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  };

  const createInvoice = {
    items: [
      {
        accessoryId: 2,
        quantity: 1,
      },
    ],
    customerId: 0,
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();

    setupApp(app);
    await app.init();
    accessToken = await getToken(app);
    brigadierToken = await getBrigadierToken(app);
    clientToken = await getClientToken(app);
  });

  afterEach(async () => {
    await delay(500);
  });

  it(`/POST invoice (empty)`, async () => {
    expect.assertions(1);
    const req = await invoice(app.getHttpServer()).post(`/api/invoice`).set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(400);
  });

  it(`/POST invoice (wrong list)`, async () => {
    expect.assertions(1);
    const req = await invoice(app.getHttpServer())
      .post(`/api/invoice`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        items: [
          {
            accessoryId: 22222,
            quantity: 1,
          },
        ],
        customerId: 0,
      });
    expect(req.status).toBe(400);
  });

  it(`/POST invoice`, async () => {
    expect.assertions(2);
    const req = await invoice(app.getHttpServer())
      .post(`/api/invoice`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createInvoice);
    expect(req.status).toBe(201);
    expect(req.body).toEqual({ message: 'OK' });
  });

  it(`/GET invoices`, async () => {
    const req = await invoice(app.getHttpServer())
      .get('/api/invoice')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ limit: 10, offset: 0 });
    expect(req.status).toBe(200);
    maxInvoiceId = req.body.data[req.body.data.length - 1]?.id;
    return req;
  });

  it(`/GET invoice`, async () => {
    expect.assertions(2);
    const req = await invoice(app.getHttpServer())
      .get(`/api/invoice/${maxInvoiceId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
    expect(req.body).toEqual(expectedInvoice);
  });

  it(`/GET invoice (docx)`, async () => {
    expect.assertions(1);
    const req = await invoice(app.getHttpServer())
      .get(`/api/invoice/${maxInvoiceId}/file`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
  });

  it(`/GET invoice items`, async () => {
    expect.assertions(1);
    const req = await invoice(app.getHttpServer())
      .get(`/api/invoice/${maxInvoiceId}/items`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
  });

  it(`/delete invoice`, async () => {
    expect.assertions(1);
    const req = await invoice(app.getHttpServer())
      .delete(`/api/invoice/${maxInvoiceId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
  });

  it(`/GET for brigadier`, async () => {
    const req = await invoice(app.getHttpServer())
      .get('/api/invoice/brigadier/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ limit: 10, offset: 0 });
    expect(req.status).toBe(200);
    maxInvoiceId = req.body.data[req.body.data.length - 1]?.id;
    return req;
  });

  it(`/get invoices (brigadier)`, async () => {
    expect.assertions(1);
    const req = await invoice(app.getHttpServer())
      .get(`/api/invoice/brigadier/2`)
      .set('Authorization', `Bearer ${brigadierToken}`)
      .query({ limit: 10, offset: 0 });
    expect(req.status).toBe(200);
  });

  it(`/get invoices (brigadier, forbidden)`, async () => {
    expect.assertions(1);
    const req = await invoice(app.getHttpServer())
      .get(`/api/invoice/brigadier/1`)
      .set('Authorization', `Bearer ${brigadierToken}`)
      .query({ limit: 10, offset: 0 });
    expect(req.status).toBe(403);
  });

  it(`/get invoices (client, forbidden)`, async () => {
    expect.assertions(1);
    const req = await invoice(app.getHttpServer())
      .get(`/api/invoice/brigadier/1`)
      .set('Authorization', `Bearer ${clientToken}`)
      .query({ limit: 10, offset: 0 });
    expect(req.status).toBe(403);
  });

  it('/post invoices (unauthorized)', async () => {
    expect.assertions(1);
    const response = await invoice(app.getHttpServer()).post('/api/invoice');
    expect(response.status).toBe(401);
  });

  it('/GET invoices (unauthorized)', async () => {
    expect.assertions(1);
    const response = await invoice(app.getHttpServer()).get('/api/invoice');
    expect(response.status).toBe(401);
  });

  it('/GET invoice (unauthorized)', async () => {
    expect.assertions(1);
    const response = await invoice(app.getHttpServer()).get('/api/invoice/1');
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
