import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';
import { delay, getToken } from './helpers';

describe('Equipment', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdEquipmentId: number;

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

  it('should create an equipment', async () => {
    const newEquipment = {
      type: 'string',
      mounting: 'Пол',
    };

    const response = await request(app.getHttpServer())
      .post('/api/equipment')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newEquipment);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(Number),
      type: 'string',
      mounting: 'Пол',
    });

    createdEquipmentId = response.body.id;
  });

  it('should get an equipment by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/equipment/${createdEquipmentId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  it('should update an equipment', async () => {
    const updatedEquipment = {
      type: 'updated string',
      mounting: 'Стена',
    };

    const response = await request(app.getHttpServer())
      .patch(`/api/equipment/${createdEquipmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedEquipment);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: createdEquipmentId,
      type: 'updated string',
      mounting: 'Стена',
    });
  });

  it('should delete an equipment', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/equipment/${createdEquipmentId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  it('should get all equipment', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/equipment')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
