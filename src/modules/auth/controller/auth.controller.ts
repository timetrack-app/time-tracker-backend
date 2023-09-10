import { Request, Response, query } from 'express';
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
import { AuthLoginDto } from '../dto/auth-login.dto';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { InternalServerErrorException } from '../../../common/errors/all.exception';
import { authConfig } from '../config/config';
import { IUserEmailVerificationService } from 'src/modules/userEmailVerification/interface/IUserEmailVerification.service';

@controller('/auth')
export class AuthController {
  constructor(
    @inject(TYPES.IAuthService) private readonly authService: IAuthService,
    @inject(TYPES.IUserEmailVerificationService)
    private readonly emailVerificationService: IUserEmailVerificationService,
  ) {}

  @httpPost('/register', DtoValidationMiddleware(AuthRegisterDto))
  public async register(
    @requestBody() body: AuthRegisterDto,
    req: Request,
    res: Response,
  ) {
    await this.authService.registerUser(body);

    return res.status(200);
  }

  @httpGet('/email-verification')
  public async emailVerification(req: Request, res: Response) {
    const { token } = req.query;
    const user = await this.emailVerificationService.verifyUser(token);
    const jwtToken = await this.authService.generateJWT(user);
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
