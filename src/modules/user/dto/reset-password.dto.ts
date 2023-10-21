import { IsString } from 'class-validator';
import { Match } from '../../../common/libs/class-validator/customDecorators/match';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @IsString()
  password: string;

  @IsString()
  @Match('password')
  passwordConfirmation: string;
}
