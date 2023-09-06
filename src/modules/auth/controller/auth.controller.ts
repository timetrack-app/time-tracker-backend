import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  requestBody,
} from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { IAuthService } from '../interfaces/IAuth.service';
import { DtoValidationMiddleware } from '../../../middlewares/dto-validation.middleware';
import { AuthLoginDto, AuthRegisterDto } from '../dto/index.dto';
import {
  InternalServerErrorException,
  ValidationErrorException,
} from '../../../common/errors/all.exception';
import { authConfig } from '../config/config';

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
    const user = await this.authService.registerUser(body);

    const { id, email, token } = user;

    // Store the token in a cookie
    res.cookie('jwtToken', token, {
      httpOnly: true,
    });

    return res.status(200).json({
      id,
      email,
      token,
    });
  }

  @httpGet('/email-verification')
  public async emailVerification(req: Request, res: Response) {
    const { token } = req.query;
    return this.authService.emailVerification(token);
  }

  @httpPost('/login', DtoValidationMiddleware(AuthLoginDto))
  public async login(
    @requestBody() body: AuthLoginDto,
    req: Request,
    res: Response,
  ) {
    const token = await this.authService.login(body);
    if (!token) {
      throw new ValidationErrorException('User not found.');
    }

    // Store the token in a cookie
    res.cookie(authConfig.jwtCookieName, token, {
      httpOnly: true,
    });

    return res.status(200).json({ token });
  }

  @httpPost('/logout')
  public async logout(req: Request, res: Response) {
    try {
      res.clearCookie(authConfig.jwtCookieName);

      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      throw new InternalServerErrorException('Logout was not successful');
    }
  }
}
