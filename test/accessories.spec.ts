import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Accessory', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();

    const getToken = async (app): Promise<string> => {
      const authData = await request(app.getHttpServer()).post('/api/authorization/signin').send({
        login: 'admin',
        password: 'admin',
      });
      return authData.body.access_token;
    };
    accessToken = await getToken(app);
    console.log(accessToken);
    await app.init();
  });

  it(`/GET accessory`, () => {
    const req = request(app.getHttpServer())
      .get('/accessory')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    console.log(req);
    return req;
  });

  it('/GET accessory (unauthorized)', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get('/accessory');
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
