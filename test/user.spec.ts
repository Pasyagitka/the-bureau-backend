import user from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';
import { delay, getToken } from './helpers';

describe('User', () => {
  let app: INestApplication;
  let accessToken: string;
  let maxUserId: number;

  const expectedUser = {
    id: expect.any(Number),
    login: expect.any(String),
    email: expect.any(String),
    role: expect.any(String),
    isActivated: expect.any(Boolean),
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

  it(`/GET users`, async () => {
    const req = await user(app.getHttpServer())
      .get('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ limit: 10, offset: 0 });
    expect(req.status).toBe(200);
    maxUserId = req.body[req.body.length - 1].id;
    console.log(maxUserId);
    return req;
  });

  it(`/GET user`, async () => {
    expect.assertions(2);
    const req = await user(app.getHttpServer())
      .get(`/api/user/${maxUserId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
    expect(req.body).toEqual(expectedUser);
  });

  it(`deactivate user`, async () => {
    expect.assertions(1);
    const req = await user(app.getHttpServer())
      .patch(`/api/user/${maxUserId}/deactivate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
  });

  it(`activate user`, async () => {
    expect.assertions(1);
    const req = await user(app.getHttpServer())
      .patch(`/api/user/${maxUserId}/activate`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(req.status).toBe(200);
  });

  it('/GET users (unauthorized)', async () => {
    expect.assertions(1);
    const response = await user(app.getHttpServer()).get('/api/user');
    expect(response.status).toBe(401);
  });

  it('/GET user (unauthorized)', async () => {
    expect.assertions(1);
    const response = await user(app.getHttpServer()).get('/api/user/1');
    expect(response.status).toBe(401);
  });

  it('activate user (unauthorized)', async () => {
    expect.assertions(1);
    const response = await user(app.getHttpServer()).patch('/api/user/1/deactivate');
    expect(response.status).toBe(401);
  });

  it('deactivate user (unauthorized)', async () => {
    expect.assertions(1);
    const response = await user(app.getHttpServer()).patch('/api/user/1/deactivate');
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
