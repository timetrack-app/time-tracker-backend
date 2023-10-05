import 'reflect-metadata';
import container from '../../../core/container.core';
import { IUserService } from '../interfaces/IUser.service';
import { TYPES } from '../../../core/type.core';
import { FakeUserService } from '../../../../test/service/fakeUser.service';
import { agent } from '../../../../test/utils/supertest.utils';
import { fakeUser } from '../../../../test/factory/user.factory';

const user = fakeUser();

describe('User Controller Test', () => {
  beforeAll(() => {
    container.rebind<IUserService>(TYPES.IUserService).to(FakeUserService);
  });

  describe('Get A User', () => {
    it('Index', (done) => {
      agent.get(`/users/${user.id}`).expect(200, done);
    });

    it('Should response with a user', (done) => {
      agent
        .get(`/users/${user.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body.results.email).toStrictEqual(user.email);
          done();
        })
        .catch((error) => {
          console.log('error: ', error);
          done();
        });
    });
  });

  describe('Update Email', () => {
    it('Update Email', (done) => {
      const newEmail = 'newemail@example.com';
      agent
        .post(`/users/${user.id}/email-update`)
        .send({ email: newEmail })
        .expect(200, done);
    });
  });

  describe('Verify New Email', () => {
    it('Verify New Email', (done) => {
      const token = 'your_verification_token_here';
      agent
        .get(`/users/email-update/verification?token=${token}`)
        .expect(200, done);
    });
  });

  describe('Update Password', () => {
    it('Update Password', (done) => {
      const newPassword = 'newpassword123';
      agent
        .post(`/users/${user.id}/password-update`)
        .send({ password: newPassword, passwordConfirmation: newPassword })
        .expect(200, done);
    });
  });

  describe('Send Password Reset Email', () => {
    it('Send Password Reset Email', (done) => {
      const resetEmail = 'reset@example.com';
      agent
        .post(`/users/${user.id}/password-update/request`)
        .send({ email: resetEmail })
        .expect(200, done);
    });
  });

  describe('Verify User New Password', () => {
    it('Verify User New Password', (done) => {
      const token = 'token';
      agent
        .get(`/users/password-update/verification?token=${token}`)
        .expect(200, done);
    });
  });
});
