import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  queryParam,
  requestBody,
  requestParam,
} from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { IUserService } from '../interfaces/IUser.service';
import { DtoValidationMiddleware } from '../../../middlewares/dto-validation.middleware';
import { AuthGuardMiddleware } from '../../../middlewares/auth-guard.middleware';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { NotFoundException } from '../../../common/errors/all.exception';

@controller('/users')
export class UserController {
  constructor(
    @inject(TYPES.IUserService) private readonly userService: IUserService,
  ) {}

  // @httpGet('/:userId', AuthGuardMiddleware)
  @httpGet('/:userId')
  public async getUser(
    @requestParam('userId') userId: number,
    req: Request,
    res: Response,
  ) {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
    const { id, email, isVerified, } = user;
    return res.status(200).json({
      id,
      email,
      isVerified,
    });
  }

  /**
   * Send email to the user to update user's email
   * The email contains a link with token(email update link)
   *
   * @param {number} id
   * @param {UpdateEmailDto} updateEmailDto
   * @param {Request} req
   * @param {Response} res
   * @return {*}
   * @memberof UserController
   */
  @httpPost(
    '/:userId/email-update',
    AuthGuardMiddleware,
    DtoValidationMiddleware(UpdateEmailDto)
  )
  public async updateEmail(
    @requestParam('userId') id: number,
    @requestBody() updateEmailDto: UpdateEmailDto,
    req: Request,
    res: Response,
  ) {
    const { email } = updateEmailDto;
    await this.userService.updateEmailAndSendVerification(id, email);
    return res.status(200).json();
  }

  /**
   * Verify user's new email
   *
   * @param {string} token
   * @param {Request} req
   * @param {Response} res
   * @return {*}
   * @memberof UserController
   */
  @httpGet('/email-update/verification')
  public async verifyNewEmail(
    @queryParam('token') token: string,
    req: Request,
    res: Response,
  ) {
    this.userService.verifyUserWithToken(token);
    return res.status(200).json();
  }

  /**
   * Update logged in user's password
   *
   * @param {number} id
   * @param {UpdatePasswordDto} updatePasswordDto
   * @param {Request} req
   * @param {Response} res
   * @return {*}
   * @memberof UserController
   */
  @httpPost(
    '/:userId/password-update',
    DtoValidationMiddleware(UpdatePasswordDto),
  )
  public async updatePassword(
    @requestParam('userId') id: number,
    @requestBody()
    updatePasswordDto: UpdatePasswordDto,
    req: Request,
    res: Response,
  ) {
    const { password } = updatePasswordDto;
    this.userService.updatePassword(id, password);
    return res.status(200).json();
  }
}
