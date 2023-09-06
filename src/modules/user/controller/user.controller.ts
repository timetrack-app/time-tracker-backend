import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, requestParam } from 'inversify-express-utils';
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
    const user = await this.userService.findOne(id);
    const { email } = user;
    return res.status(200).json({
      email,
    });
  }
}
