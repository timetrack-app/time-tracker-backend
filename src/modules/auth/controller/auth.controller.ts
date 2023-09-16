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

  @httpGet('/email-verification')
  public async emailVerification(
    @queryParam('token') token: string,
    req: Request,
    res: Response,
  ) {
    const jwtToken = await this.authService.emailVerification(token);
    return res.status(200).json({ token: jwtToken });
  }

  @httpPost('/login', DtoValidationMiddleware(AuthLoginDto))
  public async login(
    @requestBody() body: AuthLoginDto,
    req: Request,
    res: Response,
  ) {
    const token = await this.authService.login(body);

    return res.status(200).json({ token });
  }

  @httpPost('/logout')
  public async logout(req: Request, res: Response) {
    try {
      return res.status(200).json();
    } catch (error) {
      throw new InternalServerErrorException('Logout was not successful');
    }
  }
}
