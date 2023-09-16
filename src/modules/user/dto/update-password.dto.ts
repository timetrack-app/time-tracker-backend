import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  password: string;
  @IsString()
  passwordConfirmation;
}
