import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Accessory', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    console.log(app);
    await app.init();
  });

  it(`/GET accessory`, () => {
    return request(app.getHttpServer()).get('/api/accessory').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
