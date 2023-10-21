import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  queryParam,
  requestBody,
} from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { IAuthService } from '../interfaces/IAuth.service';
import { DtoValidationMiddleware } from '../../../middlewares/dto-validation.middleware';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { InternalServerErrorException } from '../../../common/errors/all.exception';
import { AuthGuardMiddleware } from '../../../middlewares/auth-guard.middleware';

// TODO: Add password rule

@controller('/auth')
export class AuthController {
  constructor(
    @inject(TYPES.IAuthService) private readonly authService: IAuthService,
  ) {}

  @httpPost('/register', DtoValidationMiddleware(AuthRegisterDto))
  public async register(
    @requestBody() body: AuthRegisterDto,
    req: Request,
    res: Response,
  ) {
    await this.authService.registerUser(body);
    return res.status(200).json();
  }

  /**
   * Verify user registration email
   *
   * @param {string} token
   * @param {Request} req
   * @param {Response} res
   * @return {*}
   * @memberof AuthController
   */
  @httpGet('/email-verification')
  public async emailVerification(
    @queryParam('token') token: string,
    req: Request,
    res: Response,
  ) {
    const verifiedUser = await this.authService.verifyUser(token);
    const authToken = this.authService.generateJWT(verifiedUser);

    return res.status(200).json({ token: authToken });
  }

  @httpPost('/login', DtoValidationMiddleware(AuthLoginDto))
  public async login(
    @requestBody() body: AuthLoginDto,
    req: Request,
    res: Response,
  ) {
    const authToken = await this.authService.login(body);

    return res.status(200).json({ token: authToken });
  }

  @httpPost('/logout', AuthGuardMiddleware)
  public async logout(req: Request, res: Response) {
    try {
      return res.status(200).json();
    } catch (error) {
      throw new InternalServerErrorException('Logout was not successful');
    }
  }
}
