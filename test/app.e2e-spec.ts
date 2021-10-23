import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TicTacToeController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .query({ board: 'ox o o xx' })
      .expect(200)
      .expect('ox ooo xx');
  });

  it('/ (GET) invalid board length', () => {
    return request(app.getHttpServer())
      .get('/')
      .query({ board: 'ooxo xox oxo ooxxxoo   ' })
      .expect(400);
  });

  it('/ (GET) undefined board', () => {
    return request(app.getHttpServer())
      .get('/')
      .query({ board: undefined })
      .expect(400);
  });

  it('/ (GET) invalid board match', () => {
    return request(app.getHttpServer())
      .get('/')
      .query({ board: 'abcdefghi' })
      .expect(400);
  });
});
