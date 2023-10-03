import { agent } from '../../../../test/utils/supertest.utils';
import { TYPES } from '../../../core/type.core';
import container from '../../../core/container.core';
import { IAuthService } from '../interfaces/IAuth.service';
import { FakeAuthService } from '../../../../test/service/fakeAuth.service';
import { fakeUser } from '../../../../test/factory/user.factory';
import { AuthRegisterDto } from '../dto/auth-register.dto';

const userPayload: AuthRegisterDto = {
  email: fakeUser().email,
  password: 'password',
  passwordConfirmation: 'password',
};

describe('Auth Controller Test', () => {
  beforeEach(() => {
    container.rebind<IAuthService>(TYPES.IAuthService).to(FakeAuthService);
  });

  describe('Create A User', () => {
    it('Index', (done) => {
      agent.post('/auth/register').send(userPayload).expect(200, done);
    });

    it('Create', (done) => {
      agent
        .post('/auth/register')
        .send(userPayload)
        .then((response) => {
          expect(response.status).toBe(200);
          done();
        })
        .catch((error) => {
          console.log('Error on creating user: ', error);
          done();
        });
    });
  });

  describe('Sign In with a user', () => {
    it('Index', (done) => {
      agent.post('/auth/login').send(userPayload).expect(200, done);
    });

    it('Responding with token', (done) => {
      agent
        .post('/auth/login')
        .send(userPayload)
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body.token).toBeDefined();
          done();
        })
        .catch((error) => {
          console.log('Error on responding with token: ', error);
          done();
        });
    });
  });
});
