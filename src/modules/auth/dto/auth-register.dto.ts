import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { passwordMinLen, passwordMaxLen } from '../../../common/utils/password.utils';
import { Match } from '../../../common/libs/class-validator/customDecorators/match';

export class AuthRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(passwordMinLen)
  @MaxLength(passwordMaxLen)
  password: string;

  @IsString()
  @MinLength(passwordMinLen)
  @MaxLength(passwordMaxLen)
  @Match('password')
  passwordConfirmation: string;
}
