import 'reflect-metadata';
import { server } from '../server';
import supertest from 'supertest';
import { allowedOrigins } from '../common/libs/cors';

const agent = supertest(server.build());

describe('CORS Tests', () => {
  it('should allow requests from allowed origins', async () => {
    const origin = allowedOrigins[0];
    const res = await agent
      .get('/test')
      .set('Origin', origin);

    expect(res.headers['access-control-allow-origin']).toBe(origin);
  });

  it('should not allow requests from disallowed origins', async () => {
    const res = await agent
      .get('/test')
      .set('Origin', 'https://disallowed-origin.com');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
