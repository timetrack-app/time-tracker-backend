import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  requestBody,
  requestParam,
} from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { IUserService } from '../interfaces/IUser.service';

@controller('/users')
export class UserController {
  constructor(
    @inject(TYPES.IUserService) private readonly userService: IUserService,
  ) {}

  @httpGet('/:userId')
  public async getUser(
    @requestParam('userId') id: number,
    req: Request,
    res: Response,
  ) {
    const user = await this.userService.findOneById(id);
    const { email } = user;
    return res.status(200).json({
      email,
    });
  }

  @httpPost('/:userId/email-update')
  public async updateUserEmail(
    @requestParam('userId') id: number,
    @requestBody() emailData: { email: string },
    req: Request,
    res: Response,
  ) {
    // Implement logic to update the user's email and send an email to the user
    // Return appropriate responses for success or error cases
  }

  @httpGet('/email-update/verification')
  public async verifyUserNewEmail(
    @requestParam('token') token: string,
    req: Request,
    res: Response,
  ) {
    // Implement logic to verify a user's new email address using the provided token
    // Return appropriate responses for success or error cases
  }

  @httpPost('/:userId/password-update')
  public async updateUserPassword(
    @requestParam('userId') id: number,
    @requestBody()
    passwordData: { password: string; password_confirmation: string },
    req: Request,
    res: Response,
  ) {
    // Implement logic to update the user's password
    // Return appropriate responses for success or error cases
  }

  @httpPost('/password-update/request')
  public async sendPasswordChangeEmail(
    @requestBody() emailData: { email: string },
    req: Request,
    res: Response,
  ) {
    // Implement logic to send a password change email to a user who forgot their password
    // Return appropriate responses for success or error cases
  }

  @httpGet('/password-update/verification')
  public async verifyUserNewPassword(
    @requestParam('token') token: string,
    req: Request,
    res: Response,
  ) {
    // Implement logic to verify the token for a password update
    // Return appropriate responses for success or error cases
  }

  @httpPost('/password-update/save')
  public async saveUserNewPassword(
    @requestBody()
    newPasswordData: { password: string; password_confirmation: string },
    req: Request,
    res: Response,
  ) {
    // Implement logic to save a user's new password
    // Return appropriate responses for success or error cases
  }
}
