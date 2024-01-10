import { IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../../common/libs/class-validator/customDecorators/match';
import { passwordMaxLen, passwordMinLen } from '../../../common/utils/password/password.utils';

export class ResetPasswordDto {
  @IsString()
  token: string;

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
