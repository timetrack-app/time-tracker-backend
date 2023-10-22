import 'reflect-metadata';
import supertest, { SuperTest, Test } from 'supertest';
import { server } from '../../src/server';

export const agent: SuperTest<Test> = supertest(server.build());

/**
 * Agent for protected routes
 * Add auth token to Bearer header
 *
 * @param {string} token
 * @return {supertest.SuperTest<supertest.Test>}
 */
export const authAgent = (token: string) => {
  // const customAgent: SuperTest<Test> = supertest(server.build());
  const defaultGet = agent.get;
  const defaultPost = agent.post;
  const defaultPut = agent.put;
  const defaultPatch = agent.patch;
  const defaultDelete = agent.delete;

  agent.get = (url: string) => {
    return defaultGet.call(agent, url).set('Authorization', `Bearer ${token}`);
  };

  agent.post = (url: string, body?: any) => {
    return defaultPost.call(agent, url, body).set('Authorization', `Bearer ${token}`);
  };

  agent.put = (url: string, body?: any) => {
    return defaultPut.call(agent, url, body).set('Authorization', `Bearer ${token}`);
  };

  agent.patch = (url: string, body?: any) => {
    return defaultPatch.call(agent, url, body).set('Authorization', `Bearer ${token}`);
  };

  agent.delete = (url: string, body?: any) => {
    return defaultDelete.call(agent, url, body).set('Authorization', `Bearer ${token}`);
  };

  return agent;
};
