import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';

describe('Tool', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdToolId: number;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();

    const getToken = async (): Promise<string> => {
      const authData = await request(app.getHttpServer()).post('/api/auth/login').send({
        login: 'admin',
        password: 'admin',
      });
      return authData.body.access_token;
    };
    setupApp(app);

    await app.init();
    accessToken = await getToken();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a tool', async () => {
    const newTool = {
      name: 'string',
      stageId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/api/tool')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newTool);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(Number),
      name: 'string',
      stage: {
        id: expect.any(Number),
        stage: 'string',
        mountingPrice: expect.any(Number),
      },
      stageId: expect.any(Number),
    });

    createdToolId = response.body.id;
  });

  it('should update a tool', async () => {
    const updatedTool = {
      name: 'updated string',
      stageId: 2,
    };

    const response = await request(app.getHttpServer())
      .patch(`/api/tool/${createdToolId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedTool);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: createdToolId,
      name: 'updated string',
      stage: {
        id: expect.any(Number),
        stage: 'string',
        mountingPrice: expect.any(Number),
      },
      stageId: 2,
    });
  });

  it('should delete a tool', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/tool/${createdToolId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  it('should get all tools', async () => {
    const response = await request(app.getHttpServer()).get('/api/tool').set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  it('should get a tool by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/tool/${createdToolId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });
});
