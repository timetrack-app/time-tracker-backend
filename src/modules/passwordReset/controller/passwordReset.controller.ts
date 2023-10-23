import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, requestBody, queryParam } from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { DtoValidationMiddleware } from '../../../middlewares/dto-validation.middleware';
import { ResetPasswordRequestDto } from '../../../modules/user/dto/reset-password-request.dto';
import { ResetPasswordDto } from '../../../modules/user/dto/reset-password.dto';
import { IPasswordResetService } from '../interface/IPasswordReset.service';
import { VerifyTokenReturnType } from '../types';

@controller('/users')
export class PasswordResetController {
  constructor(
    @inject(TYPES.IPasswordResetService)
    private readonly passwordResetService: IPasswordResetService,
  ) {}

  /**
   * Send password reset email
   * No login needed
   *
   * @param {ResetPasswordRequestDto} resetPasswordDto
   * @param {Request} req
   * @param {Response} res
   * @return {*}
   * @memberof PasswordResetController
   */
  @httpPost(
    '/password-update/request',
    DtoValidationMiddleware(ResetPasswordRequestDto),
  )
  public async sendPasswordResetEmail(
    @requestBody() resetPasswordDto: ResetPasswordRequestDto,
    req: Request,
    res: Response,
  ) {
    const { email } = resetPasswordDto;
    await this.passwordResetService.requestPasswordReset(email);
    return res.status(200).json();
  }

  /**
   * Verify token in the query param of a link in a password update request email.
   *
   * @param {string} token
   * @param {Request} req
   * @param {Response<VerifyTokenReturnType>} res
   * @return {*}
   * @memberof PasswordResetController
   */
  @httpGet('/password-update/verification')
  public async verifyToken(
    @queryParam('token') token: string,
    req: Request,
    res: Response<VerifyTokenReturnType>,
  ) {
    const record = await this.passwordResetService.verifyToken(token);
    return res.status(200).json({ token: record.token });
  }

  /**
   *
   *
   * @param {ResetPasswordDto} resetPasswordDto
   * @param {Request} req
   * @param {Response} res
   * @return {*}
   * @memberof PasswordResetController
   */
  @httpPost(
    '/user/password-update/save',
    DtoValidationMiddleware(ResetPasswordDto)
  )
  public async resetPassword(
    @requestBody() resetPasswordDto: ResetPasswordDto,
    req: Request,
    res: Response,
  ) {
    const { token, password } = resetPasswordDto;
    await this.passwordResetService.updatePassword(token, password)
    return res.status(200).json();
  }
}
