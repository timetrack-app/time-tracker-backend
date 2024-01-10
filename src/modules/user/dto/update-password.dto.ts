import { IsString, MaxLength, MinLength } from 'class-validator';
import { passwordMaxLen, passwordMinLen } from '../../../common/utils/password/password.utils';
import { Match } from '../../../common/libs/class-validator/customDecorators/match';

export class UpdatePasswordDto {
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
